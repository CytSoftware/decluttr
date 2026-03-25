import browser from "webextension-polyfill";
import type { SavedTab } from "@decluttr/types";
import { SAVED_TABS_KEY } from "./constants";

export async function loadSavedTabs(): Promise<SavedTab[]> {
  try {
    const data = await browser.storage.local.get(SAVED_TABS_KEY);
    return data[SAVED_TABS_KEY] ?? [];
  } catch {
    return [];
  }
}

export async function addSavedTab(tab: SavedTab): Promise<void> {
  const tabs = await loadSavedTabs();
  // Avoid duplicates by URL
  const exists = tabs.some((t) => t.url === tab.url);
  if (!exists) {
    tabs.unshift(tab);
  }
  await browser.storage.local.set({ [SAVED_TABS_KEY]: tabs });
}

export async function removeSavedTab(url: string): Promise<void> {
  const tabs = await loadSavedTabs();
  const filtered = tabs.filter((t) => t.url !== url);
  await browser.storage.local.set({ [SAVED_TABS_KEY]: filtered });
}

export async function clearSavedTabs(): Promise<void> {
  await browser.storage.local.set({ [SAVED_TABS_KEY]: [] });
}

export function groupByDomain(
  tabs: SavedTab[]
): Record<string, SavedTab[]> {
  const groups: Record<string, SavedTab[]> = {};
  for (const tab of tabs) {
    if (!groups[tab.domain]) groups[tab.domain] = [];
    groups[tab.domain].push(tab);
  }
  return groups;
}
