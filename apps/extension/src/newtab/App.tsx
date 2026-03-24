import { useEffect, useState, useCallback } from "react";
import browser from "webextension-polyfill";
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
    updateScreenshot,
  } = useSwipeDeck();

  const [captureProgress, setCaptureProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);

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
          for (const [tabId, dataUrl] of screenshots) {
            updateScreenshot(tabId, dataUrl);
          }
        }
      }

      if (!cancelled) {
        // Update tabs with any screenshots already set
        initDeck(tabs, duplicateGroups, excludedCount);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [initDeck, updateScreenshot]);

  // Listen for externally closed tabs
  useEffect(() => {
    const listener = (tabId: number) => {
      tabRemovedExternally(tabId);
    };
    browser.tabs.onRemoved.addListener(listener);
    return () => browser.tabs.onRemoved.removeListener(listener);
  }, [tabRemovedExternally]);

  // Confirm: batch close all marked tabs
  const handleConfirm = useCallback(async () => {
    const tabIds = state.closedTabs.map((t) => t.id);
    if (tabIds.length > 0) {
      try {
        await browser.tabs.remove(tabIds);
      } catch {
        // Some tabs may have already been closed
      }
    }

    // Auto-close the Decluttr tab after a brief delay
    setTimeout(async () => {
      const currentTab = await browser.tabs.getCurrent();
      if (currentTab?.id) {
        await browser.tabs.remove(currentTab.id);
      }
    }, 1500);
  }, [state.closedTabs]);

  // Cancel: close the Decluttr tab without closing any tabs
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
          onSwipeLeft={closeTab}
          onSwipeRight={keepTab}
          onUndo={undo}
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
