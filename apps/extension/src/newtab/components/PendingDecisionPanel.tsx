import type { TabCard as TabCardType } from "@decluttr/types";

interface PendingDecisionPanelProps {
  tab: TabCardType;
  onClose: (tab: TabCardType) => void;
  onKeep: (tab: TabCardType) => void;
  onSave: (tab: TabCardType) => void;
  onCancel: () => void;
}

export function PendingDecisionPanel({
  tab,
  onClose,
  onKeep,
  onSave,
  onCancel,
}: PendingDecisionPanelProps) {
  return (
    <div className="w-[380px] bg-surface rounded-card shadow-card border border-primary/20 p-3 flex items-center gap-3">
      {tab.favIconUrl && (
        <img src={tab.favIconUrl} alt="" className="w-5 h-5 rounded" draggable={false} />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-text-muted uppercase tracking-wide font-medium">
          Decide on
        </p>
        <p className="text-sm text-text-primary font-medium line-clamp-1">{tab.title}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onClose(tab)}
          className="w-8 h-8 rounded-lg bg-close/10 flex items-center justify-center text-close hover:bg-close/20 transition-colors active:scale-95"
          title="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onSave(tab)}
          className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors active:scale-95"
          title="Save"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onKeep(tab)}
          className="w-8 h-8 rounded-lg bg-keep/10 flex items-center justify-center text-keep hover:bg-keep/20 transition-colors active:scale-95"
          title="Keep"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-text-muted hover:bg-gray-200 transition-colors"
          title="Cancel"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9" />
            <path d="M3 4v5h5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
