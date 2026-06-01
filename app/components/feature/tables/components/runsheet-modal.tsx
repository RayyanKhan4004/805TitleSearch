"use client";

import { useState } from "react";
import Icon from "@/components/common/icon";
import { PI_ROWS, GI_SEARCHES, PI_SAMPLE_META, GI_SAMPLE_META, type GiSearch, type GiRow } from "./runsheet-card";

interface RunsheetModalProps {
  piRows: typeof PI_ROWS;
  setPiRows: React.Dispatch<React.SetStateAction<typeof PI_ROWS>>;
  giSearches: GiSearch[];
  setGiSearches: React.Dispatch<React.SetStateAction<GiSearch[]>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
}

const DT_FONT = "'Courier New', monospace";

function piTypeColor(type: string) {
  if (["DD", "GD", "QCD"].includes(type)) return { bg: "#f0fdf4", color: "#166534", bold: true };
  if (["TD", "DOT", "AS", "SX"].includes(type)) return { bg: "#fffbeb", color: "#854d0e", bold: true };
  if (["RC", "RL"].includes(type)) return { bg: "#f5f3ff", color: "#6d28d9", bold: false };
  if (["LN", "FN", "SN", "AJ", "SJ"].includes(type)) return { bg: "#fff7ed", color: "#9a3412", bold: true };
  if (["NC", "SR"].includes(type)) return { bg: "#f0f9ff", color: "#0369a1", bold: false };
  if (["BF", "BG", "BT"].includes(type)) return { bg: "#fdf4ff", color: "#7e22ce", bold: true };
  return { bg: "#f8fafc", color: "#475569", bold: false };
}

function giTypeColor(type: string) {
  if (["AJ", "SJ", "CN"].includes(type)) return { color: "#9a3412", bold: true };
  if (["BF", "BG", "BT"].includes(type)) return { color: "#7e22ce", bold: true };
  if (["LN", "FN", "SN"].includes(type)) return { color: "#854d0e", bold: true };
  if (["RL", "RC"].includes(type)) return { color: "#6d28d9", bold: false };
  if (["OO"].includes(type)) return { color: "#0369a1", bold: false };
  return { color: "#334155", bold: false };
}

