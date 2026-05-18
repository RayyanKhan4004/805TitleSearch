"use client";

import { useState } from "react";
import SendPrelimModal from "./send-prelim-modal";
import Icon from "@/components/common/icon";
import { S } from "../shared-atoms";
import type { FinalPrelimModalProps } from "@/app/components/feature/tables/types";

export default function FinalPrelimModal({ onClose, onSave }: FinalPrelimModalProps) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [docName, setDocName] = useState("Final_Prelim_2026-000123");
  const [showSend, setShowSend] = useState(false);

  const handleGenerate = () => { setGenerating(true); setTimeout(() => { setGenerating(false); setGenerated(true); }, 1600); };

  const SECTIONS = [
    { label: "Schedule A", items: ["Effective Date", "Policy Amount", "Vesting", "Legal Description", "APN"], status: "complete" },
    { label: "Schedule B — Requirements", items: ["Grant Deed from Seller", "Payoff Deed of Trust — BOFA", "Resolve Judgment Lien — LA County"], status: "complete" },
    { label: "Schedule B — Exceptions", items: ["Property Taxes 2025-26", "Easement — City of Glendale", "CC&Rs — Sunset Hills HOA", "DOT — BOFA (2025-0213146)", "Judgment Lien (2024-0031122)"], status: "complete" },
    { label: "Notes", items: ["No deeds within 24 months except as shown", "Rights of parties in possession not covered"], status: "complete" },
  ];

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-[999] p-4" style={{ background: "var(--modal-overlay)" }}>
      <div className="bg-white w-full max-w-[700px] max-h-[90vh] rounded-[18px] overflow-hidden flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="bg-header px-[22px] py-[14px] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 bg-brand rounded-lg flex items-center justify-center"><Icon name="fileCheck" size={16} className="text-white" /></div>
            <div><div className="text-[14px] font-bold text-white">Create Final Preliminary Report</div><div className="text-[10px] text-text-muted mt-0.5">Generate a Word document from all chain data</div></div>
          </div>
          <button onClick={onClose} className="bg-transparent border-none text-text-secondary text-[22px] cursor-pointer leading-none">×</button>
        </div>
        <div className="flex-1 overflow-y-auto p-[22px] flex flex-col gap-4">
          <div>
            <label className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.07em] mb-1 block">Document Name</label>
            <div className="flex items-center gap-0 border border-border-input rounded-lg overflow-hidden">
              <input value={docName} onChange={(e) => setDocName(e.target.value)} className="flex-1 border-none px-3 py-2 text-[12px] text-text outline-none bg-white" />
              <span className="px-3 py-2 text-text-secondary text-[11px] font-semibold border-l border-border-input" style={{ background: "var(--bg-page)" }}>.docx</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold text-text mb-2.5">Document Sections</div>
            <div className="flex flex-col gap-2">
              {SECTIONS.map((sec, i) => (
                <div key={i} className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 px-3.5 py-[9px] border-b border-light" style={{ background: "var(--bg-page)" }}>
                    <Icon name="checkCircle" size={13} style={{ color: "var(--status-success-emerald)" }} />
                    <span className="text-[11px] font-bold text-text">{sec.label}</span>
                    <span className="text-[9px] font-bold bg-status-success-bg text-status-success-text px-1.5 py-0.5 rounded-full ml-auto">{sec.items.length} items</span>
                  </div>
                  <div className="px-3.5 py-2 flex flex-wrap gap-1.25">
                    {sec.items.map((item, j) => (<span key={j} className="text-[10px] text-text-secondary border border-light px-2 py-0.5 rounded-[5px]" style={{ background: "var(--bg-page)" }}>{item}</span>))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="border border-border rounded-lg p-3.5" style={{ background: "var(--bg-page)" }}>
            <div className="text-[11px] font-bold text-text mb-2.5">Format Options</div>
            <div className="grid grid-cols-2 gap-2.5">
              {[["Include Cover Page", "Yes"], ["Include Signature Line", "Yes"], ["Policy Type", "CLTA Standard"], ["Date Format", "MM/DD/YYYY"]].map(([k, v]) => (
                <div key={k} className="flex justify-between text-[11px]"><span className="text-text-secondary">{k}</span><span className="text-text font-semibold">{v}</span></div>
              ))}
            </div>
          </div>
          {!generated ? (
            <button onClick={handleGenerate} disabled={generating} className={`${S.red} justify-center py-3 text-[13px] rounded-lg ${generating ? "opacity-70 cursor-not-allowed" : ""} flex items-center gap-1.5`}>
              {generating ? (<><Icon name="loader" size={13} className="spin" />Generating Word Document…</>) : (<><Icon name="fileCheck" size={13} />Generate Final Prelim (.docx)</>)}
            </button>
          ) : (
            <div className="border border-status-info-blue-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-2.5" style={{ background: "var(--status-info-blue)" }}><Icon name="file" size={18} className="text-white" /><div className="flex-1"><div className="text-[12px] font-bold text-white">{docName}.docx</div><div className="text-[10px] text-white/75 mt-0.5">Word Document · Ready to download or send</div></div><span className="bg-white/20 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">READY</span></div>
              <div className="px-4 py-3 flex gap-2" style={{ background: "var(--status-info-blue-50)" }}>
                <button onClick={() => { onSave({ name: docName + ".docx", date: new Date().toLocaleDateString("en-US"), size: "48 KB", type: "template" }); onClose(); }} className={`${S.red} text-[11px] flex items-center gap-1.25`} style={{ background: "var(--status-info-blue)" }}><Icon name="save" size={11} />Save to Documents</button>
                <button onClick={() => setShowSend(true)} className={`${S.red} text-[11px] flex items-center gap-1.25`} style={{ background: "var(--accent-data-trace)" }}><Icon name="mail" size={11} />Send Prelim</button>
                <button className={`${S.white} text-[11px] flex items-center gap-1.25`}><Icon name="external" size={11} />Download</button>
              </div>
            </div>
          )}
        </div>
        {showSend && (<SendPrelimModal onClose={() => setShowSend(false)} docs={[{ name: docName + ".docx" }]} />)}
      </div>
    </div>
  );
}
