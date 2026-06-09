"use client";

import { useState } from "react";
import Icon from "@/components/common/icon";
import RunsheetModal from "./runsheet-modal";

interface RunsheetCardProps {
  title: string;
  sub: string;
  accent: string;
}

export const PI_SAMPLE_META = {
  order: "", county: "", date: "",
  searchedBy: "", plantThruDate: "",
  searchedDate: "", plantThruInst: "",
  geoCoverage: "",
  torTee: "",
  apn: "",
  currentOwner: "",
  acqDocId: "", acqDate: "",
  situsAddr: "",
  mailingAddr: "",
  tra: "",
  partialLegal: "",
  landUseCode: "",
  landUseDesc: "",
  lot: "", block: "", tract: "", id: "",
  subdivision: "",
};

export const GI_SAMPLE_META = {
  order: "", county: "", date: "",
  searchedBy: "", plantThruDate: "",
  searchedDate: "", plantThruInst: "",
  geoCoverage: "",
  bankruptcyDate: "",
  torTee: "",
};

export const PI_ROWS: { check: boolean; type: string; bkpg: string; date: string; doc: string; grantor: string; grantee: string; ptn: string }[] = [];

export interface GiRow {
  type: string;
  bkpg: string;
  date: string;
  doc: string;
  name: string;
  ref: string;
  remarks: string;
}

export interface GiSearch {
  role: string;
  name: string;
  nicknames: string;
  rows: GiRow[];
}

export const GI_SEARCHES: GiSearch[] = [];

export default function RunsheetCard({ title, sub, accent }: RunsheetCardProps) {
  const [open, setOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pi");
  const [piRows, setPiRows] = useState(PI_ROWS);
  const [giSearches, setGiSearches] = useState(GI_SEARCHES);

  const totalSearches = giSearches.length;
  const totalGiRows = giSearches.reduce((a, s) => a + s.rows.length, 0);

  return (
    <>
      <div className="overflow-hidden rounded-xl" style={{ border: "1px solid var(--border-primary)", background: "var(--bg-card)" }}>
        <div
          className="flex items-center justify-between px-4 py-2.75 cursor-pointer select-none bg-bg-card-header"
          style={{ borderBottom: open ? "1px solid var(--border-secondary)" : "none" }}
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-0.75 h-7 rounded-sm shrink-0" style={{ background: accent }} />
            <div>
              <div className="text-[13px] font-bold text-text">{title}</div>
              <div className="text-[10px] text-text-muted mt-0.5">{sub}</div>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-1"
              style={{ background: "var(--status-info-subtle)", color: "var(--accent-title-point)", border: "1px solid var(--status-info-blue-border)" }}
            >
              {piRows.length} PI &middot; {totalGiRows} GI
            </span>
          </div>
          <Icon name={open ? "chevDown" : "chevRight"} size={13} className="text-text-muted" />
        </div>

        {open && (
          <div className="flex flex-col gap-2.5 px-4 py-3.5">
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Property Index (PI)", val: `${piRows.length} recorded documents`, color: "var(--accent-data-trace)" },
                { label: "General Index (GI)", val: `${totalSearches} names \u00b7 ${totalGiRows} entries`, color: "var(--accent-title-point)" },
              ].map(({ label, val, color }) => (
                <div key={label} className="rounded-lg px-3.5 py-2.5 bg-white border border-border">
                  <div className="text-[10px] font-bold mb-0.75" style={{ color }}>{label}</div>
                  <div className="text-[12px] font-semibold text-text">{val}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.75 rounded-lg text-[12px] font-bold cursor-pointer transition-all duration-150"
                style={{
                  padding: "8px 16px",
                  background: "var(--status-info-subtle)",
                  border: "1px solid var(--status-info-blue-border)",
                  color: "var(--accent-title-point)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-title-point)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--status-info-subtle)"; e.currentTarget.style.color = "var(--accent-title-point)"; }}
              >
                <Icon name="external" size={12} />
                Open Full Runsheet
              </button>
              <span className="text-[10px] text-text-muted italic">
                Opens PI Chain + GI Search in a new full-screen view
              </span>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <RunsheetModal
          piRows={piRows}
          setPiRows={setPiRows}
          giSearches={giSearches}
          setGiSearches={setGiSearches}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
