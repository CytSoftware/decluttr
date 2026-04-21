import browser from "webextension-polyfill";

const TAB_ACCESS_KEY = "decluttr_tab_access_times";

// Self-contained function injected into target tabs as the decision overlay.
// MUST be self-contained — runs in the content-script isolated world. No imports,
// no closure references, uses the global chrome/browser runtime API directly.
function decluttrOverlay() {
  const OVERLAY_ID = "__decluttr-preview-overlay";

  const existing = document.getElementById(OVERLAY_ID);
  if (existing) existing.remove();

  const host = document.createElement("div");
  host.id = OVERLAY_ID;
  host.style.cssText =
    "position:fixed;left:50%;bottom:32px;transform:translateX(-50%);z-index:2147483647;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;pointer-events:none;";

  const shadow = host.attachShadow({ mode: "closed" });
  shadow.innerHTML = `
    <style>
      :host { all: initial; }
      .wrap {
        pointer-events: auto;
        animation: rise-in 0.32s cubic-bezier(0.16, 1, 0.3, 1) both,
                   float 3.2s ease-in-out 0.4s infinite;
      }
      @keyframes rise-in {
        from { transform: translateY(40px) scale(0.96); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      .pill {
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 22px;
        box-shadow: 0 24px 64px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04);
        padding: 12px 14px;
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 0 6px 0 4px;
        border-right: 1px solid rgba(0,0,0,0.08);
        padding-right: 10px;
        margin-right: 2px;
      }
      .brand-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
      }
      .brand-text {
        font-size: 12px;
        font-weight: 600;
        color: #374151;
        letter-spacing: 0.01em;
      }
      .btn {
        position: relative;
        width: 44px;
        height: 44px;
        border-radius: 14px;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.12s ease, background 0.15s ease, box-shadow 0.15s ease;
        padding: 0;
      }
      .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
      .btn:active { transform: translateY(0) scale(0.94); }
      .btn svg { width: 20px; height: 20px; }
      .kbd {
        position: absolute;
        bottom: -18px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 9px;
        font-weight: 600;
        color: #9ca3af;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        white-space: nowrap;
      }
      .close { background: #fee2e2; color: #dc2626; }
      .close:hover { background: #fecaca; }
      .save { background: #dbeafe; color: #2563eb; }
      .save:hover { background: #bfdbfe; }
      .keep { background: #dcfce7; color: #16a34a; }
      .keep:hover { background: #bbf7d0; }
      .cancel { background: #f3f4f6; color: #6b7280; }
      .cancel:hover { background: #e5e7eb; }
    </style>
    <div class="wrap">
      <div class="pill" role="toolbar" aria-label="Decluttr decision">
        <div class="brand">
          <div class="brand-dot"></div>
          <span class="brand-text">Decluttr</span>
        </div>
        <button class="btn close" data-action="close" title="Close tab (← or J)" aria-label="Close tab">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
          <span class="kbd">←</span>
        </button>
        <button class="btn save" data-action="save" title="Save for later (↑ or S)" aria-label="Save for later">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <span class="kbd">↑</span>
        </button>
        <button class="btn keep" data-action="keep" title="Keep tab (→ or K)" aria-label="Keep tab">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          <span class="kbd">→</span>
        </button>
        <button class="btn cancel" data-action="cancel" title="Back to Decluttr (Esc)" aria-label="Back without deciding">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
          <span class="kbd">Esc</span>
        </button>
      </div>
    </div>
  `;

  let sent = false;

  const send = (action: string) => {
    if (sent) return;
    sent = true;
    try {
      window.removeEventListener("keydown", keyHandler, true);
    } catch {
      /* noop */
    }
    try {
      host.remove();
    } catch {
      /* noop */
    }
    // @ts-expect-error — content-script globals
    const api = typeof browser !== "undefined" ? browser : chrome;
    api.runtime.sendMessage({ type: "PREVIEW_DECISION", action });
  };

  const keyHandler = (e: KeyboardEvent) => {
    const active = document.activeElement as HTMLElement | null;
    if (
      active &&
      (active.tagName === "INPUT" ||
        active.tagName === "TEXTAREA" ||
        active.isContentEditable)
    ) {
      return;
    }
    let action: string | null = null;
    switch (e.key) {
      case "ArrowLeft":
      case "j":
      case "J":
        action = "close";
        break;
      case "ArrowRight":
      case "k":
      case "K":
        action = "keep";
        break;
      case "ArrowUp":
      case "s":
      case "S":
        action = "save";
        break;
      case "Escape":
        action = "cancel";
        break;
    }
    if (action) {
      e.preventDefault();
      e.stopPropagation();
      send(action);
    }
  };

  shadow.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = (btn as HTMLElement).dataset.action;
      if (action) send(action);
    });
  });

  window.addEventListener("keydown", keyHandler, true);
  document.documentElement.appendChild(host);
}

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

// Handle messages from the UI (screenshot capture, overlay injection, decisions).
browser.runtime.onMessage.addListener(
  (
    message: { type: string; tabId?: number; windowId?: number; action?: string },
    sender
  ) => {
    if (message.type === "CAPTURE_TAB" && message.tabId && message.windowId) {
      return handleCaptureTab(message.tabId, message.windowId, sender.tab?.id);
    }
    if (message.type === "GET_ACCESS_TIMES") {
      return handleGetAccessTimes();
    }
    if (message.type === "OPEN_TAB_WITH_OVERLAY" && message.tabId) {
      return handleOpenWithOverlay(message.tabId, sender.tab?.id);
    }
    if (message.type === "PREVIEW_DECISION") {
      // Content-script message — switch focus back to Decluttr tab.
      // The newtab page's own onMessage listener handles the deck update.
      handleReturnToDecluttr();
      return undefined;
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

// Track which extension tab requested the current overlay so we can
// restore focus on decision.
let overlaySourceTabId: number | null = null;

async function handleOpenWithOverlay(
  tabId: number,
  senderTabId?: number
): Promise<{ success: boolean; overlayInjected: boolean; error?: string }> {
  try {
    // Remember which Decluttr tab is waiting so we can switch back later.
    // browser.tabs.getCurrent() returns undefined in the background context —
    // the sender's tab ID is the authoritative source.
    overlaySourceTabId = senderTabId ?? null;

    // Activate target tab (also brings its window to the front).
    await browser.tabs.update(tabId, { active: true });

    // Try to inject the overlay. This fails on restricted pages (chrome://,
    // web store, PDF viewer, etc.) — in that case we return
    // overlayInjected: false so the caller can fall back to the return-panel
    // flow.
    try {
      // Chrome MV3
      if (typeof browser.scripting?.executeScript === "function") {
        await browser.scripting.executeScript({
          target: { tabId },
          func: decluttrOverlay,
        });
      } else if (typeof browser.tabs.executeScript === "function") {
        // Firefox MV2
        const code = `(${decluttrOverlay.toString()})();`;
        await browser.tabs.executeScript(tabId, { code });
      } else {
        return { success: true, overlayInjected: false };
      }
      return { success: true, overlayInjected: true };
    } catch (e) {
      return { success: true, overlayInjected: false, error: String(e) };
    }
  } catch (e) {
    overlaySourceTabId = null;
    return { success: false, overlayInjected: false, error: String(e) };
  }
}

async function handleReturnToDecluttr() {
  const target = overlaySourceTabId;
  overlaySourceTabId = null;
  if (target == null) return;
  try {
    await browser.tabs.update(target, { active: true });
  } catch {
    /* Decluttr tab gone */
  }
}

console.log("Decluttr background script loaded");
