import browser from "webextension-polyfill";
import {
  BRIDGE_HOST_NAME,
  type BridgeRequest,
  type BridgeResponse,
  type DecisionRecord,
  type TabCard,
} from "@decluttr/types";
import { fetchAndProcessTabs } from "../lib/tabs";
import { loadSettings } from "../lib/settings";
import { addSavedTab, loadSavedTabs } from "../lib/saved";
import { appendDecision, loadDecisions, toDecision } from "../lib/decisions";

/**
 * CLI bridge: connects to a local native messaging host so tabs can be
 * listed, closed, kept and saved from the command line (`decluttr ...`).
 *
 * Off unless the user grants the optional `nativeMessaging` permission in
 * Settings and installs the host (see bridge/README.md). Pinned and
 * excluded tabs are never exposed or closed, same as the swipe deck.
 */

let port: browser.Runtime.Port | null = null;
let hostReady = false;
let lastError: string | null = null;
let retryMs = 2000;
let retryTimer: ReturnType<typeof setTimeout> | null = null;

export interface BridgeStatus {
  permission: boolean;
  connected: boolean;
  error: string | null;
}

export async function getBridgeStatus(): Promise<BridgeStatus> {
  const permission = await hasPermission();
  return { permission, connected: permission && hostReady, error: permission ? lastError : null };
}

/** Skip the backoff, e.g. right after the user installs the host. */
export function reconnectNow(): void {
  if (port) return;
  retryMs = 2000;
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
  void startBridge();
}

async function hasPermission(): Promise<boolean> {
  try {
    return await browser.permissions.contains({ permissions: ["nativeMessaging"] });
  } catch {
    return false;
  }
}

export async function startBridge(): Promise<void> {
  if (port || !(await hasPermission())) return;
  try {
    port = browser.runtime.connectNative(BRIDGE_HOST_NAME);
  } catch (e) {
    port = null;
    lastError = String(e);
    scheduleRetry();
    return;
  }

  const connectedAt = Date.now();
  port.onMessage.addListener((msg: unknown) => {
    retryMs = 2000;
    if ((msg as { event?: string })?.event === "ready") {
      hostReady = true;
      lastError = null;
      return;
    }
    void handleRequest(msg as BridgeRequest);
  });
  port.onDisconnect.addListener((p) => {
    // Firefox puts the reason on port.error, Chrome on runtime.lastError.
    const err =
      (p as { error?: { message?: string } }).error?.message ??
      (globalThis as { chrome?: { runtime?: { lastError?: { message?: string } } } }).chrome
        ?.runtime?.lastError?.message;
    lastError = err ?? (hostReady ? "Bridge disconnected" : "Bridge not installed");
    hostReady = false;
    port = null;
    // Host missing or crashed: back off so we don't spin.
    if (Date.now() - connectedAt < 5000) retryMs = Math.min(retryMs * 2, 5 * 60_000);
    scheduleRetry();
  });

  const manifest = browser.runtime.getManifest();
  port.postMessage({ event: "hello", data: { version: manifest.version } });
}

function scheduleRetry(): void {
  if (retryTimer) return;
  retryTimer = setTimeout(() => {
    retryTimer = null;
    void startBridge();
  }, retryMs);
}

export function stopBridge(): void {
  port?.disconnect();
  port = null;
  hostReady = false;
  lastError = null;
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
}

// Swipes come in fast bursts; serialize the storage read-modify-write so
// no decision is lost.
let decisionQueue: Promise<void> = Promise.resolve();

/** Records a decision locally and mirrors it to the host log file. */
export function recordDecision(record: DecisionRecord): Promise<void> {
  decisionQueue = decisionQueue.then(() => writeDecision(record)).catch(() => {});
  return decisionQueue;
}

async function writeDecision(record: DecisionRecord): Promise<void> {
  await appendDecision(record);
  try {
    port?.postMessage({ event: "decision", data: record });
  } catch {
    // Host gone; storage copy is enough.
  }
}

function reply(res: BridgeResponse): void {
  try {
    port?.postMessage(res);
  } catch {
    // Ignore
  }
}

async function eligibleTabs(): Promise<Map<number, TabCard>> {
  const settings = await loadSettings();
  const { tabs } = await fetchAndProcessTabs(settings);
  // Drop Decluttr's own pages (the bridge runs in the background, so
  // getCurrent() can't exclude them for us).
  const own = browser.runtime.getURL("");
  return new Map(tabs.filter((t) => !t.url.startsWith(own)).map((t) => [t.id, t]));
}

function compact(t: TabCard) {
  return {
    id: t.id,
    title: t.title,
    url: t.url,
    domain: t.domain,
    window: t.windowIndex,
    lastAccessed: t.lastAccessed,
    duplicateCount: t.isDuplicate ? t.duplicateCount : undefined,
    audible: t.isAudible || undefined,
  };
}

async function handleRequest(req: BridgeRequest): Promise<void> {
  if (!req || typeof req.id !== "string") return;
  try {
    const result = await run(req);
    reply({ id: req.id, ok: true, result });
  } catch (e) {
    reply({ id: req.id, ok: false, error: String(e) });
  }
}

async function run(req: BridgeRequest): Promise<unknown> {
  const ids = (req.args?.ids ?? []).map(Number).filter(Number.isFinite);

  switch (req.cmd) {
    case "ping":
      return { version: browser.runtime.getManifest().version };

    case "tabs": {
      const tabs = await eligibleTabs();
      return [...tabs.values()].map(compact);
    }

    case "close":
    case "keep":
    case "save": {
      const tabs = await eligibleTabs();
      const done: number[] = [];
      const missing: number[] = [];
      for (const id of ids) {
        const tab = tabs.get(id);
        if (!tab) {
          missing.push(id);
          continue;
        }
        if (req.cmd === "save") await addSavedTab({ ...tab, savedAt: Date.now() });
        if (req.cmd !== "keep") {
          try {
            await browser.tabs.remove(id);
          } catch {
            missing.push(id);
            continue;
          }
        }
        await recordDecision(toDecision(tab, req.cmd, "cli"));
        done.push(id);
      }
      return { [req.cmd === "close" ? "closed" : req.cmd === "save" ? "saved" : "kept"]: done, missing };
    }

    case "focus": {
      const tab = await browser.tabs.update(ids[0], { active: true });
      if (tab.windowId !== undefined) await browser.windows.update(tab.windowId, { focused: true });
      return { focused: ids[0] };
    }

    case "saved":
      return (await loadSavedTabs()).map((t) => ({
        title: t.title,
        url: t.url,
        domain: t.domain,
        savedAt: t.savedAt,
      }));

    case "log":
      return loadDecisions(req.args?.since ?? 0, req.args?.limit ?? 1000);

    default:
      throw new Error(`unknown command: ${String((req as { cmd: unknown }).cmd)}`);
  }
}
