import { useRef, useState, useCallback, useMemo, useEffect } from "react";
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

const SWIPE_THRESHOLD = 80;
const EXIT_DURATION = 300;

type SwipeDir = "left" | "right" | "up" | null;

function getSwipeDirection(dx: number, dy: number): SwipeDir {
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  if (absDx < SWIPE_THRESHOLD && absDy < SWIPE_THRESHOLD) return null;
  if (dy < -SWIPE_THRESHOLD && absDy > absDx) return "up";
  if (dx > SWIPE_THRESHOLD && absDx >= absDy) return "right";
  if (dx < -SWIPE_THRESHOLD && absDx >= absDy) return "left";
  return null;
}

function getActiveDirection(dx: number, dy: number): SwipeDir {
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  const minHint = 30;
  if (absDx < minHint && absDy < minHint) return null;
  if (dy < -minHint && absDy > absDx) return "up";
  if (dx > minHint && absDx >= absDy) return "right";
  if (dx < -minHint && absDx >= absDy) return "left";
  return null;
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
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [exiting, setExiting] = useState<SwipeDir>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const pendingAction = useRef<(() => void) | null>(null);

  const currentTab = currentIndex < tabs.length ? tabs[currentIndex] : null;

  const visibleTabs = useMemo(() => {
    return tabs.slice(currentIndex, currentIndex + 3).reverse();
  }, [tabs, currentIndex]);

  // Execute pending action after exit animation
  useEffect(() => {
    if (!exiting) return;
    const timer = setTimeout(() => {
      setExiting(null);
      setDrag(null);
      pendingAction.current?.();
      pendingAction.current = null;
    }, EXIT_DURATION);
    return () => clearTimeout(timer);
  }, [exiting]);

  const triggerSwipe = useCallback(
    (dir: SwipeDir, tab: TabCardType) => {
      if (!dir) return;
      pendingAction.current = () => {
        if (dir === "left") onSwipeLeft(tab);
        else if (dir === "right") onSwipeRight(tab);
        else if (dir === "up") onSwipeUp(tab);
      };
      setExiting(dir);
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (exiting) return;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      startPos.current = { x: e.clientX, y: e.clientY };
      setDrag({ x: 0, y: 0 });
    },
    [exiting]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!startPos.current) return;
      setDrag({
        x: e.clientX - startPos.current.x,
        y: e.clientY - startPos.current.y,
      });
    },
    []
  );

  const onPointerUp = useCallback(() => {
    if (!startPos.current || !drag || !currentTab) {
      startPos.current = null;
      setDrag(null);
      return;
    }
    const dir = getSwipeDirection(drag.x, drag.y);
    startPos.current = null;
    if (dir) {
      triggerSwipe(dir, currentTab);
    } else {
      setDrag(null);
    }
  }, [drag, currentTab, triggerSwipe]);

  // Programmatic swipe (buttons + keyboard)
  const swipeLeft = useCallback(() => {
    if (!currentTab || exiting) return;
    triggerSwipe("left", currentTab);
  }, [currentTab, exiting, triggerSwipe]);

  const swipeRight = useCallback(() => {
    if (!currentTab || exiting) return;
    triggerSwipe("right", currentTab);
  }, [currentTab, exiting, triggerSwipe]);

  const swipeUp = useCallback(() => {
    if (!currentTab || exiting) return;
    triggerSwipe("up", currentTab);
  }, [currentTab, exiting, triggerSwipe]);

  useKeyboardShortcuts({
    onSwipeLeft: swipeLeft,
    onSwipeRight: swipeRight,
    onSwipeUp: swipeUp,
    onUndo,
    enabled: currentTab !== null,
  });

  // Compute top card transform
  const isDragging = drag !== null && !exiting;
  const activeDir = isDragging ? getActiveDirection(drag.x, drag.y) : null;

  function getTopCardStyle(): React.CSSProperties {
    if (exiting) {
      const tx = exiting === "left" ? -800 : exiting === "right" ? 800 : 0;
      const ty = exiting === "up" ? -800 : 0;
      const rot = exiting === "left" ? -20 : exiting === "right" ? 20 : 0;
      return {
        transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`,
        transition: `transform ${EXIT_DURATION}ms ease-in`,
      };
    }
    if (isDragging) {
      const rot = drag.x * 0.08;
      return {
        transform: `translate(${drag.x}px, ${drag.y}px) rotate(${rot}deg)`,
        transition: "none",
        cursor: "grabbing",
      };
    }
    return {
      transform: "translate(0, 0) rotate(0deg)",
      transition: "transform 300ms ease-out",
      cursor: "grab",
    };
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <ProgressBar current={progress.current} total={progress.total} />

      {excludedCount > 0 && <ExcludedNotice count={excludedCount} />}

      {/* Card stack */}
      <div className="relative w-[380px] h-[360px] overflow-visible">
        {visibleTabs.map((tab, i) => {
          const reverseIndex = visibleTabs.length - 1 - i;
          const isTop = reverseIndex === 0;

          return (
            <div
              key={tab.id}
              className="absolute inset-0 select-none"
              style={{
                transform: isTop
                  ? undefined
                  : `scale(${1 - reverseIndex * 0.04}) translateY(${reverseIndex * 8}px)`,
                zIndex: visibleTabs.length - reverseIndex,
                pointerEvents: isTop ? "auto" : "none",
                ...(isTop ? getTopCardStyle() : {}),
              }}
              onPointerDown={isTop ? onPointerDown : undefined}
              onPointerMove={isTop ? onPointerMove : undefined}
              onPointerUp={isTop ? onPointerUp : undefined}
            >
              <TabCard tab={tab} />

              {/* Swipe overlays */}
              {isTop && (
                <>
                  <div
                    className="absolute top-4 left-4 px-3 py-1 rounded-lg border-2 border-close text-close font-bold text-lg -rotate-12 pointer-events-none transition-opacity duration-100"
                    style={{ opacity: activeDir === "left" || exiting === "left" ? 1 : 0 }}
                  >
                    CLOSE
                  </div>
                  <div
                    className="absolute top-4 right-4 px-3 py-1 rounded-lg border-2 border-keep text-keep font-bold text-lg rotate-12 pointer-events-none transition-opacity duration-100"
                    style={{ opacity: activeDir === "right" || exiting === "right" ? 1 : 0 }}
                  >
                    KEEP
                  </div>
                  <div
                    className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg border-2 border-primary text-primary font-bold text-lg pointer-events-none transition-opacity duration-100"
                    style={{ opacity: activeDir === "up" || exiting === "up" ? 1 : 0 }}
                  >
                    SAVE
                  </div>
                </>
              )}
            </div>
          );
        })}
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
