"use client";

import Icon from "@/components/common/icon";
import { CardHead } from "../shared-atoms";
import { useState, useEffect } from "react";
import FinalPrelimModal from "../models/final-prelim-modal";
import CreateTemplateModal from "../models/create-template-modal";
import SendPrelimModal from "../models/send-prelim-modal";
import UploadPopover from "../upload-popover";
import { INIT_DOCS } from "../temp";
import type { DocItem } from "@/app/components/feature/tables/types";
import { Button, Card, CardContent, Badge } from "@/components/ui";
import { useUploadFileMutation, useFetchNotesQuery, useCreateNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation } from "@/app/store/api/ordersApi";
import toast from "react-hot-toast";

interface StepDocumentsProps {
  orderId?: string;
  extraDocs?: Array<{ name: string; date: string; size: string; type: string; body?: string }>;
  onSaveClose?: () => void;
}

function formatNoteDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function StepDocuments({ orderId, extraDocs = [], onSaveClose }: StepDocumentsProps) {
  const [docs, setDocs] = useState<DocItem[]>(INIT_DOCS);
  const [uploadFile] = useUploadFileMutation();

  const { data: apiNotes = [], isLoading: notesLoading } = useFetchNotesQuery(orderId!, { skip: !orderId });
  const [createNote, { isLoading: creating }] = useCreateNoteMutation();
  const [deleteNote] = useDeleteNoteMutation();
  const [updateNote, { isLoading: updating }] = useUpdateNoteMutation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  /* Merge extraDocs (generated prelims from TSRI) when they change */
  useEffect(() => {
    if (extraDocs.length > 0) {
      setDocs((prev) => {
        const existingNames = prev.map((d) => d.name);
        const newExtras = extraDocs.filter((d) => !existingNames.includes(d.name));
        return newExtras.length > 0 ? [...newExtras, ...prev] : prev;
      });
    }
  }, [extraDocs]);

  const [noteText, setNote] = useState("");
  const [showTpl, setShowTpl] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const addNote = async () => {
    if (!noteText.trim() || !orderId) return;
    try {
      await createNote({ orderId, content: noteText.trim() }).unwrap();
      setNote("");
    } catch {
      toast.error("Failed to save note");
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!orderId) return;
    try {
      await deleteNote({ orderId, id }).unwrap();
    } catch {
      toast.error("Failed to delete note");
    }
  };

  const startEdit = (id: number, content: string) => {
    setEditingId(id);
    setEditText(content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = async (id: number) => {
    if (!orderId || !editText.trim()) return;
    try {
      await updateNote({ orderId, id, content: editText.trim() }).unwrap();
      cancelEdit();
    } catch {
      toast.error("Failed to update note");
    }
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
                      onUpload={async (files) => {
                        const file = files[0]
                        if (!file) return
                        const fd = new FormData()
                        fd.append("file", file)
                        try {
                          const fileUrl = await uploadFile(fd).unwrap()
                          setDocs((d) => [
                            {
                              name: file.name,
                              date: new Date().toLocaleDateString("en-US"),
                              size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
                              type: "document",
                              fileUrl,
                            },
                            ...d,
                          ])
                        } catch {
                          toast.error("Upload failed")
                        }
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
                disabled={!orderId || creating}
              />
              <Button onClick={addNote} disabled={!orderId || creating}>Add</Button>
            </div>
            <div className="flex flex-col gap-1.75 max-h-80 overflow-y-auto">
              {notesLoading && (
                <p className="text-[11px] text-text-muted text-center py-2">Loading notes…</p>
              )}
              {!notesLoading && apiNotes.length === 0 && orderId && (
                <p className="text-[11px] text-text-muted text-center py-2">No notes yet</p>
              )}
              {[...apiNotes].reverse().map((n) => (
                <div
                  key={n.id}
                  className="bg-white border border-light rounded-lg px-3 py-2.5"
                  style={{ boxShadow: "var(--shadow-note)" }}
                >
                  <div className="flex items-center justify-between mb-1.25">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                        style={{ background: "var(--ui-avatar)" }}
                      >
                        S
                      </div>
                      {/* <span className="text-[10px] font-semibold text-text">Staff</span> */}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-text-muted">
                        {formatNoteDate(n.createdAt)}
                      </span>
                      {editingId !== n.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => startEdit(n.id, n.content)}
                        >
                          <Icon name="pencil" size={11} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5"
                        onClick={() => handleDeleteNote(n.id)}
                      >
                        <Icon name="trash" size={11} />
                      </Button>
                    </div>
                  </div>
                  {editingId === n.id ? (
                    <div className="flex flex-col gap-1.5">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSaveEdit(n.id); }
                          if (e.key === "Escape") cancelEdit();
                        }}
                        rows={3}
                        className="w-full px-2.5 py-1.5 text-[11px] border border-border rounded-lg bg-white text-text outline-none resize-none"
                        autoFocus
                      />
                      <div className="flex gap-1.5 justify-end">
                        <Button variant="secondary" size="sm" onClick={cancelEdit}>Cancel</Button>
                        <Button size="sm" onClick={() => handleSaveEdit(n.id)} disabled={updating || !editText.trim()}>Save</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {n.title && (
                        <p className="text-[11px] font-semibold text-text leading-normal m-0 mb-0.5">{n.title}</p>
                      )}
                      <p className="text-[11px] text-text-secondary leading-normal m-0">
                        {n.content}
                      </p>
                    </>
                  )}
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
