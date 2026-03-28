import { useEffect, useState, useCallback } from "react";
import browser from "webextension-polyfill";
import type { SavedTab } from "@decluttr/types";
import { loadSavedTabs, removeSavedTab, clearSavedTabs, groupByDomain } from "../lib/saved";
import { formatRelativeTime } from "../lib/tabs";

export function App() {
  const [tabs, setTabs] = useState<SavedTab[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsedDomains, setCollapsedDomains] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadSavedTabs().then((saved) => {
      setTabs(saved);
      setLoading(false);
    });
  }, []);

  const groups = groupByDomain(tabs);
  const domainKeys = Object.keys(groups).sort((a, b) =>
    groups[b].length - groups[a].length
  );

  const handleOpen = useCallback(async (url: string) => {
    await browser.tabs.create({ url });
  }, []);

  const handleOpenAndRemove = useCallback(async (url: string) => {
    await browser.tabs.create({ url });
    await removeSavedTab(url);
    setTabs((prev) => prev.filter((t) => t.url !== url));
  }, []);

  const handleRemove = useCallback(async (url: string) => {
    await removeSavedTab(url);
    setTabs((prev) => prev.filter((t) => t.url !== url));
  }, []);

  const handleOpenAll = useCallback(async (domain: string) => {
    const domainTabs = groups[domain] ?? [];
    for (const tab of domainTabs) {
      await browser.tabs.create({ url: tab.url, active: false });
    }
  }, [groups]);

  const handleClearAll = useCallback(async () => {
    if (tabs.length === 0) return;
    await clearSavedTabs();
    setTabs([]);
  }, [tabs.length]);

  const toggleDomain = useCallback((domain: string) => {
    setCollapsedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(domain)) next.delete(domain);
      else next.add(domain);
      return next;
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <img src="/icons/icon-48.png" alt="" className="w-7 h-7" />
              <h1 className="text-2xl font-bold text-text-primary">Saved Tabs</h1>
            </div>
            <p className="text-sm text-text-secondary mt-0.5">
              {tabs.length} tab{tabs.length !== 1 ? "s" : ""} saved for later
            </p>
          </div>
          {tabs.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-text-muted hover:text-close transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Empty state */}
        {tabs.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <div className="text-4xl">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-text-muted">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-text-primary">No saved tabs yet</h2>
            <p className="text-sm text-text-secondary max-w-xs mx-auto">
              Swipe up on a tab during a decluttering session to save it for later.
            </p>
          </div>
        )}

        {/* Domain groups */}
        {domainKeys.map((domain) => {
          const domainTabs = groups[domain];
          const isCollapsed = collapsedDomains.has(domain);
          const firstFavicon = domainTabs.find((t) => t.favIconUrl)?.favIconUrl;

          return (
            <div key={domain} className="rounded-xl border border-border overflow-hidden">
              {/* Domain header */}
              <button
                onClick={() => toggleDomain(domain)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {firstFavicon ? (
                  <img src={firstFavicon} alt="" className="w-5 h-5 rounded" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                ) : (
                  <div className="w-5 h-5 rounded bg-gray-300 flex items-center justify-center text-[10px] font-bold text-white">
                    {domain.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-text-primary flex-1 text-left">
                  {domain}
                </span>
                <span className="text-xs text-text-muted">
                  {domainTabs.length} tab{domainTabs.length !== 1 ? "s" : ""}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpenAll(domain); }}
                  className="text-xs text-primary hover:text-primary-dark ml-2"
                >
                  Open all
                </button>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-text-muted transition-transform ${isCollapsed ? "" : "rotate-180"}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Tab list */}
              {!isCollapsed && (
                <div className="divide-y divide-border">
                  {domainTabs.map((tab) => (
                    <div
                      key={tab.url}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-text-primary truncate">
                          {tab.title}
                        </div>
                        <div className="text-[11px] text-text-muted truncate font-mono">
                          {tab.fullPath}
                        </div>
                        <div className="text-[10px] text-text-muted mt-0.5">
                          Saved {formatRelativeTime(tab.savedAt)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenAndRemove(tab.url)}
                          className="text-xs px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          Open
                        </button>
                        <button
                          onClick={() => handleRemove(tab.url)}
                          className="text-xs px-2 py-1 rounded bg-gray-100 text-text-muted hover:bg-close/10 hover:text-close transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
