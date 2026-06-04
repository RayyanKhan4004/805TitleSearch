"use client";

const inpCls = "w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none";
const lblCls = "text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block";

const ENTITY_OPTS = ["Individual", "Trust", "Corporation", "LLC", "Partnership", "Estate", "Non-Profit"];
const VESTING_OPTS = ["Community Property", "Joint Tenants", "Tenants in Common", "Sole and Separate", "Trust", "Corporation", "LLC", "Partnership"];

interface BuyerFormProps {
  first: string;
  last: string;
  mid: string;
  entity: string;
  vest: string;
  phone: string;
  email: string;
  addr: string;
  city: string;
  state: string;
  zip: string;
  onFirstChange: (v: string) => void;
  onLastChange: (v: string) => void;
  onMidChange: (v: string) => void;
  onEntityChange: (v: string) => void;
  onVestChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onAddrChange: (v: string) => void;
  onCityChange: (v: string) => void;
  onStateChange: (v: string) => void;
  onZipChange: (v: string) => void;
  onAdd: () => void;
  count: number;
}

export default function BuyerForm({
  first, last, mid, entity, vest, phone, email, addr, city, state, zip,
  onFirstChange, onLastChange, onMidChange, onEntityChange, onVestChange,
  onPhoneChange, onEmailChange, onAddrChange, onCityChange, onStateChange, onZipChange,
  onAdd, count,
}: BuyerFormProps) {
  return (
    <div className="bg-secondary rounded-xl p-4 border border-border">
      <div className="flex items-center justify-between mb-3.5">
        <div className="text-[12px] font-extrabold text-text flex items-center gap-1.75">
          <div className="w-[3px] h-4 bg-brand rounded-sm" />
          Buyer Information
        </div>
        <span className="text-[10px] text-text-muted">Add multiple buyers using the button below</span>
      </div>
      <div className="grid grid-cols-[1fr_1fr_100px] gap-2.75 mb-2.75">
        <div>
          <label className={lblCls}>First Name</label>
          <input className={inpCls} value={first} onChange={(e) => onFirstChange(e.target.value)} placeholder="John" />
        </div>
        <div>
          <label className={lblCls}>Last Name</label>
          <input className={inpCls} value={last} onChange={(e) => onLastChange(e.target.value)} placeholder="Doe" />
        </div>
        <div>
          <label className={lblCls}>Middle / Suffix</label>
          <input className={inpCls} value={mid} onChange={(e) => onMidChange(e.target.value)} placeholder="D. / Jr." />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.75 mb-2.75">
        <div>
          <label className={lblCls}>Entity Type</label>
          <select className={inpCls} value={entity} onChange={(e) => onEntityChange(e.target.value)}>
            {ENTITY_OPTS.map((o) => (<option key={o}>{o}</option>))}
          </select>
        </div>
        <div>
          <label className={lblCls}>How Title Will Be Held (Vesting)</label>
          <select className={inpCls} value={vest} onChange={(e) => onVestChange(e.target.value)}>
            {VESTING_OPTS.map((o) => (<option key={o}>{o}</option>))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.75 mb-2.75">
        <div>
          <label className={lblCls}>Phone</label>
          <input className={inpCls} value={phone} onChange={(e) => onPhoneChange(e.target.value)} placeholder="(555) 000-0000" />
        </div>
        <div>
          <label className={lblCls}>Email</label>
          <input className={inpCls} value={email} onChange={(e) => onEmailChange(e.target.value)} placeholder="buyer@email.com" type="email" />
        </div>
      </div>
      <div className="grid grid-cols-[2fr_1fr_80px_100px] gap-2.75 mb-2.75">
        <div>
          <label className={lblCls}>Mailing Address</label>
          <input className={inpCls} value={addr} onChange={(e) => onAddrChange(e.target.value)} placeholder="Street address" />
        </div>
        <div>
          <label className={lblCls}>City</label>
          <input className={inpCls} value={city} onChange={(e) => onCityChange(e.target.value)} placeholder="City" />
        </div>
        <div>
          <label className={lblCls}>State</label>
          <select className={inpCls} value={state} onChange={(e) => onStateChange(e.target.value)}>
            {["CA", "NV", "AZ", "TX", "OR", "WA"].map((s) => (<option key={s}>{s}</option>))}
          </select>
        </div>
        <div>
          <label className={lblCls}>Zip</label>
          <input className={inpCls} value={zip} onChange={(e) => onZipChange(e.target.value)} placeholder="92692" />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.25 bg-brand text-white border-none rounded-lg px-4 py-1.5 text-[11px] font-semibold cursor-pointer hover:bg-brand/90"
        >
          + Add Buyer
        </button>
        {count > 0 && (
          <span className="text-[11px] text-text-tertiary self-center">{count} buyer{count > 1 ? "s" : ""} added</span>
        )}
      </div>
    </div>
  );
}
