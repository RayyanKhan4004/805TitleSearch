"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@/components/common/icon";
import { Card, CardTitle, CardDescription } from "@/components/ui";
import type { UploadCatField } from "./temp";
import toast from "react-hot-toast";

interface SectionTableCardProps {
  title: string;
  sub: string;
  accent: string;
  fields: UploadCatField[];
  values?: Record<string, string>;
  rows?: Array<Record<string, string>>;
  onFileUpload?: (file: File) => Promise<string>;
  onDeleteRow?: (apiId: number) => Promise<void>;
  onUpdateRow?: (apiId: number, values: Record<string, string>, file?: File | null) => Promise<void>;
}

const inputClass =
  "w-full rounded-[5px] border border-border-input bg-white px-1.5 py-1 text-[10px] text-text outline-none";

function isAllValuesEmpty(obj: Record<string, string> | undefined): boolean {
  if (!obj) return true;
  return Object.values(obj).every((v) => v === null || v === undefined || v === "");
}

function buildDisplayRows(
  rows: Array<Record<string, string>> | undefined,
  values: Record<string, string> | undefined,
): Array<Record<string, string>> {
  if (rows && rows.length > 0) return rows;
  if (values && !isAllValuesEmpty(values)) return [values];
  return [];
}

export default function SectionTableCard({
  title,
  sub,
  accent,
  fields,
  values,
  rows,
  onFileUpload,
  onDeleteRow,
  onUpdateRow,
}: SectionTableCardProps) {
  const [open, setOpen] = useState(true);
  const [showImgDrop, setShowImgDrop] = useState(false);
  const imgDropRef = useRef<HTMLTableCellElement>(null);

  const [localRows, setLocalRows] = useState<Array<Record<string, string>>>(
    () => buildDisplayRows(rows, values),
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [editFile, setEditFile] = useState<File | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    setLocalRows(buildDisplayRows(rows, values));
  }, [rows, values]);

  useEffect(() => {
    if (!showImgDrop) return;
    const handler = (event: MouseEvent) => {
      if (imgDropRef.current && !imgDropRef.current.contains(event.target as Node))
        setShowImgDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showImgDrop]);

  const startEdit = (rowData: Record<string, string>) => {
    const vals: Record<string, string> = {};
    fields.forEach((f) => { vals[f.key] = rowData[f.key] || ""; });
    setEditValues(vals);
    setEditFile(null);
    setEditingId(rowData._apiId);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
    setEditFile(null);
  };

  const saveEdit = async (rowData: Record<string, string>) => {
    const apiId = Number(rowData._apiId);
    if (!apiId || !onUpdateRow) return;
    setUpdatingId(rowData._apiId);
    try {
      await onUpdateRow(apiId, editValues, editFile);
      toast.success("Record updated");
      setEditingId(null);
      setEditValues({});
      setEditFile(null);
    } catch {
      toast.error("Failed to update record");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (rowData: Record<string, string>) => {
    const apiId = rowData._apiId ? Number(rowData._apiId) : null;
    if (!apiId || !onDeleteRow) return;
    setDeletingId(rowData._apiId);
    try {
      await onDeleteRow(apiId);
      setLocalRows((prev) => prev.filter((r) => r._apiId !== rowData._apiId));
      toast.success("Record deleted");
    } catch {
      toast.error("Failed to delete record");
    } finally {
      setDeletingId(null);
    }
  };

  const showActionCol = onDeleteRow != null || onUpdateRow != null;

  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-2.75 cursor-pointer"
        style={{ borderBottom: open ? "1px solid #f1f5f9" : "none", background: "#fafafa" }}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-0.75 h-7 rounded-sm shrink-0" style={{ background: accent }} />
          <div>
            <CardTitle>{title}</CardTitle>
            {sub && <CardDescription>{sub}</CardDescription>}
          </div>
          {localRows.length > 0 && (
            <span
              className="text-[9px] font-semibold px-2 py-0.5 rounded-full ml-1"
              style={{ background: "#f1f5f9", color: "#64748b" }}
            >
              {localRows.length} record{localRows.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <Icon name={open ? "chevDown" : "chevRight"} size={13} style={{ color: "#94a3b8" }} />
      </div>

      {open && (
        <div className="overflow-x-auto" style={{ background: "var(--bg-card)" }}>
          <table className="w-full border-collapse" style={{ minWidth: 600 }}>
            <thead>
              <tr>
                {fields.map((f) => (
                  <th
                    key={f.key}
                    className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider border-b border-secondary px-2.5 py-2 text-left whitespace-nowrap"
                    style={{ background: "#f8fafc" }}
                  >
                    {f.label}
                  </th>
                ))}
                <th
                  className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider border-b border-secondary px-2.5 py-2 text-center whitespace-nowrap"
                  style={{ background: "#f8fafc" }}
                >
                  Attach
                </th>
                {showActionCol && (
                  <th
                    className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider border-b border-secondary px-2.5 py-2 text-center whitespace-nowrap"
                    style={{ background: "#f8fafc", width: 80 }}
                  >
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {localRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={fields.length + (showActionCol ? 2 : 1)}
                    className="text-[11px] text-text-muted italic py-2 text-center"
                  >
                    nothing to show
                  </td>
                </tr>
              ) : (
                localRows.map((rowData, idx) => {
                  const attached = rowData.fileUrl && rowData.fileUrl !== "";
                  const isDeleting = deletingId === rowData._apiId;
                  const isEditing = editingId === rowData._apiId;
                  const isUpdating = updatingId === rowData._apiId;
                  return (
                    <tr
                      key={rowData._apiId ?? idx}
                      style={{
                        background: isDeleting ? "#fff5f5" : isEditing ? "#f0f9ff" : "#fff",
                        transition: "background .1s",
                      }}
                      onMouseEnter={(e) => { if (!isDeleting && !isEditing) e.currentTarget.style.background = "#fafafa"; }}
                      onMouseLeave={(e) => { if (!isDeleting && !isEditing) e.currentTarget.style.background = "#fff"; }}
                    >
                      {fields.map((f) => (
                        <td key={f.key} className="border-t border-secondary px-2.5 py-2 align-middle">
                          {isEditing ? (
                            <input
                              className={inputClass}
                              value={editValues[f.key] || ""}
                              onChange={(e) =>
                                setEditValues((v) => ({ ...v, [f.key]: e.target.value }))
                              }
                            />
                          ) : (
                            <div className={inputClass} style={{ background: "#f8fafc", color: "#475569" }}>
                              {rowData[f.key] && rowData[f.key] !== "" ? rowData[f.key] : "--"}
                            </div>
                          )}
                        </td>
                      ))}
                      <td
                        ref={idx === 0 ? imgDropRef : undefined}
                        className="relative border-t border-secondary px-2.5 py-2 text-center align-middle"
                        style={{ width: 120 }}
                      >
                        <div className="flex flex-col items-center gap-1">
                          {isEditing ? (
                            <label className="inline-flex w-full cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md border border-dashed border-border bg-bg-page px-2 py-1.25 text-[9px] font-semibold text-text-muted transition-colors hover:border-status-info-blue hover:text-status-info-blue-text">
                              <Icon name="upload" size={11} />
                              <span>{editFile ? editFile.name.slice(0, 12) + "…" : attached ? "Replace file" : "Attach file"}</span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={(e) => setEditFile(e.target.files?.[0] || null)}
                              />
                            </label>
                          ) : attached ? (
                            <button
                              onClick={() => window.open(rowData.fileUrl, "_blank")}
                              className="flex items-center gap-1 rounded-[5px] border border-border-input bg-white px-2.25 py-1.25 text-[10px] font-semibold text-text hover:bg-bg-page cursor-pointer"
                              title="Open file"
                            >
                              <Icon name="file" size={13} className="text-brand" />
                              <span>View File</span>
                            </button>
                          ) : (
                            <label className="inline-flex w-15.5 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md border border-dashed border-border bg-bg-page px-2.5 py-1.25 text-[9px] font-semibold text-text-muted transition-colors hover:border-status-info-blue hover:text-status-info-blue-text">
                              <Icon name="upload" size={11} />
                              <span>no Attach found</span>
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file || !onFileUpload) return;
                                  try { await onFileUpload(file); } catch { /* ignore */ }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </td>
                      {showActionCol && (
                        <td className="border-t border-secondary px-2 py-2 text-center align-middle">
                          {rowData._apiId ? (
                            <div className="flex items-center justify-center gap-1">
                              {isEditing ? (
                                <>
                                  <button
                                    disabled={isUpdating}
                                    onClick={() => saveEdit(rowData)}
                                    className="inline-flex items-center justify-center px-2 h-6.5 rounded-md border border-green-500 text-green-700 hover:bg-green-50 disabled:opacity-40 cursor-pointer bg-white transition-colors text-[10px] font-semibold gap-1"
                                    title="Save changes"
                                  >
                                    {isUpdating ? (
                                      <Icon name="loader" size={11} className="animate-spin" />
                                    ) : (
                                      <>
                                        <Icon name="check" size={11} />
                                        Update
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={cancelEdit}
                                    className="inline-flex items-center justify-center w-6.5 h-6.5 rounded-md border border-border-input text-text-muted hover:bg-bg-page cursor-pointer bg-white transition-colors"
                                    title="Cancel"
                                  >
                                    <Icon name="x" size={11} />
                                  </button>
                                </>
                              ) : (
                                <>
                                  {onUpdateRow && (
                                    <button
                                      onClick={() => startEdit(rowData)}
                                      className="inline-flex items-center justify-center w-6.5 h-6.5 rounded-md border border-border-input text-text-muted hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 cursor-pointer bg-white transition-colors"
                                      title="Edit record"
                                    >
                                      <Icon name="pencil" size={11} />
                                    </button>
                                  )}
                                  {onDeleteRow && (
                                    <button
                                      disabled={isDeleting}
                                      onClick={() => handleDelete(rowData)}
                                      className="inline-flex items-center justify-center w-6.5 h-6.5 rounded-md border border-status-error-bg text-status-error-text hover:bg-status-error-bg disabled:opacity-40 cursor-pointer bg-white transition-colors"
                                      title="Delete record"
                                    >
                                      {isDeleting
                                        ? <Icon name="loader" size={11} className="animate-spin" />
                                        : <Icon name="trash" size={11} />}
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          ) : null}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
