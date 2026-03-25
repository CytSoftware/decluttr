import { useReducer, useCallback } from "react";
import type {
  TabCard,
  SavedTab,
  DuplicateGroup,
  DeckState,
  SessionState,
  UndoAction,
} from "@decluttr/types";

interface SwipeDeckState extends SessionState {
  deckState: DeckState;
  undoStack: UndoAction[];
}

type Action =
  | {
      type: "INIT";
      tabs: TabCard[];
      duplicateGroups: DuplicateGroup[];
      excludedCount: number;
    }
  | { type: "SET_STATE"; deckState: DeckState }
  | { type: "CLOSE_TAB"; tab: TabCard }
  | { type: "KEEP_TAB"; tab: TabCard }
  | { type: "SAVE_TAB"; tab: TabCard }
  | { type: "UNDO" }
  | { type: "RESCUE_TAB"; tabId: number }
  | { type: "TAB_REMOVED_EXTERNALLY"; tabId: number };

function reducer(state: SwipeDeckState, action: Action): SwipeDeckState {
  switch (action.type) {
    case "INIT": {
      const deckState = action.tabs.length === 0 ? "empty" : "swiping";
      return {
        ...state,
        tabs: action.tabs,
        duplicateGroups: action.duplicateGroups,
        excludedCount: action.excludedCount,
        currentIndex: 0,
        keptTabs: [],
        closedTabs: [],
        savedTabs: [],
        undoStack: [],
        startTime: Date.now(),
        deckState,
      };
    }

    case "SET_STATE":
      return { ...state, deckState: action.deckState };

    case "CLOSE_TAB": {
      const newIndex = state.currentIndex + 1;
      const closedTabs = [...state.closedTabs, action.tab];

      let additionalClosed: TabCard[] = [];
      if (action.tab.isDuplicate && action.tab.duplicateGroupId) {
        const group = state.duplicateGroups.find(
          (g) => g.groupId === action.tab.duplicateGroupId
        );
        if (group) {
          additionalClosed = group.tabs.filter((t) => t.id !== action.tab.id);
        }
      }

      const allClosed = [...closedTabs, ...additionalClosed];
      const deckState =
        newIndex >= state.tabs.length ? "summary" : state.deckState;

      return {
        ...state,
        currentIndex: newIndex,
        closedTabs: allClosed,
        undoStack: [
          ...state.undoStack,
          { type: "close", tab: action.tab, previousIndex: state.currentIndex },
        ],
        deckState,
      };
    }

    case "KEEP_TAB": {
      const newIndex = state.currentIndex + 1;

      let additionalClosed: TabCard[] = [];
      if (action.tab.isDuplicate && action.tab.duplicateGroupId) {
        const group = state.duplicateGroups.find(
          (g) => g.groupId === action.tab.duplicateGroupId
        );
        if (group) {
          additionalClosed = group.tabs.filter((t) => t.id !== action.tab.id);
        }
      }

      const deckState =
        newIndex >= state.tabs.length ? "summary" : state.deckState;

      return {
        ...state,
        currentIndex: newIndex,
        keptTabs: [...state.keptTabs, action.tab],
        closedTabs: [...state.closedTabs, ...additionalClosed],
        undoStack: [
          ...state.undoStack,
          { type: "keep", tab: action.tab, previousIndex: state.currentIndex },
        ],
        deckState,
      };
    }

    case "SAVE_TAB": {
      const newIndex = state.currentIndex + 1;
      const saved: SavedTab = { ...action.tab, savedAt: Date.now() };
      const deckState =
        newIndex >= state.tabs.length ? "summary" : state.deckState;

      return {
        ...state,
        currentIndex: newIndex,
        savedTabs: [...state.savedTabs, saved],
        undoStack: [
          ...state.undoStack,
          { type: "save", tab: action.tab, previousIndex: state.currentIndex },
        ],
        deckState,
      };
    }

    case "UNDO": {
      if (state.undoStack.length === 0) return state;

      const lastAction = state.undoStack[state.undoStack.length - 1];
      const newUndoStack = state.undoStack.slice(0, -1);

      let keptTabs = state.keptTabs;
      let closedTabs = state.closedTabs;
      let savedTabs = state.savedTabs;

      if (lastAction.type === "close") {
        const tabsToRemove = new Set([lastAction.tab.id]);
        if (lastAction.tab.isDuplicate && lastAction.tab.duplicateGroupId) {
          const group = state.duplicateGroups.find(
            (g) => g.groupId === lastAction.tab.duplicateGroupId
          );
          group?.tabs.forEach((t) => tabsToRemove.add(t.id));
        }
        closedTabs = closedTabs.filter((t) => !tabsToRemove.has(t.id));
      } else if (lastAction.type === "keep") {
        keptTabs = keptTabs.filter((t) => t.id !== lastAction.tab.id);
        if (lastAction.tab.isDuplicate && lastAction.tab.duplicateGroupId) {
          const group = state.duplicateGroups.find(
            (g) => g.groupId === lastAction.tab.duplicateGroupId
          );
          const dupIds = new Set(group?.tabs.map((t) => t.id) ?? []);
          closedTabs = closedTabs.filter((t) => !dupIds.has(t.id));
        }
      } else if (lastAction.type === "save") {
        savedTabs = savedTabs.filter((t) => t.url !== lastAction.tab.url);
      }

      return {
        ...state,
        currentIndex: lastAction.previousIndex,
        keptTabs,
        closedTabs,
        savedTabs,
        undoStack: newUndoStack,
        deckState: "swiping",
      };
    }

    case "RESCUE_TAB":
      return {
        ...state,
        closedTabs: state.closedTabs.filter((t) => t.id !== action.tabId),
        keptTabs: [
          ...state.keptTabs,
          ...state.closedTabs.filter((t) => t.id === action.tabId),
        ],
      };

    case "TAB_REMOVED_EXTERNALLY": {
      const newTabs = state.tabs.filter((t) => t.id !== action.tabId);
      const newIndex = Math.min(state.currentIndex, newTabs.length - 1);
      return {
        ...state,
        tabs: newTabs,
        currentIndex: Math.max(0, newIndex),
        closedTabs: state.closedTabs.filter((t) => t.id !== action.tabId),
        keptTabs: state.keptTabs.filter((t) => t.id !== action.tabId),
        deckState: newTabs.length === 0 ? "empty" : state.deckState,
      };
    }

    default:
      return state;
  }
}

