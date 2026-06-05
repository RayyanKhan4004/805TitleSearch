"use client";

interface PropertyIdSearchProps {
  value: string;
  onChange: (v: string) => void;
}

const inpCls = "w-full border border-border-input rounded-lg px-3 py-2 text-[12px] text-text bg-white outline-none box-border";
const lblCls = "text-[10px] font-bold text-text-secondary mb-1 block uppercase tracking-[0.05em]";

export default function PropertyIdSearch({ value, onChange }: PropertyIdSearchProps) {
  return (
    <div className="max-w-[300px]">
      <label className={lblCls}>DataTree Property ID</label>
      <input className={inpCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder="e.g. 15428964" />
    </div>
  );
}
