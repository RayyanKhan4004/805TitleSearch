"use client";

import Icon from "@/components/common/icon";
import { CardHead, Lbl, S } from "../shared-atoms";
import { useState } from "react";

export default function StepLegalVesting() {
  const [legal, setLegal] = useState("LOT 22 OF TRACT 12345, IN THE CITY OF RIALTO, COUNTY OF SAN BERNARDINO, STATE OF CALIFORNIA, AS PER MAP RECORDED IN BOOK 123, PAGE 45 OF MAPS, IN THE OFFICE OF THE COUNTY RECORDER OF SAID COUNTY.");
  const [vesting, setVesting] = useState("John D. Doe and Jane R. Doe, husband and wife as community property, COUNTY OF SAN BERNARDINO, STATE OF CALIFORNIA.");
  const [lease, setLease] = useState("Fee simple estate subject to leasehold interest as disclosed in supporting documents.");
  const [areaType, setAreaType] = useState("City");
  const [areaName, setAreaName] = useState("Rialto");
  const [propType, setPropType] = useState("Single Family Residence");
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  const handleUpdate = () => { setLoading(true); setUpdated(false); setTimeout(() => { setVesting("John D. Doe and Jane R. Doe, husband and wife as community property with right of survivorship, COUNTY OF SAN BERNARDINO, STATE OF CALIFORNIA."); setLoading(false); setUpdated(true); setTimeout(() => setUpdated(false), 3000); }, 1500); };

  const ta = "w-full border border-border-input rounded-lg px-3 py-2.5 text-[11px] text-text bg-white box-border outline-none resize-none font-mono leading-[1.6]";
  const aiBadge = "text-white text-[9px] font-bold px-1.5 py-0.5 rounded";
  const pill = "bg-status-info-blue-50 border border-status-info-blue-border text-status-info-blue-text text-[10px] font-semibold px-2.5 py-1 rounded-full";

  return (
    <div className="grid grid-cols-2 gap-[18px]">
      <div className={S.card}>
        <CardHead title="Legal Description" sub="Verify and edit the parcel legal description" right={<div className="flex items-center gap-1.5"><span className={aiBadge} style={{ background: "var(--status-success-emerald)" }}>AI</span><button className="bg-transparent border-none cursor-pointer text-text-muted flex"><Icon name="copy" size={13} /></button><button className="bg-transparent border-none cursor-pointer text-text-muted flex"><Icon name="cpu" size={13} /></button></div>} />
        <div className="p-[18px] flex flex-col gap-2.5"><textarea rows={14} value={legal} onChange={(e) => setLegal(e.target.value)} className={ta} /><div className="flex justify-between items-center"><button className="bg-transparent border-none text-status-info-blue-text text-[11px] font-semibold cursor-pointer">Convert to Fields</button><span className="text-[10px] text-text-muted">{legal.length} chars</span></div></div>
      </div>
      <div className="flex flex-col gap-4">
        <div className={S.card}>
          <CardHead title="Vesting Box" sub="Current ownership vesting from deed" right={<div className="flex items-center gap-1.5"><span className={aiBadge} style={{ background: "var(--status-success-emerald)" }}>AI</span><button className="bg-transparent border-none cursor-pointer text-text-muted flex"><Icon name="copy" size={13} /></button><button className="bg-transparent border-none cursor-pointer text-text-muted flex"><Icon name="external" size={13} /></button></div>} />
          <div className="p-[18px] flex flex-col gap-3"><textarea rows={5} value={vesting} onChange={(e) => setVesting(e.target.value)} className={ta} /><div><Lbl>Parsed Vestees</Lbl><div className="flex gap-1.5 flex-wrap mt-1"><span className={pill}>John D. Doe</span><span className={pill}>Jane R. Doe</span></div></div><div className="flex justify-between items-center">{updated ? (<span className="flex items-center gap-1 text-[10px] text-status-success-emerald font-semibold"><Icon name="checkCircle" size={11} />Updated</span>) : (<span />)}<button onClick={handleUpdate} disabled={loading} className={`${S.red} ${loading ? "opacity-60 cursor-not-allowed" : ""}`}>{loading ? (<><Icon name="loader" size={11} className="spin" />Updating…</>) : (<><Icon name="refresh" size={11} />Update Vesting</>)}</button></div></div>
        </div>
        <div className={S.card}><CardHead title="Lease Hold Interest" sub="Leasehold details and ownership remarks" /><div className="p-[18px]"><textarea rows={4} value={lease} onChange={(e) => setLease(e.target.value)} className={ta} /></div></div>
        <div className={S.card}><CardHead title="City / Township / Unincorporated Area" sub="Jurisdiction and area classification" /><div className="p-[18px] grid grid-cols-2 gap-3.5"><div><Lbl>Area Type</Lbl><select value={areaType} onChange={(e) => setAreaType(e.target.value)} className={S.inp}><option>City</option><option>Township</option><option>Unincorporated Area</option></select></div><div><Lbl>Area Name</Lbl><input value={areaName} onChange={(e) => setAreaName(e.target.value)} className={S.inp} /></div></div></div>
        <div className={S.card}>
          <CardHead title="Property Type" sub="Select the classification of the subject property" right={<span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${propType === "Single Family Residence" ? "bg-status-success-bg text-status-success-text" : propType === "Multi-Family Residence" ? "bg-status-info-bg text-status-info-blue" : propType === "Condominium" ? "bg-status-info-bg text-accent-title-point" : "bg-status-warning-bg text-status-warning-text"}`}>{propType}</span>} />
          <div className="p-[18px] flex flex-col gap-3.5">
            <div><Lbl>Property Classification</Lbl><select value={propType} onChange={(e) => setPropType(e.target.value)} className={`${S.inp} text-[12px] px-3 py-2`}><option>Single Family Residence</option><option>Multi-Family Residence</option><option>Condominium</option><option>Planned Unit Development</option></select></div>
            {propType === "Single Family Residence" && (<div className="grid grid-cols-2 gap-3"><div><Lbl>Lot Size</Lbl><input placeholder="e.g. 7,200 Sq Ft" className={S.inp} /></div><div><Lbl>Year Built</Lbl><input placeholder="e.g. 1986" className={S.inp} /></div></div>)}
            {propType === "Multi-Family Residence" && (<div className="grid grid-cols-2 gap-3"><div><Lbl>Number of Units</Lbl><input placeholder="e.g. 4" className={S.inp} /></div><div><Lbl>Building Type</Lbl><select className={S.inp}><option>Duplex</option><option>Triplex</option><option>Fourplex</option><option>Apartment Building</option></select></div></div>)}
            {propType === "Condominium" && (<div className="grid grid-cols-3 gap-3"><div><Lbl>Unit No.</Lbl><input placeholder="e.g. 204" className={S.inp} /></div><div><Lbl>Building / Phase</Lbl><input placeholder="e.g. Building A" className={S.inp} /></div><div><Lbl>HOA Name</Lbl><input placeholder="e.g. Sunset Hills HOA" className={S.inp} /></div></div>)}
            {propType === "Planned Unit Development" && (<div className="grid grid-cols-2 gap-3"><div><Lbl>PUD / Project Name</Lbl><input placeholder="e.g. Riverview Estates" className={S.inp} /></div><div><Lbl>Phase / Tract</Lbl><input placeholder="e.g. Phase 2, Tract 12345" className={S.inp} /></div></div>)}
            <div className="flex gap-1.5 flex-wrap pt-0.5">{[["Single Family Residence", "Detached single-unit residential property"], ["Multi-Family Residence", "Two or more residential units on one parcel"], ["Condominium", "Individual unit with shared common areas"], ["Planned Unit Development", "Mixed residential community with shared amenities"]].filter(([t]) => t === propType).map(([, desc]) => (<div key={desc} className="flex items-center gap-1.5 border border-border rounded-[7px] px-[11px] py-1.5 text-[11px] text-text-secondary" style={{ background: "var(--bg-page)" }}><Icon name="fileCheck" size={11} className="text-brand" />{desc}</div>))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
