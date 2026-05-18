"use client";

import Icon from "@/components/common/icon";
import { CardHead, S } from "../shared-atoms";
import { useState } from "react";
import FinalPrelimModal from "../models/final-prelim-modal";
import CreateTemplateModal from "../models/create-template-modal";
import SendPrelimModal from "../models/send-prelim-modal";
import { INIT_DOCS, INIT_NOTES } from "../consts";
import type { DocItem, NoteItem } from "@/app/components/feature/tables/types";

export default function StepDocuments() {
  const [docs, setDocs] = useState<DocItem[]>(INIT_DOCS);
  const [notes, setNotes] = useState<NoteItem[]>(INIT_NOTES);
  const [noteText, setNote] = useState("");
  const [showTpl, setShowTpl] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showSend, setShowSend] = useState(false);

  const addNote = () => { if (!noteText.trim()) return; setNotes([{ author: "John Smith", date: "Just now", text: noteText }, ...notes]); setNote(""); };
  const handleSaveTemplate = (tpl: DocItem) => { setDocs((d) => [{ ...tpl, date: new Date().toLocaleDateString("en-US"), size: "—" }, ...d]); };
  const typeIcon = (t: string | undefined) => (t === "template" ? "fileCheck" : "file");
  const typeBg = (t: string | undefined) => t === "template" ? "bg-status-info-subtle border border-status-info-blue-border" : "bg-status-error-bg border border-status-error-border";
  const typeColor = (t: string | undefined) => (t === "template" ? "var(--status-info-blue)" : "var(--status-error-text)");

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-[18px]">
        <div className={S.card}>
          <CardHead title={`Documents (${docs.length})`} sub="All files and templates attached to this order" right={<div className="flex gap-1.5 flex-wrap"><button onClick={() => setShowTpl(true)} className={`${S.red} flex items-center gap-1.25 text-[11px] px-3 py-1.5`}><Icon name="plus" size={11} />Create Template</button><button onClick={() => setShowFinal(true)} className={`${S.red} flex items-center gap-1.25 text-[11px] px-3 py-1.5`} style={{ background: "var(--status-info-blue-text)" }}><Icon name="fileCheck" size={11} />Final Prelim</button><button onClick={() => setShowSend(true)} className={`${S.red} flex items-center gap-1.25 text-[11px] px-3 py-1.5`} style={{ background: "var(--accent-data-trace)" }}><Icon name="mail" size={11} />Send Prelim</button><label className={`${S.white} inline-flex items-center gap-1.25 text-[11px] cursor-pointer px-3 py-1.5`}><Icon name="upload" size={11} />Upload<input type="file" className="hidden" multiple /></label></div>} />
          <div className="p-3.5 flex flex-col gap-[7px] max-h-[380px] overflow-y-auto">{docs.map((doc, i) => (<div key={i} className={`flex items-center justify-between px-3 py-[9px] rounded-lg cursor-pointer transition-all duration-150 border ${doc.type === "template" ? "border-status-success-border bg-status-success-bg" : "border-light bg-page"} hover:border-border hover:shadow-[0_1px_6px_rgba(0,0,0,.06)]`}><div className="flex items-center gap-2.5"><div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeBg(doc.type)}`}><Icon name={typeIcon(doc.type)} size={14} style={{ color: typeColor(doc.type) }} /></div><div><div className="flex items-center gap-1.5"><span className="text-[11px] font-semibold text-status-info-blue-text underline">{doc.name}</span>{doc.type === "template" && (<span className="bg-status-info-bg text-status-info-blue text-[9px] font-bold px-1.5 py-0.5 rounded-full">WORD</span>)}</div><div className="text-[10px] text-text-muted">{doc.date}{doc.size !== "—" ? ` · ${doc.size}` : ""}</div></div></div><button className="bg-transparent border-none cursor-pointer text-text-disabled flex"><Icon name="moreV" size={13} /></button></div>))}</div>
        </div>
        <div className={S.card}>
          <CardHead title="Notes & Tasks" sub="Internal notes for this order" />
          <div className="p-3.5 flex flex-col gap-2.5">
            <div className="flex gap-1.5"><input value={noteText} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNote()} placeholder="Add a note… (Enter to submit)" className="flex-1 px-2.5 py-1.5 text-[11px] border border-border rounded-lg bg-white text-text outline-none" /><button onClick={addNote} className={S.red}>Add</button></div>
            <div className="flex flex-col gap-[7px] max-h-[320px] overflow-y-auto">{notes.map((n, i) => (<div key={i} className="bg-white border border-light rounded-lg px-3 py-2.5" style={{ boxShadow: "var(--shadow-note)" }}><div className="flex items-center justify-between mb-1.25"><div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ background: "var(--ui-avatar)" }}>{n.author[0]}</div><span className="text-[10px] font-semibold text-text">{n.author}</span></div><div className="flex items-center gap-1.5"><span className="text-[9px] text-text-muted">{n.date}</span><button onClick={() => setNotes(notes.filter((_, j) => j !== i))} className="bg-transparent border-none cursor-pointer text-text-disabled flex"><Icon name="trash" size={11} /></button></div></div><p className="text-[11px] text-text-secondary leading-[1.5] m-0">{n.text}</p></div>))}</div>
          </div>
        </div>
      </div>
      {docs.filter((d) => d.type === "template").length > 0 && (<div className={`${S.card} p-4`}><div className="flex items-center gap-2 mb-3"><Icon name="fileCheck" size={14} style={{ color: "var(--status-info-blue)" }} /><span className="text-[12px] font-bold text-text">Saved Templates</span><span className="bg-status-success-bg text-status-success-text text-[10px] font-bold px-2 py-0.5 rounded-full">{docs.filter((d) => d.type === "template").length}</span></div><div className="flex flex-wrap gap-2.5">{docs.filter((d) => d.type === "template").map((t, i) => (<div key={i} className="border border-status-success-border rounded-lg px-3.5 py-2.5 bg-status-info-subtle flex items-center gap-2.5 cursor-pointer transition-all duration-150 hover:shadow-[0_2px_8px_rgba(0,0,0,.08)]"><Icon name="fileCheck" size={14} style={{ color: "var(--status-info-blue)" }} /><div><div className="text-[11px] font-semibold text-text">{t.name}</div><div className="text-[9px] text-text-muted">Created {t.date} · Word Document</div></div><button className="bg-transparent border-none cursor-pointer text-text-muted text-[10px] font-semibold ml-1.5 px-1.5 py-0.5 rounded transition-all duration-150 hover:text-brand">Edit</button></div>))}</div></div>)}
      {showTpl && <CreateTemplateModal onClose={() => setShowTpl(false)} onSave={handleSaveTemplate} />}
      {showFinal && <FinalPrelimModal onClose={() => setShowFinal(false)} onSave={handleSaveTemplate} />}
      {showSend && <SendPrelimModal onClose={() => setShowSend(false)} docs={docs} />}
    </div>
  );
}
