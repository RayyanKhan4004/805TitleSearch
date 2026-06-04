"use client";

interface OwnerNameSearchProps {
  ownerName: string;
  state: string;
  onNameChange: (v: string) => void;
  onStateChange: (v: string) => void;
}

const inpCls = "w-full border border-border-input rounded-lg px-3 py-2 text-[12px] text-text bg-white outline-none box-border";
const lblCls = "text-[10px] font-bold text-text-secondary mb-1 block uppercase tracking-[0.05em]";

export default function OwnerNameSearch({ ownerName, state, onNameChange, onStateChange }: OwnerNameSearchProps) {
  return (
    <div className="grid grid-cols-[1fr_120px] gap-3">
      <div>
        <label className={lblCls}>Owner Full Name</label>
        <input className={inpCls} value={ownerName} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. SARMIENTO REYNALDO" />
      </div>
      <div>
        <label className={lblCls}>State</label>
        <select className={inpCls} value={state} onChange={(e) => onStateChange(e.target.value)}>
          {["CA", "NV", "AZ", "TX", "OR", "WA"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
