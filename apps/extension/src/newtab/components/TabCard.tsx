import type { TabCard as TabCardType } from "@decluttr/types";
import { formatRelativeTime } from "../../lib/tabs";

interface TabCardProps {
  tab: TabCardType;
}

export function TabCard({ tab }: TabCardProps) {
  return (
    <div className="w-[380px] bg-surface rounded-card shadow-card overflow-hidden select-none">
      {/* Screenshot / Favicon fallback */}
      <div className="h-[220px] bg-gray-50 flex items-center justify-center overflow-hidden relative">
        {tab.screenshotUrl ? (
          <img
            src={tab.screenshotUrl}
            alt={tab.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            {tab.favIconUrl ? (
              <img
                src={tab.favIconUrl}
                alt=""
                className="w-12 h-12"
                draggable={false}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-xl">
                  {tab.domain.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-text-muted text-xs">Preview unavailable</span>
          </div>
        )}
      </div>

      {/* Tab info */}
      <div className="p-4 space-y-2">
        <div className="flex items-start gap-2.5">
          {tab.favIconUrl && (
            <img
              src={tab.favIconUrl}
              alt=""
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <h3 className="text-text-primary font-medium text-sm leading-tight line-clamp-2">
            {tab.title}
          </h3>
        </div>

        <p className="text-text-muted text-xs truncate">{tab.domain}</p>

        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span>{formatRelativeTime(tab.lastAccessed)}</span>
          {tab.isDuplicate && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-medium">
              Duplicate
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
