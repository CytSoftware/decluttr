import type { TabCard as TabCardType } from "@decluttr/types";
import { formatRelativeTime } from "../../lib/tabs";

interface TabCardProps {
  tab: TabCardType;
}

// Generate a consistent pastel background color from a domain string
function domainColor(domain: string): string {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 45%, 92%)`;
}

function domainAccent(domain: string): string {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 55%, 45%)`;
}

export function TabCard({ tab }: TabCardProps) {
  const bg = domainColor(tab.domain);
  const accent = domainAccent(tab.domain);

  return (
    <div className="w-[380px] bg-surface rounded-card shadow-card overflow-hidden select-none">
      {/* Domain hero area */}
      <div
        className="h-[160px] flex flex-col items-center justify-center gap-3 relative"
        style={{ backgroundColor: bg }}
      >
        {/* Favicon large */}
        {tab.favIconUrl ? (
          <img
            src={tab.favIconUrl}
            alt=""
            className="w-14 h-14 rounded-xl shadow-sm"
            draggable={false}
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              el.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${tab.favIconUrl ? "hidden" : ""}`}
          style={{ backgroundColor: accent }}
        >
          <span className="text-white font-bold text-2xl">
            {tab.domain.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* Domain name */}
        <span className="text-xs font-medium opacity-70" style={{ color: accent }}>
          {tab.domain}
        </span>

        {/* Status badges (top-right corner) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {tab.isAudible && !tab.isMuted && (
            <span className="px-1.5 py-0.5 rounded-md bg-white/70 text-[10px] font-medium text-text-secondary" title="Playing audio">
              &#128266;
            </span>
          )}
          {tab.isMuted && (
            <span className="px-1.5 py-0.5 rounded-md bg-white/70 text-[10px] font-medium text-text-secondary" title="Muted">
              &#128263;
            </span>
          )}
          {tab.isDiscarded && (
            <span className="px-1.5 py-0.5 rounded-md bg-white/70 text-[10px] font-medium text-text-muted" title="Tab suspended">
              &#128164;
            </span>
          )}
        </div>

        {/* Window badge (top-left) */}
        {tab.totalWindows > 1 && (
          <span className="absolute top-3 left-3 px-1.5 py-0.5 rounded-md bg-white/70 text-[10px] font-medium text-text-secondary">
            Window {tab.windowIndex}
          </span>
        )}
      </div>

      {/* Tab info */}
      <div className="p-4 space-y-2.5">
        {/* Title */}
        <h3 className="text-text-primary font-semibold text-[15px] leading-snug line-clamp-2">
          {tab.title}
        </h3>

        {/* URL path */}
        <p className="text-text-muted text-xs truncate font-mono">{tab.fullPath}</p>

        {/* Metadata row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatRelativeTime(tab.lastAccessed)}
          </span>

          {tab.isDuplicate && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-medium">
              {tab.duplicateCount}x duplicate
            </span>
          )}

          {tab.status === "loading" && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-medium">
              Loading...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
