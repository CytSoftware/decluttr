import browser from "webextension-polyfill";
import type { TabCard as TabCardType } from "@decluttr/types";
import { SwipeDeck } from "../components/SwipeDeck";
import { PendingDecisionPanel } from "../components/PendingDecisionPanel";

interface SwipeScreenProps {
  tabs: TabCardType[];
  currentIndex: number;
  excludedCount: number;
  canUndo: boolean;
  progress: { current: number; total: number };
  onSwipeLeft: (tab: TabCardType) => void;
  onSwipeRight: (tab: TabCardType) => void;
  onSwipeUp: (tab: TabCardType) => void;
  onUndo: () => void;
  onPeek: (tab: TabCardType) => void;
  onOpen: (tab: TabCardType) => void;
  disableInput: boolean;
  pendingDecision: TabCardType | null;
  onPendingClose: (tab: TabCardType) => void;
  onPendingKeep: (tab: TabCardType) => void;
  onPendingSave: (tab: TabCardType) => void;
  onPendingCancel: () => void;
}

export function SwipeScreen({
  tabs,
  currentIndex,
  excludedCount,
  canUndo,
  progress,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onUndo,
  onPeek,
  onOpen,
  disableInput,
  pendingDecision,
  onPendingClose,
  onPendingKeep,
  onPendingSave,
  onPendingCancel,
}: SwipeScreenProps) {
  const openSaved = () => {
    browser.tabs.create({
      url: browser.runtime.getURL("src/saved/index.html"),
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-text-primary">Decluttr</h1>
        <button
          onClick={openSaved}
          className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors"
          title="View saved tabs"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          Saved
        </button>
      </div>

      {pendingDecision && (
        <PendingDecisionPanel
          tab={pendingDecision}
          onClose={onPendingClose}
          onKeep={onPendingKeep}
          onSave={onPendingSave}
          onCancel={onPendingCancel}
        />
      )}

      <SwipeDeck
        tabs={tabs}
        currentIndex={currentIndex}
        excludedCount={excludedCount}
        canUndo={canUndo}
        progress={progress}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
        onSwipeUp={onSwipeUp}
        onUndo={onUndo}
        onPeek={onPeek}
        onOpen={onOpen}
        disableInput={disableInput}
      />
    </div>
  );
}
