"use client";

interface StepFileInfoProps {
  clientName: string;
  clientFileNo: string;
  transactionType: string;
  productType: string;
  sourceOfBusiness: string;
  loanNumber: string;
  salePrice: string | undefined;
  loanAmount: string | undefined;
  onClientNameChange: (v: string) => void;
  onClientFileNoChange: (v: string) => void;
  onTransactionTypeChange: (v: string) => void;
  onProductTypeChange: (v: string) => void;
  onSourceOfBusinessChange: (v: string) => void;
  onLoanNumberChange: (v: string) => void;
}

const inpCls = "w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none";
const lblCls = "text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block";

export default function StepFileInfo({
  clientName, clientFileNo, transactionType, productType, sourceOfBusiness, loanNumber, salePrice, loanAmount,
  onClientNameChange, onClientFileNoChange, onTransactionTypeChange, onProductTypeChange, onSourceOfBusinessChange, onLoanNumberChange,
}: StepFileInfoProps) {
  return (
    <div className="p-4.5 overflow-y-auto flex-1">
      <div className="bg-secondary rounded-xl p-4 border border-border">
        <div className="text-[13px] font-bold text-text mb-3.5">File Information</div>
        <div className="grid grid-cols-3 gap-3.25">
          <div>
            <label className={lblCls}>Client Name</label>
            <select className={inpCls} value={clientName} onChange={(e) => onClientNameChange(e.target.value)}>
              <option>Select Client</option>
              <option>ABC Title</option>
              <option>XYZ Escrow</option>
            </select>
          </div>
          <div>
            <label className={lblCls}>Client File No</label>
            <input className={inpCls} value={clientFileNo} onChange={(e) => onClientFileNoChange(e.target.value)} placeholder="File number" />
          </div>
          <div>
            <label className={lblCls}>Transaction Type</label>
            <select className={inpCls} value={transactionType} onChange={(e) => onTransactionTypeChange(e.target.value)}>
              <option>Sale</option>
              <option>Refinance</option>
              <option>Construction</option>
            </select>
          </div>
          <div>
            <label className={lblCls}>Product Type</label>
            <input className={inpCls} value={productType} onChange={(e) => onProductTypeChange(e.target.value)} placeholder="Product type" />
          </div>
          <div>
            <label className={lblCls}>Source of Business</label>
            <input className={inpCls} value={sourceOfBusiness} onChange={(e) => onSourceOfBusinessChange(e.target.value)} placeholder="Source" />
          </div>
          <div>
            <label className={lblCls}>Sale Price</label>
            <input className={`${inpCls} bg-[#fffbeb]`} value={salePrice || ""} readOnly placeholder="$0.00" />
          </div>
          <div>
            <label className={lblCls}>Loan Amount</label>
            <input className={`${inpCls} bg-[#fffbeb]`} value={loanAmount || ""} readOnly placeholder="$0.00" />
          </div>
          <div>
            <label className={lblCls}>Loan Number</label>
            <input className={inpCls} value={loanNumber} onChange={(e) => onLoanNumberChange(e.target.value)} placeholder="Loan #" />
          </div>
        </div>
      </div>
    </div>
  );
}
