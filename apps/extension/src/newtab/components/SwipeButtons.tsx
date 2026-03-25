interface SwipeButtonsProps {
  onClose: () => void;
  onSave: () => void;
  onKeep: () => void;
  onUndo: () => void;
  canUndo: boolean;
  disabled: boolean;
}

export function SwipeButtons({
  onClose,
  onSave,
  onKeep,
  onUndo,
  canUndo,
  disabled,
}: SwipeButtonsProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Undo */}
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-secondary hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        title="Undo (U)"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
        </svg>
      </button>

      {/* Close */}
      <button
        onClick={onClose}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-close/10 flex items-center justify-center text-close hover:bg-close/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        title="Close tab (← or J)"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18" />
          <path d="M6 6l12 12" />
        </svg>
      </button>

      {/* Save for Later */}
      <button
        onClick={onSave}
        disabled={disabled}
        className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        title="Save for later (↑ or S)"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Keep */}
      <button
        onClick={onKeep}
        disabled={disabled}
        className="w-14 h-14 rounded-full bg-keep/10 flex items-center justify-center text-keep hover:bg-keep/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
        title="Keep tab (→ or K)"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </button>
    </div>
  );
}
