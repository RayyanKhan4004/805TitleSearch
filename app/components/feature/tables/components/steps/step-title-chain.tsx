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
import { useState, useEffect } from "react";
import ManualSearchModal from "../models/manual-search-modal";
import { INDEX_SECTIONS } from "../consts";
import { mapTransactionsToIndexRows } from "@/app/services/transaction-mapper";
import { useFetchCodeBookQuery } from "@/app/store/api/ordersApi";
import type {
  SharedState,
  PropertyForm,
  ChainCode,
  CodeBookEntry,
} from "@/app/components/feature/tables/types";

/* ── Map API CodeBookEntry to GenieSectionCard's expected shape ── */
interface GenieCodeItem {
  code: string;
  label: string;
  body: string;
}

function mapCodeBookToGenieItems(entries: CodeBookEntry[]): GenieCodeItem[] {
  return entries
    .filter((e) => e.isActive)
    .map((e) => {
      const dashIdx = e.code.indexOf(" - ");
      const label = dashIdx !== -1 ? e.code.slice(dashIdx + 3).trim() : e.code;
      return { code: e.code, label, body: e.verbiage };
    });
}

interface StepTitleChainProps {
  shared: SharedState;
  setShared: React.Dispatch<React.SetStateAction<SharedState>>;
  propertyForm?: PropertyForm;
  reportRaw?: Record<string, any>;
  isLoading?: boolean;
  onSave?: (dates?: { typeDate: string; effectiveDate: string }) => void;
  onSaveClose?: () => void;
}

