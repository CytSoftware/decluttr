import { useEffect, useState, useCallback, useRef } from "react";
import browser from "webextension-polyfill";
import type { TabCard } from "@decluttr/types";
import { useSwipeDeck } from "./hooks/useSwipeDeck";
import { fetchAndProcessTabs } from "../lib/tabs";
import { loadSettings } from "../lib/settings";
import { addSavedTab, removeSavedTab } from "../lib/saved";
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
    saveTab,
    undo,
    rescueTab,
    tabRemovedExternally,
  } = useSwipeDeck();

  const [undoingTabId, setUndoingTabId] = useState<number | null>(null);
  const closingTabIds = useRef<Set<number>>(new Set());

  // Initialize: fetch tabs, start session
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const settings = await loadSettings();
      const { tabs, duplicateGroups, excludedCount } =
        await fetchAndProcessTabs(settings);

      if (!cancelled) {
        initDeck(tabs, duplicateGroups, excludedCount);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [initDeck]);

  // Listen for externally closed tabs (skip tabs we closed ourselves)
  useEffect(() => {
    const listener = (tabId: number) => {
      if (tabId === undoingTabId) return;
      if (closingTabIds.current.has(tabId)) {
        closingTabIds.current.delete(tabId);
        return;
      }
      tabRemovedExternally(tabId);
    };
    browser.tabs.onRemoved.addListener(listener);
    return () => browser.tabs.onRemoved.removeListener(listener);
  }, [tabRemovedExternally, undoingTabId]);

  // Close tab immediately on swipe left
  const handleCloseTab = useCallback(
    async (tab: TabCard) => {
      closingTabIds.current.add(tab.id);
      try {
        await browser.tabs.remove(tab.id);
      } catch { /* already closed */ }

      closeTab(tab);
    },
    [closeTab]
  );

  // Save tab for later: close tab + persist to storage
  const handleSaveTab = useCallback(
    async (tab: TabCard) => {
      closingTabIds.current.add(tab.id);
      // Close the browser tab
      try {
        await browser.tabs.remove(tab.id);
      } catch { /* already closed */ }

      // Persist to storage
      await addSavedTab({ ...tab, savedAt: Date.now() });

      // Update state
      saveTab(tab);
    },
    [saveTab]
  );

  // Undo last action
  const handleUndo = useCallback(async () => {
    const lastAction = state.undoStack[state.undoStack.length - 1];
    if (!lastAction) return;

    if (lastAction.type === "close" || lastAction.type === "save") {
      // Reopen the tab
      try {
        const newTab = await browser.tabs.create({ url: lastAction.tab.url, active: false });
        setUndoingTabId(newTab.id ?? null);
        setTimeout(() => setUndoingTabId(null), 500);
      } catch { /* failed to reopen */ }

      // If it was a save, also remove from persistent storage
      if (lastAction.type === "save") {
        await removeSavedTab(lastAction.tab.url);
      }
    }

    undo();
  }, [undo, state.undoStack]);

  // Summary confirm: close the Decluttr tab
  const handleConfirm = useCallback(async () => {
    setTimeout(async () => {
      const currentTab = await browser.tabs.getCurrent();
      if (currentTab?.id) await browser.tabs.remove(currentTab.id);
    }, 1000);
  }, []);

  const handleCancel = useCallback(async () => {
    const currentTab = await browser.tabs.getCurrent();
    if (currentTab?.id) await browser.tabs.remove(currentTab.id);
  }, []);

  const handleClose = useCallback(async () => {
    const currentTab = await browser.tabs.getCurrent();
    if (currentTab?.id) await browser.tabs.remove(currentTab.id);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {state.deckState === "loading" && <LoadingScreen />}

      {state.deckState === "swiping" && (
        <SwipeScreen
          tabs={state.tabs}
          currentIndex={state.currentIndex}
          excludedCount={state.excludedCount}
          canUndo={canUndo}
          progress={progress}
          onSwipeLeft={handleCloseTab}
          onSwipeRight={keepTab}
          onSwipeUp={handleSaveTab}
          onUndo={handleUndo}
        />
      )}

      {state.deckState === "summary" && (
        <SummaryScreen
          closedTabs={state.closedTabs}
          keptTabs={state.keptTabs}
          savedTabs={state.savedTabs}
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
