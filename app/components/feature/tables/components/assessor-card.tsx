"use client";

import { useState, useMemo } from "react";
import Icon from "@/components/common/icon";
import type { PropertyForm, AssessorData } from "@/app/components/feature/tables/types";
import { mapRawToAssessorData } from "@/app/services/datatree-api";
import AssessorModal from "./assessor-modal";

interface AssessorCardProps {
  data?: PropertyForm;
  dataRaw?: Record<string, any>;
  transactions?: Record<string, any>[];
  isLoading?: boolean;
}

const LoadingSkeleton = () => (
  <div className="flex flex-col gap-2.5 p-4 animate-pulse">
    <div className="grid grid-cols-4 gap-2">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="border border-border rounded-lg px-3 py-2.5 bg-white"
        >
          <div className="h-2.5 bg-bg-table-row-alt rounded w-12 mb-2" />
          <div className="h-3.5 bg-bg-table-row-alt rounded w-24" />
        </div>
      ))}
    </div>
    <div className="h-8 bg-bg-table-row-alt rounded-lg w-56" />
  </div>
);

export default function AssessorCard({ data, dataRaw, transactions, isLoading }: AssessorCardProps) {
  const [open, setOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const owner = data?.vestingText ?? "—";
  const landUse = data?.landUse ?? "—";
  const yearBuilt = data?._yearBuilt ?? "—";
  const taxDollar = data?._annualTax ?? "—";
  const apn = data?.apn1 ?? "—";
  const county = data?.county ?? "—";
  const assessorData: AssessorData | null = useMemo(
    () => (dataRaw ? mapRawToAssessorData(dataRaw) : null),
    [dataRaw],
  );

  return (
    <>
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div
          className="flex items-center justify-between px-4 py-2.75 cursor-pointer select-none bg-bg-card-header"
          style={{
            borderBottom: open ? "1px solid var(--border-secondary)" : "none",
          }}
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-0.75 h-7 rounded-sm shrink-0 bg-accent-data-trace" />
            <div>
              <div className="text-[13px] font-bold text-text">
                Assessor Page
              </div>
              <div className="text-[10px] text-text-muted mt-0.5">
                Property Detail Report · APN: {apn} · {county} County
              </div>
            </div>
            {isLoading ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full ml-1 bg-status-warning-bg text-status-warning-text">
                <Icon name="loader" size={9} className="animate-spin" />
                Loading
              </span>
            ) : (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-1 bg-status-info-subtle text-accent-data-trace border border-status-info-blue-border">
                DataTree
              </span>
            )}
          </div>
          <Icon
            name={open ? "chevDown" : "chevRight"}
            size={13}
            className="text-text-muted"
          />
        </div>

        {open &&
          (isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="flex flex-col gap-2.5 p-4">
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Owner", val: owner },
                  { label: "Land Use", val: landUse },
                  { label: "Year Built", val: yearBuilt },
                  { label: "Property Tax", val: taxDollar },
                ].map(({ label, val }) => (
                  <div
                    key={label}
                    className="border border-border rounded-lg px-3 py-2.5 bg-white"
                  >
                    <div className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-0.5">
                      {label}
                    </div>
                    <div className="text-[11px] font-semibold text-text whitespace-pre-wrap leading-[1.4]">
                      {val || "—"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-[7px] px-4 py-2 rounded-lg text-[12px] font-bold cursor-pointer transition-all duration-150"
                  style={{
                    background: "#e0f2fe",
                    border: "1px solid #7dd3fc",
                    color: "#0369a1",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#0369a1";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#e0f2fe";
                    e.currentTarget.style.color = "#0369a1";
                  }}
                >
                  <Icon name="external" size={12} />
                  Open Property Detail Report
                </button>

                {/* <span className="text-[10px] text-text-muted italic">
                  DataTrace PropertyDetailReport
                </span> */}
              </div>
            </div>
          ))}
      </div>
      {modalOpen && assessorData && (
        <AssessorModal data={assessorData} transactions={transactions} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
