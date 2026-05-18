"use client";

import { useState } from "react";
import SendPrelimModal from "./send-prelim-modal";
import Icon from "@/components/common/icon";
import { Button, Dialog, DialogContent, DialogBody, DialogFooter, Input, Badge } from "@/components/ui";
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="md" title="Create Final Preliminary Report" subtitle="Generate a Word document from all chain data" onClose={onClose}>
        <div className="flex flex-col gap-4 p-[22px]">
          <div>
            <label className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.07em] mb-1 block">Document Name</label>
            <div className="flex items-center gap-0 border border-border-input rounded-lg overflow-hidden">
              <Input value={docName} onChange={(e) => setDocName(e.target.value)} className="flex-1 border-none px-3 py-2 outline-none bg-white" />
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
                    <Badge variant="success" size="sm" className="ml-auto">{sec.items.length} items</Badge>
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
            <Button onClick={handleGenerate} disabled={generating} className="justify-center py-3 text-[13px] w-full">
              {generating ? (<><Icon name="loader" size={13} className="spin" />Generating Word Document…</>) : (<><Icon name="fileCheck" size={13} />Generate Final Prelim (.docx)</>)}
            </Button>
          ) : (
            <div className="border border-status-info-blue-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 flex items-center gap-2.5" style={{ background: "var(--status-info-blue)" }}><Icon name="file" size={18} className="text-white" /><div className="flex-1"><div className="text-[12px] font-bold text-white">{docName}.docx</div><div className="text-[10px] text-white/75 mt-0.5">Word Document · Ready to download or send</div></div><Badge variant="outline" className="bg-white/20 text-white text-[9px] font-bold">READY</Badge></div>
              <div className="px-4 py-3 flex gap-2" style={{ background: "var(--status-info-blue-50)" }}>
                <Button onClick={() => { onSave({ name: docName + ".docx", date: new Date().toLocaleDateString("en-US"), size: "48 KB", type: "template" }); onClose(); }} variant="info"><Icon name="save" size={11} />Save to Documents</Button>
                <Button onClick={() => setShowSend(true)} style={{ background: "var(--accent-data-trace)" }}><Icon name="mail" size={11} />Send Prelim</Button>
                <Button variant="secondary"><Icon name="external" size={11} />Download</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
      {showSend && (<SendPrelimModal onClose={() => setShowSend(false)} docs={[{ name: docName + ".docx" }]} />)}
    </Dialog>
  );
}
