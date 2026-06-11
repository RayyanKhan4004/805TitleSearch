"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@/components/common/icon";
import { Card, CardTitle, CardDescription } from "@/components/ui";
import type { UploadCatField } from "./temp";

interface SectionTableCardProps {
  title: string;
  sub: string;
  accent: string;
  fields: UploadCatField[];
  values: Record<string, string>;
  onFileUpload?: (file: File) => Promise<string>;
}

const inputClass =
  "w-full rounded-[5px] border border-border-input bg-white px-1.5 py-1 text-[10px] text-text outline-none";

export default function SectionTableCard({
  title,
  sub,
  accent,
  fields,
  values,
  onFileUpload,
}: SectionTableCardProps) {
  const [open, setOpen] = useState(true);
  const nonEmpty = fields.filter((f) => values[f.key] && values[f.key] !== "");
  const [showImgDrop, setShowImgDrop] = useState(false);
  const imgDropRef = useRef<HTMLTableCellElement>(null);
  useEffect(() => {
    if (!showImgDrop) return;
    const handler = (event: MouseEvent) => {
      if (
        imgDropRef.current &&
        !imgDropRef.current.contains(event.target as Node)
      ) {
        setShowImgDrop(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showImgDrop]);

  const handleExamImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (onFileUpload) {
      try {
        await onFileUpload(file);
      } catch {
        /* ignore */
      }
    }
  };
function isAllValuesEmpty(obj : any) {
  if (!obj || typeof obj !== "object") return true; // null, undefined, or not object

  const values = Object.values(obj);

  // Check if every value is null, undefined, or empty string
  return values.every((v) => v === null || v === undefined || v === "");
}
  const attached = values?.fileUrl && values.fileUrl !== "";

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
          <div
            className="w-0.75 h-7 rounded-sm shrink-0"
            style={{ background: accent }}
          />
          <div>
            <CardTitle>{title}</CardTitle>
            {sub && <CardDescription>{sub}</CardDescription>}
          </div>
          {nonEmpty.length > 0 && (
            <span
              className="text-[9px] font-semibold px-2 py-0.5 rounded-full ml-1"
              style={{ background: "#f1f5f9", color: "#64748b" }}
            >
              {nonEmpty.length} field{nonEmpty.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <Icon
          name={open ? "chevDown" : "chevRight"}
          size={13}
          style={{ color: "#94a3b8" }}
        />
      </div>

      {open && (
        <div
          className="overflow-x-auto"
          style={{ background: "var(--bg-card)" }}
        >
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
              </tr>
            </thead>
            {!isAllValuesEmpty(values) ? (
              <tbody>
                <tr
                  style={{ background: "#fff", transition: "background .1s" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fafafa")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#fff")
                  }
                >
                  {fields.map((f) => (
                    <td
                      key={f.key}
                      className="border-t border-secondary px-2.5 py-2 align-middle"
                    >
                      <div className={inputClass}>
                        {values[f.key] && values[f.key] !== ""
                          ? values[f.key]
                          : "--"}
                      </div>
                    </td>
                  ))}
                  <td
                    ref={imgDropRef}
                    className="relative border-t border-secondary px-2.5 py-2 text-center align-middle"
                    style={{ width: 110 }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      {attached ? (
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              window.open(values.fileUrl, "_blank")
                            }
                            className="flex items-center gap-1 rounded-[5px] border border-border-input bg-white px-2.25 py-1.25 text-[10px] font-semibold text-text hover:bg-bg-page cursor-pointer"
                            title="Open file"
                          >
                            <Icon
                              name="file"
                              size={13}
                              className="text-brand"
                            />
                            <span>View File</span>
                          </button>
                        </div>
                      ) : (
                        <label className="inline-flex w-15.5 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-md border border-dashed border-border bg-bg-page px-2.5 py-1.25 text-[9px] font-semibold text-text-muted transition-colors hover:border-status-info-blue hover:text-status-info-blue-text">
                          <Icon name="upload" size={11} />
                          <span> no Attach found</span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={handleExamImg}
                          />
                        </label>
                      )}
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td
                    colSpan={fields.length + 1}
                    className="text-[11px] text-text-muted italic py-2 text-center"
                  >
                    nothing to show
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      )}
    </Card>
  );
}
