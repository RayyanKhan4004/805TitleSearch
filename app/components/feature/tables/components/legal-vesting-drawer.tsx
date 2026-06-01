"use client";

import Icon from "@/components/common/icon";
import { CardHead, Lbl } from "./shared-atoms";
import { useState } from "react";

export default function LegalVestingDrawer() {
  const [openLegal, setOpenLegal] = useState(false);
  const [openVesting, setOpenVesting] = useState(false);
  const [legal, setLegal] = useState(
    "LOT 22 OF TRACT 12345, IN THE CITY OF RIALTO, COUNTY OF SAN BERNARDINO, STATE OF CALIFORNIA, AS PER MAP RECORDED IN BOOK 123, PAGE 45 OF MAPS, IN THE OFFICE OF THE COUNTY RECORDER OF SAID COUNTY."
  );
  const [vesting, setVesting] = useState(
    "John D. Doe and Jane R. Doe, husband and wife as community property, COUNTY OF SAN BERNARDINO, STATE OF CALIFORNIA."
  );
  const [lease, setLease] = useState(
    "Fee simple estate subject to leasehold interest as disclosed in supporting documents."
  );
  const [areaType, setAreaType] = useState("City");
  const [areaName, setAreaName] = useState("Rialto");
  const [propType, setPropType] = useState("Single Family Residence");
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  const handleUpdate = () => {
    setLoading(true);
    setUpdated(false);
    setTimeout(() => {
      setVesting(
        "John D. Doe and Jane R. Doe, husband and wife as community property with right of survivorship, COUNTY OF SAN BERNARDINO, STATE OF CALIFORNIA."
      );
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
        borderColor: isOpen ? color : "#dbe2ea",
        background: isOpen ? `${color}14` : "#fff",
        color: isOpen ? color : "#334155",
        boxShadow: isOpen ? `0 2px 8px ${color}22` : "0 1px 3px rgba(0,0,0,.05)",
      }}
    >
      <div
        className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all duration-150"
        style={{
          background: isOpen ? color : "#f1f5f9",
        }}
      >
        <Icon name={icon} size={11} className={isOpen ? "text-white" : "text-[#64748b]"} />
      </div>
      {label}
      <Icon
        name={isOpen ? "chevDown" : "chevRight"}
        size={11}
        style={{ color: isOpen ? color : "#94a3b8", marginLeft: 2 }}
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
          className="bg-transparent border-none cursor-pointer text-[#94a3b8] text-lg leading-none p-0.5"
        >
          ×
        </button>
      </div>
      <div className="p-4 bg-white">{children}</div>
    </div>
  );

  const ta =
    "w-full border border-[#dbe3ee] rounded-lg px-3 py-2.5 text-[11px] text-[#334155] bg-white outline-none resize-none font-mono leading-relaxed";
  const aiBadge = "bg-[#10b981] text-white text-[9px] font-bold px-1.5 py-0.5 rounded";
  const pill =
    "bg-[#eff6ff] border border-[#bfdbfe] text-[#2563eb] text-[10px] font-semibold px-2.5 py-1 rounded-full";
  const card = "bg-white border border-[#e2e8f0] rounded-xl overflow-hidden";
  const inp =
    "w-full border border-[#dbe3ee] rounded-lg px-3 py-2 text-[11px] text-[#334155] bg-white outline-none";

  return (
    <div className="flex flex-col gap-3.5">
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
              <textarea rows={10} value={legal} onChange={(e) => setLegal(e.target.value)} className={ta} />
              <div className="flex justify-between items-center">
                <button className="bg-transparent border-none text-[#2563eb] text-[11px] font-semibold cursor-pointer">
                  Convert to Fields
                </button>
                <span className="text-[10px] text-[#94a3b8]">{legal.length} chars</span>
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
                  <button className="bg-transparent border-none cursor-pointer text-[#94a3b8] flex">
                    <Icon name="external" size={13} />
                  </button>
                </div>
              }
            />
            <div className="p-[18px] flex flex-col gap-3">
              <textarea rows={4} value={vesting} onChange={(e) => setVesting(e.target.value)} className={ta} />
              <div>
                <Lbl>Parsed Vestees</Lbl>
                <div className="flex gap-1.5 flex-wrap mt-1">
                  <span className={pill}>John D. Doe</span>
                  <span className={pill}>Jane R. Doe</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                {updated ? (
                  <span className="flex items-center gap-1 text-[10px] text-[#059669] font-semibold">
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
                    background: "#8B0000",
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
          <textarea rows={3} value={lease} onChange={(e) => setLease(e.target.value)} className={ta} />
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
                    ? "#dcfce7"
                    : propType === "Multi-Family Residence"
                      ? "#dbeafe"
                      : propType === "Condominium"
                        ? "#f3e8ff"
                        : "#fef9c3",
                color:
                  propType === "Single Family Residence"
                    ? "#166534"
                    : propType === "Multi-Family Residence"
                      ? "#1d4ed8"
                      : propType === "Condominium"
                        ? "#7e22ce"
                        : "#854d0e",
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
