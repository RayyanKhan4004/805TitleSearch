"use client";

import { useState, Fragment } from "react";
import Icon from "@/components/common/icon";
import { CATX_CODES, type CatxCode } from "./temp";

interface TaxCertCardProps {
  title: string;
  sub: string;
  accent: string;
}

interface AddedCode extends CatxCode {
  id: number;
  editing: boolean;
  expanded: boolean;
}

export default function TaxCertCard({ title, sub, accent }: TaxCertCardProps) {
  const [open, setOpen] = useState(true);
  const [addedCodes, setAddedCodes] = useState<AddedCode[]>([]);

  const addCode = (catx: CatxCode) =>
    setAddedCodes((c) => [...c, { ...catx, id: Date.now(), editing: false, expanded: true }]);

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

  const renderVerbiage = (text: string) => {
    const parts = text.split("*");
    return parts.map((seg, i, arr) => (
      <Fragment key={i}>
        {seg}
        {i < arr.length - 1 && (
          <mark
            style={{
              background: "#fef9c3",
              color: "#92400e",
              padding: "0 3px",
              borderRadius: 3,
              fontWeight: 700,
            }}
          >
            *
          </mark>
        )}
      </Fragment>
    ));
  };

  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{ border: "1px solid var(--border-primary)", background: "var(--bg-card)" }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between px-4 py-2.75 cursor-pointer select-none"
        style={{
          borderBottom: open ? "1px solid #f1f5f9" : "none",
          background: "#fafafa",
        }}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-0.75 h-7 rounded-sm shrink-0" style={{ background: accent }} />
          <div>
            <div className="text-[13px] font-bold text-[#1e293b]">{title}</div>
            <div className="text-[10px] text-[#94a3b8] mt-0.5">{sub}</div>
          </div>
          {addedCodes.length > 0 && (
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1"
              style={{
                background: "#f0fdf4",
                color: "#166534",
                border: "1px solid #bbf7d0",
              }}
            >
              {addedCodes.length} code{addedCodes.length !== 1 ? "s" : ""} saved
            </span>
          )}
        </div>
        <Icon name={open ? "chevDown" : "chevRight"} size={13} style={{ color: "#94a3b8" }} />
      </div>

      {open && (
        <div className="flex flex-col gap-3.5 p-4">
          {/* CATX code picker */}
          <div>
            <div
              className="text-[10px] font-bold text-[#64748b] uppercase tracking-[0.07em] mb-2"
            >
              Select Tax Codes to Include
            </div>
            <div className="flex flex-wrap gap-1.75">
              {CATX_CODES.map((catx) => {
                const added = isAdded(catx.code);
                return (
                  <button
                    key={catx.code}
                    onClick={() => !added && addCode(catx)}
                    disabled={added}
                    title={catx.label}
                    className="inline-flex items-center gap-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition-all duration-150"
                    style={{
                      padding: "5px 12px",
                      border: "1px solid",
                      cursor: added ? "default" : "pointer",
                      background: added ? "#f0fdf4" : "#fff",
                      borderColor: added ? "#86efac" : "#e2e8f0",
                      color: added ? "#16a34a" : "#475569",
                      opacity: added ? 0.8 : 1,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Courier New', monospace",
                        fontSize: 10,
                        color: added ? "#16a34a" : accent,
                        fontWeight: 800,
                      }}
                    >
                      {catx.code}
                    </span>
                    {added ? (
                      <Icon name="checkCircle" size={10} style={{ color: "#16a34a" }} />
                    ) : (
                      <Icon name="plus" size={10} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Added codes */}
          {addedCodes.length > 0 && (
            <div className="flex flex-col gap-2.25">
              <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-[0.07em]">
                Added Codes
              </div>
              {addedCodes.map((c) => (
                <div
                  key={c.id}
                  className="overflow-hidden rounded-[10px] transition-all duration-150"
                  style={{
                    border: "1px solid",
                    borderColor: c.expanded ? "#e2e8f0" : "#bbf7d0",
                    background: c.expanded ? "#fafafa" : "#f0fdf4",
                  }}
                >
                  {/* card header */}
                  <div
                    className="flex items-center justify-between px-3 py-2 cursor-pointer"
                    style={{
                      background: c.expanded ? "#fff" : "#f0fdf4",
                      borderBottom: c.expanded ? "1px solid #f1f5f9" : "none",
                    }}
                    onClick={() => !c.editing && toggleExpanded(c.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        style={{
                          fontFamily: "'Courier New', monospace",
                          fontSize: 10,
                          fontWeight: 800,
                          color: accent,
                          background: "#f7fee7",
                          border: "1px solid #d9f99d",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}
                      >
                        {c.code}
                      </span>
                      <span className="text-[10px] text-[#64748b]">{c.label}</span>
                      {!c.expanded && (
                        <span
                          className="text-[8px] font-bold px-1.5 py-0.25 rounded-full"
                          style={{
                            background: "#dcfce7",
                            color: "#166534",
                            border: "1px solid #bbf7d0",
                          }}
                        >
                          Saved
                        </span>
                      )}
                      {c.expanded && c.verbiage.includes("*") && !c.editing && (
                        <span
                          className="text-[9px] font-semibold px-1.75 py-0.25 rounded-full"
                          style={{
                            background: "#fef3c7",
                            color: "#92400e",
                            border: "1px solid #fde68a",
                          }}
                        >
                          Fill in *
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {c.expanded && !c.editing && (
                        <button
                          onClick={() => startEdit(c.id)}
                          className="bg-transparent rounded-md text-[10px] font-semibold cursor-pointer transition-colors duration-150"
                          style={{
                            border: "1px solid #e2e8f0",
                            padding: "2px 9px",
                            color: "#475569",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#8B0000";
                            e.currentTarget.style.color = "#8B0000";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.color = "#475569";
                          }}
                        >
                          Edit
                        </button>
                      )}
                      {c.editing && (
                        <button
                          onClick={() => saveCode(c.id)}
                          className="inline-flex items-center gap-1 rounded-md border-none text-[10px] font-bold cursor-pointer text-white"
                          style={{ background: "#059669", padding: "2px 10px" }}
                        >
                          <Icon name="save" size={10} />
                          Save
                        </button>
                      )}
                      {!c.editing && (
                        <button
                          onClick={() => toggleExpanded(c.id)}
                          className="bg-transparent border-none cursor-pointer flex text-[#94a3b8] p-0.5"
                        >
                          <Icon name={c.expanded ? "chevDown" : "chevRight"} size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => removeCode(c.id)}
                        className="bg-transparent border-none cursor-pointer flex text-[#cbd5e1] transition-colors duration-150"
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#dc2626")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#cbd5e1")}
                      >
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </div>

                  {/* verbiage */}
                  {c.expanded && (
                    <div className="px-3 py-2.5">
                      {c.editing ? (
                        <textarea
                          value={c.verbiage}
                          onChange={(e) => updateVerbiage(c.id, e.target.value)}
                          rows={6}
                          style={{
                            width: "100%",
                            border: "1px solid #fecaca",
                            borderRadius: 7,
                            padding: "8px 10px",
                            fontSize: 11,
                            fontFamily: "'Times New Roman', serif",
                            lineHeight: 1.6,
                            resize: "vertical",
                            outline: "none",
                            background: "#fffbeb",
                            color: "#1e293b",
                            boxSizing: "border-box",
                          }}
                        />
                      ) : (
                        <p
                          style={{
                            fontSize: 11,
                            color: "#334155",
                            lineHeight: 1.6,
                            margin: 0,
                            whiteSpace: "pre-wrap",
                            fontFamily: "'Times New Roman', serif",
                          }}
                        >
                          {renderVerbiage(c.verbiage)}
                        </p>
                      )}
                      <div
                        style={{
                          display: "flex",
                          gap: 6,
                          marginTop: 8,
                          paddingTop: 8,
                          borderTop: "1px solid #f1f5f9",
                        }}
                      >
                        <button
                          onClick={() => {
                            const sel = window.getSelection()?.toString() || "";
                            const url = prompt("Enter URL to hyperlink selected text:", "https://");
                            if (url && sel) updateVerbiage(c.id, c.verbiage.replace(sel, `${sel} [${url}]`));
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.25 text-[10px] font-semibold rounded-lg cursor-pointer"
                          style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8" }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                          </svg>
                          Hyperlink
                        </button>
                        <button
                          onClick={() =>
                            updateVerbiage(
                              c.id,
                              c.verbiage.replace(/ \[[^\]]*\]/g, "").trim(),
                            )
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.25 text-[10px] font-semibold rounded-lg cursor-pointer"
                          style={{ background: "#fdf4ff", border: "1px solid #e9d5ff", color: "#7c3aed" }}
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
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {addedCodes.length === 0 && (
            <p className="m-0 text-[11px] text-[#94a3b8] italic">
              Select codes above to add them to the Tax Cert section.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
