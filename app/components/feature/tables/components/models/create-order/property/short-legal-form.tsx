"use client";

import type { PropertyForm } from "@/app/components/feature/tables/types";

interface ShortLegalFormProps {
  form: PropertyForm;
  onChange: (k: keyof PropertyForm, v: string) => void;
}

const inpCls = "w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none";
const lblCls = "text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block";

export default function ShortLegalForm({ form, onChange }: ShortLegalFormProps) {
  return (
    <div className="bg-secondary rounded-xl p-4 border border-border">
      <div className="text-[12px] font-extrabold text-text mb-3.5 flex items-center gap-1.75">
        <div className="w-[3px] h-4 rounded-sm" style={{ background: "var(--search-source-pacer)" }} />
        Short Legal
      </div>
      <textarea
        rows={5}
        value={form.shortLegal}
        onChange={(e) => onChange("shortLegal", e.target.value)}
        className={`${inpCls} resize-none font-mono leading-relaxed`}
        placeholder="Short legal description…"
      />
      <div className="grid grid-cols-2 gap-2.25 mt-2.25">
        <div>
          <label className={lblCls}>Municipality</label>
          <select className={inpCls} value={form.municipality} onChange={(e) => onChange("municipality", e.target.value)}>
            <option>City</option>
            <option>Township</option>
            <option>Unincorporated</option>
          </select>
        </div>
        <div>
          <label className={lblCls}>Jurisdiction</label>
          <input className={inpCls} value={form.jurisdiction} onChange={(e) => onChange("jurisdiction", e.target.value)} />
        </div>
      </div>
    </div>
  );
}
