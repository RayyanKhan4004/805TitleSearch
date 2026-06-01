"use client";

import { useState } from "react";
import Icon from "@/components/common/icon";

interface GenieCodeItem {
  code: string;
  label: string;
  body: string;
}

interface AddedCode extends GenieCodeItem {
  id: number;
  editing: boolean;
  expanded: boolean;
  verbiage: string;
}

interface GenieSectionCardProps {
  title: string;
  sub: string;
  accent: string;
  codes?: GenieCodeItem[];
}

const DEFAULT_CODES: GenieCodeItem[] = [
  { code: "CA A1", label: "ALTA Note", body: "None of the items shown in this report will cause the Company to decline to attach ALTA Endorsement Form 9." },
  { code: "CA E1", label: "Easement", body: "An easement for public utilities and incidental purposes." },
  { code: "CA C1", label: "CC&Rs", body: "Covenants, conditions, and restrictions as set forth in instrument recorded." },
  { code: "CA L1", label: "Lien", body: "A lien for taxes or assessments not yet delinquent." },
  { code: "CA MG1", label: "Mortgage", body: "A Deed of Trust to secure an indebtedness." },
  { code: "CA NT1", label: "Notice", body: "A notice of completion or other statutory notice." },
];

export default function GenieSectionCard({ title, sub, accent, codes }: GenieSectionCardProps) {
  const [open, setOpen] = useState(true);
  const [addedCodes, setAddedCodes] = useState<AddedCode[]>([]);

  const items = codes || DEFAULT_CODES;

  const addCode = (item: GenieCodeItem) => {
    setAddedCodes((c) => [
      ...c,
      { ...item, id: Date.now(), editing: false, expanded: true, verbiage: item.body },
    ]);
  };

  const removeCode = (id: number) => setAddedCodes((c) => c.filter((x) => x.id !== id));
  const updateVerbiage = (id: number, v: string) =>
    setAddedCodes((c) => c.map((x) => (x.id === id ? { ...x, verbiage: v } : x)));
  const toggleExpanded = (id: number) =>
    setAddedCodes((c) => c.map((x) => (x.id === id ? { ...x, expanded: !x.expanded } : x)));
  const startEdit = (id: number) =>
    setAddedCodes((c) => c.map((x) => (x.id === id ? { ...x, editing: true, expanded: true } : x)));
  const saveCode = (id: number) =>
    setAddedCodes((c) => c.map((x) => (x.id === id ? { ...x, editing: false, expanded: false } : x)));
  const isAdded = (code: string) => addedCodes.some((c) => c.code === code);

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-2.75 cursor-pointer"
        style={{
          borderBottom: open ? "1px solid #f1f5f9" : "none",
          background: "#fafafa",
        }}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2.5">
          <div style={{ width: 3, height: 28, background: accent, borderRadius: 2, flexShrink: 0 }} />
          <div>
            <div className="text-[13px] font-bold text-[#1e293b]">{title}</div>
            {sub && <div className="text-[10px] text-[#94a3b8] mt-0.25">{sub}</div>}
          </div>
          {addedCodes.length > 0 && (
            <span className="bg-[#f0fdf4] text-[#166634] border border-[#bbf7d0] text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1">
              {addedCodes.length} code{addedCodes.length !== 1 ? "s" : ""} saved
            </span>
          )}
        </div>
        <Icon name={open ? "chevDown" : "chevRight"} size={13} style={{ color: "#94a3b8" }} />
      </div>

      {open && (
        <div className="p-4 flex flex-col gap-3.5">
          <div>
            <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-2">
              Select Codes to Include
            </div>
            <div className="flex flex-wrap gap-1.5">
              {items.map((item) => {
                const added = isAdded(item.code);
                const saved = added && !addedCodes.find((c) => c.code === item.code)?.expanded;
                return (
                  <button
                    key={item.code}
                    onClick={() => {
                      if (!added) addCode(item);
                      else {
                        const found = addedCodes.find((c) => c.code === item.code);
                        if (found) toggleExpanded(found.id);
                      }
                    }}
                    title={added ? (saved ? "Click to view / edit" : "Collapse") : item.label}
                    className="inline-flex items-center gap-1.25 px-2.5 py-1.25 rounded-lg text-[10px] font-bold border cursor-pointer transition-all duration-150"
                    style={{
                      background: added ? (saved ? "#f0fdf4" : "#eff6ff") : "#fff",
                      borderColor: added ? (saved ? "#86efac" : "#bfdbfe") : "#e2e8f0",
                      color: added ? (saved ? "#166634" : "#1d4ed8") : "#475569",
                    }}
                  >
                    <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 800, color: added ? (saved ? "#166634" : "#1d4ed8") : accent }}>
                      {item.code}
                    </span>
                    {added ? (
                      <Icon name={saved ? "checkCircle" : "chevDown"} size={10} style={{ color: saved ? "#16a34a" : "#1d4ed8" }} />
                    ) : (
                      <Icon name="plus" size={10} />
                    )}
                  </button>
                );
              })}
            </div>
            {addedCodes.some((c) => !c.expanded) && (
              <p className="text-[10px] text-[#94a3b8] mt-1.75 mb-0 italic">
                ✓ Saved codes are collapsed — click the code badge to expand again
              </p>
            )}
          </div>

          {addedCodes.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                Added Codes
              </div>
              {addedCodes.map((c) => (
                <div
                  key={c.id}
                  className="border rounded-xl overflow-hidden transition-all duration-150"
                  style={{
                    borderColor: c.expanded ? "#e2e8f0" : "#bbf7d0",
                    background: c.expanded ? "#fafafa" : "#f0fdf4",
                  }}
                >
                  <div
                    className="flex items-center justify-between px-3 py-2 cursor-pointer"
                    style={{ background: c.expanded ? "#fff" : "#f0fdf4", borderBottom: c.expanded ? "1px solid #f1f5f9" : "none" }}
                    onClick={() => !c.editing && toggleExpanded(c.id)}
                  >
                    <div className="flex items-center gap-1.75">
                      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 800, color: accent }}>
                        {c.code}
                      </span>
                      <span className="text-[11px] text-[#475569]">{c.label}</span>
                      {c.expanded ? (
                        <Icon name="chevDown" size={10} style={{ color: "#94a3b8" }} />
                      ) : (
                        <span className="text-[10px] text-[#16a34a] font-semibold">✓ Saved</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {c.editing ? (
                        <button
                          onClick={(e) => { e.stopPropagation(); saveCode(c.id); }}
                          className="bg-[#059669] text-white text-[9px] font-bold px-2 py-0.75 rounded border-none cursor-pointer"
                        >
                          <Icon name="check" size={9} /> Save
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); startEdit(c.id); }}
                            className="bg-transparent text-[#64748b] border border-[#e2e8f0] text-[9px] font-bold px-2 py-0.75 rounded cursor-pointer"
                          >
                            <Icon name="fileCheck" size={9} /> Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeCode(c.id); }}
                            className="bg-transparent text-[#ef4444] border border-[#fecaca] text-[9px] font-bold px-1.5 py-0.75 rounded cursor-pointer"
                          >
                            <Icon name="trash" size={9} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {c.expanded && (
                    <div className="p-3">
                      <textarea
                        rows={4}
                        value={c.editing ? c.verbiage : c.verbiage}
                        onChange={(e) => updateVerbiage(c.id, e.target.value)}
                        className="w-full border border-[#dbe3ee] rounded-lg px-2.5 py-2 text-[11px] text-[#334155] bg-white outline-none resize-none font-mono leading-relaxed"
                        readOnly={!c.editing}
                        style={c.editing ? {} : { opacity: 0.75 }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
