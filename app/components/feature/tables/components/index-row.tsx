"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/common/icon";
import {
  ABBR_MAP,
  DOC_ENTITIES,
  DOC_TITLES,
  DOC_TYPES,
} from "./consts";
import { entityStyle, rowScheme } from "./schemes";
import "./styles/entity-colors.css";

export type IndexRecord = {
  _id: string;
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
};

interface IndexRowProps {
  row: IndexRecord;
  onAddChild: () => void;
  onRemove: () => void;
  depth?: number;
  zoomed?: boolean;
}

const inputClass =
  "w-full rounded-[5px] border border-border-input bg-white px-1.5 py-1 text-[10px] text-text outline-none";

export default function IndexRow({ row, onAddChild, onRemove, depth = 0, zoomed = false }: IndexRowProps) {
  const [rec, setRec] = useState(row.rec || "");
  const [abbr, setAbbr] = useState(row.abbr || ABBR_MAP[0].abbr);
  const [grantor, setGrantor] = useState(row.grantor || "");
  const [grantee, setGrantee] = useState(row.grantee || "");
  const [instr, setInstr] = useState(row.instr || "");
  const [book, setBook] = useState(row.book || "");
  const [pg, setPg] = useState(row.pg || "");
  const [entity, setEntity] = useState(row.entity || "MISC");
  const [docTitle, setDocTitle] = useState(row.docTitle || DOC_TITLES[0]);
  const [examImg, setExamImg] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState("");
  const [codes, setCodes] = useState<string[]>([]);
  const [showImgDrop, setShowImgDrop] = useState(false);
  const [showRowMenu, setShowRowMenu] = useState(false);
  const imgDropRef = useRef<HTMLTableCellElement>(null);
  const rowMenuRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    if (!showImgDrop) return;
    const handler = (event: MouseEvent) => {
      if (imgDropRef.current && !imgDropRef.current.contains(event.target as Node)) {
        setShowImgDrop(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showImgDrop]);

  useEffect(() => {
    if (!showRowMenu) return;
    const handler = (event: MouseEvent) => {
      if (rowMenuRef.current && !rowMenuRef.current.contains(event.target as Node)) {
        setShowRowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showRowMenu]);

  const handleExamImg = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setExamImg(String(ev.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const addCode = () => {
    if (!code.trim()) return;
    setCodes((current) => [...current, code.trim()]);
    setCode("");
    setShowCode(false);
  };

  const abbrFull = ABBR_MAP.find((item) => item.abbr === abbr)?.full || "";
  const entityCss = entityStyle(entity);

  return (
    <>
      <td className="border-t border-secondary px-2.5 py-2 text-[11px] align-middle w-[92px]">
        <input
          value={rec}
          onChange={(e) => setRec(e.target.value)}
          placeholder="MM/DD/YYYY"
          className={inputClass}
        />
      </td>
      <td className="border-t border-secondary px-2.5 py-2 align-middle w-[78px]">
        <select
          value={abbr}
          onChange={(e) => setAbbr(e.target.value)}
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
        </select>
        <div className="mt-0.5 text-[9px] leading-tight text-text-muted">
          {abbrFull}
        </div>
      </td>
      <td className="border-t border-secondary px-2.5 py-2 align-middle min-w-[105px]">
        <input
          value={grantor}
          onChange={(e) => setGrantor(e.target.value)}
          placeholder="Grantor..."
          className={inputClass}
        />
      </td>
      <td className="border-t border-secondary px-2.5 py-2 align-middle min-w-[105px]">
        <input
          value={grantee}
          onChange={(e) => setGrantee(e.target.value)}
          placeholder="Grantee..."
          className={inputClass}
        />
      </td>
      <td className="border-t border-secondary px-2.5 py-2 align-middle min-w-40">
        <div className="flex items-center gap-1">
          <input
            value={instr}
            onChange={(e) => setInstr(e.target.value)}
            placeholder="Instrument No."
            className={`${inputClass} flex-[2]`}
          />
          <input
            value={book}
            onChange={(e) => setBook(e.target.value)}
            placeholder="Bk"
            className={`${inputClass} flex-1`}
          />
          <input
            value={pg}
            onChange={(e) => setPg(e.target.value)}
            placeholder="Pg"
            className={`${inputClass} flex-1`}
          />
        </div>
        {codes.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-0.75">
            {codes.map((savedCode, index) => (
              <span
                key={`${savedCode}-${index}`}
                className="inline-flex items-center gap-0.75 rounded-full border border-status-info-blue-border bg-status-info-subtle px-1.5 py-0.5 text-[9px] font-bold text-status-info-blue-text"
              >
                {savedCode}
                <button
                  onClick={() => setCodes((current) => current.filter((_, i) => i !== index))}
                  className="border-none bg-transparent p-0 text-[10px] leading-none text-status-info-blue-text/60"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        )}
      </td>
      <td className="border-t border-secondary px-2.5 py-2 align-middle min-w-[150px]">
        <select
          value={entity}
          onChange={(e) => setEntity(e.target.value)}
          className="mb-1 w-full cursor-pointer rounded-md border px-1.5 py-1 text-[10px] font-bold outline-none"
          style={entityCss}
        >
          {DOC_ENTITIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <select
          value={docTitle}
          onChange={(e) => setDocTitle(e.target.value)}
          className={`${inputClass} cursor-pointer`}
        >
          {DOC_TITLES.map((title) => (
            <option key={title}>{title}</option>
          ))}
        </select>
      </td>
      <td
        ref={imgDropRef}
        className="relative w-[110px] border-t border-secondary px-2.5 py-2 text-center align-middle"
      >
        <div className="flex flex-col items-center gap-1">
          {examImg ? (
            <div className="relative inline-block">
              <button
                onClick={() => window.open(examImg, "_blank")}
                className="block border-none bg-transparent p-0"
                title="View full size"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={examImg}
                  alt="examiner"
                  className="block h-11 w-[62px] rounded-md border border-status-info-blue-border object-cover"
                />
              </button>
              <button
                onClick={() => setExamImg(null)}
                title="Remove"
                className="absolute -right-1.25 -top-1.25 h-[15px] w-[15px] rounded-full border-none bg-brand text-[9px] leading-[15px] text-white"
              >
                x
              </button>
            </div>
          ) : (
            <label className="inline-flex w-[62px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md border border-dashed border-border bg-bg-page px-2.5 py-1.25 text-[9px] font-semibold text-text-muted transition-colors hover:border-status-info-blue hover:text-status-info-blue-text">
              <Icon name="upload" size={11} />
              <span>Attach</span>
              <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleExamImg} />
            </label>
          )}
          <button
            onClick={() => setShowImgDrop((value) => !value)}
            title="Image options"
            className="inline-flex items-center gap-0.5 rounded-[5px] border px-1.75 py-0.75 text-[9px] font-semibold transition-colors"
            style={{
              background: showImgDrop ? "var(--brand-primary)" : "var(--color-white)",
              borderColor: showImgDrop ? "var(--brand-primary)" : "var(--border-input)",
              color: showImgDrop ? "var(--color-white)" : "var(--text-secondary)",
            }}
          >
            <Icon name="file" size={9} />
            Options
            <Icon name="chevDown" size={8} />
          </button>
        </div>
        {showImgDrop && (
          <div className="absolute bottom-full left-1/2 z-[200] mb-1 min-w-[185px] -translate-x-1/2 overflow-hidden rounded-[10px] border border-border bg-white shadow-[0_8px_24px_rgba(0,0,0,.16)]">
            <div className="border-b border-light bg-table-header px-2.75 py-1.5 text-left text-[9px] font-extrabold uppercase tracking-[0.07em] text-text-muted">
              Image Options
            </div>
            <label className="flex cursor-pointer items-center gap-2 border-b border-light px-3 py-2 text-left text-[11px] font-medium text-text hover:bg-bg-page">
              <Icon name="upload" size={12} className="text-status-info-blue-text" />
              {examImg ? "Re-attach Examiner Image" : "Attach Examiner Image"}
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => {
                  handleExamImg(e);
                  setShowImgDrop(false);
                }}
              />
            </label>
            <label className="flex cursor-pointer items-center gap-2 border-b border-light px-3 py-2 text-left text-[11px] font-medium text-text hover:bg-bg-page">
              <Icon name="file" size={12} className="text-status-success-emerald" />
              Replace Image
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => {
                  handleExamImg(e);
                  setShowImgDrop(false);
                }}
              />
            </label>
            <button
              onClick={() => setShowImgDrop(false)}
              className="flex w-full items-center gap-2 border-none bg-white px-3 py-2 text-left text-[11px] font-medium text-text hover:bg-bg-page"
            >
              <Icon name="refresh" size={12} className="text-purple-700" />
              Override from Back Source
            </button>
          </div>
        )}
      </td>
      <td className="w-[70px] border-t border-secondary px-2.5 py-2 text-center align-middle">
        <button
          onClick={() => setShowCode((value) => !value)}
          className="inline-flex items-center gap-0.75 rounded-md border px-1.75 py-1 text-[10px] font-semibold transition-colors"
          style={{
            background: showCode ? "var(--brand-primary)" : "var(--color-white)",
            borderColor: showCode ? "var(--brand-primary)" : "var(--border-input)",
            color: showCode ? "var(--color-white)" : "var(--text-secondary)",
          }}
        >
          <Icon name="plus" size={10} />
          Code
        </button>
      </td>
      <td
        ref={rowMenuRef}
        className="relative w-7 border-t border-secondary px-2.5 py-2 text-center align-middle"
      >
        <button
          onClick={() => setShowRowMenu((value) => !value)}
          className="flex rounded border-none bg-transparent p-0.5 text-text-muted transition-colors hover:text-text-secondary"
        >
          <Icon name="moreV" size={13} />
        </button>
        {showRowMenu && (
          <div className="absolute right-full top-0 z-[200] mr-1 min-w-[170px] overflow-hidden rounded-[9px] border border-border bg-white shadow-[0_6px_20px_rgba(0,0,0,.14)]">
            <button
              onClick={() => {
                onAddChild();
                setShowRowMenu(false);
              }}
              className="flex w-full items-center gap-1.75 border-none border-b border-light bg-white px-3.25 py-2.25 text-left text-[11px] font-medium text-text hover:bg-bg-page"
            >
              <Icon name="plus" size={12} className="text-amber-500" />
              Add Trailing Document
            </button>
            <button
              onClick={() => {
                onRemove();
                setShowRowMenu(false);
              }}
              className="flex w-full items-center gap-1.75 border-none bg-white px-3.25 py-2.25 text-left text-[11px] font-medium text-status-error-text hover:bg-status-error-bg"
            >
              <Icon name="trash" size={12} className="text-status-error-text" />
              Remove Row
            </button>
          </div>
        )}
      </td>
      {showCode && (
        <td colSpan={10} className="hidden">
          {code}
        </td>
      )}
    </>
  );
}

export { DOC_TYPES };
