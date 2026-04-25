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

async function closeDecluttrView() {
  const currentTab = await browser.tabs.getCurrent();
  if (currentTab?.id) {
    await browser.tabs.remove(currentTab.id);
  } else {
    window.close();
  }
}

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
  const [isSidePanel, setIsSidePanel] = useState<boolean>(false);
  const closingTabIds = useRef<Set<number>>(new Set());

  // Detect whether we're running in a side panel (no current tab)
  useEffect(() => {
    browser.tabs.getCurrent().then((tab) => {
      setIsSidePanel(!tab);
    });
  }, []);

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

  // Activate the tab currently shown in the deck so the user sees it in the main window
  // (only when running inside the side panel)
  useEffect(() => {
    if (!isSidePanel || state.deckState !== "swiping") return;
    const tab = state.tabs[state.currentIndex];
    if (!tab?.id) return;

    browser.tabs.update(tab.id, { active: true }).catch(() => {
      /* tab may have been closed */
    });
  }, [isSidePanel, state.currentIndex, state.deckState, state.tabs]);

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

  // Summary confirm: close the Decluttr view
  const handleConfirm = useCallback(async () => {
    setTimeout(closeDecluttrView, 1000);
  }, []);

  const handleCancel = useCallback(async () => {
    await closeDecluttrView();
  }, []);

  const handleClose = useCallback(async () => {
    await closeDecluttrView();
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-3 py-6">
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
          onCardClick={
            isSidePanel
              ? () => {
                  const tab = state.tabs[state.currentIndex];
                  if (tab?.id) {
                    browser.tabs.update(tab.id, { active: true }).catch(() => {});
                  }
                }
              : undefined
          }
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
