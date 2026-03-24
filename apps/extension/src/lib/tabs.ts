import browser from "webextension-polyfill";
import type { TabCard, DuplicateGroup, DecluttrSettings } from "@decluttr/types";
import { EXCLUDED_PROTOCOLS, NEW_TAB_URLS } from "./constants";

/**
 * Extracts the domain from a URL.
 */
function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

/**
 * Normalizes a URL for duplicate detection.
 * Strips trailing slash and fragment, keeps query params.
 */
function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return url;
  }
}

/**
 * Checks if a tab should be excluded from the swipe deck.
 */
function isSpecialTab(
  tab: browser.Tabs.Tab,
  selfTabId: number | undefined,
  excludedDomains: string[]
): boolean {
  if (tab.pinned) return true;
  if (tab.id === selfTabId) return true;
  if (!tab.url) return true;

  if (EXCLUDED_PROTOCOLS.some((p) => tab.url!.startsWith(p))) return true;
  if (NEW_TAB_URLS.includes(tab.url)) return true;

  const domain = getDomain(tab.url);
  if (excludedDomains.includes(domain)) return true;

  return false;
}

/**
 * Fetches all tabs from all windows, filters, sorts, and detects duplicates.
 */
export async function fetchAndProcessTabs(
  settings: DecluttrSettings
): Promise<{
  tabs: TabCard[];
  duplicateGroups: DuplicateGroup[];
  excludedCount: number;
}> {
  // Get all tabs across all windows
  const allTabs = await browser.tabs.query({});

  // Get the current Decluttr tab ID to exclude it
  const currentTab = await browser.tabs.getCurrent();
  const selfTabId = currentTab?.id;

  // Get LRU access times (for Chrome which lacks lastAccessed)
  const accessTimes = await getAccessTimes();

  // Filter
  let excludedCount = 0;
  const eligibleTabs: TabCard[] = [];

  for (const tab of allTabs) {
    if (isSpecialTab(tab, selfTabId, settings.excludedDomains)) {
      excludedCount++;
      continue;
    }

    const lastAccessed =
      (tab as { lastAccessed?: number }).lastAccessed ??
      accessTimes[tab.id!] ??
      0;

    eligibleTabs.push({
      id: tab.id!,
      windowId: tab.windowId!,
      url: tab.url!,
      title: tab.title || "Untitled",
      favIconUrl: tab.favIconUrl || undefined,
      lastAccessed,
      pinned: false,
      isDuplicate: false,
      domain: getDomain(tab.url!),
    });
  }

  // Sort
  sortTabs(eligibleTabs, settings.sortOrder);

  // Detect duplicates
  const duplicateGroups = detectDuplicates(eligibleTabs);

  return { tabs: eligibleTabs, duplicateGroups, excludedCount };
}

/**
 * Gets tab access times from storage (Chrome LRU fallback).
 */
async function getAccessTimes(): Promise<Record<number, number>> {
  try {
    const response = await browser.runtime.sendMessage({
      type: "GET_ACCESS_TIMES",
    });
    return response ?? {};
  } catch {
    return {};
  }
}

/**
 * Sorts tabs in-place based on the sort order.
 */
function sortTabs(tabs: TabCard[], sortOrder: string): void {
  switch (sortOrder) {
    case "lru":
      // Least recently used first (ascending lastAccessed)
      tabs.sort((a, b) => a.lastAccessed - b.lastAccessed);
      break;
    case "domain":
      tabs.sort((a, b) => a.domain.localeCompare(b.domain));
      break;
    case "title":
      tabs.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }
}

/**
 * Detects duplicate tabs (same normalized URL) and marks them.
 * Returns duplicate groups with 2+ tabs.
 */
function detectDuplicates(tabs: TabCard[]): DuplicateGroup[] {
  const urlMap = new Map<string, TabCard[]>();

  for (const tab of tabs) {
    const normalized = normalizeUrl(tab.url);
    const group = urlMap.get(normalized) ?? [];
    group.push(tab);
    urlMap.set(normalized, group);
  }

  const groups: DuplicateGroup[] = [];

  for (const [normalizedUrl, groupTabs] of urlMap) {
    if (groupTabs.length > 1) {
      const groupId = normalizedUrl;
      for (const tab of groupTabs) {
        tab.isDuplicate = true;
        tab.duplicateGroupId = groupId;
      }
      groups.push({
        groupId,
        url: groupTabs[0].url,
        tabs: groupTabs,
      });
    }
  }

  return groups;
}

/**
 * Formats a relative time string from a timestamp.
 */
export function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return "Unknown";

  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}
