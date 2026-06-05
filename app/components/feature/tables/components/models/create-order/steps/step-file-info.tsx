"use client";

interface Props {
  form: {
    editMode: boolean;
    editOrderNo: string;
    editOpenDate: string;
    editStatus: string;
    editRush: boolean;
    clientName: string;
    clientFileNo: string;
    editClientFileNo: string;
    editSource: string;
    editCloseDate: string;
    editDelivery: string;
    editSegment: string;
    transactionType: string;
    editTransType: string;
    productType: string;
    editProductType: string;
    editUnderwriter: string;
    editSalePrice: string;
    editLoanAmt: string;
    editLoanNo: string;
    editInsuredAmt: string;
    editPremOwners: string;
    editPremLenders: string;
    editPremBinder: string;
    editOwnersPolicy: string;
    editLoanPolicy: string;
    editBinderPolicy: string;
    editEscrowRef: string;
    editTitleOfficer: string;
    editTitleOfficerEmail: string;
    editEscrowOfficer: string;
    editEscrowOfficerEmail: string;
    editTitleRep: string;
    editTitleRepEmail: string;
    editTitleRepPct: string;
    editFileSource: string;
  };
  onChange: (field: string, value: string | boolean) => void;
  salePrice?: string;
  loanAmount?: string;
}

const inp: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: 7,
  padding: "5px 9px",
  fontSize: 11,
  color: "#1e293b",
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const lbl: React.CSSProperties = {
  fontSize: 9,
  fontWeight: 700,
  color: "#94a3b8",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  marginBottom: 3,
  display: "block",
};

const sec: React.CSSProperties = {
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  padding: 18,
};

const grid3: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 13,
  marginBottom: 13,
};

const grid4: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 13,
  marginBottom: 13,
};

