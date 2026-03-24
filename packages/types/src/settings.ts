export type SortOrder = "lru" | "domain" | "title";

export interface DecluttrSettings {
  sortOrder: SortOrder;
  excludedDomains: string[];
  captureScreenshots: boolean;
  confirmBeforeClose: boolean;
}

export const DEFAULT_SETTINGS: DecluttrSettings = {
  sortOrder: "lru",
  excludedDomains: [],
  captureScreenshots: true,
  confirmBeforeClose: true,
};
