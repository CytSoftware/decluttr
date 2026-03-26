import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { loadSavedTabs } from "../lib/saved";

export function App() {
  const [savedCount, setSavedCount] = useState<number | null>(null);

  useEffect(() => {
    loadSavedTabs().then((tabs) => setSavedCount(tabs.length));
  }, []);

  const startDecluttering = async () => {
    const decluttrUrl = browser.runtime.getURL("src/newtab/index.html");
    const existingTabs = await browser.tabs.query({ url: decluttrUrl });

    if (existingTabs.length > 0 && existingTabs[0].id) {
      await browser.tabs.update(existingTabs[0].id, { active: true });
      if (existingTabs[0].windowId) {
        await browser.windows.update(existingTabs[0].windowId, { focused: true });
      }
    } else {
      await browser.tabs.create({ url: decluttrUrl });
    }
    window.close();
  };

  const viewSaved = async () => {
    const savedUrl = browser.runtime.getURL("src/saved/index.html");
    await browser.tabs.create({ url: savedUrl });
    window.close();
  };

  return (
    <div className="w-[220px] p-3 space-y-2">
      <h1 className="text-sm font-bold text-text-primary text-center">Decluttr</h1>

      <button
        onClick={startDecluttering}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark text-sm font-medium transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
        Start Decluttering
      </button>

      <button
        onClick={viewSaved}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border text-text-primary hover:bg-gray-50 text-sm font-medium transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          Saved Tabs
        </div>
        {savedCount !== null && savedCount > 0 && (
          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
            {savedCount}
          </span>
        )}
      </button>
    </div>
  );
}
