"use client";

import type { PropertyForm } from "@/app/components/feature/tables/types";

interface VestingFormProps {
  form: PropertyForm;
  onChange: (k: keyof PropertyForm, v: string) => void;
}

const inpCls = "w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none";
const lblCls = "text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block";

const VESTING_OPTS = [
  "Community Property", "Joint Tenants", "Tenants in Common",
  "Sole and Separate", "Trust", "Corporation", "LLC", "Partnership",
];

const LAND_USE_OPTS = [
  "Single Family Residential", "Multi-Family Residential", "Condominium",
  "Planned Unit Development", "Commercial", "Industrial", "Vacant Land",
];

export default function VestingForm({ form, onChange }: VestingFormProps) {
  return (
    <div className="bg-secondary rounded-xl p-4 border border-border">
      <div className="text-[12px] font-extrabold text-text mb-3.5 flex items-center gap-1.75">
        <div className="w-[3px] h-4 rounded-sm" style={{ background: "var(--status-success-emerald)" }} />
        Assessor Vesting
      </div>
      <textarea
        rows={3}
        value={form.vestingText}
        onChange={(e) => onChange("vestingText", e.target.value)}
        className={`${inpCls} resize-none font-mono leading-relaxed mb-2.25`}
        placeholder="Owner name as on assessor roll"
      />
      <div className="mb-2.25">
        <label className={lblCls}>Vesting Type</label>
        <select className={inpCls} value={form.vestingType} onChange={(e) => onChange("vestingType", e.target.value)}>
          {VESTING_OPTS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={lblCls}>Land Use</label>
        <select className={inpCls} value={form.landUse} onChange={(e) => onChange("landUse", e.target.value)}>
          {LAND_USE_OPTS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
