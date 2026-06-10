"use client";

import { useState } from "react";
import Icon from "@/components/common/icon";
import type { UploadCatField } from "./temp";

interface SectionFieldsCardProps {
  title: string;
  sub: string;
  accent: string;
  fields: UploadCatField[];
  values: Record<string, string>;
}

function fieldValue(fields: UploadCatField[], key: string, values: Record<string, string>): string {
  const f = fields.find((x) => x.key === key);
  if (!f) return values[key] || "";
  const v = values[key];
  if (!v || v === "") return "—";
  return v;
}

export default function SectionFieldsCard({
  title,
  sub,
  accent,
  fields,
  values,
}: SectionFieldsCardProps) {
  const [open, setOpen] = useState(true);
  const nonEmpty = fields.filter((f) => values[f.key] && values[f.key] !== "");

  return (
    <div className="bg-white border border-border rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-2.75 cursor-pointer select-none"
        style={{
          borderBottom: open ? "1px solid var(--border-secondary)" : "none",
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
            <div className="text-[13px] font-bold text-text">{title}</div>
            <div className="text-[10px] text-text-muted mt-0.5">{sub}</div>
          </div>
          {nonEmpty.length > 0 && (
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-1"
              style={{
                background: `${accent}18`,
                color: accent,
                border: `1px solid ${accent}44`,
              }}
            >
              {nonEmpty.length} field{nonEmpty.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <Icon
          name={open ? "chevDown" : "chevRight"}
          size={13}
          className="text-text-muted"
        />
      </div>

      {open && (
        <div className="flex flex-col gap-2.5 p-4">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`,
            }}
          >
            {fields.map((f) => (
              <div
                key={f.key}
                className="border border-border rounded-lg px-3 py-2.5 bg-white"
              >
                <div className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-0.5">
                  {f.label}
                </div>
                <div className="text-[11px] font-semibold text-text whitespace-pre-wrap leading-[1.4]">
                  {fieldValue(fields, f.key, values)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
