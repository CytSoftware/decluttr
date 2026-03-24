import browser from "webextension-polyfill";
import type { DecluttrSettings } from "@decluttr/types";
import { DEFAULT_SETTINGS } from "@decluttr/types";

const SETTINGS_KEY = "decluttr_settings";

export async function loadSettings(): Promise<DecluttrSettings> {
  try {
    const data = await browser.storage.local.get(SETTINGS_KEY);
    const stored = data[SETTINGS_KEY];
    return { ...DEFAULT_SETTINGS, ...stored };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(
  settings: Partial<DecluttrSettings>
): Promise<DecluttrSettings> {
  const current = await loadSettings();
  const merged = { ...current, ...settings };
  await browser.storage.local.set({ [SETTINGS_KEY]: merged });
  return merged;
}
