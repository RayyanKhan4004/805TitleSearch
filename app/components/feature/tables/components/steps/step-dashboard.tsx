"use client";

import Icon from "@/components/common/icon";
import { S, statusStyle } from "../shared-atoms";
import { useState } from "react";
import { ORDERS, RECENT_FILES } from "../temp";
import type { CreateOrderModalProps } from "@/app/components/feature/tables/types";

function CreateOrderModal({ onClose }: CreateOrderModalProps) {
  const [ms, setMs] = useState(1);
  const steps = ["Property Information", "File Information", "Transaction Parties"];
  const inp = "w-full border border-border-input rounded-lg px-[11px] py-2 text-[12px] outline-none bg-white box-border text-text";
  const lbl = "text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]";
  const sec = "bg-hover rounded-xl p-[18px] border border-border";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[999] p-6" style={{ background: "rgba(0,0,0,.55)" }}>
      <div className="bg-white w-full max-w-[940px] rounded-[18px] overflow-hidden flex flex-col max-h-[90vh]" style={{ boxShadow: "var(--shadow-modal-shadow-strong)" }}>
        <div className="bg-header text-header-text px-6 py-4 flex justify-between items-center shrink-0">
          <div><div className="text-[15px] font-bold">Create New Order</div><div className="text-[11px] text-text-muted mt-0.5">ATS Production Workflow</div></div>
          <button onClick={onClose} className="bg-transparent border-none text-text-muted text-[22px] cursor-pointer leading-none">×</button>
        </div>
        <div className="flex gap-1.5 px-6 pt-[14px] border-b border-secondary shrink-0">
          {steps.map((label, i) => { const n = i + 1, active = ms === n, done = ms > n; return (<div key={n} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg text-[12px] font-semibold cursor-pointer ${active ? "border-b-2 border-b-brand text-brand bg-brand-subtle" : done ? "border-b-2 border-b-status-success-dark text-status-success-dark bg-status-success-green-50" : "border-b-2 border-b-transparent text-text-muted bg-transparent"}`} onClick={() => setMs(n)}><div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${active ? "bg-brand text-white" : done ? "bg-status-success-dark text-white" : "bg-border text-text-muted"}`}>{done ? <Icon name="check" size={9} /> : n}</div>{n}. {label}</div>); })}
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {ms === 1 && (<div className="grid grid-cols-[3fr_2fr] gap-[18px]"><div><div className={sec}><div className="text-[13px] font-bold text-text mb-3.5">Property Information</div><div className="grid grid-cols-3 gap-2.75">{["Situs Address", "City", "State", "Zip Code", "County", "Assessor Vesting"].map((f) => (<div key={f}><label className={lbl}>{f}</label><input className={inp} placeholder={f} /></div>))}</div></div><div className={`${sec} mt-3.5`}><div className="text-[13px] font-bold text-text mb-3.5">Legal Information</div><div className="grid grid-cols-4 gap-2.75">{["Lot", "Block", "Tract", "Map Book", "Page", "Section", "Township", "Range"].map((f) => (<div key={f}><label className={lbl}>{f}</label><input className={inp} placeholder="-" /></div>))}</div></div></div><div className={sec}><div className="text-[13px] font-bold text-text mb-3.5">Parcel ID Information</div>{["APN 1", "APN 2", "APN 3", "APN 4"].map((f) => (<div key={f} className="mb-2.5"><label className={lbl}>{f}</label><input className={inp} placeholder="e.g. 123-456-789" /></div>))}</div></div>)}
          {ms === 2 && (<div className={sec}><div className="text-[13px] font-bold text-text mb-3.5">File Information</div><div className="grid grid-cols-3 gap-[13px]"><div><label className={lbl}>Client Name</label><select className={inp}><option>Select Client</option><option>ABC Title</option><option>XYZ Escrow</option></select></div><div><label className={lbl}>Client File No</label><input className={inp} placeholder="File number" /></div><div><label className={lbl}>Transaction Type</label><select className={inp}><option>Sale</option><option>Refinance</option><option>Construction</option></select></div><div><label className={lbl}>Product Type</label><input className={inp} placeholder="Product type" /></div><div><label className={lbl}>Source of Business</label><input className={inp} placeholder="Source" /></div><div><label className={lbl}>Sale Price</label><input className={inp} placeholder="$0.00" /></div><div><label className={lbl}>Loan Amount</label><input className={inp} placeholder="$0.00" /></div><div><label className={lbl}>Loan Number</label><input className={inp} placeholder="Loan #" /></div></div></div>)}
          {ms === 3 && (<div className={sec}><div className="text-[13px] font-bold text-text mb-3.5">Transaction Parties</div><div className="grid grid-cols-2 gap-[13px]"><div><label className={lbl}>Buyer Names</label><textarea className={`${inp} h-[78px] resize-none`} placeholder="Enter buyer names..." /></div><div><label className={lbl}>Seller Names</label><textarea className={`${inp} h-[78px] resize-none`} placeholder="Enter seller names..." /></div><div><label className={lbl}>Title Office</label><input className={inp} placeholder="Title office name" /></div><div><label className={lbl}>Escrow Office</label><input className={inp} placeholder="Escrow office name" /></div><div><label className={lbl}>Title Branch Review</label><select className={inp}><option>South Cal</option><option>North Cal</option></select></div></div></div>)}
        </div>
        <div className="border-t border-border px-6 py-[13px] flex justify-between items-center shrink-0">
          <button onClick={() => setMs((s) => Math.max(1, s - 1))} disabled={ms === 1} className={`${S.white} ${ms === 1 ? "opacity-40 cursor-not-allowed" : ""}`}>Back</button>
          <div className="flex gap-1">{steps.map((_, i) => (<div key={i} className="h-1.5 rounded-full transition-all duration-200" style={{ width: i + 1 === ms ? 20 : 8, background: i + 1 === ms ? "var(--brand-primary)" : i + 1 < ms ? "var(--status-success-dark)" : "var(--border-primary)" }} />))}</div>
          <button onClick={() => { if (ms < 3) setMs((s) => s + 1); else { alert("Order submitted successfully!"); onClose(); } }} className={S.red}>{ms === 3 ? "Submit Order" : "Next →"}</button>
        </div>
      </div>
    </div>
  );
}

