"use client";

import Icon from "@/components/common/icon";
import { CardHead, Lbl } from "./shared-atoms";
import { useState } from "react";
import type { SharedState } from "@/app/components/feature/tables/types";

interface LegalVestingDrawerProps {
  shared?: SharedState;
  setShared?: React.Dispatch<React.SetStateAction<SharedState>>;
  isLoading?: boolean;
}

export default function LegalVestingDrawer({ shared, setShared, isLoading }: LegalVestingDrawerProps) {
  const [openLegal, setOpenLegal] = useState(false);
  const [openVesting, setOpenVesting] = useState(false);
  const [legal, setLegal] = useState(shared?.legal ?? "");
  const [vesting, setVesting] = useState(shared?.vesting ?? "");
  const [lease, setLease] = useState(shared?.leaseHold ?? "");
  const [areaType, setAreaType] = useState("City");
  const [areaName, setAreaName] = useState("Rialto");
  const [propType, setPropType] = useState("Single Family Residence");
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  const handleUpdate = () => {
    setLoading(true);
    setUpdated(false);
    setTimeout(() => {
      setShared?.((s) => ({
        ...s,
        legal,
        vesting,
        leaseHold: lease,
      }));
      setLoading(false);
      setUpdated(true);
      setTimeout(() => setUpdated(false), 3000);
    }, 1500);
  };

  const triggerBtn = (
    label: string,
    icon: string,
    color: string,
    isOpen: boolean,
    onClick: () => void
  ) => (
    <button
      key={label}
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-4 py-1.75 rounded-lg text-[12px] font-semibold border cursor-pointer transition-all duration-150"
      style={{
        borderColor: isOpen ? color : "var(--border-input)",
        background: isOpen ? `${color}14` : "#fff",
        color: isOpen ? color : "var(--ui-code-text)",
        boxShadow: isOpen ? `0 2px 8px ${color}22` : "0 1px 3px rgba(0,0,0,.05)",
      }}
    >
      <div
        className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all duration-150"
        style={{
          background: isOpen ? color : "var(--bg-page)",
        }}
      >
        <Icon name={icon} size={11} className={isOpen ? "text-white" : "text-text-tertiary"} />
      </div>
      {label}
      <Icon
        name={isOpen ? "chevDown" : "chevRight"}
        size={11}
        style={{ color: isOpen ? color : "var(--text-muted)", marginLeft: 2 }}
      />
    </button>
  );

  const panelWrap = (color: string, title: string, onClose: () => void, children: React.ReactNode) => (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${color}44`, boxShadow: `0 4px 16px ${color}10`, marginTop: 8 }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: `${color}0d`, borderBottom: `1px solid ${color}33` }}
      >
        <span className="text-[12px] font-bold" style={{ color }}>{title}</span>
        <button
          onClick={onClose}
          className="bg-transparent border-none cursor-pointer text-text-muted text-lg leading-none p-0.5"
        >
          ×
        </button>
      </div>
      <div className="p-4 bg-white">{children}</div>
    </div>
  );

  const ta =
    "w-full border border-border-input-alt rounded-lg px-3 py-2.5 text-[11px] text-ui-code bg-white outline-none resize-none font-mono leading-relaxed";
  const aiBadge = "bg-status-success-emerald text-white text-[9px] font-bold px-1.5 py-0.5 rounded";
  const pill =
    "bg-status-info-subtle border border-status-info-blue-border text-ui-link text-[10px] font-semibold px-2.5 py-1 rounded-full";
  const card = "bg-white border border-border rounded-xl overflow-hidden";
  const inp =
    "w-full border border-border-input-alt rounded-lg px-3 py-2 text-[11px] text-ui-code bg-white outline-none";

  return (
    <div className="flex flex-col gap-3.5">
      {isLoading && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-status-info-subtle border border-status-info-blue-border text-[11px] text-accent-data-trace">
          <Icon name="loader" size={12} className="animate-spin" />
          Loading property data from API…
        </div>
      )}
      <div className="flex gap-2 items-center">
        {triggerBtn("Legal Description", "fileCheck", "#8B0000", openLegal, () => setOpenLegal((v) => !v))}
        {triggerBtn("Vesting", "user", "#0369a1", openVesting, () => setOpenVesting((v) => !v))}
      </div>

      {openLegal &&
        panelWrap("#8B0000", "Legal Description", () => setOpenLegal(false), (
          <div className={card}>
            <CardHead
              title="Legal Description"
              sub="Verify and edit the parcel legal description"
              right={
                <div className="flex items-center gap-1.5">
                  <span className={aiBadge}>AI</span>
                  <button className="bg-transparent border-none cursor-pointer text-[#94a3b8] flex">
                    <Icon name="copy" size={13} />
                  </button>
                  <button className="bg-transparent border-none cursor-pointer text-[#94a3b8] flex">
                    <Icon name="cpu" size={13} />
                  </button>
                </div>
              }
            />
            <div className="p-[18px] flex flex-col gap-2.5">
              <textarea rows={10} value={legal} onChange={(e) => setLegal(e.target.value)} className={ta} disabled={isLoading} placeholder={isLoading ? "Loading property data..." : ""} />
              <div className="flex flex-wrap justify-between items-center gap-2">
                <button className="bg-transparent border-none text-ui-link text-[11px] font-semibold cursor-pointer">
                  Convert to Fields
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-text-muted">{legal.length} chars</span>
                  <button
                    onClick={() => {
                      const sel = window.getSelection()?.toString() || "";
                      const url = prompt("Enter URL to hyperlink selected text:", "https://");
                      if (url && sel) setLegal((l) => l.replace(sel, `${sel} [${url}]`));
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
                    onClick={() =>
                      setLegal((l) =>
                        l.replace(/https?:\/\/[^\s\]]+/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/<a[^>]*>([^<]*)<\/a>/gi, "$1").replace(/[ \t]+/g, " ").trim(),
                      )
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1.25 text-[10px] font-semibold rounded-lg cursor-pointer"
                    style={{ background: "#fdf4ff", border: "1px solid #e9d5ff", color: "var(--accent-title-point)" }}
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
            </div>
          </div>
        ))}

      {openVesting &&
        panelWrap("#0369a1", "Vesting Box", () => setOpenVesting(false), (
          <div className={card}>
            <CardHead
              title="Vesting Box"
              sub="Current ownership vesting from deed"
              right={
                <div className="flex items-center gap-1.5">
                  <span className={aiBadge}>AI</span>
                  <button className="bg-transparent border-none cursor-pointer text-[#94a3b8] flex">
                    <Icon name="copy" size={13} />
                  </button>
                  <button className="bg-transparent border-none cursor-pointer text-text-muted flex">
                    <Icon name="external" size={13} />
                  </button>
                </div>
              }
            />
            <div className="p-[18px] flex flex-col gap-3">
              <textarea rows={4} value={vesting} onChange={(e) => setVesting(e.target.value)} className={ta} disabled={isLoading} placeholder={isLoading ? "Loading property data..." : ""} />
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const sel = window.getSelection()?.toString() || "";
                    const url = prompt("Enter URL to hyperlink selected text:", "https://");
                    if (url && sel) setVesting((v) => v.replace(sel, `${sel} [${url}]`));
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
                    setVesting((v) =>
                      v.replace(/https?:\/\/[^\s\]]+/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/<a[^>]*>([^<]*)<\/a>/gi, "$1").replace(/[ \t]+/g, " ").trim(),
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
              <div>
                <Lbl>Parsed Vestees</Lbl>
                <div className="flex gap-1.5 flex-wrap mt-1">
                  <span className={pill}>John D. Doe</span>
                  <span className={pill}>Jane R. Doe</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                {updated ? (
                  <span className="flex items-center gap-1 text-[10px] text-status-success-dark font-semibold">
                    <Icon name="checkCircle" size={11} />
                    Updated
                  </span>
                ) : (
                  <span />
                )}
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="inline-flex items-center gap-1 px-4 py-1.5 text-[11px] font-semibold border-none rounded-lg cursor-pointer transition-opacity"
                  style={{
                    background: "var(--brand-primary)",
                    color: "#fff",
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? (
                    <>
                      <Icon name="loader" size={11} className="spin" />
                      Updating…
                    </>
                  ) : (
                    <>
                      <Icon name="refresh" size={11} />
                      Update Vesting from Chain
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

      <div className={card}>
        <CardHead title="Lease Hold Interest" sub="Leasehold details and ownership remarks" />
        <div className="p-[18px]">
          <textarea rows={3} value={lease} onChange={(e) => setLease(e.target.value)} className={ta} disabled={isLoading} placeholder={isLoading ? "Loading property data..." : ""} />
        </div>
      </div>

      <div className={card}>
        <CardHead title="City / Township / Unincorporated Area" sub="Jurisdiction and area classification" />
        <div className="p-[18px] grid grid-cols-2 gap-3.5">
          <div>
            <Lbl>Area Type</Lbl>
            <select value={areaType} onChange={(e) => setAreaType(e.target.value)} className={inp}>
              <option>City</option>
              <option>Township</option>
              <option>Unincorporated Area</option>
            </select>
          </div>
          <div>
            <Lbl>Area Name</Lbl>
            <input value={areaName} onChange={(e) => setAreaName(e.target.value)} className={inp} />
          </div>
        </div>
      </div>

      <div className={card}>
        <CardHead
          title="Property Type"
          sub="Select the classification of the subject property"
          right={
            <span
              className="text-[10px] font-bold px-2.5 py-0.75 rounded-full"
              style={{
                background:
                  propType === "Single Family Residence"
                    ? "var(--status-success-bg)"
                    : propType === "Multi-Family Residence"
                      ? "var(--status-info-blue-50)"
                      : propType === "Condominium"
                        ? "#f3e8ff"
                        : "var(--status-warning-bg)",
                color:
                  propType === "Single Family Residence"
                    ? "var(--status-success-text)"
                    : propType === "Multi-Family Residence"
                      ? "var(--status-info-blue)"
                      : propType === "Condominium"
                        ? "#7e22ce"
                        : "var(--status-warning-text)",
              }}
            >
              {propType}
            </span>
          }
        />
        <div className="p-[18px] flex flex-col gap-3.5">
          <div>
            <Lbl>Property Classification</Lbl>
            <select
              value={propType}
              onChange={(e) => setPropType(e.target.value)}
              className={`${inp} text-[12px] px-3 py-2.25`}
            >
              <option>Single Family Residence</option>
              <option>Multi-Family Residence</option>
              <option>Condominium</option>
              <option>Planned Unit Development</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
