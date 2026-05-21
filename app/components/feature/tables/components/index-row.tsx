"use client";

import { useState } from "react";
import Icon from "@/components/common/icon";
import { Button, Input, Select, Badge, TableCell } from "@/components/ui";
import { DOC_TYPES } from "./consts";

function badgeStyle(status: string) {
  if (status === "Clear")
    return {
      background: "var(--status-success-bg)",
      color: "var(--status-success-text)",
    };
  if (status === "Open Lien")
    return {
      background: "var(--status-warning-bg)",
      color: "var(--status-warning-text)",
    };
  if (status === "Open")
    return {
      background: "var(--status-error-bg)",
      color: "var(--status-error-text)",
    };
  if (status === "Exception")
    return {
      background: "var(--status-warning-bg)",
      color: "var(--status-warning-text)",
    };
  if (status === "Released")
    return {
      background: "var(--status-neutral-bg)",
      color: "var(--status-neutral-text)",
    };
  return {
    background: "var(--status-info-bg)",
    color: "var(--status-info-text)",
  };
}

function rowBgColor(dtype: string): string {
  const t = dtype.toLowerCase();
  if (t.includes("deed")) return "#FEF3C7";
  if (t.includes("mortgage") || t.includes("trust")) return "#DBEAFE";
  if (t.includes("lien")) return "#FEE2E2";
  if (t.includes("reconvey") || t.includes("release") || t.includes("satisfied")) return "#D1FAE5";
  if (t.includes("easement")) return "#F3E8FF";
  if (t.includes("judgment")) return "#F1F5F9";
  return "#fff";
}

function statusToBadgeVariant(
  status: string,
): "success" | "warning" | "error" | "info" | "neutral" {
  if (status === "Clear") return "success";
  if (status === "Open Lien") return "warning";
  if (status === "Open") return "error";
  if (status === "Exception") return "warning";
  if (status === "Released") return "neutral";
  return "info";
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

  const statusOpts = [
    "Clear",
    "Open Lien",
    "Open",
    "Released",
    "Reconveyed",
    "Satisfied",
    "Exception",
  ];

  return (
    <>
      <tr className="transition-[background] duration-100 hover:brightness-[0.98]" style={{ background: rowBgColor(dtype) }}>
        <TableCell className="text-center w-8">
          <input
            type="checkbox"
            checked={chk}
            onChange={() => setChk(!chk)}
            className="accent-ui-checkbox w-3.25 h-3.25 cursor-pointer"
          />
        </TableCell>
        <TableCell className="w-[100px]">
          <Input
            size="sm"
            value={rec}
            onChange={(e) => setRec(e.target.value)}
            placeholder="MM/DD/YYYY"
          />
        </TableCell>
        <TableCell className="w-[150px]">
          <select
            value={dtype}
            onChange={(e) => setDtype(e.target.value)}
            className="text-[10px] border border-border-input rounded-[5px] px-1.5 py-1 bg-white text-text outline-none w-full cursor-pointer"
          >
            {DOC_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </TableCell>
        <TableCell>
          <div className="flex gap-1 items-center">
            <Input
              size="sm"
              value={instr}
              onChange={(e) => setInstr(e.target.value)}
              placeholder="Instrument No."
              className="flex-[2]"
            />
            <Input
              size="sm"
              value={book}
              onChange={(e) => setBook(e.target.value)}
              placeholder="Book"
              className="flex"
            />
            <Input
              size="sm"
              value={pg}
              onChange={(e) => setPg(e.target.value)}
              placeholder="Page"
              className="flex"
            />
          </div>
          {codes.length > 0 && (
            <div className="flex flex-wrap gap-0.5 mt-1">
              {codes.map((c, i) => (
                <span
                  key={i}
                  className="bg-status-info-subtle border border-status-info-blue-border text-status-info-blue text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                >
                  {c}
                  <button
                    onClick={() => setCodes(codes.filter((_, j) => j !== i))}
                    className="bg-transparent border-none cursor-pointer text-blue-300 text-[10px] leading-none p-0"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </TableCell>
        <TableCell className="text-center w-[100px]">
          <Badge
            variant={statusToBadgeVariant(status)}
            size="sm"
            className="cursor-pointer"
          >
            <select
              value={status}
              onChange={(e) => setSt(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer appearance-none"
              style={{ ...badgeStyle(status) }}
            >
              {statusOpts.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Badge>
        </TableCell>
        <TableCell className="text-center w-[110px]">
          <label className="inline-flex items-center gap-1 cursor-pointer bg-white border border-border-input rounded-md px-2 py-1 text-[10px] font-semibold text-text-secondary transition-all duration-150 hover:bg-hover">
            <Icon name="upload" size={10} />
            Replace Image
            <input type="file" className="hidden" accept="image/*,.pdf" />
          </label>
        </TableCell>
        <TableCell className="text-center w-[90px]">
          <Button
            variant={showCode ? "primary" : "secondary"}
            size="sm"
            onClick={() => setShowCode(!showCode)}
          >
            <Icon name="plus" size={10} />
            Code
          </Button>
        </TableCell>
      </tr>
      {showCode && (
        <tr className="bg-table-row-alt">
          <td colSpan={7} className="px-3 pt-1.5 pb-2 pl-11">
            <div className="flex gap-1.5 items-center">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter exception / requirement code…"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && code.trim()) {
                    setCodes([...codes, code.trim()]);
                    setCode("");
                    setShowCode(false);
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (code.trim()) {
                    setCodes([...codes, code.trim()]);
                    setCode("");
                    setShowCode(false);
                  }
                }}
              >
                Add
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCode(false);
                  setCode("");
                }}
              >
                Cancel
              </Button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export { DOC_TYPES, badgeStyle, rowBgColor };
