"use client";

import { useState, useRef } from "react";
import Icon from "@/components/common/icon";
import { Button, Card, CardHeader, CardTitle, CardDescription, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";
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
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.75 border-b border-secondary bg-card-header cursor-pointer" style={{ borderBottomStyle: open ? "solid" : "none" }} onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-7 rounded-sm shrink-0" style={{ background: accent }} />
          <div>
            <CardTitle>{title}</CardTitle>
            {sub && <CardDescription>{sub}</CardDescription>}
          </div>
          <span className="bg-border text-text-tertiary text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1">
            {rows.length} {rows.length === 1 ? "record" : "records"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={e => { e.stopPropagation(); addRow(); setOpen(true); }} size="sm">
            <Icon name="plus" size={11} />Add Row
          </Button>
          <Icon name={open ? "chevDown" : "chevRight"} size={13} className="text-text-muted" />
        </div>
      </div>
      {open && (
        <div className="overflow-x-auto" style={{ background: color }}>
          <Table className="w-full border-collapse" style={{ minWidth: 780 }}>
            <TableHeader>
              <TableRow>
                {IDX_COLS.map((h, i) => (
                  <TableHead key={i} align={["", "Status", "Image", "Add Code"].includes(h) ? "center" : "left"} className="bg-table-header">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-5 text-center text-text-muted text-[11px]">
                    No records yet — click <strong>Add Row</strong> to begin.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map(r => <IndexRow key={r._id} row={r} onRemove={() => setRows(rows.filter(x => x._id !== r._id))} />)
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
