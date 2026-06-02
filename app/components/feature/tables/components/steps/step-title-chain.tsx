"use client";

import Icon from "@/components/common/icon";
import IndexCard from "../index-card";
import LegalVestingDrawer from "../legal-vesting-drawer";
import GenieSectionCard from "../genie-section-card";
import RunsheetCard from "../runsheet-card";
import TaxCertCard from "../tax-cert-card";
import AssessorCard from "../assessor-card";
import SectionUploadModal from "../section-upload-modal";
import { Button } from "@/components/ui";
import { useState } from "react";
import ManualSearchModal from "../models/manual-search-modal";
import { INDEX_SECTIONS, CAEXC_CODES, CAREQ_CODES } from "../consts";
import type { SharedState, ChainCode } from "@/app/components/feature/tables/types";

interface StepTitleChainProps {
  shared?: SharedState;
  setShared?: React.Dispatch<React.SetStateAction<SharedState>>;
  onSaveClose?: () => void;
}

export default function StepTitleChain({ shared, setShared, onSaveClose }: StepTitleChainProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [typeDate, setTypeDate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("2026-04-28");
  const [codes, setCodes] = useState<ChainCode[]>(shared?.chainCodes || []);

  const addCode = (code: ChainCode) => {
    const next = [...codes, code];
    setCodes(next);
    if (setShared) {
      setShared((s) => ({ ...s, chainCodes: next }));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ── Legal & Vesting — slide-down panel ── */}
      <LegalVestingDrawer />

      {/* ── Type Date & Effective Date ── */}
      <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
        <div className="p-[12px_18px] grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1.25">
              <Icon name="file" size={11} style={{ color: "#475569" }} />
              Type Date
            </label>
            <input
              type="date"
              value={typeDate}
              onChange={(e) => setTypeDate(e.target.value)}
              className="w-full border border-[#dbe3ee] rounded-lg px-2.5 py-2 text-[12px] text-[#334155] bg-white outline-none"
            />
            {typeDate && (
              <span className="text-[10px] text-[#64748b]">
                {new Date(typeDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1.25">
              <Icon name="calendar" size={11} style={{ color: "#8B0000" }} />
              Effective Date
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full border rounded-lg px-2.5 py-2 text-[12px] outline-none"
              style={{
                borderColor: effectiveDate ? "#fecaca" : "#d1d5db",
                background: effectiveDate ? "#fff5f5" : "#fff",
                color: "#334155",
              }}
            />
            {effectiveDate && (
              <span className="text-[10px] text-[#8B0000] font-semibold flex items-center gap-1">
                <Icon name="checkCircle" size={10} />
                {new Date(effectiveDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          SECTION B — Index Review
      ════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#0369a1] mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#0369a1] rounded-lg flex items-center justify-center shrink-0">
              <Icon name="link" size={14} className="text-white" />
            </div>
            <div>
              <h3 className="m-0 text-[13px] font-bold text-[#1e293b]">Index Review</h3>
              <p className="m-0 text-[10px] text-[#94a3b8] mt-0.25">
                {INDEX_SECTIONS.length} sections · Review all recorded documents by category
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button className="inline-flex items-center gap-1.25 bg-white text-[#475569] border border-[#e2e8f0] rounded-lg px-3.5 py-1.5 text-[11px] font-semibold cursor-pointer">
              <Icon name="refresh" size={11} />
              Refresh All
            </button>
            <button className="inline-flex items-center gap-1.25 bg-[#8B0000] text-white border-none rounded-lg px-3.5 py-1.5 text-[11px] font-semibold cursor-pointer">
              <Icon name="fileCheck" size={11} />
              Generate Exceptions
            </button>
          </div>
        </div>

        {INDEX_SECTIONS.map((sec) => {
          if (sec.title === "Assessor Page") return <AssessorCard key="Assessor Page" />;
          if (sec.title === "Tax Cert") return <TaxCertCard key={sec.title} title={sec.title} sub={sec.sub} accent={sec.accent} />;
          if (sec.title === "Runsheet") return <RunsheetCard key={sec.title} title={sec.title} sub={sec.sub} accent={sec.accent} />;
          if (sec.title === "Other Exceptions") return <GenieSectionCard key={sec.title} title={sec.title} sub="Schedule B Exceptions — from Genie Code Book" accent={sec.accent} codes={CAEXC_CODES} />;
          if (sec.title === "Other Requirements") return <GenieSectionCard key={sec.title} title={sec.title} sub="Informational Notes & Requirements — from Genie Code Book" accent={sec.accent} codes={CAREQ_CODES} />;
          const isTitleChain = sec.title === "Title Chain Review";
          return (
            <IndexCard
              key={sec.title}
              title={sec.title}
              sub={sec.sub}
              accent={sec.accent}
              initRows={sec.rows}
              allowAddRow={isTitleChain}
              showCode={sec.title === "Tract Map"}
            />
          );
        })}
      </div>

      {/* ── bottom action bar ── */}
      <div
        className="sticky bottom-0 z-10 bg-white border border-[#e2e8f0] rounded-xl flex items-center gap-2 px-4 py-2.5 mt-1.5"
        style={{ boxShadow: "0 -2px 14px rgba(0,0,0,.08)" }}
      >
        <button
          onClick={() => setShowSearch(true)}
          className="inline-flex items-center gap-1.25 bg-[#8B0000] text-white border-none rounded-lg px-[18px] py-2 text-[12px] font-semibold cursor-pointer"
        >
          <Icon name="search" size={12} />
          Manual Search
        </button>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-1.25 bg-white text-[#475569] border border-[#e2e8f0] rounded-lg px-3.5 py-1.75 text-[12px] font-semibold cursor-pointer"
        >
          <Icon name="upload" size={12} />
          Upload
        </button>
        <div className="flex-1" />
        <button className="inline-flex items-center gap-1.25 bg-white text-[#475569] border border-[#e2e8f0] rounded-lg px-4 py-1.75 text-[12px] font-semibold cursor-pointer">
          <Icon name="save" size={12} />
          Save
        </button>
        <button
          onClick={onSaveClose}
          className="inline-flex items-center gap-1.25 bg-[#1e2130] text-white border-none rounded-lg px-4 py-1.75 text-[12px] font-semibold cursor-pointer"
        >
          <Icon name="save" size={12} />
          Save &amp; Close
        </button>
      </div>

      {showSearch && <ManualSearchModal onClose={() => setShowSearch(false)} />}
      {showUploadModal && <SectionUploadModal onClose={() => setShowUploadModal(false)} />}
    </div>
  );
}

export { INDEX_SECTIONS };