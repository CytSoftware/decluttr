import { useEffect, useState, useCallback } from "react";
import browser from "webextension-polyfill";
import type { TabCard } from "@decluttr/types";
import { useSwipeDeck } from "./hooks/useSwipeDeck";
import { fetchAndProcessTabs } from "../lib/tabs";
import { batchCaptureScreenshots } from "../lib/screenshot";
import { loadSettings } from "../lib/settings";
import { LoadingScreen } from "./screens/LoadingScreen";
import { SwipeScreen } from "./screens/SwipeScreen";
import { SummaryScreen } from "./screens/SummaryScreen";
import { EmptyScreen } from "./screens/EmptyScreen";

export function App() {
  const {
    state,
    canUndo,
    progress,
    initDeck,
    closeTab,
    keepTab,
    undo,
    rescueTab,
    tabRemovedExternally,
  } = useSwipeDeck();

  const [captureProgress, setCaptureProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);

  // Track whether we're mid-undo to suppress the onRemoved listener
  const [undoingTabId, setUndoingTabId] = useState<number | null>(null);

  // Initialize: fetch tabs, capture screenshots, start session
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const settings = await loadSettings();
      const { tabs, duplicateGroups, excludedCount } =
        await fetchAndProcessTabs(settings);

      if (cancelled) return;

      // Capture screenshots if enabled
      if (settings.captureScreenshots && tabs.length > 0) {
        const screenshots = await batchCaptureScreenshots(
          tabs,
          (completed, total) => {
            if (!cancelled) setCaptureProgress({ completed, total });
          }
        );

        if (!cancelled) {
          // Attach screenshots directly to tab objects before initDeck
          for (const [tabId, dataUrl] of screenshots) {
            const tab = tabs.find((t) => t.id === tabId);
            if (tab) tab.screenshotUrl = dataUrl;
          }
        }
      }

      if (!cancelled) {
        initDeck(tabs, duplicateGroups, excludedCount);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [initDeck]);

  // Listen for externally closed tabs
  useEffect(() => {
    const listener = (tabId: number) => {
      // Don't treat our own closes as external removals
      if (tabId === undoingTabId) return;
      tabRemovedExternally(tabId);
    };
    browser.tabs.onRemoved.addListener(listener);
    return () => browser.tabs.onRemoved.removeListener(listener);
  }, [tabRemovedExternally, undoingTabId]);

  // Close tab immediately on swipe left
  const handleCloseTab = useCallback(
    async (tab: TabCard) => {
      // Close the actual browser tab immediately
      try {
        await browser.tabs.remove(tab.id);
      } catch {
        // Tab may already be closed
      }

      // Also close duplicates if this is a duplicate group
      if (tab.isDuplicate && tab.duplicateGroupId) {
        const group = state.duplicateGroups.find(
          (g) => g.groupId === tab.duplicateGroupId
        );
        if (group) {
          const otherIds = group.tabs
            .filter((t) => t.id !== tab.id)
            .map((t) => t.id);
          if (otherIds.length > 0) {
            try {
              await browser.tabs.remove(otherIds);
            } catch {
              // Some may already be closed
            }
          }
        }
      }

      closeTab(tab);
    },
    [closeTab, state.duplicateGroups]
  );

  // Undo: reopen the last closed tab
  const handleUndo = useCallback(async () => {
    const lastAction = state.undoStack[state.undoStack.length - 1];
    if (!lastAction) return;

    if (lastAction.type === "close") {
      // Reopen the tab at its original URL
      try {
        const newTab = await browser.tabs.create({ url: lastAction.tab.url, active: false });
        setUndoingTabId(newTab.id ?? null);
        // Clear after a tick so the onRemoved listener doesn't fire
        setTimeout(() => setUndoingTabId(null), 500);
      } catch {
        // Failed to reopen
      }
    }

    undo();
  }, [undo, state.undoStack]);

  // Summary: close remaining marked tabs
  const handleConfirm = useCallback(async () => {
    // Tabs were already closed during swiping, just close the Decluttr tab
    setTimeout(async () => {
      const currentTab = await browser.tabs.getCurrent();
      if (currentTab?.id) {
        await browser.tabs.remove(currentTab.id);
      }
    }, 1000);
  }, []);

  // Cancel: close the Decluttr tab
  const handleCancel = useCallback(async () => {
    const currentTab = await browser.tabs.getCurrent();
    if (currentTab?.id) {
      await browser.tabs.remove(currentTab.id);
    }
  }, []);

  // Close the Decluttr tab (empty state)
  const handleClose = useCallback(async () => {
    const currentTab = await browser.tabs.getCurrent();
    if (currentTab?.id) {
      await browser.tabs.remove(currentTab.id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {state.deckState === "loading" && (
        <LoadingScreen captureProgress={captureProgress ?? undefined} />
      )}

      {state.deckState === "swiping" && (
        <SwipeScreen
          tabs={state.tabs}
          currentIndex={state.currentIndex}
          excludedCount={state.excludedCount}
          canUndo={canUndo}
          progress={progress}
          onSwipeLeft={handleCloseTab}
          onSwipeRight={keepTab}
          onUndo={handleUndo}
        />
      )}

      {state.deckState === "summary" && (
        <SummaryScreen
          closedTabs={state.closedTabs}
          keptTabs={state.keptTabs}
          startTime={state.startTime}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onRescue={rescueTab}
        />
      )}

      {state.deckState === "empty" && <EmptyScreen onClose={handleClose} />}
    </div>
  );
}
