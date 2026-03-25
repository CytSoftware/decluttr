export interface TabCard {
  id: number;
  windowId: number;
  url: string;
  title: string;
  favIconUrl?: string;
  lastAccessed: number;
  pinned: boolean;
  isDuplicate: boolean;
  duplicateGroupId?: string;
  duplicateCount?: number;
  domain: string;
  fullPath: string;
  tabIndex: number;
  windowIndex: number;
  totalWindows: number;
  status?: string;
  isAudible: boolean;
  isMuted: boolean;
  isDiscarded: boolean;
}

export interface DuplicateGroup {
  groupId: string;
  url: string;
  tabs: TabCard[];
}

export interface SavedTab extends TabCard {
  savedAt: number;
}

export type DeckState = "loading" | "swiping" | "summary" | "empty";

export interface SessionState {
  tabs: TabCard[];
  duplicateGroups: DuplicateGroup[];
  currentIndex: number;
  keptTabs: TabCard[];
  closedTabs: TabCard[];
  savedTabs: SavedTab[];
  excludedCount: number;
  startTime: number;
}

export type SwipeDirection = "left" | "right" | "up";

export interface UndoAction {
  type: "close" | "keep" | "save";
  tab: TabCard;
  previousIndex: number;
}
