"use client";

import { useState, useRef, useEffect, Fragment, type ReactNode } from "react";
import Icon from "@/components/common/icon";
import { Card, CardTitle, CardDescription } from "@/components/ui";
import IndexRow from "./index-row";
import { IDX_COLS } from "./consts";
import { DOC_TITLES } from "./temp";
import { LEGEND_ITEMS, scheme } from "./schemes";
import "./styles/entity-colors.css";

interface IndexCardProps {
  title: string;
  sub?: string;
  color?: string;
  initRows?: Record<string, any>[];
  accent?: string;
  allowAddRow?: boolean;
  showCode?: boolean;
  onFileUpload?: (file: File) => Promise<string>;
  onDeleteRow?: (apiId: number) => Promise<void>;
  onUpdateRow?: (apiId: number, values: Record<string, string>, file?: File | null) => Promise<void>;
}

export default function IndexCard({
  title,
  sub,
  color = "var(--bg-card)",
  initRows = [],
  accent = "var(--brand-primary)",
  allowAddRow = false,
  showCode = false,
  onFileUpload,
  onDeleteRow,
  onUpdateRow,
}: IndexCardProps) {
  const [open, setOpen] = useState(true);
  const [rows, setRows] = useState<(Record<string, any> & { _id: string; parentInstr: string | null })[]>(
    initRows.map((r, i) => ({ ...r, _id: String(i), parentInstr: r.parentInstr || null }))
  );
  const nextId = useRef(initRows.length);

  useEffect(() => {
    if (initRows.length > 0) {
      setRows(initRows.map((r, i) => ({ ...r, _id: String(i), parentInstr: r.parentInstr || null })));
      nextId.current = initRows.length;
    }
  }, [initRows]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [codeOpen, setCodeOpen] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [sectionCodes, setSectionCodes] = useState<string[]>([]);

  const instrToId: Record<string, string> = {};
  rows.forEach((r) => {
    if (r.instr) instrToId[r.instr] = r._id;
  });

  const roots = rows.filter((r) => !r.parentInstr || !instrToId[r.parentInstr]);
  const childrenOf = (parentId: string) =>
    rows.filter((r) => r.parentInstr && instrToId[r.parentInstr] === parentId);

  const addRoot = () => {
    setRows((r) => [
      ...r,
      {
        _id: String(nextId.current++),
        rec: "",
        abbr: "GD",
        entity: "XFER",
        docTitle: DOC_TITLES[0],
        instr: "",
        book: "",
        pg: "",
        grantor: "",
        grantee: "",
        parentInstr: null,
      },
    ]);
  };

  const addChild = (parentRow: any) => {
    setRows((r) => [
      ...r,
      {
        _id: String(nextId.current++),
        rec: "",
        abbr: "GD",
        entity: parentRow.entity || "XFER",
        docTitle: DOC_TITLES[0],
        instr: "",
        book: "",
        pg: "",
        grantor: "",
        grantee: "",
        parentInstr: parentRow.instr || "__parent_" + parentRow._id,
      },
    ]);
  };

  const removeRow = (id: string) => {
    const childIds = rows.filter((r) => instrToId[r.parentInstr || ""] === id).map((r) => r._id);
    setRows((r) => r.filter((x) => x._id !== id && !childIds.includes(x._id)));
  };

  const toggleCollapse = (id: string) => {
    setCollapsed((c) => ({ ...c, [id]: !c[id] }));
  };

  const totalCount = rows.length;
  const parentCount = roots.length;

  const renderRows = (rowList: any[], depth = 0): ReactNode =>
    rowList.map((row) => {
      const kids = childrenOf(row._id);
      const hasKids = kids.length > 0;
      const isCollapsed = collapsed[row._id];
      const indent = depth * 28;
      const s = scheme(row.entity || "MISC", depth);

      return (
        <Fragment key={row._id}>
          <tr
            style={{ background: s.bg, transition: "background .1s", borderLeft: `4px solid ${s.border}` }}
            onMouseEnter={(e) => (e.currentTarget.style.background = s.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = s.bg)}
          >
            <td
              className="border-t border-secondary px-2.5 py-2 text-center align-middle"
              style={{ width: 30 + indent, paddingLeft: indent + 4 }}
            >
              <div className="flex items-center justify-center gap-0.5">
                {hasKids ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleCollapse(row._id); }}
                    title={isCollapsed ? "Expand children" : "Collapse children"}
                    className="flex items-center justify-center shrink-0 rounded-sm cursor-pointer"
                    style={{
                      width: 14,
                      height: 14,
                      border: `1px solid ${s.border}44`,
                      background: s.bg,
                      fontSize: 9,
                      fontWeight: 700,
                      color: s.border,
                      padding: 0,
                    }}
                  >
                    {isCollapsed ? "+" : "−"}
                  </button>
                ) : depth > 0 ? (
                  <div
                    className="shrink-0"
                    style={{ width: 6, height: 6, borderRadius: "50%", background: s.border, marginRight: 2 }}
                  />
                ) : null}
                <input
                  type="checkbox"
                  defaultChecked
                  className="cursor-pointer"
                  style={{ accentColor: s.border, width: 12, height: 12 }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </td>
            <IndexRow
              row={row}
              onAddChild={() => addChild(row)}
              onRemove={() => removeRow(row._id)}
              onDelete={
                onDeleteRow && row.apiId != null
                  ? () => onDeleteRow(row.apiId as number)
                  : undefined
              }
              onUpdate={
                onUpdateRow && row.apiId != null
                  ? (values, file) => onUpdateRow(row.apiId as number, values, file)
                  : undefined
              }
              depth={depth}
              onFileUpload={onFileUpload}
            />
          </tr>
          {hasKids && !isCollapsed && renderRows(kids, depth + 1)}
          {hasKids && !isCollapsed && (
            <tr
              key={row._id + "_addchild"}
              style={{ background: s.bg, borderLeft: `4px solid ${s.border}55` }}
            >
              <td
                colSpan={10}
                style={{ paddingLeft: indent + 28 + 8, paddingTop: 3, paddingBottom: 3 }}
              >
                <button
                  onClick={() => addChild(row)}
                  className="inline-flex items-center gap-1 rounded-sm cursor-pointer"
                  style={{
                    border: `1px dashed ${s.border}88`,
                    borderRadius: 5,
                    padding: "2px 10px",
                    fontSize: 9,
                    fontWeight: 600,
                    color: s.border,
                    background: "none",
                    transition: "all .15s",
                  }}
                >
                  <Icon name="plus" size={9} />
                  Add trailing document
                </button>
              </td>
            </tr>
          )}
        </Fragment>
      );
    });

  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-2.75 cursor-pointer"
        style={{
          borderBottom: open ? "1px solid #f1f5f9" : "none",
          background: "#fafafa",
        }}
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-0.75 h-7 rounded-sm shrink-0" style={{ background: accent }} />
          <div>
            <CardTitle>{title}</CardTitle>
            {sub && <CardDescription>{sub}</CardDescription>}
          </div>
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1"
            style={{ background: "#f1f5f9", color: "#64748b" }}
          >
            {parentCount} parent{parentCount !== 1 ? "s" : ""}
            {totalCount > parentCount ? ` \u00b7 ${totalCount - parentCount} trailing` : ""}
          </span>
        </div>
        <div className="flex items-center gap-1.75">
          {allowAddRow && (
            <button
              onClick={(e) => { e.stopPropagation(); addRoot(); setOpen(true); }}
              className="inline-flex items-center gap-1 rounded-lg text-white text-[11px] font-semibold cursor-pointer border-none"
              style={{ background: accent, padding: "4px 11px" }}
            >
              <Icon name="plus" size={11} />
              Add Row
            </button>
          )}
          {showCode && (
            <button
              onClick={(e) => { e.stopPropagation(); setCodeOpen((v) => !v); setOpen(true); }}
              title="Add code"
              className="inline-flex items-center gap-1 rounded-lg text-[11px] font-semibold cursor-pointer"
              style={{
                padding: "4px 10px",
                border: "1px solid",
                transition: "all .15s",
                borderColor: codeOpen ? accent : "#dbe2ea",
                background: codeOpen ? `${accent}14` : "#fff",
                color: codeOpen ? accent : "#475569",
              }}
            >
              <Icon name="plus" size={11} />
              Code
            </button>
          )}
          <Icon name={open ? "chevDown" : "chevRight"} size={13} style={{ color: "#94a3b8" }} />
        </div>
      </div>

      {showCode && codeOpen && open && (
        <div
          className="flex flex-col gap-1.75"
          style={{ padding: "8px 16px", background: `${accent}08`, borderBottom: `1px solid ${accent}22` }}
        >
          <div className="flex items-center gap-1.75">
            <input
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && codeInput.trim()) {
                  setSectionCodes((c) => [...c, codeInput.trim()]);
                  setCodeInput("");
                }
              }}
              placeholder="Enter code\u2026 (Enter to add)"
              className="flex-1 text-[11px] border border-[#dbe2ea] rounded-lg px-2.5 py-1.25 outline-none bg-white text-[#1e293b]"
            />
            <button
              onClick={() => {
                if (codeInput.trim()) {
                  setSectionCodes((c) => [...c, codeInput.trim()]);
                  setCodeInput("");
                }
              }}
              className="text-white text-[11px] font-semibold px-3.5 py-1.25 rounded-lg border-none cursor-pointer"
              style={{ background: accent }}
            >
              Add
            </button>
          </div>
          {sectionCodes.length > 0 && (
            <div className="flex flex-wrap gap-1.25">
              {sectionCodes.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full"
                  style={{
                    background: "#fff",
                    border: `1px solid ${accent}55`,
                    color: accent,
                    padding: "3px 9px",
                  }}
                >
                  {c}
                  <button
                    onClick={() => setSectionCodes(sectionCodes.filter((_, j) => j !== i))}
                    className="bg-transparent border-none cursor-pointer p-0"
                    style={{ color: accent, fontSize: 12, lineHeight: 1, opacity: 0.6 }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {open && initRows.length > 0 && (
        <div
          className="flex flex-wrap gap-1.5 px-4 py-2"
          style={{ background: "#fafafa", borderBottom: "1px solid #f1f5f9" }}
        >
          {LEGEND_ITEMS.map(({ label, bg, border }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.25 text-[9px] font-bold px-2 py-0.5 rounded-md"
              style={{
                background: bg,
                border: `1px solid ${border}55`,
                borderLeft: `3px solid ${border}`,
                color: border,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="overflow-x-auto" style={{ background: color }}>
          <table className="w-full border-collapse" style={{ minWidth: 820 }}>
            <thead>
              <tr>
                {IDX_COLS.map((h, i) => (
                  <th
                    key={i}
                    className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider border-b border-secondary px-2.5 py-2"
                    style={{
                      textAlign: ["", "Image", "Add Code"].includes(h) ? "center" : "left",
                      whiteSpace: "nowrap",
                      background: "#f8fafc",
                    }}
                  >
                    {h}
                  </th>
                ))}
                <th
                  className="text-[10px] font-extrabold text-[#64748b] uppercase tracking-wider border-b border-secondary px-2.5 py-2 text-center"
                  style={{ background: "#f8fafc", width: 28 }}
                />
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-5 text-center text-[#94a3b8] text-[11px]"
                  >
                    No records yet.
                  </td>
                </tr>
              ) : (
                renderRows(roots)
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
