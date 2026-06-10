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

const DEFAULT_CODES: GenieCodeItem[] = [];

export default function GenieSectionCard({ title, sub, accent, codes }: GenieSectionCardProps) {
  const [open, setOpen] = useState(true);
  const [addedCodes, setAddedCodes] = useState<AddedCode[]>([]);
  const [codeInput, setCodeInput] = useState("");

  const items = codes || DEFAULT_CODES;

  const addCode = (item: GenieCodeItem) => {
    setAddedCodes((c) => [
      ...c,
      { ...item, id: Date.now(), editing: false, expanded: true, verbiage: item.body },
    ]);
    setCodeInput("");
  };

  const addCodeByInput = (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const match = items.find((c) => c.code === trimmed);
    addCode(match || { code: trimmed, label: trimmed, body: "" });
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
    <div className="bg-white border border-border rounded-xl overflow-hidden">
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
            <div className="text-[13px] font-bold text-text">{title}</div>
            {sub && <div className="text-[10px] text-text-muted mt-0.25">{sub}</div>}
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
            <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-2">
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
                        const found = addedCodes.find(
                          (c) => c.code === item.code,
                        );
                        if (found) toggleExpanded(found.id);
                      }
                    }}
                    title={
                      added
                        ? saved
                          ? "Click to view / edit"
                          : "Collapse"
                        : item.label
                    }
                    className="inline-flex items-center gap-1.25 px-2.5 py-1.25 rounded-lg text-[10px] font-bold border cursor-pointer transition-all duration-150"
                    style={{
                      background: added
                        ? saved
                          ? "#f0fdf4"
                          : "#eff6ff"
                        : "#fff",
                      borderColor: added
                        ? saved
                          ? "#86efac"
                          : "#bfdbfe"
                        : "var(--border)",
                      color: added
                        ? saved
                          ? "#166634"
                          : "#1d4ed8"
                        : "var(--text-secondary)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: 9,
                        fontWeight: 800,
                        color: added ? (saved ? "#166634" : "#1d4ed8") : accent,
                      }}
                    >
                      {item.code}
                    </span>
                    {added ? (
                      <Icon
                        name={saved ? "checkCircle" : "chevDown"}
                        size={10}
                        style={{ color: saved ? "#16a34a" : "#1d4ed8" }}
                      />
                    ) : (
                      <Icon name="plus" size={10} />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // removeCode(c.id);
                      }}
                      className="bg-transparent border-none cursor-pointer flex items-center justify-center h-fit mb-0.5 text-red-500"
                      style={{
                        fontSize: 12,
                        // lineHeight: 0.1,
                        opacity: 0.5,
                      }}
                    >
                      ×
                    </button>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.75">
            <input
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addCodeByInput(codeInput);
              }}
              placeholder="Or type a new code\u2026"
              className="flex-1 text-[11px] border border-border-input-alt rounded-lg px-2.5 py-1.25 outline-none bg-white text-text"
            />
            <button
              onClick={() => addCodeByInput(codeInput)}
              className="text-white text-[11px] font-semibold px-3.5 py-1.25 rounded-lg border-none cursor-pointer"
              style={{ background: accent }}
            >
              Add
            </button>
          </div>

          {addedCodes.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
                Added Codes
              </div>
              {addedCodes.map((c) => (
                <div
                  key={c.id}
                  className="border rounded-xl overflow-hidden transition-all duration-150"
                  style={{
                    borderColor: c.expanded ? "var(--border)" : "#bbf7d0",
                    background: c.expanded ? "#fafafa" : "#f0fdf4",
                  }}
                >
                  <div
                    className="flex items-center justify-between px-3 py-2 cursor-pointer"
                    style={{ background: c.expanded ? "#fff" : "#f0fdf4", borderBottom: c.expanded ? "1px solid #f1f5f9" : "none" }}
                    onClick={() => !c.editing && toggleExpanded(c.id)}
                  >
                    <div className="flex items-center gap-1.75">
                      <button
                        onClick={(e) => { e.stopPropagation(); removeCode(c.id); }}
                        className="bg-transparent border-none cursor-pointer p-0 flex items-center"
                        style={{ color: accent, fontSize: 12, lineHeight: 1, opacity: 0.5 }}
                      >
                        ×
                      </button>
                      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 9, fontWeight: 800, color: accent }}>
                        {c.code}
                      </span>
                      <span className="text-[11px] text-text-secondary">{c.label}</span>
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
                            className="bg-transparent text-text-secondary border border-border text-[9px] font-bold px-2 py-0.75 rounded cursor-pointer"
                          >
                            <Icon name="fileCheck" size={9} /> Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeCode(c.id); }}
                            className="bg-transparent text-status-error border border-status-error-border text-[9px] font-bold px-1.5 py-0.75 rounded cursor-pointer"
                          >
                            <Icon name="trash" size={9} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  {c.expanded && (
                    <div className="p-3">
                      {c.editing ? (
                        <textarea
                          rows={4}
                          value={c.verbiage}
                          onChange={(e) => updateVerbiage(c.id, e.target.value)}
                          className="w-full border border-border-input-alt rounded-lg px-2.5 py-2 text-[11px] text-ui-code bg-white outline-none resize-none font-mono leading-relaxed"
                        />
                      ) : (
                        <>
                          <p className="m-0 text-[11px] text-text leading-relaxed whitespace-pre-wrap font-mono">
                            {c.verbiage}
                          </p>
                          <div className="flex gap-1.5 mt-2 pt-2" style={{ borderTop: "1px solid var(--border-secondary)" }}>
                            <button
                              onClick={() => {
                                const sel = window.getSelection()?.toString() || "";
                                const url = prompt("Enter URL to hyperlink selected text:", "https://");
                                if (url && sel) updateVerbiage(c.id, c.verbiage.replace(sel, `${sel} [${url}]`));
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.25 text-[10px] font-semibold rounded-lg cursor-pointer"
                              style={{ background: "var(--status-info-subtle)", border: "1px solid var(--status-info-blue-border)", color: "var(--status-info-blue)" }}
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                              </svg>
                              Hyperlink
                            </button>
                            <button
                              onClick={() => updateVerbiage(c.id, c.verbiage.replace(/ \[[^\]]*\]/g, "").trim())}
                              className="inline-flex items-center gap-1 px-2.5 py-1.25 text-[10px] font-semibold rounded-lg cursor-pointer"
                              style={{ background: "var(--status-info-subtle)", border: "1px solid var(--status-info-blue-border)", color: "var(--accent-title-point)" }}
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M18.84 12.25l1.72-1.71h-.02a5.004 5.004 0 00-.12-7.07 5.006 5.006 0 00-6.95 0l-1.72 1.71" />
                                <path d="M5.17 11.75l-1.71 1.71a5.004 5.004 0 00.12 7.07 5.006 5.006 0 006.95 0l1.71-1.71" />
                                <line x1="8" y1="2" x2="8" y2="5" />
                                <line x1="2" y1="8" x2="5" y2="8" />
                              </svg>
                              Remove Hyperlink
                            </button>
                          </div>
                        </>
                      )}
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
