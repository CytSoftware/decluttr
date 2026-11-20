import browser from "webextension-polyfill";
import type { DecisionAction, DecisionRecord, DecisionSource, TabCard } from "@decluttr/types";
import { DECISION_LOG_KEY, DECISION_LOG_MAX } from "./constants";

export function toDecision(
  tab: TabCard,
  action: DecisionAction,
  source: DecisionSource
): DecisionRecord {
  const now = Date.now();
  return {
    ts: now,
    action,
    source,
    url: tab.url,
    title: tab.title,
    domain: tab.domain,
    ageMs: tab.lastAccessed ? Math.max(0, now - tab.lastAccessed) : 0,
    isDuplicate: tab.isDuplicate,
    duplicateCount: tab.duplicateCount,
    windowIndex: tab.windowIndex,
  };
}

/** Appends to the local decision log (capped). Background-only writer. */
export async function appendDecision(record: DecisionRecord): Promise<void> {
  const data = await browser.storage.local.get(DECISION_LOG_KEY);
  const log = (data[DECISION_LOG_KEY] as DecisionRecord[] | undefined) ?? [];
  log.push(record);
  if (log.length > DECISION_LOG_MAX) log.splice(0, log.length - DECISION_LOG_MAX);
  await browser.storage.local.set({ [DECISION_LOG_KEY]: log });
}

export async function loadDecisions(since = 0, limit = 1000): Promise<DecisionRecord[]> {
  const data = await browser.storage.local.get(DECISION_LOG_KEY);
  const log = (data[DECISION_LOG_KEY] as DecisionRecord[] | undefined) ?? [];
  return log.filter((d) => d.ts >= since).slice(-limit);
}
