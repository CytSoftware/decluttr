import { useEffect } from "react";

interface KeyboardActions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp: () => void;
  onUndo: () => void;
  enabled: boolean;
}

export function useKeyboardShortcuts({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onUndo,
  enabled,
}: KeyboardActions) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowLeft":
        case "j":
          e.preventDefault();
          onSwipeLeft();
          break;
        case "ArrowRight":
        case "k":
          e.preventDefault();
          onSwipeRight();
          break;
        case "ArrowUp":
        case "s":
          e.preventDefault();
          onSwipeUp();
          break;
        case "u":
          e.preventDefault();
          onUndo();
          break;
        case "z":
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault();
            onUndo();
          }
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onUndo, enabled]);
}
