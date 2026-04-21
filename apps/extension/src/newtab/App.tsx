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
import { PreviewModal } from "./components/PreviewModal";

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
    showPeek,
    hidePeek,
    setPendingDecision,
    clearPendingDecision,
    setOverlayTab,
    clearOverlayTab,
  } = useSwipeDeck();

  const overlayTabRef = useRef<TabCard | null>(null);
  useEffect(() => {
    overlayTabRef.current = state.overlayTab;
  }, [state.overlayTab]);

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

  // Listen for decision messages sent from the injected overlay.
  useEffect(() => {
    const listener = (message: unknown) => {
      if (
        typeof message !== "object" ||
        message === null ||
        (message as { type?: unknown }).type !== "PREVIEW_DECISION"
      ) {
        return;
      }
      const action = (message as { action?: string }).action;
      const tab = overlayTabRef.current;
      if (!tab) return;

      clearOverlayTab();

      if (action === "close") {
        closingTabIds.current.add(tab.id);
        browser.tabs.remove(tab.id).catch(() => {});
        closeTab(tab);
      } else if (action === "keep") {
        keepTab(tab);
      } else if (action === "save") {
        closingTabIds.current.add(tab.id);
        browser.tabs.remove(tab.id).catch(() => {});
        addSavedTab({ ...tab, savedAt: Date.now() }).catch(() => {});
        saveTab(tab);
      }
      // "cancel" — already cleared, no action needed.
    };
    browser.runtime.onMessage.addListener(listener);
    return () => browser.runtime.onMessage.removeListener(listener);
  }, [clearOverlayTab, closeTab, keepTab, saveTab]);

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

  // Peek: show screenshot modal for the current tab
  const handlePeek = useCallback(
    (tab: TabCard) => {
      showPeek(tab);
    },
    [showPeek]
  );

  // Open: inject a decision overlay onto the target tab. Falls back to the
  // "come back and decide" panel for restricted pages where script injection
  // isn't allowed.
  const handleOpen = useCallback(
    async (tab: TabCard) => {
      if (state.pendingDecision || state.overlayTab) return;
      try {
        const result = (await browser.runtime.sendMessage({
          type: "OPEN_TAB_WITH_OVERLAY",
          tabId: tab.id,
        })) as
          | { success: boolean; overlayInjected: boolean; error?: string }
          | undefined;

        if (!result?.success) {
          closingTabIds.current.add(tab.id);
          tabRemovedExternally(tab.id);
          return;
        }

        if (result.overlayInjected) {
          setOverlayTab(tab);
        } else {
          // Restricted page — can't inject. Fall back to pending-panel flow.
          setPendingDecision(tab);
        }
      } catch (e) {
        console.error("handleOpen failed", e);
      }
    },
    [
      state.pendingDecision,
      state.overlayTab,
      setOverlayTab,
      setPendingDecision,
      tabRemovedExternally,
    ]
  );

  // Preview-modal decisions: dismiss modal then run the existing action
  const handlePreviewClose = useCallback(
    async (tab: TabCard) => {
      hidePeek();
      await handleCloseTab(tab);
    },
    [hidePeek, handleCloseTab]
  );

  const handlePreviewKeep = useCallback(
    (tab: TabCard) => {
      hidePeek();
      keepTab(tab);
    },
    [hidePeek, keepTab]
  );

  const handlePreviewSave = useCallback(
    async (tab: TabCard) => {
      hidePeek();
      await handleSaveTab(tab);
    },
    [hidePeek, handleSaveTab]
  );

  // Pending-decision panel actions (after live-switch return)
  const handlePendingClose = useCallback(
    async (tab: TabCard) => {
      clearPendingDecision();
      await handleCloseTab(tab);
    },
    [clearPendingDecision, handleCloseTab]
  );

  const handlePendingKeep = useCallback(
    (tab: TabCard) => {
      clearPendingDecision();
      keepTab(tab);
    },
    [clearPendingDecision, keepTab]
  );

  const handlePendingSave = useCallback(
    async (tab: TabCard) => {
      clearPendingDecision();
      await handleSaveTab(tab);
    },
    [clearPendingDecision, handleSaveTab]
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
          onPeek={handlePeek}
          onOpen={handleOpen}
          disableInput={state.previewingTab !== null || state.overlayTab !== null}
          pendingDecision={state.pendingDecision}
          onPendingClose={handlePendingClose}
          onPendingKeep={handlePendingKeep}
          onPendingSave={handlePendingSave}
          onPendingCancel={clearPendingDecision}
        />
      )}

      {state.previewingTab && (
        <PreviewModal
          tab={state.previewingTab}
          onClose={handlePreviewClose}
          onKeep={handlePreviewKeep}
          onSave={handlePreviewSave}
          onDismiss={hidePeek}
          onOpenTab={handleOpen}
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
