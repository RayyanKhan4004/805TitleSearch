"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Icon from "@/components/common/icon";
import RichEditor from "@/components/common/text-toolbar";
import {
  useLazySearchCodeBookQuery,
  useCreateTsriExceptionMutation,
  useDeleteTsriExceptionMutation,
  useCreateTsriRequirementMutation,
  useDeleteTsriRequirementMutation,
} from "@/app/store/api/ordersApi";
import toast from "react-hot-toast";

interface Chip {
  id: number;       // local key
  apiId?: number;   // server-side id (tsri_exceptions / tsri_requirements)
  code: string;
  verbiage: string;
  selected: boolean;
  editing: boolean;
}

interface GenieSectionCardProps {
  title: string;
  sub: string;
  accent: string;
  orderId?: string;
  sectionType?: "exception" | "requirement";
  codes?: { code: string; label: string; body: string }[];
  initialAddedCodes?: { id?: number; code: string; verbiage: string }[];
  onChange?: (codes: { code: string; verbiage: string }[]) => void;
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

export default function GenieSectionCard({
  title,
  sub,
  accent,
  orderId,
  sectionType,
  initialAddedCodes,
  onChange,
}: GenieSectionCardProps) {
  const [open, setOpen] = useState(true);
  const [chips, setChips] = useState<Chip[]>(() => initChips(initialAddedCodes));
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [triggerSearch, { data: searchResults, isFetching }] = useLazySearchCodeBookQuery();
  const [createTsriException] = useCreateTsriExceptionMutation();
  const [deleteTsriException] = useDeleteTsriExceptionMutation();
  const [createTsriRequirement] = useCreateTsriRequirementMutation();
  const [deleteTsriRequirement] = useDeleteTsriRequirementMutation();

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Debounced search */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (!trimmed) return;
    debounceRef.current = setTimeout(() => triggerSearch(trimmed), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, triggerSearch]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const notify = useCallback(
    (next: Chip[]) => {
      onChange?.(next.filter(c => c.selected).map(c => ({ code: c.code, verbiage: c.verbiage })));
    },
    [onChange],
  );

  const hasCode = (code: string) => chips.some((c) => c.code === code);
  const selectedChips = chips.filter((c) => c.selected);
  const activeResults = (searchResults || []).filter((r) => r.isActive);

  /* ── API helpers ── */
  const callCreate = async (code: string, verbiage: string) => {
    if (!orderId || !sectionType) return undefined;
    const body = { orderId, code, verbiage, type: sectionType === "exception" ? "Exception" : "Requirement" };
    if (sectionType === "exception") {
      return createTsriException(body).unwrap();
    } else {
      return createTsriRequirement(body).unwrap();
    }
  };

  const callDelete = async (apiId: number) => {
    if (!orderId || !sectionType) return;
    const args = { orderId, id: apiId };
    if (sectionType === "exception") {
      await deleteTsriException(args).unwrap();
    } else {
      await deleteTsriRequirement(args).unwrap();
    }
  };

  /* ── Add from search dropdown ── */
  const addFromSearch = async (code: string, verbiage: string) => {
    if (hasCode(code)) return;
    try {
      const result = await callCreate(code, verbiage);
      const newChip: Chip = {
        id: Date.now(),
        apiId: result?.id,
        code: result?.code ?? code,
        verbiage: result?.verbiage ?? verbiage,
        selected: true,
        editing: false,
      };
      const next = [...chips, newChip];
      setChips(next);
      notify(next);
      toast.success(`${code} added`);
    } catch {
      toast.error("Failed to add code");
    }
    setQuery("");
    setShowDropdown(false);
  };

  /* ── Add by typed input (Enter / Add button) ── */
  const addByTyped = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const match = searchResults?.find((r) => r.code.toLowerCase() === trimmed.toLowerCase());
    addFromSearch(match?.code ?? trimmed, match?.verbiage ?? "");
  };

  /* ── Toggle chip selected state ── */
  const toggleSelect = (id: number) => {
    const next = chips.map((c) => c.id === id ? { ...c, selected: !c.selected, editing: false } : c);
    setChips(next);
    notify(next);
  };

  /* ── Remove chip (× button) → calls DELETE API ── */
  const removeChip = async (id: number) => {
    const chip = chips.find((c) => c.id === id);
    if (chip?.apiId) {
      try {
        await callDelete(chip.apiId);
        toast.success(`${chip.code} deleted`);
      } catch {
        toast.error(`Failed to delete ${chip?.code}`);
        return;
      }
    }
    const next = chips.filter((c) => c.id !== id);
    setChips(next);
    notify(next);
  };

