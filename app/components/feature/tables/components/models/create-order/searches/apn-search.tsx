"use client";

interface ApnSearchProps {
  apnInput: string;
  zipInput: string;
  onApnChange: (v: string) => void;
  onZipChange: (v: string) => void;
}

const inpCls = "w-full border border-border-input rounded-lg px-3 py-2 text-[12px] text-text bg-white outline-none box-border";
const lblCls = "text-[10px] font-bold text-text-secondary mb-1 block uppercase tracking-[0.05em]";

export default function ApnSearch({ apnInput, zipInput, onApnChange, onZipChange }: ApnSearchProps) {
  return (
    <div className="grid grid-cols-[1fr_160px] gap-3">
      <div>
        <label className={lblCls}>APN / Parcel Number</label>
        <input className={inpCls} value={apnInput} onChange={(e) => onApnChange(e.target.value)} placeholder="e.g. 808-631-06" />
      </div>
      <div>
        <label className={lblCls}>Zip Code (optional)</label>
        <input className={inpCls} value={zipInput} onChange={(e) => onZipChange(e.target.value)} placeholder="e.g. 92692" />
      </div>
    </div>
  );
}
