import browser from "webextension-polyfill";

const TAB_ACCESS_KEY = "decluttr_tab_access_times";

// Toolbar click is handled by the popup (manifest default_popup).
// No onClicked listener needed.

// Track tab access times for LRU sorting (Chrome doesn't expose lastAccessed)
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    const data = await browser.storage.local.get(TAB_ACCESS_KEY);
    const times: Record<number, number> = data[TAB_ACCESS_KEY] ?? {};
    times[tabId] = Date.now();
    await browser.storage.local.set({ [TAB_ACCESS_KEY]: times });
  } catch {
    // Silently fail — not critical
  }
});

// Clean up access times when tabs close
browser.tabs.onRemoved.addListener(async (tabId) => {
  try {
    const data = await browser.storage.local.get(TAB_ACCESS_KEY);
    const times: Record<number, number> = data[TAB_ACCESS_KEY] ?? {};
    delete times[tabId];
    await browser.storage.local.set({ [TAB_ACCESS_KEY]: times });
  } catch {
    // Silently fail
  }
});

// Handle messages from the UI (screenshot capture, etc.)
browser.runtime.onMessage.addListener(
  (message: { type: string; tabId?: number; windowId?: number }, sender) => {
    if (message.type === "CAPTURE_TAB" && message.tabId && message.windowId) {
      return handleCaptureTab(message.tabId, message.windowId, sender.tab?.id);
    }
    if (message.type === "GET_ACCESS_TIMES") {
      return handleGetAccessTimes();
    }
    return undefined;
  }
);

async function handleCaptureTab(
  tabId: number,
  windowId: number,
  decluttrTabId?: number
): Promise<{ success: boolean; dataUrl?: string; error?: string }> {
  try {
    // Activate target tab to capture it
    await browser.tabs.update(tabId, { active: true });

    // Brief delay for the page to paint
    await new Promise((r) => setTimeout(r, 400));

    // Capture the visible tab
    const dataUrl = await browser.tabs.captureVisibleTab(windowId, {
      format: "jpeg",
      quality: 70,
    });

    // Switch back to Decluttr tab
    if (decluttrTabId) {
      await browser.tabs.update(decluttrTabId, { active: true });
    }

    return { success: true, dataUrl };
  } catch (e) {
    // Switch back even on error
    if (decluttrTabId) {
      try {
        await browser.tabs.update(decluttrTabId, { active: true });
      } catch {
        // Ignore
      }
    }
    return { success: false, error: String(e) };
  }
}

async function handleGetAccessTimes(): Promise<Record<number, number>> {
  const data = await browser.storage.local.get(TAB_ACCESS_KEY);
  return data[TAB_ACCESS_KEY] ?? {};
}

console.log("Decluttr background script loaded");
