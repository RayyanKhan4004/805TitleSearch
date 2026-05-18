"use client";

import { useState } from "react";
import Icon from "@/components/common/icon";
import { S } from "./shared-atoms";
import { DOC_TYPES } from "./consts";

function badgeStyle(status: string) {
  if (status === "Clear") return { background: "var(--status-success-bg)", color: "var(--status-success-text)" };
  if (status === "Open Lien") return { background: "var(--status-warning-bg)", color: "var(--status-warning-text)" };
  if (status === "Open") return { background: "var(--status-error-bg)", color: "var(--status-error-text)" };
  if (status === "Exception") return { background: "var(--status-warning-bg)", color: "var(--status-warning-text)" };
  if (status === "Released") return { background: "var(--status-neutral-bg)", color: "var(--status-neutral-text)" };
  return { background: "var(--status-info-bg)", color: "var(--status-info-text)" };
}

interface IndexRowProps {
  row: Record<string, string | number>;
  onRemove: () => void;
}

export default function IndexRow({ row, onRemove }: IndexRowProps) {
  const [chk, setChk] = useState(true);
  const [rec, setRec] = useState(String(row.rec || ""));
  const [dtype, setDtype] = useState(String(row.type || DOC_TYPES[0]));
  const [instr, setInstr] = useState(String(row.instr || ""));
  const [book, setBook] = useState(String(row.book || ""));
  const [pg, setPg] = useState(String(row.pg || ""));
  const [status, setSt] = useState(String(row.status || "Clear"));
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState("");
  const [codes, setCodes] = useState<string[]>([]);

  const statusOpts = ["Clear", "Open Lien", "Open", "Released", "Reconveyed", "Satisfied", "Exception"];
  const cellS = S.td;
  const inp10 = "text-[10px] border border-border-input rounded-[5px] px-1.5 py-1 bg-white text-text outline-none w-full";

  return (
    <>
      <tr className="bg-white transition-[background] duration-100 hover:bg-table-row-hover">
        <td className={`${cellS} text-center w-8`}>
          <input type="checkbox" checked={chk} onChange={() => setChk(!chk)} className="accent-ui-checkbox w-3.25 h-3.25 cursor-pointer" />
        </td>
        <td className={`${cellS} w-[100px]`}>
          <input value={rec} onChange={e => setRec(e.target.value)} placeholder="MM/DD/YYYY" className={inp10} />
        </td>
        <td className={`${cellS} w-[150px]`}>
          <select value={dtype} onChange={e => setDtype(e.target.value)} className={`${inp10} cursor-pointer`}>
            {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </td>
        <td className={cellS}>
          <div className="flex gap-1 items-center">
            <input value={instr} onChange={e => setInstr(e.target.value)} placeholder="Instrument No." className={`${inp10} flex-[2]`} />
            <input value={book} onChange={e => setBook(e.target.value)} placeholder="Book" className={`${inp10} flex`} />
            <input value={pg} onChange={e => setPg(e.target.value)} placeholder="Page" className={`${inp10} flex`} />
          </div>
          {codes.length > 0 && (
            <div className="flex flex-wrap gap-0.5 mt-1">
              {codes.map((c, i) => (
                <span key={i} className="bg-status-info-subtle border border-status-info-blue-border text-status-info-blue text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  {c}
                  <button onClick={() => setCodes(codes.filter((_, j) => j !== i))} className="bg-transparent border-none cursor-pointer text-blue-300 text-[10px] leading-none p-0">×</button>
                </span>
              ))}
            </div>
          )}
        </td>
        <td className={`${cellS} text-center w-[100px]`}>
          <select value={status} onChange={e => setSt(e.target.value)} className="text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-transparent cursor-pointer outline-none" style={{ ...badgeStyle(status) }}>
            {statusOpts.map(o => <option key={o}>{o}</option>)}
          </select>
        </td>
        <td className={`${cellS} text-center w-[110px]`}>
          <label className="inline-flex items-center gap-1 cursor-pointer bg-white border border-border-input rounded-md px-2 py-1 text-[10px] font-semibold text-text-secondary transition-all duration-150 hover:bg-hover">
            <Icon name="upload" size={10} />Replace Image
            <input type="file" className="hidden" accept="image/*,.pdf" />
          </label>
        </td>
        <td className={`${cellS} text-center w-[90px]`}>
          <button onClick={() => setShowCode(!showCode)} className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-2 py-1 rounded-md cursor-pointer transition-all duration-150" style={{ background: showCode ? "var(--brand-primary)" : "var(--color-white)", border: "1px solid", borderColor: showCode ? "var(--brand-primary)" : "var(--border-input)", color: showCode ? "var(--color-white)" : "var(--text-secondary)" }}>
            <Icon name="plus" size={10} />Code
          </button>
        </td>
      </tr>
      {showCode && (
        <tr className="bg-table-row-alt">
          <td colSpan={7} className="px-3 pt-1.5 pb-2 pl-11">
            <div className="flex gap-1.5 items-center">
              <input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter exception / requirement code…" className="flex-1 text-[11px] border border-border-input rounded-md px-2 py-1 outline-none bg-white text-text"
                onKeyDown={e => { if (e.key === "Enter" && code.trim()) { setCodes([...codes, code.trim()]); setCode(""); setShowCode(false); } }} />
              <button onClick={() => { if (code.trim()) { setCodes([...codes, code.trim()]); setCode(""); setShowCode(false); } }} className={`${S.red} px-3.5 py-1 text-[11px]`}>Add</button>
              <button onClick={() => { setShowCode(false); setCode(""); }} className={`${S.white} px-2.5 py-1 text-[11px]`}>Cancel</button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export { DOC_TYPES, badgeStyle };
