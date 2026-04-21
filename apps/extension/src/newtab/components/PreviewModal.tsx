import { useCallback, useEffect, useState } from "react";
import type { TabCard as TabCardType } from "@decluttr/types";
import { captureTab } from "../../lib/screenshot";

interface PreviewModalProps {
  tab: TabCardType;
  onClose: (tab: TabCardType) => void;
  onKeep: (tab: TabCardType) => void;
  onSave: (tab: TabCardType) => void;
  onDismiss: () => void;
  onOpenTab: (tab: TabCardType) => void;
}

type State =
  | { status: "loading" }
  | { status: "ready"; dataUrl: string }
  | { status: "error"; error: string };

export function PreviewModal({
  tab,
  onClose,
  onKeep,
  onSave,
  onDismiss,
  onOpenTab,
}: PreviewModalProps) {
  const [state, setState] = useState<State>({ status: "loading" });

  const capture = useCallback(async () => {
    setState({ status: "loading" });
    const result = await captureTab(tab.id, tab.windowId);
    if (result.success && result.dataUrl) {
      setState({ status: "ready", dataUrl: result.dataUrl });
    } else {
      setState({ status: "error", error: result.error ?? "Capture failed" });
    }
  }, [tab.id, tab.windowId]);

  useEffect(() => {
    void capture();
  }, [capture]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onDismiss();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onDismiss}
    >
      <div
        className="bg-surface rounded-card shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-3 p-4 border-b border-gray-100">
          {tab.favIconUrl && (
            <img
              src={tab.favIconUrl}
              alt=""
              className="w-5 h-5 mt-0.5 rounded"
              draggable={false}
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-text-primary font-semibold text-sm line-clamp-1">
              {tab.title}
            </h3>
            <p className="text-text-muted text-xs truncate font-mono">
              {tab.domain}
              {tab.fullPath}
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-gray-100 transition-colors"
            title="Close preview (Esc)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Preview body */}
        <div className="flex-1 min-h-[240px] bg-gray-50 flex items-center justify-center overflow-auto">
          {state.status === "loading" && (
            <div className="flex flex-col items-center gap-3 text-text-muted">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
              <span className="text-xs">Capturing preview…</span>
            </div>
          )}
          {state.status === "ready" && (
            <img
              src={state.dataUrl}
              alt="Tab preview"
              className="max-w-full max-h-full object-contain"
              draggable={false}
            />
          )}
          {state.status === "error" && (
            <div className="flex flex-col items-center gap-3 text-text-muted max-w-md text-center px-6 py-8">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-close">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm text-text-secondary">Couldn't capture a preview for this tab.</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={capture}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 text-text-secondary text-xs font-medium hover:bg-gray-200 transition-colors"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDismiss();
                    onOpenTab(tab);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  Open tab instead
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Decision bar */}
        <div className="flex items-center justify-center gap-3 p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => onClose(tab)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-close/10 text-close text-sm font-semibold hover:bg-close/20 transition-colors active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
            Close
          </button>
          <button
            type="button"
            onClick={() => onSave(tab)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Save
          </button>
          <button
            type="button"
            onClick={() => onKeep(tab)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-keep/10 text-keep text-sm font-semibold hover:bg-keep/20 transition-colors active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
            Keep
          </button>
        </div>
      </div>
    </div>
  );
}
