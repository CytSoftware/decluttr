import browser from "webextension-polyfill";
import type { TabCard } from "@decluttr/types";

interface CaptureResult {
  success: boolean;
  dataUrl?: string;
  error?: string;
}

/**
 * Requests a screenshot capture from the background script.
 */
async function captureTab(
  tabId: number,
  windowId: number
): Promise<CaptureResult> {
  try {
    return await browser.runtime.sendMessage({
      type: "CAPTURE_TAB",
      tabId,
      windowId,
    });
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

/**
 * Batch captures screenshots for tabs, calling onProgress for each.
 * Only captures tabs in the same window as the Decluttr tab to avoid window flashing.
 */
export async function batchCaptureScreenshots(
  tabs: TabCard[],
  onProgress: (completed: number, total: number) => void
): Promise<Map<number, string>> {
  const screenshots = new Map<number, string>();

  // Get current window to only capture same-window tabs
  const currentTab = await browser.tabs.getCurrent();
  const currentWindowId = currentTab?.windowId;

  // Filter to same-window tabs only
  const captureable = tabs.filter((t) => t.windowId === currentWindowId);
  const total = captureable.length;

  for (let i = 0; i < captureable.length; i++) {
    const tab = captureable[i];
    const result = await captureTab(tab.id, tab.windowId);

    if (result.success && result.dataUrl) {
      screenshots.set(tab.id, result.dataUrl);
    }

    onProgress(i + 1, total);
  }

  return screenshots;
}
