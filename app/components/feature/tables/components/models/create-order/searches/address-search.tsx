"use client";

interface AddressSearchProps {
  addrNum: string;
  addrStr: string;
  addrCity: string;
  addrState: string;
  addrZip: string;
  onNumChange: (v: string) => void;
  onStrChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onStateChange: (v: string) => void;
  onZipChange: (v: string) => void;
}

const inpCls = "w-full border border-border-input rounded-lg px-3 py-2 text-[12px] text-text bg-white outline-none box-border";
const lblCls = "text-[10px] font-bold text-text-secondary mb-1 block uppercase tracking-[0.05em]";

export default function AddressSearch({ addrNum, addrStr, addrCity, addrState, addrZip, onNumChange, onStrChange, onCityChange, onStateChange, onZipChange }: AddressSearchProps) {
  return (
    <div className="grid grid-cols-[100px_1fr_160px_80px_120px] gap-3">
      <div>
        <label className={lblCls}>House No.</label>
        <input className={inpCls} value={addrNum} onChange={(e) => onNumChange(e.target.value)} placeholder="27901" />
      </div>
      <div>
        <label className={lblCls}>Street Name</label>
        <input className={inpCls} value={addrStr} onChange={(e) => onStrChange(e.target.value)} placeholder="ENCANTO" />
      </div>
      <div>
        <label className={lblCls}>City</label>
        <input className={inpCls} value={addrCity} onChange={(e) => onCityChange(e.target.value)} placeholder="MISSION VIEJO" />
      </div>
      <div>
        <label className={lblCls}>State</label>
        <select className={inpCls} value={addrState} onChange={(e) => onStateChange(e.target.value)}>
          {["CA", "NV", "AZ", "TX", "OR", "WA"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={lblCls}>Zip Code</label>
        <input className={inpCls} value={addrZip} onChange={(e) => onZipChange(e.target.value)} placeholder="92692" />
      </div>
    </div>
  );
}
