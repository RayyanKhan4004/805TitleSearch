"use client";

import { useState, useRef } from "react";
import Icon from "@/components/common/icon";
import { S } from "./shared-atoms";
import IndexRow, { DOC_TYPES } from "./index-row";
import { IDX_COLS } from "./consts";

interface IndexCardProps {
  title: string;
  sub?: string;
  color?: string;
  initRows?: Record<string, string | number>[];
  accent?: string;
}

export default function IndexCard({ title, sub, color = "var(--bg-card)", initRows = [], accent = "var(--brand-primary)" }: IndexCardProps) {
  const [open, setOpen] = useState(true);
  const [rows, setRows] = useState<(Record<string, string | number> & { _id: number })[]>(initRows.map((r, i) => ({ ...r, _id: i })));
  const nextId = useRef(initRows.length);

  const addRow = () => {
    setRows(r => [...r, { _id: nextId.current++, rec: "", type: DOC_TYPES[0], instr: "", book: "", pg: "", status: "Clear" } as Record<string, string | number> & { _id: number }]);
  };

  return (
    <div className={`${S.card} overflow-hidden`}>
      <div className="flex items-center justify-between px-4 py-2.75 border-b border-secondary bg-card-header cursor-pointer" style={{ borderBottomStyle: open ? "solid" : "none" }} onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-7 rounded-sm shrink-0" style={{ background: accent }} />
          <div>
            <div className="text-[13px] font-bold text-text">{title}</div>
            {sub && <div className="text-[10px] text-text-muted mt-0.5">{sub}</div>}
          </div>
          <span className="bg-border text-text-tertiary text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1">
            {rows.length} {rows.length === 1 ? "record" : "records"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={e => { e.stopPropagation(); addRow(); setOpen(true); }} className={`${S.red} px-2.5 py-1 text-[11px] flex items-center gap-1`}>
            <Icon name="plus" size={11} />Add Row
          </button>
          <Icon name={open ? "chevDown" : "chevRight"} size={13} className="text-text-muted" />
        </div>
      </div>
      {open && (
        <div className="overflow-x-auto" style={{ background: color }}>
          <table className="w-full border-collapse" style={{ minWidth: 780 }}>
            <thead>
              <tr>
                {IDX_COLS.map((h, i) => (
                  <th key={i} className={`${S.th} ${["", "Status", "Image", "Add Code"].includes(h) ? "text-center" : "text-left"} bg-table-header`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-5 text-center text-text-muted text-[11px]">
                    No records yet — click <strong>Add Row</strong> to begin.
                  </td>
                </tr>
              ) : (
                rows.map(r => <IndexRow key={r._id} row={r} onRemove={() => setRows(rows.filter(x => x._id !== r._id))} />)
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
