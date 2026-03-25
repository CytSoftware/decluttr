import type { TabCard as TabCardType } from "@decluttr/types";
import { SwipeDeck } from "../components/SwipeDeck";

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
}: SwipeScreenProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="text-xl font-bold text-text-primary">Decluttr</h1>
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
      />
    </div>
  );
}
