"use client";

import Icon from "@/components/common/icon";
import { S } from "../shared-atoms";
import { useState } from "react";
import { RECIPIENTS, PREFILLS } from "../consts";
import type { SendPrelimModalProps } from "@/app/components/feature/tables/types";

export default function SendPrelimModal({ onClose, docs }: SendPrelimModalProps) {
  const [to, setTo] = useState("title_officer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("Preliminary Report — Order No. 2026-000123");
  const [message, setMessage] = useState("Please find attached the Preliminary Report for the above referenced order.\n\nPlease review and advise of any additional requirements or exceptions.\n\nThank you.");
  const [docSel, setDocSel] = useState(docs.length > 0 ? docs[0].name : "");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleToChange = (v: string) => { setTo(v); const p = PREFILLS[v] || { name: "", email: "" }; setName(p.name); setEmail(p.email); };
  const handleSend = () => { setSending(true); setTimeout(() => { setSending(false); setSent(true); }, 1400); };

  const inp = "border border-border-input rounded-[7px] px-[11px] py-2 text-[11px] text-text bg-white outline-none w-full box-border";
  const lbl = "text-[9px] font-bold text-text-secondary uppercase tracking-[0.07em] mb-1 block";

  return (
    <div className="fixed inset-0 backdrop-blur-[2px] flex items-center justify-center z-[999] p-4" style={{ background: "var(--modal-overlay)" }}>
      <div className="bg-white w-full max-w-[680px] max-h-[90vh] rounded-[18px] overflow-hidden flex flex-col" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="bg-header px-[22px] py-[14px] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-data-trace)" }}><Icon name="mail" size={16} className="text-white" /></div>
            <div><div className="text-[14px] font-bold text-white">Send Preliminary Report</div><div className="text-[10px] text-text-muted mt-0.5">Deliver document to Title Officer, Client, or Escrow</div></div>
          </div>
          <button onClick={onClose} className="bg-transparent border-none text-text-secondary text-[22px] cursor-pointer leading-none">×</button>
        </div>
        {!sent ? (
          <div className="flex-1 overflow-y-auto p-[22px] flex flex-col gap-4">
            <div>
              <label className={lbl}>Send To</label>
              <div className="flex flex-wrap gap-1.5">
                {RECIPIENTS.map((r) => (<button key={r.value} onClick={() => handleToChange(r.value)} className={`px-3.5 py-1.5 rounded-lg text-[11px] font-semibold border cursor-pointer transition-all duration-150 ${to === r.value ? "text-white" : "bg-white border-border text-text-secondary"}`} style={to === r.value ? { background: "var(--accent-data-trace)", borderColor: "var(--accent-data-trace)" } : {}}>{r.label}</button>))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>Recipient Name</label><input value={name} onChange={(e) => setName(e.target.value)} className={inp} placeholder="Full name" /></div>
              <div><label className={lbl}>Email Address</label><input value={email} onChange={(e) => setEmail(e.target.value)} className={inp} placeholder="email@domain.com" type="email" /></div>
            </div>
            <div><label className={lbl}>CC (optional)</label><input value={cc} onChange={(e) => setCc(e.target.value)} className={inp} placeholder="cc@domain.com, cc2@domain.com" /></div>
            <div><label className={lbl}>Attach Document</label><select value={docSel} onChange={(e) => setDocSel(e.target.value)} className={inp}>{docs.map((d) => (<option key={d.name} value={d.name}>{d.name}</option>))}<option value="__prelim__">Preliminary Report — Auto-Generated</option><option value="__final__">Final Prelim — Order 2026-000123.docx</option></select></div>
            <div><label className={lbl}>Subject</label><input value={subject} onChange={(e) => setSubject(e.target.value)} className={inp} /></div>
            <div><label className={lbl}>Message</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className={`${inp} resize-none leading-[1.6] font-inherit`} /></div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--status-success-bg)" }}><Icon name="checkCircle" size={32} className="text-status-success-emerald" /></div>
            <div className="text-center">
              <div className="text-[16px] font-bold text-text mb-1.5">Document Sent Successfully</div>
              <div className="text-[12px] text-text-secondary"><strong>{docSel === "__prelim__" ? "Preliminary Report" : docSel === "__final__" ? "Final Prelim" : docSel}</strong> was sent to <strong>{name || email}</strong></div>
              {cc && (<div className="text-[11px] text-text-muted mt-1">CC: {cc}</div>)}
            </div>
            <button onClick={onClose} className={`${S.red} px-7 py-2.5 text-[13px]`}>Done</button>
          </div>
        )}
        {!sent && (
          <div className="border-t border-border px-[22px] py-3 flex justify-between items-center shrink-0" style={{ background: "var(--card-header)" }}>
            <span className="text-[11px] text-text-muted">Sending as: <strong className="text-text">John Smith — Your Title Company</strong></span>
            <div className="flex gap-2">
              <button onClick={onClose} className={`${S.white} text-[12px]`}>Cancel</button>
              <button onClick={handleSend} disabled={!email || !name || sending} className={`${S.red} text-[12px] ${!email || !name || sending ? "opacity-60 cursor-not-allowed" : ""} flex items-center gap-1.25`} style={{ background: "var(--accent-data-trace)" }}>
                {sending ? (<><Icon name="loader" size={11} className="spin" />Sending…</>) : (<><Icon name="mail" size={11} />Send Document</>)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
