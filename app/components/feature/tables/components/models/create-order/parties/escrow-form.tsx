"use client";

const inpCls = "w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none";
const lblCls = "text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block";

interface EscrowFormProps {
  escrowNo: string;
  escrowCompany: string;
  titleOffice: string;
  escrowOffice: string;
  branch: string;
  loanOfficer: string;
  lender: string;
  onEscrowNoChange: (v: string) => void;
  onEscrowCompanyChange: (v: string) => void;
  onTitleOfficeChange: (v: string) => void;
  onEscrowOfficeChange: (v: string) => void;
  onBranchChange: (v: string) => void;
  onLoanOfficerChange: (v: string) => void;
  onLenderChange: (v: string) => void;
}

export default function EscrowForm({
  escrowNo, escrowCompany, titleOffice, escrowOffice, branch, loanOfficer, lender,
  onEscrowNoChange, onEscrowCompanyChange, onTitleOfficeChange, onEscrowOfficeChange,
  onBranchChange, onLoanOfficerChange, onLenderChange,
}: EscrowFormProps) {
  return (
    <div className="bg-secondary rounded-xl p-4 border border-border">
      <div className="text-[12px] font-extrabold text-text mb-3.5 flex items-center gap-1.75">
        <div className="w-[3px] h-4 rounded-sm" style={{ background: "var(--text-tertiary)" }} />
        Escrow & Title Information
      </div>
      <div className="grid grid-cols-2 gap-3.25">
        <div>
          <label className={lblCls}>Escrow No.</label>
          <input className={inpCls} value={escrowNo} onChange={(e) => onEscrowNoChange(e.target.value)} placeholder="ESC-2024-001" />
        </div>
        <div>
          <label className={lblCls}>Escrow Company</label>
          <input className={inpCls} value={escrowCompany} onChange={(e) => onEscrowCompanyChange(e.target.value)} placeholder="First American Title" />
        </div>
        <div>
          <label className={lblCls}>Title Office</label>
          <input className={inpCls} value={titleOffice} onChange={(e) => onTitleOfficeChange(e.target.value)} placeholder="Title office name" />
        </div>
        <div>
          <label className={lblCls}>Escrow Office</label>
          <input className={inpCls} value={escrowOffice} onChange={(e) => onEscrowOfficeChange(e.target.value)} placeholder="Escrow company name" />
        </div>
        <div>
          <label className={lblCls}>Title Branch Review</label>
          <select className={inpCls} value={branch} onChange={(e) => onBranchChange(e.target.value)}>
            <option>South Cal</option>
            <option>North Cal</option>
            <option>Central Cal</option>
            <option>NorCal</option>
          </select>
        </div>
        <div>
          <label className={lblCls}>Loan Officer</label>
          <input className={inpCls} value={loanOfficer} onChange={(e) => onLoanOfficerChange(e.target.value)} placeholder="Loan officer name" />
        </div>
        <div>
          <label className={lblCls}>Lender / Bank</label>
          <input className={inpCls} value={lender} onChange={(e) => onLenderChange(e.target.value)} placeholder="e.g. PARKSIDE LENDING LLC" style={{ background: lender ? "var(--amber-50)" : "#fff" }} />
        </div>
      </div>
    </div>
  );
}