const initialState: SwipeDeckState = {
  tabs: [],
  duplicateGroups: [],
  currentIndex: 0,
  keptTabs: [],
  closedTabs: [],
  savedTabs: [],
  excludedCount: 0,
  startTime: Date.now(),
  deckState: "loading",
  undoStack: [],
};

export function useSwipeDeck() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initDeck = useCallback(
    (tabs: TabCard[], duplicateGroups: DuplicateGroup[], excludedCount: number) => {
      dispatch({ type: "INIT", tabs, duplicateGroups, excludedCount });
    },
    []
  );

  const closeTab = useCallback((tab: TabCard) => {
    dispatch({ type: "CLOSE_TAB", tab });
  }, []);

  const keepTab = useCallback((tab: TabCard) => {
    dispatch({ type: "KEEP_TAB", tab });
  }, []);

  const saveTab = useCallback((tab: TabCard) => {
    dispatch({ type: "SAVE_TAB", tab });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: "UNDO" });
  }, []);

  const rescueTab = useCallback((tabId: number) => {
    dispatch({ type: "RESCUE_TAB", tabId });
  }, []);

  const tabRemovedExternally = useCallback((tabId: number) => {
    dispatch({ type: "TAB_REMOVED_EXTERNALLY", tabId });
  }, []);

  const setDeckState = useCallback((deckState: DeckState) => {
    dispatch({ type: "SET_STATE", deckState });
  }, []);

  const currentTab =
    state.deckState === "swiping" && state.currentIndex < state.tabs.length
      ? state.tabs[state.currentIndex]
      : null;

  const canUndo = state.undoStack.length > 0;
  const progress = {
    current: state.currentIndex,
    total: state.tabs.length,
  };

  return {
    state,
    currentTab,
    canUndo,
    progress,
    initDeck,
    closeTab,
    keepTab,
    saveTab,
    undo,
    rescueTab,
    tabRemovedExternally,
    setDeckState,
  };
}
