"use client";

const inpCls =
  "w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none";
const lblCls =
  "text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block";
const VESTING_OPTS = [
  "Community Property",
  "Joint Tenants",
  "Tenants in Common",
  "Sole and Separate",
  "Trust",
  "Corporation",
  "LLC",
  "Partnership",
];
const DEED_OPTS = [
  "Grant Deed",
  "Quitclaim Deed",
  "Trustee's Deed",
  "Trustee's Deed Upon Rec. of Sale",
  "Warranty Deed",
];

interface SellerFormProps {
  prefillName: string;
  first: string;
  last: string;
  mid: string;
  vest: string;
  deedType: string;
  phone: string;
  email: string;
  addr: string;
  docNo: string;
  onFirstChange: (v: string) => void;
  onLastChange: (v: string) => void;
  onMidChange: (v: string) => void;
  onVestChange: (v: string) => void;
  onDeedTypeChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onAddrChange: (v: string) => void;
  onDocNoChange: (v: string) => void;
  onAdd: () => void;
  count: number;
}

export default function SellerForm({
  prefillName,
  first,
  last,
  mid,
  vest,
  deedType,
  phone,
  email,
  addr,
  docNo,
  onFirstChange,
  onLastChange,
  onMidChange,
  onVestChange,
  onDeedTypeChange,
  onPhoneChange,
  onEmailChange,
  onAddrChange,
  onDocNoChange,
  onAdd,
  count,
}: SellerFormProps) {
  return (
    <div className="flex flex-col gap-3.5">
      {prefillName && (
        <div className="flex items-center gap-1.75 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2">
          <span className="text-[11px] text-amber-800 font-medium">
            Seller pre-filled from DataTree: <strong>{prefillName}</strong>
          </span>
        </div>
      )}
      <div className="bg-secondary rounded-xl p-4 border border-border">
        <div className="flex items-center justify-between mb-3.5">
          <div className="text-[12px] font-extrabold text-text flex items-center gap-1.75">
            <div
              className="w-[3px] h-4 rounded-sm"
              style={{ background: "var(--search-source-datatree)" }}
            />
            Seller Information
          </div>
          <span className="text-[10px] text-text-muted">
            Add multiple sellers using the button below
          </span>
        </div>
        <div className="grid grid-cols-[1fr_1fr_100px] gap-2.75 mb-2.75">
          <div>
            <label className={lblCls}>First Name</label>
            <input
              className={inpCls}
              value={first}
              onChange={(e) => onFirstChange(e.target.value)}
              placeholder="Michael"
            />
          </div>
          <div>
            <label className={lblCls}>Last Name</label>
            <input
              className={inpCls}
              value={last}
              onChange={(e) => onLastChange(e.target.value)}
              placeholder="Smith"
            />
          </div>
          <div>
            <label className={lblCls}>Middle / Suffix</label>
            <input
              className={inpCls}
              value={mid}
              onChange={(e) => onMidChange(e.target.value)}
              placeholder="A. / Sr."
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.75 mb-2.75">
          <div>
            <label className={lblCls}>Current Vesting (from Deed)</label>
            <select
              className={inpCls}
              value={vest}
              onChange={(e) => onVestChange(e.target.value)}
            >
              {VESTING_OPTS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={lblCls}>Deed Type</label>
            <select
              className={inpCls}
              value={deedType}
              onChange={(e) => onDeedTypeChange(e.target.value)}
            >
              {DEED_OPTS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.75 mb-2.75">
          <div>
            <label className={lblCls}>Phone</label>
            <input
              className={inpCls}
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="(555) 000-0000"
            />
          </div>
          <div>
            <label className={lblCls}>Email</label>
            <input
              className={inpCls}
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="seller@email.com"
              type="email"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.75 mb-3.5">
          <div>
            <label className={lblCls}>Mailing Address</label>
            <input
              className={inpCls}
              value={addr}
              onChange={(e) => onAddrChange(e.target.value)}
              placeholder="Street address (if different from property)"
            />
          </div>
          <div>
            <label className={lblCls}>Recorded Doc No.</label>
            <input
              className={inpCls}
              value={docNo}
              onChange={(e) => onDocNoChange(e.target.value)}
              placeholder="e.g. 2021.70877"
              style={{ background: docNo ? "var(--amber-50)" : "#fff" }}
            />
          </div>
        </div>

        // Add SSN / Tax ID (last 4)
        <div className="grid grid-cols-2 gap-2.75 mb-3.5">
          <div>
            <label className={lblCls}>SSN / Tax ID (last 4)</label>
            <input
              className={inpCls}
              value={""}
              onChange={(e) => {}}
              placeholder="0000"
              type="password"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1.25 text-white border-none rounded-lg px-4 py-1.5 text-[11px] font-semibold cursor-pointer"
            style={{ background: "var(--search-source-datatree)" }}
          >
            + Add Seller
          </button>
          {count > 0 && (
            <span className="text-[11px] text-text-tertiary self-center">
              {count} seller{count > 1 ? "s" : ""} added
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
