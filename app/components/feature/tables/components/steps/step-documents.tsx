"use client";

import Icon from "@/components/common/icon";
import { CardHead } from "../shared-atoms";
import { useState, useEffect } from "react";
import FinalPrelimModal from "../models/final-prelim-modal";
import CreateTemplateModal from "../models/create-template-modal";
import SendPrelimModal from "../models/send-prelim-modal";
import UploadPopover from "../upload-popover";
import { INIT_DOCS, INIT_NOTES } from "../temp";
import type { DocItem, NoteItem } from "@/app/components/feature/tables/types";
import { Button, Card, CardContent, Badge } from "@/components/ui";

interface StepDocumentsProps {
  extraDocs?: Array<{ name: string; date: string; size: string; type: string; body?: string }>;
  onSaveClose?: () => void;
}

export default function StepDocuments({ extraDocs = [], onSaveClose }: StepDocumentsProps) {
  const [docs, setDocs] = useState<DocItem[]>(INIT_DOCS);

  /* Merge extraDocs (generated prelims from TSRI) when they change */
  useEffect(() => {
    if (extraDocs.length > 0) {
      const extraNames = extraDocs.map((d) => d.name);
      setDocs((prev) => {
        const existingNames = prev.map((d) => d.name);
        const newExtras = extraDocs.filter((d) => !existingNames.includes(d.name));
        return newExtras.length > 0 ? [...newExtras, ...prev] : prev;
      });
    }
  }, [extraDocs]);
  const [notes, setNotes] = useState<NoteItem[]>(INIT_NOTES);
  const [noteText, setNote] = useState("");
  const [showTpl, setShowTpl] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const addNote = () => {
    if (!noteText.trim()) return;
    setNotes([
      { author: "John Smith", date: "Just now", text: noteText },
      ...notes,
    ]);
    setNote("");
  };
  const handleSaveTemplate = (tpl: DocItem) => {
    setDocs((d) => [
      { ...tpl, date: new Date().toLocaleDateString("en-US"), size: "—" },
      ...d,
    ]);
  };
  const typeIcon = (t: string | undefined) =>
    t === "template" ? "fileCheck" : "file";
  const typeBg = (t: string | undefined) =>
    t === "template"
      ? "bg-status-info-subtle border border-status-info-blue-border"
      : "bg-status-error-bg border border-status-error-border";
  const typeColor = (t: string | undefined) =>
    t === "template" ? "var(--status-info-blue)" : "var(--status-error-text)";

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-[18px]">
        <Card>
          <CardHead
            title={`Documents (${docs.length})`}
            sub="All files and templates attached to this order"
            right={
              <div className="flex gap-1.5 flex-wrap">
                <Button onClick={() => setShowTpl(true)} size="sm">
                  <Icon name="plus" size={11} />
                  Create Template
                </Button>
                <Button
                  onClick={() => setShowFinal(true)}
                  size="sm"
                  variant="info"
                >
                  <Icon name="fileCheck" size={11} />
                  Final Prelim
                </Button>
                <Button
                  onClick={() => setShowSend(true)}
                  size="sm"
                  style={{ background: "var(--accent-data-trace)" }}
                >
                  <Icon name="mail" size={11} />
                  Send Prelim
                </Button>
                <div className="relative">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowUpload(!showUpload)}
                  >
                    <Icon name="upload" size={11} />
                    Upload
                  </Button>
                  {showUpload && (
                    <UploadPopover
                      onUpload={(files) => {
                        Array.from(files).forEach((f) => {
                          setDocs((d) => [
                            {
                              name: f.name,
                              date: new Date().toLocaleDateString("en-US"),
                              size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
                              type: "document",
                            },
                            ...d,
                          ])
                        })
                        setShowUpload(false)
                      }}
                      onClose={() => setShowUpload(false)}
                    />
                  )}
                </div>
              </div>
            }
          />
          <div className="p-3.5 flex flex-col gap-[7px] max-h-[380px] overflow-y-auto">
            {docs.map((doc, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-3 py-[9px] rounded-lg cursor-pointer transition-all duration-150 border ${doc.type === "template" ? "border-status-success-border bg-status-success-bg" : "border-light bg-page"} hover:border-border hover:shadow-[0_1px_6px_rgba(0,0,0,.06)]`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeBg(doc.type)}`}
                  >
                    <Icon
                      name={typeIcon(doc.type)}
                      size={14}
                      style={{ color: typeColor(doc.type) }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-status-info-blue-text underline">
                        {doc.name}
                      </span>
                      {doc.type === "template" && (
                        <Badge variant="info" size="sm">
                          WORD
                        </Badge>
                      )}
                    </div>
                    <div className="text-[10px] text-text-muted">
                      {doc.date}
                      {doc.size !== "—" ? ` · ${doc.size}` : ""}
                    </div>
                  </div>
                </div>
                <button className="bg-transparent border-none cursor-pointer text-text-disabled flex">
                  <Icon name="moreV" size={13} />
                </button>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHead title="Notes & Tasks" sub="Internal notes for this order" />
          <CardContent className="flex flex-col gap-2.5">
            <div className="flex gap-1.5">
              <input
                value={noteText}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addNote()}
                placeholder="Add a note… (Enter to submit)"
                className="flex-1 px-2.5 py-1.5 text-[11px] border border-border rounded-lg bg-white text-text outline-none"
              />
              <Button onClick={addNote}>Add</Button>
            </div>
            <div className="flex flex-col gap-[7px] max-h-[320px] overflow-y-auto">
              {notes.map((n, i) => (
                <div
                  key={i}
                  className="bg-white border border-light rounded-lg px-3 py-2.5"
                  style={{ boxShadow: "var(--shadow-note)" }}
                >
                  <div className="flex items-center justify-between mb-1.25">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ background: "var(--ui-avatar)" }}
                      >
                        {n.author[0]}
                      </div>
                      <span className="text-[10px] font-semibold text-text">
                        {n.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-text-muted">
                        {n.date}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() =>
                          setNotes(notes.filter((_, j) => j !== i))
                        }
                      >
                        <Icon name="trash" size={11} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-[1.5] m-0">
                    {n.text}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {docs.filter((d) => d.type === "template").length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon
              name="fileCheck"
              size={14}
              style={{ color: "var(--status-info-blue)" }}
            />
            <span className="text-[12px] font-bold text-text">
              Saved Templates
            </span>
            <Badge variant="success">
              {docs.filter((d) => d.type === "template").length}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {docs
              .filter((d) => d.type === "template")
              .map((t, i) => (
                <div
                  key={i}
                  className="border border-status-success-border rounded-lg px-3.5 py-2.5 bg-status-info-subtle flex items-center gap-2.5 cursor-pointer transition-all duration-150 hover:shadow-[0_2px_8px_rgba(0,0,0,.08)]"
                >
                  <Icon
                    name="fileCheck"
                    size={14}
                    style={{ color: "var(--status-info-blue)" }}
                  />
                  <div>
                    <div className="text-[11px] font-semibold text-text">
                      {t.name}
                    </div>
                    <div className="text-[9px] text-text-muted">
                      Created {t.date} · Word Document
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-1.5">
                    Edit
                  </Button>
                </div>
              ))}
          </div>
        </Card>
      )}
      {showTpl && (
        <CreateTemplateModal
          onClose={() => setShowTpl(false)}
          onSave={handleSaveTemplate}
        />
      )}
      {showFinal && (
        <FinalPrelimModal
          onClose={() => setShowFinal(false)}
          onSave={handleSaveTemplate}
        />
      )}
      {showSend && (
        <SendPrelimModal onClose={() => setShowSend(false)} docs={docs} />
      )}
    </div>
  );
}