export default function StepFileInfo({ form, onChange, salePrice, loanAmount }: Props) {
  return (
    <div style={{ padding: 18, overflowY: "auto", flex: 1 }}>
      <div style={sec}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", marginBottom: 14 }}>
          File Information
        </div>

        {form.editMode && (
          <div style={grid3}>
            <div>
              <label style={lbl}>Order No.</label>
              <input style={{ ...inp, background: "#f8fafc", color: "#94a3b8" }} readOnly value={form.editOrderNo} />
            </div>
            <div>
              <label style={lbl}>File Open Date</label>
              <input style={inp} type="date" value={form.editOpenDate} onChange={(e) => onChange("editOpenDate", e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Status</label>
              <select style={inp} value={form.editStatus} onChange={(e) => onChange("editStatus", e.target.value)}>
                {["Open", "In Review", "In Clarification", "Closed", "Cancelled"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", border: "1px solid #e2e8f0", borderRadius: 8, background: "#fafafa", cursor: "pointer", gridColumn: "span 1" }}
              onClick={() => onChange("editRush", !form.editRush)}
            >
              <input type="checkbox" readOnly checked={form.editRush} style={{ width: 14, height: 14, accentColor: "#dc2626", cursor: "pointer" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#475569" }}>Rush File</span>
              {form.editRush && (
                <span style={{ background: "#dc2626", color: "#fff", fontSize: 9, fontWeight: 700, padding: "1px 7px", borderRadius: 999 }}>RUSH</span>
              )}
            </div>
          </div>
        )}

        <div style={grid3}>
          <div>
            <label style={lbl}>Client Name</label>
            <select style={inp} value={form.clientName} onChange={(e) => onChange("clientName", e.target.value)}>
              <option>Select Client</option>
              <option>ABC Title</option>
              <option>XYZ Escrow</option>
            </select>
          </div>
          <div>
            <label style={lbl}>Client File No</label>
            <input style={inp} value={form.editClientFileNo} onChange={(e) => onChange("editClientFileNo", e.target.value)} placeholder="File number" />
          </div>
          <div>
            <label style={lbl}>Source of Business</label>
            <input style={inp} value={form.editSource} onChange={(e) => onChange("editSource", e.target.value)} placeholder="Source" />
          </div>
        </div>

        <div style={grid3}>
          <div>
            <label style={lbl}>Estimated Closing Date</label>
            <input type="date" style={inp} value={form.editCloseDate} onChange={(e) => onChange("editCloseDate", e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Expected Delivery</label>
            <input type="date" style={inp} value={form.editDelivery} onChange={(e) => onChange("editDelivery", e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Business Segment</label>
            <select style={inp} value={form.editSegment} onChange={(e) => onChange("editSegment", e.target.value)}>
              <option value="">Select…</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Industrial</option>
              <option>Land</option>
            </select>
          </div>
        </div>

        <div style={grid3}>
          <div>
            <label style={lbl}>Transaction Type</label>
            <select style={inp} value={form.editTransType} onChange={(e) => onChange("editTransType", e.target.value)}>
              <option value="">Select…</option>
              <option>Sale</option>
              <option>Refinance</option>
              <option>Construction</option>
              <option>Loan Only/Refi</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label style={lbl}>Product Type</label>
            <input style={inp} value={form.editProductType} onChange={(e) => onChange("editProductType", e.target.value)} placeholder="e.g. PRELIM/COMMITMENT - SALE" />
          </div>
          <div>
            <label style={lbl}>Underwriter</label>
            <input style={inp} value={form.editUnderwriter} onChange={(e) => onChange("editUnderwriter", e.target.value)} placeholder="e.g. Westcor - California" />
          </div>
        </div>

        <div style={grid3}>
          <div>
            <label style={lbl}>Sale Price</label>
            <input style={{ ...inp, background: "#fffbeb" }} value={salePrice || form.editSalePrice} onChange={(e) => onChange("editSalePrice", e.target.value)} placeholder="$0.00" />
          </div>
          <div>
            <label style={lbl}>Loan Amount</label>
            <input style={{ ...inp, background: "#fffbeb" }} value={loanAmount || form.editLoanAmt} onChange={(e) => onChange("editLoanAmt", e.target.value)} placeholder="$0.00" />
          </div>
          <div>
            <label style={lbl}>Loan Number</label>
            <input style={inp} value={form.editLoanNo} onChange={(e) => onChange("editLoanNo", e.target.value)} placeholder="Loan #" />
          </div>
        </div>

        <div style={grid4}>
          <div>
            <label style={lbl}>Insured Amount</label>
            <input style={inp} value={form.editInsuredAmt} onChange={(e) => onChange("editInsuredAmt", e.target.value)} placeholder="$0.00" />
          </div>
          <div>
            <label style={lbl}>Premium — Owners</label>
            <input style={inp} value={form.editPremOwners} onChange={(e) => onChange("editPremOwners", e.target.value)} placeholder="$0.00" />
          </div>
          <div>
            <label style={lbl}>Premium — Lenders</label>
            <input style={inp} value={form.editPremLenders} onChange={(e) => onChange("editPremLenders", e.target.value)} placeholder="$0.00" />
          </div>
          <div>
            <label style={lbl}>Premium — Binder</label>
            <input style={inp} value={form.editPremBinder} onChange={(e) => onChange("editPremBinder", e.target.value)} placeholder="$0.00" />
          </div>
        </div>

        <div style={grid4}>
          <div>
            <label style={lbl}>Owners Policy No.</label>
            <input style={inp} value={form.editOwnersPolicy} onChange={(e) => onChange("editOwnersPolicy", e.target.value)} placeholder="Policy #" />
          </div>
          <div>
            <label style={lbl}>Loan Policy No.</label>
            <input style={inp} value={form.editLoanPolicy} onChange={(e) => onChange("editLoanPolicy", e.target.value)} placeholder="Policy #" />
          </div>
          <div>
            <label style={lbl}>Binder Policy No.</label>
            <input style={inp} value={form.editBinderPolicy} onChange={(e) => onChange("editBinderPolicy", e.target.value)} placeholder="Policy #" />
          </div>
          <div>
            <label style={lbl}>Escrow Co. Ref No.</label>
            <input style={inp} value={form.editEscrowRef} onChange={(e) => onChange("editEscrowRef", e.target.value)} placeholder="Ref #" />
          </div>
        </div>

        <div style={grid4}>
          <div>
            <label style={lbl}>Title Officer</label>
            <input style={inp} value={form.editTitleOfficer} onChange={(e) => onChange("editTitleOfficer", e.target.value)} placeholder="Name" />
          </div>
          <div>
            <label style={lbl}>Title Officer Email</label>
            <input type="email" style={inp} value={form.editTitleOfficerEmail} onChange={(e) => onChange("editTitleOfficerEmail", e.target.value)} placeholder="Email" />
          </div>
          <div>
            <label style={lbl}>Escrow Officer</label>
            <input style={inp} value={form.editEscrowOfficer} onChange={(e) => onChange("editEscrowOfficer", e.target.value)} placeholder="Name" />
          </div>
          <div>
            <label style={lbl}>Escrow Officer Email</label>
            <input type="email" style={inp} value={form.editEscrowOfficerEmail} onChange={(e) => onChange("editEscrowOfficerEmail", e.target.value)} placeholder="Email" />
          </div>
        </div>

        <div style={grid4}>
          <div>
            <label style={lbl}>Title Rep</label>
            <input style={inp} value={form.editTitleRep} onChange={(e) => onChange("editTitleRep", e.target.value)} placeholder="Rep name" />
          </div>
          <div>
            <label style={lbl}>Title Rep Email</label>
            <input type="email" style={inp} value={form.editTitleRepEmail} onChange={(e) => onChange("editTitleRepEmail", e.target.value)} placeholder="Email" />
          </div>
          <div>
            <label style={lbl}>Title Rep %</label>
            <input style={inp} value={form.editTitleRepPct} onChange={(e) => onChange("editTitleRepPct", e.target.value)} placeholder="100%" />
          </div>
          <div>
            <label style={lbl}>File Source</label>
            <input style={inp} value={form.editFileSource} onChange={(e) => onChange("editFileSource", e.target.value)} placeholder="File source" />
          </div>
        </div>
      </div>
    </div>
  );
}