export default function StepDashboard() {
  const [tab, setTab] = useState("Open");
  const [showModal, setShowModal] = useState(false);
  const filtered = tab === "All" ? ORDERS : ORDERS.filter((o) => o.status === tab);

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="w-60 shrink-0 bg-white border-r border-border overflow-y-auto p-4">
        <div className="text-[12px] font-bold text-text-secondary mb-3">Recent Worked Files</div>
        {RECENT_FILES.map((f) => (<div key={f.no} className="border border-border rounded-lg p-[11px] mb-2 cursor-pointer transition-[background] hover:bg-hover"><div className="flex justify-between items-center mb-1"><span className="text-[12px] font-bold text-text">{f.no}</span><span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ ...statusStyle(f.status) }}>{f.status}</span></div><div className="text-[11px] text-text-secondary mb-0.5">{f.addr}</div><div className="text-[10px] text-text-muted">{f.owner}</div></div>))}
      </div>
      <div className="flex-1 overflow-y-auto p-[18px] flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">{["Open", "Closed", "Cancelled", "All"].map((t) => (<button key={t} onClick={() => setTab(t)} className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold border cursor-pointer transition-all duration-150 ${tab === t ? "bg-brand border-brand text-white" : "bg-white border-border text-text-secondary"}`}>{t} Files</button>))}</div>
          <button onClick={() => setShowModal(true)} className={`${S.red} flex items-center gap-1.25`}><Icon name="plus" size={12} />Create New Order</button>
        </div>
        <div className={`${S.card} overflow-hidden`}>
          <table className="w-full border-collapse"><thead><tr>{["Order No.", "APN", "Address", "Owner", "County", "Status"].map((h) => (<th key={h} className={S.th}>{h}</th>))}</tr></thead><tbody>{filtered.map((row, i) => (<tr key={i} className="cursor-pointer transition-[background] duration-100 hover:bg-hover"><td className={`${S.td} font-semibold text-brand`}>{row.no}</td><td className={S.td}>{row.apn}</td><td className={S.td}>{row.addr}</td><td className={S.td}>{row.owner}</td><td className={S.td}>{row.county}</td><td className={S.td}><span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block" style={{ ...statusStyle(row.status) }}>{row.status}</span></td></tr>))}</tbody></table>
        </div>
      </div>
      {showModal && <CreateOrderModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
