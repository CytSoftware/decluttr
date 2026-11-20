/** Name of the native messaging host the extension connects to. */
export const BRIDGE_HOST_NAME = "app.getdecluttr.bridge";

export type DecisionAction = "close" | "keep" | "save" | "undo";
export type DecisionSource = "ui" | "cli";

/**
 * One triage decision. Logged for every swipe (UI) and every CLI action so
 * an agent can learn which tabs a person keeps and which they close.
 */
export interface DecisionRecord {
  ts: number;
  action: DecisionAction;
  source: DecisionSource;
  url: string;
  title: string;
  domain: string;
  /** Tab age in ms at decision time (now - lastAccessed), 0 if unknown. */
  ageMs: number;
  isDuplicate: boolean;
  duplicateCount?: number;
  windowIndex?: number;
}

/** Command sent from the CLI (via the native host) to the extension. */
export interface BridgeRequest {
  id: string;
  cmd: "ping" | "tabs" | "close" | "keep" | "save" | "focus" | "saved" | "log";
  args?: {
    ids?: number[];
    limit?: number;
    since?: number;
  };
}

export interface BridgeResponse {
  id: string;
  ok: boolean;
  result?: unknown;
  error?: string;
}

/** Unsolicited message from the extension to the host. */
export interface BridgeEvent {
  event: "hello" | "decision";
  data: unknown;
}
