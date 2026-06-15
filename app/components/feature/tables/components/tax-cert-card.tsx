"use client";

import { useState, useRef, useEffect, Fragment } from "react";
import Icon from "@/components/common/icon";
import RichEditor from "@/components/common/text-toolbar";
import { useLazySearchCodeBookQuery, useCreateTaxCertMutation, useDeleteTaxCertMutation } from "@/app/store/api/ordersApi";
import toast from "react-hot-toast";

interface Chip {
  id: number;       // local state key
  apiId?: number;   // server-side tax_certs.id (present for existing + newly created)
  code: string;
  verbiage: string;
  selected: boolean;
  editing: boolean;
}

interface TaxCertCardProps {
  title: string;
  sub: string;
  accent: string;
  orderId?: number | string;
  codes?: { code: string; verbiage?: string | null }[];
  initialAddedCodes?: { id?: number; code: string; verbiage: string }[];
}

function initChips(list?: { id?: number; code: string; verbiage: string }[]): Chip[] {
  if (!list || list.length === 0) return [];
  return list.map((item, i) => ({
    id: Date.now() + i,
    apiId: item.id,
    code: item.code,
    verbiage: item.verbiage || "",
    selected: false,
    editing: false,
  }));
}

export default function TaxCertCard({
  title,
  sub,
  accent,
  orderId,
  initialAddedCodes,
}: TaxCertCardProps) {
  const [open, setOpen] = useState(true);
  const [chips, setChips] = useState<Chip[]>(() => initChips(initialAddedCodes));

  useEffect(() => {
    if (initialAddedCodes && initialAddedCodes.length > 0)
      setChips(initChips(initialAddedCodes));
  }, [initialAddedCodes]);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [triggerSearch, { data: searchResults, isFetching }] = useLazySearchCodeBookQuery();
  const [createTaxCert] = useCreateTaxCertMutation();
  const [deleteTaxCert] = useDeleteTaxCertMutation();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (!trimmed) return;
    debounceRef.current = setTimeout(() => triggerSearch(trimmed), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, triggerSearch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedChips = chips.filter((c) => c.selected);
  const hasCode = (code: string) => chips.some((c) => c.code === code);
  const activeResults = (searchResults || []).filter((r) => r.isActive);

  const addFromSearch = async (code: string, verbiage: string) => {
    if (hasCode(code)) return;
    if (!orderId) { toast.error("Order not loaded"); return; }
    try {
      const result = await createTaxCert({ orderId, code, verbiage }).unwrap();
      setChips((c) => [...c, { id: Date.now(), apiId: result.id, code: result.code, verbiage: result.verbiage, selected: true, editing: false }]);
      toast.success(`Tax cert ${result.code} added`);
    } catch (err: any) {
      if (err?.status === 409) {
        toast.error(`Code ${code} already exists`);
      } else {
        toast.error("Failed to create tax cert");
      }
    }
    setQuery("");
    setShowDropdown(false);
  };

  const addByTyped = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const match = searchResults?.find((r) => r.code.toLowerCase() === trimmed.toLowerCase());
    addFromSearch(match?.code ?? trimmed, match?.verbiage ?? "");
  };

  const toggleSelect = (id: number) =>
    setChips((c) => c.map((x) => x.id === id ? { ...x, selected: !x.selected, editing: false } : x));

  const removeChip = async (id: number) => {
    const chip = chips.find((c) => c.id === id);
    if (chip?.apiId && orderId) {
      try {
        await deleteTaxCert({ orderId, id: chip.apiId }).unwrap();
        toast.success(`Tax cert ${chip.code} deleted`);
      } catch {
        toast.error("Failed to delete tax cert");
        return;
      }
    }
    setChips((c) => c.filter((x) => x.id !== id));
  };

  const updateVerbiage = (id: number, v: string) =>
    setChips((c) => c.map((x) => x.id === id ? { ...x, verbiage: v } : x));

  const startEdit = (id: number) =>
    setChips((c) => c.map((x) => x.id === id ? { ...x, editing: true } : x));

  const saveEdit = (id: number) =>
    setChips((c) => c.map((x) => x.id === id ? { ...x, editing: false } : x));

  const renderVerbiage = (text: string) => {
    const parts = text.split("*");
    return parts.map((seg, i, arr) => (
      <Fragment key={i}>
        {seg}
        {i < arr.length - 1 && (
          <mark style={{ background: "#fef9c3", color: "#92400e", padding: "0 3px", borderRadius: 3, fontWeight: 700 }}>
            *
          </mark>
        )}
      </Fragment>
    ));
  };

  return (
    <div className="rounded-xl" style={{ border: "1px solid var(--border-primary)", background: "var(--bg-card)" }}>
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-2.75 cursor-pointer select-none rounded-t-xl bg-bg-card-header"
        style={{ borderBottom: open ? "1px solid var(--border-secondary)" : "none" }}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-0.75 h-7 rounded-sm shrink-0" style={{ background: accent }} />
          <div>
            <div className="text-[13px] font-bold text-text">{title}</div>
            <div className="text-[10px] text-text-muted mt-0.5">{sub}</div>
          </div>
          {selectedChips.length > 0 && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1 bg-status-success-bg text-status-success-text border border-status-success-border">
              {selectedChips.length} selected
            </span>
          )}
        </div>
        <Icon name={open ? "chevDown" : "chevRight"} size={13} className="text-text-muted" />
      </div>

      {open && (
        <div className="flex flex-col gap-3.5 p-4">
          {/* ── Chip row ── */}
          {chips.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.07em] mb-2">
                Select Tax Codes to Include
              </div>
              <div className="flex flex-wrap gap-1.75">
                {chips.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => toggleSelect(chip.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-all duration-150"
                    style={{
                      padding: "5px 12px",
                      background: chip.selected ? "var(--status-success-bg)" : "#fff",
                      borderColor: chip.selected ? "var(--status-success-border)" : "#e2e8f0",
                      color: chip.selected ? "var(--status-success-text)" : "#64748b",
                    }}
                  >
                    <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 800, color: chip.selected ? "var(--status-success-text)" : accent }}>
                      {chip.code}
                    </span>
                    {chip.selected && (
                      <Icon name="checkCircle" size={10} className="text-status-success-text" />
                    )}
                    {/* × delete */}
                    <span
                      onClick={(e) => { e.stopPropagation(); removeChip(chip.id); }}
                      className="flex items-center leading-none cursor-pointer"
                      style={{ fontSize: 14, color: chip.selected ? "var(--status-success-text)" : "#94a3b8", marginLeft: 1 }}
                    >
                      ×
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {chips.length === 0 && (
            <p className="m-0 text-[11px] text-text-muted italic">No tax codes on this order.</p>
          )}

          {/* ── Search input ── */}
          <div ref={containerRef} className="relative">
            <div
              className="flex items-center gap-2 border rounded-lg px-3 py-1.75"
              style={{
                borderColor: showDropdown ? accent : "#e2e8f0",
                background: "#fff",
                boxShadow: showDropdown ? `0 0 0 3px ${accent}18` : "none",
                transition: "border-color .15s, box-shadow .15s",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
                onFocus={() => { if (query.trim()) setShowDropdown(true); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addByTyped(); }
                  if (e.key === "Escape") setShowDropdown(false);
                }}
                placeholder="Or type a new code…"
                className="flex-1 text-[11px] outline-none bg-transparent text-text placeholder:text-[#94a3b8]"
              />
              {isFetching && (
                <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" stroke="#e2e8f0" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke={accent} strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {query && !isFetching && (
                <button onClick={() => { setQuery(""); setShowDropdown(false); }} className="bg-transparent border-none cursor-pointer p-0 flex items-center" style={{ color: "#94a3b8" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              )}
              <button
                onClick={addByTyped}
                className="text-white text-[10px] font-semibold px-3 py-1 rounded-md border-none cursor-pointer shrink-0"
                style={{ background: accent }}
              >
                Add
              </button>
            </div>

            {showDropdown && query.trim() && (
              <div
                className="absolute left-0 right-0 mt-1.5 bg-white border border-[#e2e8f0] rounded-xl z-9999 overflow-hidden"
                style={{ boxShadow: "0 8px 28px rgba(0,0,0,.12)", maxHeight: 260, overflowY: "auto" }}
              >
                {isFetching ? (
                  <div className="px-4 py-4 text-[11px] text-text-muted text-center">Searching…</div>
                ) : activeResults.length === 0 ? (
                  <div className="px-4 py-3 text-center">
                    <div className="text-[11px] text-text-muted mb-1">No matches found</div>
                    <div className="text-[10px] font-semibold cursor-pointer" style={{ color: accent }} onClick={addByTyped}>
                      + Add &ldquo;{query}&rdquo; as a custom code
                    </div>
                  </div>
                ) : (
                  <>
                    {activeResults.map((r) => {
                      const exists = hasCode(r.code);
                      return (
                        <button
                          key={r.code}
                          onClick={() => addFromSearch(r.code, r.verbiage)}
                          disabled={exists}
                          className="w-full text-left flex items-start gap-3 px-3.5 py-2.5 border-none transition-colors"
                          style={{ background: exists ? "#f8fafc" : "#fff", borderBottom: "1px solid #f8fafc", cursor: exists ? "default" : "pointer" }}
                          onMouseEnter={(e) => { if (!exists) (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = exists ? "#f8fafc" : "#fff"; }}
                        >
                          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, color: exists ? "#cbd5e1" : accent, flexShrink: 0, marginTop: 2, minWidth: 56 }}>
                            {r.code}
                          </span>
                          <span className="text-[11px] leading-snug flex-1 text-left" style={{ color: exists ? "#94a3b8" : "#334155" }}>
                            {r.verbiage ? r.verbiage.replace(/<[^>]+>/g, "").slice(0, 120) + (r.verbiage.length > 120 ? "…" : "") : r.code}
                          </span>
                          {exists
                            ? <span className="text-[9px] font-semibold text-[#16a34a] shrink-0 mt-0.5">✓ Added</span>
                            : <span className="text-[9px] font-semibold shrink-0 mt-0.5" style={{ color: accent }}>+ Add</span>
                          }
                        </button>
                      );
                    })}
                    <div className="px-3.5 py-2 text-[10px] text-text-muted cursor-pointer border-t border-[#f1f5f9]" style={{ background: "#fafafa" }} onClick={addByTyped}>
                      Press <kbd className="bg-[#e2e8f0] rounded px-1 py-0.5 text-[9px] font-mono">Enter</kbd> to add &ldquo;{query}&rdquo; as a custom code
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── Detail panels for selected chips ── */}
          {selectedChips.length > 0 && (
            <div className="flex flex-col gap-2.25">
              <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.07em]">Added Codes</div>
              {selectedChips.map((c) => (
                <div
                  key={c.id}
                  className="overflow-hidden rounded-[10px]"
                  style={{ border: "1px solid var(--status-success-border)", background: "var(--status-success-bg)" }}
                >
                  {/* card header */}
                  <div
                    className="flex items-center justify-between px-3 py-2 cursor-pointer"
                    style={{ background: "#fff", borderBottom: "1px solid var(--border-secondary)" }}
                    onClick={() => !c.editing && toggleSelect(c.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 800, color: accent, background: "var(--status-success-bg)", border: "1px solid var(--status-success-border)", padding: "2px 8px", borderRadius: 4 }}>
                        {c.code}
                      </span>
                      {c.verbiage.includes("*") && !c.editing && (
                        <span className="text-[9px] font-semibold px-1.75 py-px rounded-full" style={{ background: "var(--status-warning-bg)", color: "var(--status-warning-text)", border: "1px solid var(--status-warning-border)" }}>
                          Fill in *
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {c.editing ? (
                        <button
                          onClick={() => saveEdit(c.id)}
                          className="inline-flex items-center gap-1 rounded-md border-none text-[10px] font-bold cursor-pointer text-white"
                          style={{ background: "var(--bg-status-success-emerald)", padding: "2px 10px" }}
                        >
                          <Icon name="save" size={10} /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(c.id)}
                          className="bg-transparent rounded-md text-[10px] font-semibold cursor-pointer"
                          style={{ border: "1px solid var(--border-border)", padding: "2px 9px", color: "var(--text-text-secondary)" }}
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => removeChip(c.id)}
                        className="bg-transparent border-none cursor-pointer flex text-[#cbd5e1] transition-colors duration-150"
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e1")}
                      >
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </div>

                  {/* verbiage */}
                  <div className="px-3 py-2.5">
                    {c.editing ? (
                      <RichEditor value={c.verbiage} onChange={(v) => updateVerbiage(c.id, v)} />
                    ) : (
                      <div style={{ fontSize: 11, color: "var(--color-text)", lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "'Times New Roman',serif" }}>
                        {c.verbiage ? renderVerbiage(c.verbiage) : <span style={{ color: "#94a3b8" }}>No verbiage — click Edit to add.</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
