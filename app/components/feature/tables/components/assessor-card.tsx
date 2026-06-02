"use client"

import { useState } from "react"
import Icon from "@/components/common/icon"
import { ASSESSOR_DATA_SAMPLE } from "./temp"
import type { AssessorData } from "./temp"
import AssessorModal from "./assessor-modal"

export default function AssessorCard() {
  const [open, setOpen] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const d: AssessorData = ASSESSOR_DATA_SAMPLE
  const accent = "#0369a1"

  const fmtDollar = (v: number | null | undefined) =>
    v != null ? "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"

  return (
    <><div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-2.75 cursor-pointer select-none"
        style={{ borderBottom: open ? "1px solid #f1f5f9" : "none", background: "#fafafa" }}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2.5">
          <div style={{ width: 3, height: 28, background: accent, borderRadius: 2, flexShrink: 0 }} />
          <div>
            <div className="text-[13px] font-bold text-[#1e293b]">Assessor Page</div>
            <div className="text-[10px] text-[#94a3b8] mt-0.5">
              Property Detail Report · APN: {d.apn} · {d.county} County
            </div>
          </div>
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-1"
            style={{ background: "#e0f2fe", color: "#0369a1", border: "1px solid #bae6fd" }}
          >
            DataTree
          </span>
        </div>
        <Icon name={open ? "chevDown" : "chevRight"} size={13} style={{ color: "#94a3b8" }} />
      </div>

      {open && (
        <div className="flex flex-col gap-2.5 p-4">
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Owner", val: d.owner1 + (d.owner2 ? "\n" + d.owner2 : "") },
              { label: "Land Use", val: d.site.landUse },
              { label: "Year Built", val: d.characteristics.yearBuilt },
              { label: "Property Tax", val: fmtDollar(d.tax.propertyTax) },
            ].map(({ label, val }) => (
              <div key={label} className="border border-[#e2e8f0] rounded-lg px-3 py-2.5 bg-white">
                <div className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-[0.07em] mb-0.5">{label}</div>
                <div className="text-[11px] font-semibold text-[#1e293b] whitespace-pre-wrap leading-[1.4]">{val || "—"}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-[7px] px-4 py-2 rounded-lg text-[12px] font-bold cursor-pointer transition-all duration-150"
              style={{ background: "#e0f2fe", border: "1px solid #7dd3fc", color: "#0369a1" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#0369a1"; e.currentTarget.style.color = "#fff" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#e0f2fe"; e.currentTarget.style.color = "#0369a1" }}
            >
              <Icon name="external" size={12} />
              Open Property Detail Report
            </button>
            <span className="text-[10px] text-[#94a3b8] italic">
              DataTrace PropertyDetailReport · County data as of {d.countyDataAsOf}
            </span>
          </div>
        </div>
      )}
    </div>
      {modalOpen && <AssessorModal data={d} onClose={() => setModalOpen(false)} />}
    </>
  )
}