  const updateVerbiage = (id: number, v: string) => {
    const next = chips.map((c) => c.id === id ? { ...c, verbiage: v } : c);
    setChips(next);
    notify(next);
  };

  const startEdit = (id: number) =>
    setChips((c) => c.map((x) => x.id === id ? { ...x, editing: true } : x));

  const saveEdit = (id: number) =>
    setChips((c) => c.map((x) => x.id === id ? { ...x, editing: false } : x));

  return (
    <div className="bg-white border border-border rounded-xl">
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 py-2.75 cursor-pointer rounded-t-xl"
        style={{ borderBottom: open ? "1px solid #f1f5f9" : "none", background: "#fafafa" }}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2.5">
          <div style={{ width: 3, height: 28, background: accent, borderRadius: 2, flexShrink: 0 }} />
          <div>
            <div className="text-[13px] font-bold text-text">{title}</div>
            {sub && <div className="text-[10px] text-text-muted mt-px">{sub}</div>}
          </div>
          {selectedChips.length > 0 && (
            <span className="bg-[#f0fdf4] text-[#166634] border border-[#bbf7d0] text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1">
              {selectedChips.length} selected
            </span>
          )}
        </div>
        <Icon name={open ? "chevDown" : "chevRight"} size={13} style={{ color: "#94a3b8" }} />
      </div>

      {open && (
        <div className="p-4 flex flex-col gap-3">

          {/* ── Chip row (default codes from order) ── */}
          {chips.length > 0 && (
            <div>
              <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-2">
                Select Codes to Include
              </div>
              <div className="flex flex-wrap gap-1.5">
                {chips.map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => toggleSelect(chip.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.25 rounded-lg text-[10px] font-bold border cursor-pointer transition-all duration-150"
                    style={{
                      background: chip.selected ? "#f0fdf4" : "#fff",
                      borderColor: chip.selected ? "#86efac" : "#e2e8f0",
                      color: chip.selected ? "#166634" : "#64748b",
                    }}
                  >
                    <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, color: chip.selected ? "#16a34a" : accent }}>
                      {chip.code}
                    </span>
                    {chip.selected && <Icon name="checkCircle" size={10} style={{ color: "#16a34a" }} />}
                    <span
                      onClick={(e) => { e.stopPropagation(); removeChip(chip.id); }}
                      className="flex items-center justify-center leading-none cursor-pointer"
                      style={{ fontSize: 14, color: chip.selected ? "#16a34a" : "#94a3b8", marginLeft: 1, lineHeight: 1 }}
                    >
                      ×
                    </span>
                  </button>
                ))}
              </div>
            </div>
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

            {/* ── Dropdown ── */}
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
                          onClick={() => !exists && addFromSearch(r.code, r.verbiage)}
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
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">Added Codes</div>
              {selectedChips.map((c) => (
                <div key={c.id} className="border rounded-xl overflow-hidden" style={{ borderColor: "#bbf7d0", background: "#f0fdf4" }}>
                  <div
                    className="flex items-center justify-between px-3 py-2 cursor-pointer"
                    style={{ background: "#fff", borderBottom: "1px solid #f1f5f9" }}
                    onClick={() => !c.editing && toggleSelect(c.id)}
                  >
                    <div className="flex items-center gap-1.75">
                      <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 800, color: accent }}>{c.code}</span>
                      <Icon name="chevDown" size={10} style={{ color: "#94a3b8" }} />
                    </div>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {c.editing ? (
                        <button onClick={() => saveEdit(c.id)} className="bg-[#059669] text-white text-[9px] font-bold px-2 py-0.75 rounded border-none cursor-pointer flex items-center gap-1">
                          <Icon name="check" size={9} /> Save
                        </button>
                      ) : (
                        <button onClick={() => startEdit(c.id)} className="bg-transparent text-text-secondary border border-border text-[9px] font-bold px-2 py-0.75 rounded cursor-pointer flex items-center gap-1">
                          <Icon name="fileCheck" size={9} /> Edit
                        </button>
                      )}
                      <button onClick={() => toggleSelect(c.id)} className="bg-transparent text-[#94a3b8] border border-[#e2e8f0] text-[9px] font-bold px-1.5 py-0.75 rounded cursor-pointer">
                        <Icon name="chevDown" size={9} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    {c.editing ? (
                      <RichEditor value={c.verbiage} onChange={(v) => updateVerbiage(c.id, v)} />
                    ) : (
                      <div
                        className="text-[11px] text-text leading-relaxed font-mono"
                        dangerouslySetInnerHTML={{ __html: c.verbiage || "<span style='color:#94a3b8'>No verbiage — click Edit to add.</span>" }}
                        style={{ whiteSpace: "pre-wrap" }}
                      />
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
