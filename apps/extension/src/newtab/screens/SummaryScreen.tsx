import browser from "webextension-polyfill";
import type { TabCard, SavedTab } from "@decluttr/types";

interface SummaryScreenProps {
  closedTabs: TabCard[];
  keptTabs: TabCard[];
  savedTabs: SavedTab[];
  startTime: number;
  onConfirm: () => void;
  onCancel: () => void;
  onRescue: (tabId: number) => void;
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes > 0) return `${minutes}m ${remainingSeconds}s`;
  return `${remainingSeconds}s`;
}

export function SummaryScreen({
  closedTabs,
  keptTabs,
  savedTabs,
  startTime,
  onConfirm,
  onCancel,
  onRescue,
}: SummaryScreenProps) {
  const duration = formatDuration(Date.now() - startTime);

  const openSavedPage = () => {
    browser.tabs.create({
      url: browser.runtime.getURL("src/saved/index.html"),
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-text-primary">
          Session Complete
        </h1>
        <p className="text-text-secondary text-sm">
          Here&apos;s your decluttering summary
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-close/5 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-close">
            {closedTabs.length}
          </div>
          <div className="text-[10px] text-text-secondary mt-1">closed</div>
        </div>
        <div className="bg-primary/5 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-primary">
            {savedTabs.length}
          </div>
          <div className="text-[10px] text-text-secondary mt-1">saved</div>
        </div>
        <div className="bg-keep/5 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-keep">{keptTabs.length}</div>
          <div className="text-[10px] text-text-secondary mt-1">kept</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <div className="text-xl font-bold text-text-secondary">{duration}</div>
          <div className="text-[10px] text-text-secondary mt-1">time</div>
        </div>
      </div>

      {/* Saved tabs link */}
      {savedTabs.length > 0 && (
        <button
          onClick={openSavedPage}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-primary/5 hover:bg-primary/10 transition-colors"
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-sm font-medium text-primary">
              View {savedTabs.length} saved tab{savedTabs.length !== 1 ? "s" : ""}
            </span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Tabs closed */}
      {closedTabs.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-text-primary">
            Tabs closed:
          </h3>
          <div className="max-h-[200px] overflow-y-auto space-y-1 rounded-xl border border-border">
            {closedTabs.map((tab) => (
              <div
                key={tab.id}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
              >
                {tab.favIconUrl ? (
                  <img
                    src={tab.favIconUrl}
                    alt=""
                    className="w-4 h-4 flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0" />
                )}
                <span className="text-sm text-text-primary truncate flex-1">
                  {tab.title}
                </span>
                <button
                  onClick={() => onRescue(tab.id)}
                  className="text-xs text-primary hover:text-primary-dark flex-shrink-0"
                >
                  Rescue
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-lg border border-border text-text-secondary hover:bg-gray-50 text-sm font-medium transition-colors"
        >
          Done
        </button>
        {closedTabs.length > 0 && (
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary-dark text-sm font-medium transition-colors"
          >
            Close Decluttr
          </button>
        )}
      </div>
    </div>
  );
}