export default function StepTitleChain({
  shared,
  setShared,
  propertyForm,
  reportRaw,
  isLoading,
  onSave,
  onSaveClose,
}: StepTitleChainProps) {
  const apiChainRows = reportRaw?.Transactions
    ? mapTransactionsToIndexRows(reportRaw.Transactions)
    : [];
  const [showSearch, setShowSearch] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [typeDate, setTypeDate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [codes, setCodes] = useState<ChainCode[]>(shared?.chainCodes || []);
  const { data: codeBookEntries } = useFetchCodeBookQuery();
  const genieCodes = codeBookEntries ? mapCodeBookToGenieItems(codeBookEntries) : [];

  useEffect(() => {
    setTypeDate(shared.typeDate || "");
    setEffectiveDate(shared.effectiveDate || "");
  }, [shared.typeDate, shared.effectiveDate]);

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
      <LegalVestingDrawer
        shared={shared}
        setShared={setShared}
        propertyForm={propertyForm}
        isLoading={isLoading}
      />

      {/* ── Type Date & Effective Date ── */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="p-[12px_18px] grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1.25">
              <Icon name="file" size={11} className="text-text-secondary" />
              Type Date
            </label>
            <input
              type="date"
              value={typeDate}
              onChange={(e) => setTypeDate(e.target.value)}
              className="w-full border border-border-input-alt rounded-lg px-2.5 py-2 text-[12px] text-ui-code bg-white outline-none"
            />
            {typeDate && (
              <span className="text-[10px] text-text-tertiary">
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
            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1.25">
              <Icon name="calendar" size={11} className="text-brand" />
              Effective Date
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full border rounded-lg px-2.5 py-2 text-[12px] text-ui-code outline-none"
              style={{
                borderColor: effectiveDate
                  ? "var(--status-error-bg)"
                  : "#d1d5db",
                background: effectiveDate
                  ? "var(--brand-primary-subtle)"
                  : "#fff",
              }}
            />
            {effectiveDate && (
              <span className="text-[10px] text-brand font-semibold flex items-center gap-1">
                <Icon name="checkCircle" size={10} />
                {new Date(effectiveDate + "T00:00:00").toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          SECTION B — Index Review
      ════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b-2 border-accent-data-trace mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-accent-data-trace rounded-lg flex items-center justify-center shrink-0">
              <Icon name="link" size={14} className="text-white" />
            </div>
            <div>
              <h3 className="m-0 text-[13px] font-bold text-text">
                Index Review
              </h3>
              <p className="m-0 text-[10px] text-text-muted mt-0.25">
                {INDEX_SECTIONS.length} sections · Review all recorded documents
                by category
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button className="inline-flex items-center gap-1.25 bg-white text-text-secondary border border-border rounded-lg px-3.5 py-1.5 text-[11px] font-semibold cursor-pointer">
              <Icon name="refresh" size={11} />
              Refresh All
            </button>
            <button className="inline-flex items-center gap-1.25 bg-brand text-white border-none rounded-lg px-3.5 py-1.5 text-[11px] font-semibold cursor-pointer">
              <Icon name="fileCheck" size={11} />
              Generate Exceptions
            </button>
          </div>
        </div>

        {INDEX_SECTIONS.map((sec) => {
          if (sec.title === "Assessor Page")
            return (
              <AssessorCard
                key="Assessor Page"
                data={propertyForm}
                dataRaw={reportRaw}
                isLoading={isLoading}
              />
            );
          if (sec.title === "Tax Cert")
            return (
              <TaxCertCard
                key={sec.title}
                title={sec.title}
                sub={sec.sub}
                accent={sec.accent}
              />
            );
          if (sec.title === "Runsheet")
            return (
              <RunsheetCard
                key={sec.title}
                title={sec.title}
                sub={sec.sub}
                accent={sec.accent}
              />
            );
          if (sec.title === "Other Exceptions")
            return (
              <GenieSectionCard
                key={sec.title}
                title={sec.title}
                sub="Schedule B Exceptions — from Genie Code Book"
                accent={sec.accent}
                codes={genieCodes}
              />
            );
          if (sec.title === "Other Requirements")
            return (
              <GenieSectionCard
                key={sec.title}
                title={sec.title}
                sub="Informational Notes & Requirements — from Genie Code Book"
                accent={sec.accent}
                codes={genieCodes}
              />
            );
          const isTitleChain = sec.title === "Title Chain Review";
          return (
            <IndexCard
              key={sec.title}
              title={sec.title}
              sub={sec.sub}
              accent={sec.accent}
              initRows={
                isTitleChain && apiChainRows.length > 0
                  ? apiChainRows
                  : sec.rows
              }
              allowAddRow={isTitleChain}
              showCode={sec.title === "Tract Map"}
            />
          );
        })}
      </div>

      {/* ── bottom action bar ── */}
      <div
        className="sticky bottom-0 z-10 bg-white border border-border rounded-xl flex items-center gap-2 px-4 py-2.5 mt-1.5"
        style={{ boxShadow: "0 -2px 14px rgba(0,0,0,.08)" }}
      >
        <button
          onClick={() => setShowSearch(true)}
          className="inline-flex items-center gap-1.25 bg-brand text-white border-none rounded-lg px-[18px] py-2 text-[12px] font-semibold cursor-pointer"
        >
          <Icon name="search" size={12} />
          Manual Search
        </button>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-1.25 bg-white text-text-secondary border border-border rounded-lg px-3.5 py-1.75 text-[12px] font-semibold cursor-pointer"
        >
          <Icon name="upload" size={12} />
          Upload
        </button>
        <div className="flex-1" />
        <button
          onClick={() => onSave?.({ typeDate, effectiveDate })}
          className="inline-flex items-center gap-1.25 bg-white text-text-secondary border border-border rounded-lg px-4 py-1.75 text-[12px] font-semibold cursor-pointer"
        >
          <Icon name="save" size={12} />
          Save
        </button>
        <button
          onClick={() => {
            onSave?.({ typeDate, effectiveDate });
            onSaveClose?.();
          }}
          className="inline-flex items-center gap-1.25 bg-header text-white border-none rounded-lg px-4 py-1.75 text-[12px] font-semibold cursor-pointer"
        >
          <Icon name="save" size={12} />
          Save &amp; Close
        </button>
        <Button
          className="inline-flex items-center gap-1.25 bg-header text-white border-none rounded-lg px-4 py-1.75 text-[12px] font-semibold cursor-pointer"
          size="md"
          style={{ background: "#8B0000" }}
        >
          Create TSR
        </Button>
      </div>

      {showSearch && <ManualSearchModal onClose={() => setShowSearch(false)} />}
      {showUploadModal && (
        <SectionUploadModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}

export { INDEX_SECTIONS };
