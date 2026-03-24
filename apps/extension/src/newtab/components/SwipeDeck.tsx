import { useRef, useCallback, useMemo } from "react";
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
  onUndo,
}: SwipeDeckProps) {
  const cardRefs = useRef<Map<number, CardRef>>(new Map());

  const currentTab = currentIndex < tabs.length ? tabs[currentIndex] : null;

  const handleSwipe = useCallback(
    (direction: string, tab: TabCardType) => {
      if (direction === "left") {
        onSwipeLeft(tab);
      } else if (direction === "right") {
        onSwipeRight(tab);
      }
    },
    [onSwipeLeft, onSwipeRight]
  );

  const swipeLeft = useCallback(() => {
    if (!currentTab) return;
    const ref = cardRefs.current.get(currentTab.id);
    ref?.swipe("left");
  }, [currentTab]);

  const swipeRight = useCallback(() => {
    if (!currentTab) return;
    const ref = cardRefs.current.get(currentTab.id);
    ref?.swipe("right");
  }, [currentTab]);

  useKeyboardShortcuts({
    onSwipeLeft: swipeLeft,
    onSwipeRight: swipeRight,
    onUndo,
    enabled: currentTab !== null,
  });

  // Only render current + next 2 cards for performance
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
                if (ref) {
                  cardRefs.current.set(tab.id, ref);
                }
              }}
              onSwipe={(dir: string) => handleSwipe(dir, tab)}
              preventSwipe={["up", "down"]}
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
            <div className="absolute top-4 left-4 text-close font-bold text-lg opacity-0 pointer-events-none z-50 swipe-indicator-left">
              CLOSE
            </div>
            <div className="absolute top-4 right-4 text-keep font-bold text-lg opacity-0 pointer-events-none z-50 swipe-indicator-right">
              KEEP
            </div>
          </>
        )}
      </div>

      <SwipeButtons
        onClose={swipeLeft}
        onKeep={swipeRight}
        onUndo={onUndo}
        canUndo={canUndo}
        disabled={!currentTab}
      />

      {/* Keyboard shortcut hints */}
      <div className="flex items-center gap-4 text-[10px] text-text-muted">
        <span>
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">&larr;</kbd>{" "}
          or{" "}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">J</kbd>{" "}
          Close
        </span>
        <span>
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">&rarr;</kbd>{" "}
          or{" "}
          <kbd className="px-1 py-0.5 bg-gray-100 rounded text-[10px]">K</kbd>{" "}
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
