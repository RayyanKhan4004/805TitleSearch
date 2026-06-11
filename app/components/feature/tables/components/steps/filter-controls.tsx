"use client";

import Icon from "@/components/common/icon";

interface Props {
  showFunnel: boolean;
  setShowFunnel: (v: boolean) => void;
  expandedSection: "status" | "country" | null;
  setExpandedSection: (v: "status" | "country" | null) => void;
  statusFilter: string[];
  setStatusFilter: (v: string[]) => void;
  countryFilter: string[];
  setCountryFilter: (v: string[]) => void;
  rushFilter: boolean;
  setRushFilter: (v: boolean) => void;
  hasActiveFilters: boolean;
  clearFilters: () => void;
  allStatuses: string[];
  allCountries: string[];
}

export default function FilterControls({
  showFunnel, setShowFunnel,
  expandedSection, setExpandedSection,
  statusFilter, setStatusFilter,
  countryFilter, setCountryFilter,
  rushFilter, setRushFilter,
  hasActiveFilters, clearFilters,
  allStatuses, allCountries,
}: Props) {
  const toggleStatus = (s: string) =>
    setStatusFilter(statusFilter.includes(s) ? statusFilter.filter((x) => x !== s) : [...statusFilter, s]);

  const toggleCountry = (c: string) =>
    setCountryFilter(countryFilter.includes(c) ? countryFilter.filter((x) => x !== c) : [...countryFilter, c]);

  return (
    <div className="relative">
      <button
        onClick={() => { setShowFunnel(!showFunnel); setExpandedSection(null) }}
        title="Filters"
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "7px 12px", borderRadius: 9, fontSize: 12, fontWeight: 600,
          border: "1px solid", cursor: "pointer", position: "relative",
          background: hasActiveFilters ? "var(--brand-primary)" : "var(--color-white)",
          borderColor: hasActiveFilters ? "var(--brand-primary)" : "var(--border-primary)",
          color: hasActiveFilters ? "var(--color-white)" : "var(--text-secondary)",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
        </svg>
        {hasActiveFilters && (
          <span style={{ position: "absolute", top: -4, right: -4, width: 8, height: 8, borderRadius: "50%", background: "var(--status-error-dark)" }} />
        )}
      </button>
      {showFunnel && (
        <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,.18)] border border-border z-50 p-2" style={{ minWidth: 240 }}>
          <div className="rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === "status" ? null : "status")}
              className="flex items-center justify-between w-full px-3 py-2 text-[12px] font-semibold text-left cursor-pointer border-none rounded-lg transition-all"
              style={{
                color: statusFilter.length > 0 ? "var(--brand-primary)" : "var(--ui-code-text)",
                background: expandedSection === "status" ? "var(--bg-table-header)" : "transparent",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-table-header)"}
              onMouseLeave={(e) => { if (expandedSection !== "status") e.currentTarget.style.background = "transparent" }}
            >
              <span>Status</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {statusFilter.length > 0 && (
                  <span className="text-[10px] font-bold text-white px-1.5 py-0.25 rounded-full" style={{ background: "var(--brand-primary)" }}>{statusFilter.length}</span>
                )}
                <Icon name="chevRight" size={10} style={{ transform: expandedSection === "status" ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
              </span>
            </button>
            {expandedSection === "status" && (
              <div className="px-3 pb-2 flex flex-col gap-0.5">
                {allStatuses.map((s) => {
                  const checked = statusFilter.includes(s);
                  return (
                    <label key={s} className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[11px] transition-all"
                      style={{
                        background: checked ? "var(--brand-primary-subtle)" : "transparent",
                        color: checked ? "var(--brand-primary)" : "var(--text-secondary)",
                        fontWeight: checked ? 600 : 400,
                      }}
                    >
                      <input type="checkbox" checked={checked} onChange={() => toggleStatus(s)} className="accent-brand w-3 h-3" />
                      {s}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedSection(expandedSection === "country" ? null : "country")}
              className="flex items-center justify-between w-full px-3 py-2 text-[12px] font-semibold text-left cursor-pointer border-none rounded-lg transition-all"
              style={{
                color: countryFilter.length > 0 ? "var(--brand-primary)" : "var(--ui-code-text)",
                background: expandedSection === "country" ? "var(--bg-table-header)" : "transparent",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-table-header)"}
              onMouseLeave={(e) => { if (expandedSection !== "country") e.currentTarget.style.background = "transparent" }}
            >
              <span>Country</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {countryFilter.length > 0 && (
                  <span className="text-[10px] font-bold text-white px-1.5 py-0.25 rounded-full" style={{ background: "var(--brand-primary)" }}>{countryFilter.length}</span>
                )}
                <Icon name="chevRight" size={10} style={{ transform: expandedSection === "country" ? "rotate(90deg)" : "none", transition: "transform .15s" }} />
              </span>
            </button>
            {expandedSection === "country" && (
              <div className="px-3 pb-2 flex flex-col gap-0.5">
                {allCountries.map((c) => {
                  const checked = countryFilter.includes(c);
                  return (
                    <label key={c} className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[11px] transition-all"
                      style={{
                        background: checked ? "var(--brand-primary-subtle)" : "transparent",
                        color: checked ? "var(--brand-primary)" : "var(--text-secondary)",
                        fontWeight: checked ? 600 : 400,
                      }}
                    >
                      <input type="checkbox" checked={checked} onChange={() => toggleCountry(c)} className="accent-brand w-3 h-3" />
                      {c}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <label
            className="flex items-center justify-between px-3 py-2 text-[12px] font-semibold cursor-pointer rounded-lg transition-all"
            style={{ color: rushFilter ? "var(--brand-primary)" : "var(--ui-code-text)", background: rushFilter ? "var(--brand-primary-subtle)" : "transparent" }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-table-header)"}
            onMouseLeave={(e) => { if (!rushFilter) e.currentTarget.style.background = "transparent" }}
          >
            <span>Rush Only</span>
            <input type="checkbox" checked={rushFilter} onChange={() => setRushFilter(!rushFilter)} className="accent-brand w-3.5 h-3.5" />
          </label>

          {hasActiveFilters && (
            <>
              <div className="border-t border-border my-1.5" />
              <button onClick={clearFilters} className="w-full text-center text-[10px] font-semibold text-brand cursor-pointer bg-transparent border-none py-1.5 rounded-lg hover:bg-[var(--brand-primary-subtle)] transition-all">
                Clear all filters
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
