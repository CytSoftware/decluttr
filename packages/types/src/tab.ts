export interface TabCard {
  id: number;
  windowId: number;
  url: string;
  title: string;
  favIconUrl?: string;
  lastAccessed: number;
  pinned: boolean;
  screenshotUrl?: string;
  isDuplicate: boolean;
  duplicateGroupId?: string;
  domain: string;
}

export interface DuplicateGroup {
  groupId: string;
  url: string;
  tabs: TabCard[];
}

export type DeckState = "loading" | "swiping" | "summary" | "empty";

export interface SessionState {
  tabs: TabCard[];
  duplicateGroups: DuplicateGroup[];
  currentIndex: number;
  keptTabs: TabCard[];
  closedTabs: TabCard[];
  excludedCount: number;
  startTime: number;
}

export type SwipeDirection = "left" | "right";

export interface UndoAction {
  type: "close" | "keep";
  tab: TabCard;
  previousIndex: number;
}
