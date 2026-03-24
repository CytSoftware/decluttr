import type { TabCard } from "@decluttr/types";

interface SummaryScreenProps {
  closedTabs: TabCard[];
  keptTabs: TabCard[];
  startTime: number;
  onConfirm: () => void;
  onCancel: () => void;
  onRescue: (tabId: number) => void;
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}

export function SummaryScreen({
  closedTabs,
  keptTabs,
  startTime,
  onConfirm,
  onCancel,
  onRescue,
}: SummaryScreenProps) {
  const duration = formatDuration(Date.now() - startTime);

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
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-close/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-close">
            {closedTabs.length}
          </div>
          <div className="text-xs text-text-secondary mt-1">to close</div>
        </div>
        <div className="bg-keep/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-keep">{keptTabs.length}</div>
          <div className="text-xs text-text-secondary mt-1">kept</div>
        </div>
        <div className="bg-primary/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{duration}</div>
          <div className="text-xs text-text-secondary mt-1">time</div>
        </div>
      </div>

      {/* Tabs to close */}
      {closedTabs.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-text-primary">
            Tabs to close:
          </h3>
          <div className="max-h-[240px] overflow-y-auto space-y-1 rounded-xl border border-border">
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
                  title="Keep this tab"
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
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={closedTabs.length === 0}
          className="flex-1 px-4 py-2.5 rounded-lg bg-close text-white hover:bg-rose-600 disabled:opacity-50 text-sm font-medium transition-colors"
        >
          Close {closedTabs.length} tab{closedTabs.length !== 1 ? "s" : ""}
        </button>
      </div>
    </div>
  );
}
