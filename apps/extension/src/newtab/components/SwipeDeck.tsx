import { useRef, useState, useCallback, useMemo } from "react";
import TinderCard from "react-tinder-card";
import type { TabCard as TabCardType } from "@decluttr/types";
import { TabCard } from "./TabCard";
import { SwipeButtons } from "./SwipeButtons";
import { ProgressBar } from "./ProgressBar";
import { ExcludedNotice } from "./ExcludedNotice";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

interface SwipeDeckProps {
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

interface CardRef {
  swipe: (dir: string) => Promise<void>;
}

export function SwipeDeck({
  tabs,
  currentIndex,
  excludedCount,
  canUndo,
  progress,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onUndo,
}: SwipeDeckProps) {
  const cardRefs = useRef<Map<number, CardRef>>(new Map());
  const [swipeDirection, setSwipeDirection] = useState<{ id: number; dir: string } | null>(null);

  const currentTab = currentIndex < tabs.length ? tabs[currentIndex] : null;

  const handleSwipe = useCallback(
    (direction: string, tab: TabCardType) => {
      setSwipeDirection(null);
      if (direction === "left") {
        onSwipeLeft(tab);
      } else if (direction === "right") {
        onSwipeRight(tab);
      } else if (direction === "up") {
        onSwipeUp(tab);
      }
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp]
  );

  const swipeLeft = useCallback(() => {
    if (!currentTab) return;
    cardRefs.current.get(currentTab.id)?.swipe("left");
  }, [currentTab]);

  const swipeRight = useCallback(() => {
    if (!currentTab) return;
    cardRefs.current.get(currentTab.id)?.swipe("right");
  }, [currentTab]);

  const swipeUp = useCallback(() => {
    if (!currentTab) return;
    cardRefs.current.get(currentTab.id)?.swipe("up");
  }, [currentTab]);

  useKeyboardShortcuts({
    onSwipeLeft: swipeLeft,
    onSwipeRight: swipeRight,
    onSwipeUp: swipeUp,
    onUndo,
    enabled: currentTab !== null,
  });

  const visibleTabs = useMemo(() => {
    return tabs.slice(currentIndex, currentIndex + 3).reverse();
  }, [tabs, currentIndex]);

  return (
    <div className="flex flex-col items-center gap-6">
      <ProgressBar current={progress.current} total={progress.total} />

      {excludedCount > 0 && <ExcludedNotice count={excludedCount} />}

      {/* Card stack */}
      <div className="relative w-[380px] h-[360px]">
        {visibleTabs.map((tab, i) => {
          const reverseIndex = visibleTabs.length - 1 - i;
          return (
            <TinderCard
              key={tab.id}
              ref={(ref: CardRef | null) => {
                if (ref) cardRefs.current.set(tab.id, ref);
              }}
              onSwipe={(dir: string) => handleSwipe(dir, tab)}
              onSwipeRequirementFulfilled={(dir: string) =>
                setSwipeDirection({ id: tab.id, dir })
              }
              onSwipeRequirementUnfulfilled={() => setSwipeDirection(null)}
              swipeRequirementType="position"
              swipeThreshold={100}
              preventSwipe={["down"]}
              flickOnSwipe
              className="absolute inset-0"
            >
              <div
                className="transition-transform"
                style={{
                  transform: `scale(${1 - reverseIndex * 0.04}) translateY(${reverseIndex * 8}px)`,
                  zIndex: visibleTabs.length - reverseIndex,
                }}
              >
                <TabCard tab={tab} />
              </div>
            </TinderCard>
          );
        })}

        {/* Swipe direction indicators */}
        {currentTab && (
          <>
            <div
              className="absolute top-4 left-4 px-3 py-1 rounded-lg border-2 border-close text-close font-bold text-lg -rotate-12 pointer-events-none z-50 transition-opacity duration-150"
              style={{ opacity: swipeDirection?.id === currentTab.id && swipeDirection.dir === "left" ? 1 : 0 }}
            >
              CLOSE
            </div>
            <div
              className="absolute top-4 right-4 px-3 py-1 rounded-lg border-2 border-keep text-keep font-bold text-lg rotate-12 pointer-events-none z-50 transition-opacity duration-150"
              style={{ opacity: swipeDirection?.id === currentTab.id && swipeDirection.dir === "right" ? 1 : 0 }}
            >
              KEEP
            </div>
            <div
              className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg border-2 border-primary text-primary font-bold text-lg pointer-events-none z-50 transition-opacity duration-150"
              style={{ opacity: swipeDirection?.id === currentTab.id && swipeDirection.dir === "up" ? 1 : 0 }}
            >
              SAVE
            </div>
          </>
        )}
      </div>

      <SwipeButtons
        onClose={swipeLeft}
        onSave={swipeUp}
        onKeep={swipeRight}
        onUndo={onUndo}
        canUndo={canUndo}
        disabled={!currentTab}
      />

      {/* Keyboard shortcut hints */}
      <div className="flex items-center gap-4 text-[10px] text-text-muted">
        <span>
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">&larr;</kbd>{" "}
          Close
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">&uarr;</kbd>{" "}
          Save
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">&rarr;</kbd>{" "}
          Keep
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">U</kbd>{" "}
          Undo
        </span>
      </div>
    </div>
  );
}
