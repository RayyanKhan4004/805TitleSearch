"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/common/icon";
import toast from "react-hot-toast";
import { ABBR_MAP, DOC_ENTITIES, DOC_TITLES, DOC_TYPES } from "./temp";
import { entityStyle, rowScheme } from "./schemes";
import "./styles/entity-colors.css";

export type IndexRecord = {
  _id: string;
  apiId?: number;
  rec?: string;
  abbr?: string;
  entity?: string;
  docTitle?: string;
  instr?: string;
  book?: string;
  pg?: string;
  grantor?: string;
  grantee?: string;
  parentInstr?: string | null;
  fileUrl?: string;
};

interface IndexRowProps {
  row: IndexRecord;
  onAddChild: () => void;
  onRemove: () => void;
  onDelete?: () => Promise<void>;
  onUpdate?: (values: Record<string, string>, file?: File | null) => Promise<void>;
  depth?: number;
  zoomed?: boolean;
  onFileUpload?: (file: File) => Promise<string>;
}

const inputClass =
  "w-full rounded-[5px] border border-border-input bg-white px-1.5 py-1 text-[10px] text-text outline-none";

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?|$)/i.test(url);
}

export default function IndexRow({
  row,
  onAddChild,
  onRemove,
  onDelete,
  onUpdate,
  depth = 0,
  zoomed = false,
  onFileUpload,
}: IndexRowProps) {
  const [state, setState] = useState({
    rec: row.rec || "",
    abbr: row.abbr || ABBR_MAP[0].abbr,
    grantor: row.grantor || "",
    grantee: row.grantee || "",
    instr: row.instr || "",
    book: row.book || "",
    pg: row.pg || "",
    entity: row.entity || "MISC",
    docTitle: row.docTitle || DOC_TITLES[0],
    examImg: (row.fileUrl || null) as string | null,
    showImgDrop: false,
    showRowMenu: false,
    deleting: false,
  });
  /* Rows from the API start read-only; newly added rows (no apiId) start editable */
  const [isEditing, setIsEditing] = useState(!row.apiId);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);
  const imgDropRef = useRef<HTMLTableCellElement>(null);
  const rowMenuRef = useRef<HTMLTableCellElement>(null);

  const set = <K extends keyof typeof state>(
    key: K,
    value: (typeof state)[K],
  ) => setState((prev) => ({ ...prev, [key]: value }));

  /* Sync examImg when the parent updates row.fileUrl after initial mount */
  useEffect(() => {
    if (row.fileUrl) set("examImg", row.fileUrl);
  }, [row.fileUrl]);

  useEffect(() => {
    if (!state.showImgDrop) return;
    const handler = (event: MouseEvent) => {
      if (
        imgDropRef.current &&
        !imgDropRef.current.contains(event.target as Node)
      ) {
        set("showImgDrop", false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [state.showImgDrop]);

  useEffect(() => {
    if (!state.showRowMenu) return;
    const handler = (event: MouseEvent) => {
      if (
        rowMenuRef.current &&
        !rowMenuRef.current.contains(event.target as Node)
      ) {
        set("showRowMenu", false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [state.showRowMenu]);

  const handleExamImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (onFileUpload) {
      try {
        const url = await onFileUpload(file);
        set("examImg", url);
      } catch {
        const reader = new FileReader();
        reader.onload = (ev) => set("examImg", String(ev.target?.result || ""));
        reader.readAsDataURL(file);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => set("examImg", String(ev.target?.result || ""));
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    if (!onUpdate) return;
    setUpdating(true);
    try {
      await onUpdate(
        {
          rec: state.rec,
          abbr: state.abbr,
          grantor: state.grantor,
          grantee: state.grantee,
          instr: state.instr,
          book: state.book,
          pg: state.pg,
          entity: state.entity,
          docTitle: state.docTitle,
        },
        pendingFile,
      );
      setIsEditing(false);
      setPendingFile(null);
      toast.success("Record updated");
    } catch {
      toast.error("Failed to update record");
    } finally {
      setUpdating(false);
    }
  };

  const abbrFull =
    ABBR_MAP.find((item) => item.abbr === state.abbr)?.full || "";
  const entityCss = entityStyle(state.entity);

  const readOnlyStyle = !isEditing
    ? { background: "#f8fafc", color: "#475569", cursor: "default" }
    : {};

  return (
    <>
      <td className="border-t border-secondary px-2.5 py-2 text-[11px] align-middle w-23">
        <input
          value={state.rec}
          onChange={(e) => set("rec", e.target.value)}
          readOnly={!isEditing}
          placeholder="MM/DD/YYYY"
          className={inputClass}
          style={readOnlyStyle}
        />
      </td>
      <td className="border-t border-secondary px-2.5 py-2 align-middle w-19.5">
        <div
          className={`${inputClass} cursor-pointer font-mono font-bold text-center`}
          style={{
            color: "var(--brand-primary)",
            background: "var(--brand-primary-subtle)",
            borderColor: "#fecaca",
          }}
        >
          {state.abbr}
        </div>
        {/* <select
          value={state.abbr}
          onChange={(e) => set("abbr", e.target.value)}
          className={`${inputClass} cursor-pointer font-mono font-bold`}
          style={{
            color: "var(--brand-primary)",
            background: "var(--brand-primary-subtle)",
            borderColor: "#fecaca",
          }}
        >
          {ABBR_MAP.map((item) => (
            <option key={item.abbr} value={item.abbr}>
              {item.abbr}
            </option>
          ))}
        </select> */}
        <div className="mt-0.5 text-[9px] leading-tight text-text-muted">
          {abbrFull}
        </div>
      </td>
      <td className="border-t border-secondary px-2.5 py-2 align-middle min-w-26.25">
        <input
          value={state.grantor}
          onChange={(e) => set("grantor", e.target.value)}
          readOnly={!isEditing}
          placeholder="Grantor..."
          className={inputClass}
          style={readOnlyStyle}
        />
      </td>
      <td className="border-t border-secondary px-2.5 py-2 align-middle min-w-26.25">
        <input
          value={state.grantee}
          onChange={(e) => set("grantee", e.target.value)}
          readOnly={!isEditing}
          placeholder="Grantee..."
          className={inputClass}
          style={readOnlyStyle}
        />
      </td>
      <td className="border-t border-secondary px-2.5 py-2 align-middle min-w-40">
        <div className="flex items-center gap-1">
          <input
            value={state.instr}
            onChange={(e) => set("instr", e.target.value)}
            readOnly={!isEditing}
            placeholder="Instrument No."
            className={`${inputClass} flex-2`}
            style={readOnlyStyle}
          />
          <input
            value={state.book}
            onChange={(e) => set("book", e.target.value)}
            readOnly={!isEditing}
            placeholder="Bk"
            className={`${inputClass} flex-1`}
            style={readOnlyStyle}
          />
          <input
            value={state.pg}
            onChange={(e) => set("pg", e.target.value)}
            readOnly={!isEditing}
            placeholder="Pg"
            className={`${inputClass} flex-1`}
            style={readOnlyStyle}
          />
        </div>
      </td>
      <td className="border-t border-secondary px-2.5 py-2 align-middle min-w-37.5">
        <select
          value={state.entity}
          onChange={(e) => set("entity", e.target.value)}
          disabled={!isEditing}
          className="mb-1 w-full cursor-pointer rounded-md border px-1.5 py-1 text-[10px] font-bold outline-none"
          style={isEditing ? entityCss : { ...entityCss, cursor: "default", opacity: 0.85 }}
        >
          {DOC_ENTITIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={state.docTitle}
          onChange={(e) => set("docTitle", e.target.value)}
          disabled={!isEditing}
          className={`${inputClass} cursor-pointer`}
          style={isEditing ? {} : readOnlyStyle}
        >
          {DOC_TITLES.map((title) => (
            <option key={title}>{title}</option>
          ))}
        </select>
      </td>
      <td
        ref={imgDropRef}
        className="relative w-27.5 border-t border-secondary px-2.5 py-2 text-center align-middle"
      >
        <div className="flex flex-col items-center gap-1">
          {state.examImg ? (
            <div className="relative inline-block">
              {isImageUrl(state.examImg) ? (
                <button
                  onClick={() => window.open(state.examImg ?? undefined, "_blank")}
                  className="block border-none bg-transparent p-0"
                  title="View full size"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={state.examImg}
                    alt="examiner"
                    className="block h-11 w-15.5 rounded-md border border-status-info-blue-border object-cover"
                  />
                </button>
              ) : (
                <button
                  onClick={() => window.open(state.examImg ?? undefined, "_blank")}
                  className="flex flex-col items-center justify-center gap-0.5 rounded-md border border-status-info-blue-border bg-[#eff6ff] px-2.5 py-1.5 text-[9px] font-semibold text-status-info-blue-text cursor-pointer"
                  style={{ width: 62, height: 44 }}
                  title="Open file"
                >
                  <Icon name="file" size={16} className="text-status-info-blue-text" />
                  <span>View File</span>
                </button>
              )}
              {isEditing && (
                <button
                  onClick={() => set("examImg", null)}
                  title="Remove"
                  className="absolute -right-1.25 -top-1.25 h-3.75 w-3.75 rounded-full border-none bg-brand text-[9px] leading-3.75 text-white"
                >
                  x
                </button>
              )}
            </div>
          ) : (
            <label className="inline-flex w-15.5 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md border border-dashed border-border bg-bg-page px-2.5 py-1.25 text-[9px] font-semibold text-text-muted transition-colors hover:border-status-info-blue hover:text-status-info-blue-text">
              <Icon name="upload" size={11} />
              <span>{isEditing ? "Attach" : "No file"}</span>
              {isEditing && (
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleExamImg}
                />
              )}
            </label>
          )}
          {isEditing && (
            <label className="inline-flex cursor-pointer items-center gap-0.5 rounded-[5px] border border-dashed border-blue-300 bg-blue-50 px-1.5 py-0.75 text-[9px] font-semibold text-blue-600 transition-colors hover:bg-blue-100">
              <Icon name="upload" size={9} />
              {pendingFile ? pendingFile.name.slice(0, 10) + "…" : "Change file"}
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => setPendingFile(e.target.files?.[0] || null)}
              />
            </label>
          )}
          <button
            onClick={() => set("showImgDrop", !state.showImgDrop)}
            title="Image options"
            className="inline-flex items-center gap-0.5 rounded-[5px] border px-1.75 py-0.75 text-[9px] font-semibold transition-colors"
            style={{
              background: state.showImgDrop
                ? "var(--brand-primary)"
                : "var(--color-white)",
              borderColor: state.showImgDrop
                ? "var(--brand-primary)"
                : "var(--border-input)",
              color: state.showImgDrop
                ? "var(--color-white)"
                : "var(--text-secondary)",
            }}
          >
            <Icon name="file" size={9} />
            Options
            <Icon name="chevDown" size={8} />
          </button>
        </div>
        {state.showImgDrop && imgDropRef.current && (
          <div
            style={{
              position: "fixed",
              top: imgDropRef.current.getBoundingClientRect().top - 8,
              left:
                imgDropRef.current.getBoundingClientRect().left +
                imgDropRef.current.getBoundingClientRect().width / 2,
              transform: "translate(-50%, -100%)",
              zIndex: 9999,
              minWidth: 185,
            }}
            className="overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,.16)]"
          >
            <div className="border-b border-light bg-table-header px-2.75 py-1.5 text-left text-[9px] font-extrabold uppercase tracking-[0.07em] text-text-muted">
              Image Options
            </div>
            <label className="flex cursor-pointer items-center gap-2 border-b border-light px-3 py-2 text-left text-[11px] font-medium text-text hover:bg-bg-page">
              <Icon
                name="upload"
                size={12}
                className="text-status-info-blue-text"
              />
              {state.examImg
                ? "Re-attach Examiner Image"
                : "Attach Examiner Image"}
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => {
                  handleExamImg(e);
                  set("showImgDrop", false);
                }}
              />
            </label>
            <label className="flex cursor-pointer items-center gap-2 border-b border-light px-3 py-2 text-left text-[11px] font-medium text-text hover:bg-bg-page">
              <Icon
                name="file"
                size={12}
                className="text-status-success-emerald"
              />
              Replace Image
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => {
                  handleExamImg(e);
                  set("showImgDrop", false);
                }}
              />
            </label>
            <button
              onClick={() => set("showImgDrop", false)}
              className="flex w-full items-center gap-2 border-none bg-white px-3 py-2 text-left text-[11px] font-medium text-text hover:bg-bg-page"
            >
              <Icon name="refresh" size={12} className="text-purple-700" />
              Override from Back Source
            </button>
            {onDelete && (
              <button
                disabled={state.deleting}
                onClick={async () => {
                  set("showImgDrop", false);
                  set("deleting", true);
                  try {
                    await onDelete();
                    onRemove();
                  } catch {
                    set("deleting", false);
                  }
                }}
                className="flex w-full items-center gap-2 border-none border-t border-light bg-white px-3 py-2 text-left text-[11px] font-medium text-status-error-text hover:bg-status-error-bg disabled:opacity-40"
              >
                <Icon name="trash" size={12} className="text-status-error-text" />
                {state.deleting ? "Deleting…" : "Delete Record"}
              </button>
            )}
          </div>
        )}
      </td>
      <td
        ref={rowMenuRef}
        className="relative w-7 border-t border-secondary px-2.5 py-2 text-center align-middle"
      >
        <button
          onClick={() => set("showRowMenu", !state.showRowMenu)}
          className="flex rounded border-none bg-transparent p-0.5 text-text-muted transition-colors hover:text-text-secondary"
        >
          <Icon name="moreV" size={13} />
        </button>
        {state.showRowMenu && rowMenuRef.current && (
          <div
            style={{
              position: "fixed",
              top: rowMenuRef.current.getBoundingClientRect().top,
              left: rowMenuRef.current.getBoundingClientRect().left - 8,
              transform: "translate(-100%, 0)",
              zIndex: 9999,
              minWidth: 170,
            }}
            className="overflow-hidden rounded-[9px] border border-border bg-white shadow-[0_6px_20px_rgba(0,0,0,.14)]"
          >
            {onUpdate && row.apiId && !isEditing && (
              <button
                onClick={() => { setIsEditing(true); set("showRowMenu", false); }}
                className="flex w-full items-center gap-1.75 border-none border-b border-light bg-white px-3.25 py-2.25 text-left text-[11px] font-medium text-text hover:bg-bg-page"
              >
                <Icon name="pencil" size={12} className="text-blue-500" />
                Edit Record
              </button>
            )}
            {onUpdate && isEditing && (
              <>
                <button
                  disabled={updating}
                  onClick={async () => { set("showRowMenu", false); await handleUpdate(); }}
                  className="flex w-full items-center gap-1.75 border-none border-b border-light bg-white px-3.25 py-2.25 text-left text-[11px] font-medium text-green-700 hover:bg-green-50 disabled:opacity-40"
                >
                  <Icon name="check" size={12} className="text-green-600" />
                  {updating ? "Saving…" : "Update Record"}
                </button>
                <button
                  onClick={() => { setIsEditing(false); setPendingFile(null); set("showRowMenu", false); }}
                  className="flex w-full items-center gap-1.75 border-none border-b border-light bg-white px-3.25 py-2.25 text-left text-[11px] font-medium text-text-muted hover:bg-bg-page"
                >
                  <Icon name="x" size={12} className="text-text-muted" />
                  Cancel Edit
                </button>
              </>
            )}
            <button
              onClick={() => {
                onAddChild();
                set("showRowMenu", false);
              }}
              className="flex w-full items-center gap-1.75 border-none border-b border-light bg-white px-3.25 py-2.25 text-left text-[11px] font-medium text-text hover:bg-bg-page"
            >
              <Icon name="plus" size={12} className="text-amber-500" />
              Add Trailing Document
            </button>
            <button
              disabled={state.deleting}
              onClick={async () => {
                set("showRowMenu", false);
                if (onDelete) {
                  set("deleting", true);
                  try {
                    await onDelete();
                    onRemove();
                  } catch {
                    set("deleting", false);
                  }
                } else {
                  onRemove();
                }
              }}
              className="flex w-full items-center gap-1.75 border-none bg-white px-3.25 py-2.25 text-left text-[11px] font-medium text-status-error-text hover:bg-status-error-bg disabled:opacity-40"
            >
              <Icon name="trash" size={12} className="text-status-error-text" />
              {state.deleting ? "Deleting…" : "Delete Record"}
            </button>
          </div>
        )}
      </td>
    </>
  );
}

export { DOC_TYPES };