export default function RunsheetModal({
  piRows, setPiRows,
  giSearches, setGiSearches,
  activeTab, setActiveTab,
  onClose,
}: RunsheetModalProps) {
  const [showManual, setShowManual] = useState(false);
  const [manualType, setManualType] = useState("PI");
  const [manualAPN, setManualAPN] = useState("");
  const [manualName, setManualName] = useState("");
  const [manualRole, setManualRole] = useState("INDIVIDUAL");
  const [searching, setSearching] = useState(false);
  const [searchDone, setSearchDone] = useState(false);

  const runManualSearch = () => {
    setSearching(true);
    setSearchDone(false);
    setTimeout(() => {
      if (manualType === "PI" && manualAPN.trim()) {
        setPiRows((r) => [
          ...r,
          {
            check: false,
            type: "SR",
            bkpg: "",
            date: new Date().toLocaleDateString("en-US"),
            doc: "",
            grantor: "",
            grantee: "MANUAL SEARCH: " + manualAPN.trim(),
            ptn: "",
          },
        ]);
      } else if (manualType === "GI" && manualName.trim()) {
        const existing = giSearches.find((s) => s.role === manualRole);
        const newRow: GiRow = {
          type: "MN",
          bkpg: "",
          date: new Date().toLocaleDateString("en-US"),
          doc: "",
          name: "MANUAL SEARCH: " + manualName.trim(),
          ref: "",
          remarks: "User-initiated search",
        };
        if (existing) {
          setGiSearches((searches) =>
            searches.map((s) =>
              s.role === manualRole ? { ...s, rows: [...s.rows, newRow] } : s
            )
          );
        } else {
          setGiSearches((searches) => [
            ...searches,
            {
              role: manualRole,
              name: manualName.trim().toUpperCase(),
              nicknames: "",
              rows: [newRow],
            },
          ]);
        }
      }
      setSearching(false);
      setSearchDone(true);
      setTimeout(() => setSearchDone(false), 3000);
    }, 1400);
  };

  const th = {
    background: "#1a1a2e",
    color: "#e2e8f0",
    fontSize: 9,
    fontWeight: 700,
    padding: "5px 8px",
    textAlign: "left" as const,
    fontFamily: DT_FONT,
    whiteSpace: "nowrap" as const,
  };

  const td = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    padding: "3px 8px",
    fontSize: 9,
    fontFamily: DT_FONT,
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "top",
    ...extra,
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,.75)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* toolbar */}
      <div
        style={{
          background: "#1a1a2e",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          borderBottom: "1px solid #2d3348",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            style={{
              width: 32,
              height: 32,
              background: "#7c3aed",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="fileCheck" size={15} style={{ color: "#fff" }} />
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>Runsheet</div>
            <div style={{ color: "#94a3b8", fontSize: 10 }}>
              Order: {PI_SAMPLE_META.order} &nbsp;·&nbsp; {PI_SAMPLE_META.county} &nbsp;·&nbsp; {PI_SAMPLE_META.date}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowManual((v) => !v)}
            className="inline-flex items-center gap-1.25 text-[11px] font-semibold rounded-lg cursor-pointer transition-all duration-150"
            style={{
              padding: "6px 13px",
              border: "1px solid",
              background: showManual ? "#fef9c3" : "rgba(255,255,255,.1)",
              borderColor: showManual ? "#fde68a" : "#475569",
              color: showManual ? "#854d0e" : "#fff",
            }}
          >
            <Icon name="search" size={11} />
            Manual Search
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.25 text-[11px] font-semibold rounded-lg cursor-pointer transition-all duration-150"
            style={{
              padding: "6px 13px",
              border: "1px solid #dc2626",
              background: "rgba(220,38,38,.15)",
              color: "#fca5a5",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(220,38,38,.15)"; e.currentTarget.style.color = "#fca5a5"; }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* manual search panel */}
      {showManual && (
        <div
          style={{
            background: "#fffbeb",
            borderBottom: "2px solid #fde68a",
            padding: "12px 20px",
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div>
            <div className="text-[9px] font-bold text-[#92400e] uppercase mb-1">Search Type</div>
            <select
              value={manualType}
              onChange={(e) => setManualType(e.target.value)}
              className="border border-[#fde68a] rounded-md px-2.5 py-1.25 text-[11px] bg-white outline-none"
            >
              <option value="PI">PI — Property Index (by APN)</option>
              <option value="GI">GI — General Index (by Name)</option>
            </select>
          </div>
          {manualType === "PI" ? (
            <div style={{ flex: 1 }}>
              <div className="text-[9px] font-bold text-[#92400e] uppercase mb-1">APN</div>
              <input
                value={manualAPN}
                onChange={(e) => setManualAPN(e.target.value)}
                placeholder="e.g. 100-0-264-105"
                className="w-full border border-[#fde68a] rounded-md px-2.5 py-1.25 text-[11px] outline-none bg-white box-border"
              />
            </div>
          ) : (
            <>
              <div>
                <div className="text-[9px] font-bold text-[#92400e] uppercase mb-1">Role</div>
                <select
                  value={manualRole}
                  onChange={(e) => setManualRole(e.target.value)}
                  className="border border-[#fde68a] rounded-md px-2.5 py-1.25 text-[11px] bg-white outline-none"
                >
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="SPOUSE">Spouse</option>
                  <option value="TRUSTEE">Trustee</option>
                  <option value="CORPORATION">Corporation</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <div className="text-[9px] font-bold text-[#92400e] uppercase mb-1">Name (Last, First Middle)</div>
                <input
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. MARTINEZ, MARCOS"
                  className="w-full border border-[#fde68a] rounded-md px-2.5 py-1.25 text-[11px] outline-none bg-white box-border"
                />
              </div>
            </>
          )}
          <button
            onClick={runManualSearch}
            disabled={searching}
            className="inline-flex items-center gap-1.25 rounded-lg text-white text-[11px] font-semibold border-none cursor-pointer whitespace-nowrap"
            style={{
              background: "#92400e",
              padding: "7px 14px",
              opacity: searching ? 0.6 : 1,
              cursor: searching ? "not-allowed" : "pointer",
            }}
          >
            {searching ? (
              <><Icon name="loader" size={11} />Searching...</>
            ) : (
              <><Icon name="search" size={11} />Run Search</>
            )}
          </button>
          {searchDone && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-[#16a34a]">
              <Icon name="checkCircle" size={11} />
              Added to runsheet
            </span>
          )}
        </div>
      )}

      {/* tab bar */}
      <div
        style={{
          background: "#1e2130",
          display: "flex",
          borderBottom: "2px solid #2d3348",
          flexShrink: 0,
        }}
      >
        {[
          { key: "pi", label: "Property Index (PI Chain)", count: piRows.length },
          { key: "gi", label: "General Index (GI Search)", count: giSearches.reduce((a, s) => a + s.rows.length, 0) },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="inline-flex items-center gap-1.75 text-[11px] font-semibold cursor-pointer border-none bg-transparent transition-all duration-150"
            style={{
              padding: "10px 20px",
              borderBottom: activeTab === t.key ? "3px solid #7c3aed" : "3px solid transparent",
              color: activeTab === t.key ? "#a78bfa" : "#94a3b8",
            }}
          >
            {t.label}
            <span
              style={{
                background: activeTab === t.key ? "#7c3aed" : "#2d3348",
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                padding: "1px 7px",
                borderRadius: 999,
              }}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", background: "#f1f5f9", padding: 16 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #e2e8f0",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          {activeTab === "pi" && (
            <>
              {/* PI header */}
              <div style={{ background: "#1a1a2e", padding: "10px 16px" }}>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {([
                    ["ORDER:", PI_SAMPLE_META.order],
                    ["COUNTY:", PI_SAMPLE_META.county],
                    ["DATE:", PI_SAMPLE_META.date],
                    ["SEARCHED BY:", PI_SAMPLE_META.searchedBy],
                    ["PLANT THRU DATE:", PI_SAMPLE_META.plantThruDate],
                    ["PLANT THRU INST:", PI_SAMPLE_META.plantThruInst],
                    ["SEARCHED DATE:", PI_SAMPLE_META.searchedDate],
                    ["GEO COVERAGE:", PI_SAMPLE_META.geoCoverage],
                    ["TOR/TEE COVERAGE:", PI_SAMPLE_META.torTee],
                  ] as const).map(([k, v]) => (
                    <div key={k} className="flex gap-1.5">
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", fontFamily: DT_FONT, whiteSpace: "nowrap" }}>{k}</span>
                      <span style={{ fontSize: 9, color: "#e2e8f0", fontFamily: DT_FONT }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Assessor info */}
              <div
                className="mx-3 my-3 rounded-md p-2.5"
                style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
              >
                <div className="text-[10px] font-bold text-[#0369a1] mb-1.5">
                  ASSESSOR INFORMATION FOR APN: {PI_SAMPLE_META.apn}
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {([
                    ["CURRENT OWNER:", PI_SAMPLE_META.currentOwner],
                    ["ACQ DOC ID:", PI_SAMPLE_META.acqDocId],
                    ["SITUS ADDRESS:", PI_SAMPLE_META.situsAddr],
                    ["ACQ DATE:", PI_SAMPLE_META.acqDate],
                    ["MAILING ADDRESS:", PI_SAMPLE_META.mailingAddr],
                    ["TRA:", PI_SAMPLE_META.tra],
                    ["PARTIAL LEGAL:", PI_SAMPLE_META.partialLegal],
                    ["LAND USE CODE:", PI_SAMPLE_META.landUseCode],
                  ] as const).map(([k, v]) => (
                    <div key={k} className="flex gap-1.5">
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#475569", fontFamily: DT_FONT, whiteSpace: "nowrap", minWidth: 110 }}>{k}</span>
                      <span style={{ fontSize: 9, color: "#1e293b", fontFamily: DT_FONT }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-2 text-[9px] font-bold"
                  style={{ color: "#dc2626", fontFamily: DT_FONT }}
                >
                  SUBJECT PROPERTY INFORMATION REPRESENTS DATA RECEIVED FROM THE COUNTY TAX ASSESSORS OFFICE - VALIDATION OF CONTENT IS REQUIRED
                </div>
              </div>
              {/* Lot / Block / Tract strip */}
              <div
                className="mx-3 flex gap-6 px-2.5 py-1.5"
                style={{ background: "#1a1a2e", borderRadius: "4px 4px 0 0" }}
              >
                {([
                  ["LOT", PI_SAMPLE_META.lot],
                  ["BLOCK", PI_SAMPLE_META.block || "\u2014"],
                  ["TRACT", PI_SAMPLE_META.tract],
                  ["ID", PI_SAMPLE_META.id],
                ] as const).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", fontFamily: DT_FONT }}>{k}</span>
                    <span style={{ fontSize: 9, color: "#fff", fontFamily: DT_FONT }}>{v}</span>
                  </div>
                ))}
              </div>
              {/* PI table */}
              <div className="mx-3 mb-3 overflow-x-auto">
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                  <thead>
                    <tr>
                      {["\u2713", "TYPE", "BK/PG", "DATE", "DOC#", "GRANTOR", "GRANTEE", "PTN LGL/REMARKS"].map((h) => (
                        <th key={h} style={th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {piRows.map((row, i) => {
                      const { bg, color, bold } = piTypeColor(row.type);
                      return (
                        <tr
                          key={i}
                          style={{ background: bg }}
                          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.96)")}
                          onMouseLeave={(e) => (e.currentTarget.style.filter = "")}
                        >
                          <td style={td({ width: 20, textAlign: "center", color: "#16a34a" })}>
                            {row.check ? "\u2713" : ""}
                          </td>
                          <td style={td({ fontWeight: bold ? 700 : 400, color })}>{row.type}</td>
                          <td style={td({ color: "#64748b" })}>{row.bkpg}</td>
                          <td style={td({ whiteSpace: "nowrap" })}>{row.date}</td>
                          <td style={td({ fontWeight: 700, color: "#1e293b" })}>{row.doc}</td>
                          <td style={td()}>{row.grantor}</td>
                          <td
                            style={td({
                              fontWeight: row.grantee ? 600 : 400,
                              color: row.grantee ? "#0369a1" : "#94a3b8",
                            })}
                          >
                            {row.grantee}
                          </td>
                          <td style={td({ color: "#64748b" })}>{row.ptn}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div
                  className="text-center pt-2.5 mt-1"
                  style={{
                    fontFamily: DT_FONT,
                    fontSize: 10,
                    color: "#475569",
                    borderTop: "1px solid #e2e8f0",
                  }}
                >
                  END OF REPORT — {piRows.length} records
                </div>
              </div>
            </>
          )}

          {activeTab === "gi" && (
            <>
              {/* GI header */}
              <div style={{ background: "#1a1a2e", padding: "10px 16px" }}>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    ["ORDER:", GI_SAMPLE_META.order],
                    ["COUNTY:", GI_SAMPLE_META.county],
                    ["DATE:", GI_SAMPLE_META.date],
                    ["SEARCHED BY:", GI_SAMPLE_META.searchedBy],
                    ["PLANT THRU DATE:", GI_SAMPLE_META.plantThruDate],
                    ["PLANT THRU INST:", GI_SAMPLE_META.plantThruInst],
                    ["SEARCHED DATE:", GI_SAMPLE_META.searchedDate],
                    ["GEO COVERAGE:", GI_SAMPLE_META.geoCoverage],
                    ["FED BANKRUPTCY DATE:", GI_SAMPLE_META.bankruptcyDate],
                  ] as const).map(([k, v]) => (
                    <div key={k} className="flex gap-1.5">
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", fontFamily: DT_FONT, whiteSpace: "nowrap" }}>{k}</span>
                      <span style={{ fontSize: 9, color: "#e2e8f0", fontFamily: DT_FONT }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GI name sections */}
              {giSearches.map((search, si) => (
                <div key={si} className="mx-3 mb-3">
                  <div
                    style={{
                      background: "#1a1a2e",
                      padding: "4px 10px",
                      borderRadius: "4px 4px 0 0",
                    }}
                  >
                    <div style={{ fontSize: 9, color: "#94a3b8", fontFamily: DT_FONT }}>
                      Name Service: GENERAL_INDEX
                    </div>
                  </div>
                  <div style={{ border: "1px solid #e2e8f0", borderTop: "none" }}>
                    <div
                      className="grid grid-cols-2 px-2.5 py-1.5"
                      style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}
                    >
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#1e293b", fontFamily: DT_FONT }}>
                        {search.role} LAST, FIRST MIDDLE
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#1e293b",
                          fontFamily: DT_FONT,
                          textAlign: "right",
                        }}
                      >
                        LST 4 SSN
                      </div>
                    </div>
                    <div className="px-2.5 py-1.25" style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#1e293b", fontFamily: DT_FONT }}>
                        {search.name}
                      </span>
                    </div>
                    {search.nicknames && (
                      <div
                        className="px-2.5 py-0.75"
                        style={{
                          borderBottom: "1px solid #e2e8f0",
                          fontSize: 9,
                          color: "#64748b",
                          fontFamily: DT_FONT,
                        }}
                      >
                        NICKNAME VARIATIONS SEARCHED: {search.nicknames}
                      </div>
                    )}
                    {/* GI table */}
                    <div className="overflow-x-auto">
                      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
                        <thead>
                          <tr>
                            {["TYPE", "BK/PG", "DATE", "DOC#", "NAME", "REFERENCE", "REMARKS"].map((h) => (
                              <th key={h} style={th}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {search.rows.map((row, ri) => {
                            const { color, bold } = giTypeColor(row.type);
                            const isBankr = ["BF", "BG", "BT", "BC"].includes(row.type);
                            return (
                              <tr
                                key={ri}
                                style={{ background: isBankr ? "#fdf4ff" : "#fff" }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.background = isBankr ? "#f3e8ff" : "#f8fafc")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.background = isBankr ? "#fdf4ff" : "#fff")
                                }
                              >
                                <td style={td({ fontWeight: bold ? 700 : 400, color, whiteSpace: "nowrap" })}>
                                  {row.type}
                                </td>
                                <td style={td({ color: "#64748b" })}>{row.bkpg}</td>
                                <td style={td({ whiteSpace: "nowrap" })}>{row.date}</td>
                                <td style={td({ fontWeight: 700 })}>{row.doc}</td>
                                <td style={td({ fontWeight: isBankr ? 600 : 400, maxWidth: 200 })}>
                                  {row.name}
                                </td>
                                <td style={td({ color: "#64748b" })}>{row.ref}</td>
                                <td
                                  style={td({
                                    color: isBankr ? "#7e22ce" : "#64748b",
                                    fontSize: 8,
                                    maxWidth: 220,
                                  })}
                                >
                                  {row.remarks}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
              <div
                className="mx-3 mb-3 pt-2.5 text-center"
                style={{
                  fontFamily: DT_FONT,
                  fontSize: 10,
                  color: "#475569",
                  borderTop: "1px solid #e2e8f0",
                }}
              >
                END OF REPORT
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
