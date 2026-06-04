"use client";

import type { PropertyForm } from "@/app/components/feature/tables/types";

interface LegalInfoFormProps {
  form: PropertyForm;
  onChange: (k: keyof PropertyForm, v: string) => void;
}

const inpCls = "w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none";
const lblCls = "text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block";

const FIELDS: [keyof PropertyForm, string][] = [
  ["lot", "Lot"],
  ["block", "Block"],
  ["tract", "Tract"],
  ["mapBook", "Map Book"],
  ["page", "Page"],
  ["section", "Section"],
  ["township", "Township"],
  ["range", "Range"],
];

export default function LegalInfoForm({ form, onChange }: LegalInfoFormProps) {
  return (
    <div className="bg-secondary rounded-xl p-4 border border-border">
      <div className="text-[12px] font-extrabold text-text mb-3.5 flex items-center gap-1.75">
        <div className="w-[3px] h-4 rounded-sm" style={{ background: "var(--search-source-titlepoint)" }} />
        Legal Information
      </div>
      <div className="grid grid-cols-2 gap-2.25">
        {FIELDS.map(([k, l]) => (
          <div key={k}>
            <label className={lblCls}>{l}</label>
            <input className={inpCls} value={form[k] as string} onChange={(e) => onChange(k, e.target.value)} placeholder="-" />
          </div>
        ))}
      </div>
    </div>
  );
}
