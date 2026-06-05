"use client";

interface FullAddressSearchProps {
  value: string;
  onChange: (v: string) => void;
}

const inpCls = "w-full border border-border-input rounded-lg px-3 py-2 text-[12px] text-text bg-white outline-none box-border";
const lblCls = "text-[10px] font-bold text-text-secondary mb-1 block uppercase tracking-[0.05em]";

export default function FullAddressSearch({ value, onChange }: FullAddressSearchProps) {
  return (
    <div>
      <label className={lblCls}>Full Address (Street, City, State, Zip)</label>
      <input className={inpCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder="e.g. 27901 ENCANTO, MISSION VIEJO, CA 92692" />
    </div>
  );
}
