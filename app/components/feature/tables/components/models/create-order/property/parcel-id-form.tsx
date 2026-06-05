"use client";

import type { PropertyForm } from "@/app/components/feature/tables/types";

interface ParcelIdFormProps {
  form: PropertyForm;
  onChange: (k: keyof PropertyForm, v: string) => void;
}

const inpCls = "w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none";
const lblCls = "text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block";

export default function ParcelIdForm({ form, onChange }: ParcelIdFormProps) {
  return (
    <div className="bg-secondary rounded-xl p-4 border border-border">
      <div className="text-[12px] font-extrabold text-text mb-3.5 flex items-center gap-1.75">
        <div className="w-[3px] h-4 rounded-sm" style={{ background: "var(--search-source-datatree)" }} />
        Parcel ID
      </div>
      {(["apn1", "apn2", "apn3", "apn4"] as const).map((k, i) => (
        <div key={k} className="mb-2.25">
          <label className={lblCls}>APN {i + 1}</label>
          <input className={inpCls} value={form[k]} onChange={(e) => onChange(k, e.target.value)} placeholder="e.g. 808-631-06" />
        </div>
      ))}
    </div>
  );
}
