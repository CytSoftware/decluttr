import { useEffect, useState, useCallback } from "react";
import type { DecluttrSettings, SortOrder } from "@decluttr/types";
import { DEFAULT_SETTINGS } from "@decluttr/types";
import { loadSettings, saveSettings } from "../lib/settings";

export function App() {
  const [settings, setSettings] = useState<DecluttrSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [domainInput, setDomainInput] = useState("");

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const handleSave = useCallback(
    async (newSettings: Partial<DecluttrSettings>) => {
      const merged = await saveSettings(newSettings);
      setSettings(merged);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
    []
  );

  const addExcludedDomain = useCallback(() => {
    const domain = domainInput.trim().toLowerCase();
    if (domain && !settings.excludedDomains.includes(domain)) {
      handleSave({
        excludedDomains: [...settings.excludedDomains, domain],
      });
      setDomainInput("");
    }
  }, [domainInput, settings.excludedDomains, handleSave]);

  const removeExcludedDomain = useCallback(
    (domain: string) => {
      handleSave({
        excludedDomains: settings.excludedDomains.filter((d) => d !== domain),
      });
    },
    [settings.excludedDomains, handleSave]
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Decluttr Settings
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Changes take effect on your next decluttering session.
          </p>
        </div>

        {/* Sort Order */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
            Sort Order
          </h2>
          <p className="text-xs text-text-secondary">
            Choose how tabs are ordered in the swipe deck.
          </p>
          <div className="flex gap-2">
            {[
              { value: "lru", label: "Least Recent" },
              { value: "domain", label: "By Domain" },
              { value: "title", label: "By Title" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  handleSave({ sortOrder: option.value as SortOrder })
                }
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.sortOrder === option.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-text-secondary hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </section>

        {/* Toggles */}
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
            Behavior
          </h2>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm text-text-primary">
                Capture tab screenshots
              </div>
              <div className="text-xs text-text-muted">
                Show preview thumbnails on cards (may cause brief tab
                flickering)
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.captureScreenshots}
              onChange={(e) =>
                handleSave({ captureScreenshots: e.target.checked })
              }
              className="w-5 h-5 rounded accent-primary"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="text-sm text-text-primary">
                Confirm before closing
              </div>
              <div className="text-xs text-text-muted">
                Show a summary screen before tabs are actually closed
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.confirmBeforeClose}
              onChange={(e) =>
                handleSave({ confirmBeforeClose: e.target.checked })
              }
              className="w-5 h-5 rounded accent-primary"
            />
          </label>
        </section>

        {/* Excluded Domains */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wide">
            Excluded Domains
          </h2>
          <p className="text-xs text-text-secondary">
            Tabs from these domains will be skipped during decluttering.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addExcludedDomain()}
              placeholder="e.g., mail.google.com"
              className="flex-1 px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              onClick={addExcludedDomain}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              Add
            </button>
          </div>

          {settings.excludedDomains.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {settings.excludedDomains.map((domain) => (
                <span
                  key={domain}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-sm text-text-secondary"
                >
                  {domain}
                  <button
                    onClick={() => removeExcludedDomain(domain)}
                    className="text-text-muted hover:text-close"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {/* Save indicator */}
        {saved && (
          <div className="fixed bottom-6 right-6 bg-keep text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg animate-fade-in">
            Settings saved
          </div>
        )}
      </div>
    </div>
  );
}
