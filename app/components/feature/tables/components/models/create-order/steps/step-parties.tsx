"use client";

import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/common/icon";

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
const ENTITY_OPTS = [
  "Individual",
  "Trust",
  "Corporation",
  "LLC",
  "Partnership",
  "Estate",
  "Non-Profit",
];

export interface BuyerEntry {
  id: number;
  name: string;
  first: string;
  last: string;
  mid: string;
  entity: string;
  vesting: string;
  phone: string;
  email: string;
  addr: string;
  city: string;
  state: string;
  zip: string;
  ssn: string;
}

export interface SellerEntry {
  id: number;
  name: string;
  first: string;
  last: string;
  mid: string;
  vesting: string;
  deedType: string;
  phone: string;
  email: string;
  addr: string;
  docNo: string;
  ssn: string;
}

export interface PartiesState {
  buyers: BuyerEntry[];
  sellers: SellerEntry[];
  bFirst: string;
  bLast: string;
  bMid: string;
  bEntity: string;
  bVest: string;
  bPhone: string;
  bEmail: string;
  bAddr: string;
  bCity: string;
  bState: string;
  bZip: string;
  bSSN: string;
  sFirst: string;
  sLast: string;
  sMid: string;
  sVest: string;
  sDeedType: string;
  sPhone: string;
  sEmail: string;
  sAddr: string;
  sDocNo: string;
  sSSN: string;
  titleOffice: string;
  escrowOffice: string;
  branch: string;
  titleOfficer: string;
  titleOfficerEmail: string;
  escrowOfficer: string;
  escrowOfficerEmail: string;
  loanOfficer: string;
  lender: string;
  laCompany: string;
  laCompDre: string;
  laContact: string;
  laContDre: string;
  laAddr: string;
  laCity: string;
  laState: string;
  laZip: string;
  laPhone: string;
  laFax: string;
  laMobile: string;
  laEmail: string;
  laRef: string;
  saCompany: string;
  saCompDre: string;
  saContact: string;
  saContDre: string;
  saAddr: string;
  saCity: string;
  saState: string;
  saZip: string;
  saPhone: string;
  saFax: string;
  saMobile: string;
  saEmail: string;
  saRef: string;
  lsaCompany: string;
  lsaCompDre: string;
  lsaContact: string;
  lsaContDre: string;
  lsaAddr: string;
  lsaCity: string;
  lsaState: string;
  lsaZip: string;
  lsaPhone: string;
  lsaFax: string;
  lsaMobile: string;
  lsaEmail: string;
  lsaRef: string;
  ldCompany: string;
  ldCompNmls: string;
  ldContact: string;
  ldContNmls: string;
  ldAddr: string;
  ldCity: string;
  ldState: string;
  ldZip: string;
  ldPhone: string;
  ldFax: string;
  ldMobile: string;
  ldEmail: string;
  ldRef: string;
  mbCompany: string;
  mbCompNmls: string;
  mbContact: string;
  mbContNmls: string;
  mbAddr: string;
  mbCity: string;
  mbState: string;
  mbZip: string;
  mbPhone: string;
  mbFax: string;
  mbMobile: string;
  mbEmail: string;
  mbRef: string;
  pcCompany: string;
  pcCompId: string;
  pcContact: string;
  pcContId: string;
  pcAddr1: string;
  pcCity: string;
  pcState: string;
  pcZip: string;
  pcPhone: string;
  pcEmail: string;
  clCompany: string;
  clCompId: string;
  clContact: string;
  clContId: string;
  clAddr: string;
  clCity: string;
  clState: string;
  clZip: string;
  clPhone: string;
  clEmail: string;
}

interface Props {
  form: Record<string, any>;
  defaultValue?: PartiesState;
  onStateChange?: (s: PartiesState) => void;
}

const defaultState = (form?: Record<string, any>): PartiesState => ({
  buyers: [],
  sellers: [],
  bFirst: "",
  bLast: "",
  bMid: "",
  bEntity: "Individual",
  bVest: "Community Property",
  bPhone: "",
  bEmail: "",
  bAddr: "",
  bCity: "",
  bState: "CA",
  bZip: "",
  bSSN: "",
  sFirst: (form?._seller || "").split(" ")[0] || "",
  sLast: (form?._seller || "").split(" ").slice(1).join(" ") || "",
  sMid: "",
  sVest: "Community Property",
  sDeedType: form?._deedType || "Grant Deed",
  sPhone: "",
  sEmail: "",
  sAddr: "",
  sDocNo: form?._docNo || "",
  sSSN: "",
  titleOffice: "",
  escrowOffice: "",
  branch: "South Cal",
  titleOfficer: "",
  titleOfficerEmail: "",
  escrowOfficer: "",
  escrowOfficerEmail: "",
  loanOfficer: "",
  lender: form?._lender || "",
  laCompany: "",
  laCompDre: "",
  laContact: "",
  laContDre: "",
  laAddr: "",
  laCity: "",
  laState: "CA",
  laZip: "",
  laPhone: "",
  laFax: "",
  laMobile: "",
  laEmail: "",
  laRef: "",
  saCompany: "",
  saCompDre: "",
  saContact: "",
  saContDre: "",
  saAddr: "",
  saCity: "",
  saState: "CA",
  saZip: "",
  saPhone: "",
  saFax: "",
  saMobile: "",
  saEmail: "",
  saRef: "",
  lsaCompany: "",
  lsaCompDre: "",
  lsaContact: "",
  lsaContDre: "",
  lsaAddr: "",
  lsaCity: "",
  lsaState: "CA",
  lsaZip: "",
  lsaPhone: "",
  lsaFax: "",
  lsaMobile: "",
  lsaEmail: "",
  lsaRef: "",
  ldCompany: "",
  ldCompNmls: "",
  ldContact: "",
  ldContNmls: "",
  ldAddr: "",
  ldCity: "",
  ldState: "CA",
  ldZip: "",
  ldPhone: "",
  ldFax: "",
  ldMobile: "",
  ldEmail: "",
  ldRef: "",
  mbCompany: "",
  mbCompNmls: "",
  mbContact: "",
  mbContNmls: "",
  mbAddr: "",
  mbCity: "",
  mbState: "CA",
  mbZip: "",
  mbPhone: "",
  mbFax: "",
  mbMobile: "",
  mbEmail: "",
  mbRef: "",
  pcCompany: "",
  pcCompId: "",
  pcContact: "",
  pcContId: "",
  pcAddr1: "",
  pcCity: "",
  pcState: "CA",
  pcZip: "",
  pcPhone: "",
  pcEmail: "",
  clCompany: "",
  clCompId: "",
  clContact: "",
  clContId: "",
  clAddr: "",
  clCity: "",
  clState: "CA",
  clZip: "",
  clPhone: "",
  clEmail: "",
});

const grid3 = {
  display: "grid" as const,
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 13,
};

const TagPill = ({
  name,
  onRemove,
}: {
  name: string;
  onRemove: () => void;
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: "#f1f5f9",
      border: "1px solid #e2e8f0",
      color: "#334155",
      fontSize: 11,
      fontWeight: 600,
      padding: "4px 10px",
      borderRadius: 999,
    }}
  >
    {name}
    <button
      onClick={onRemove}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "#94a3b8",
        fontSize: 13,
        lineHeight: 1,
        padding: 0,
      }}
    >
      ×
    </button>
  </span>
);

const TABS = [
  { key: "buyer" as const, label: "Buyer(s)", color: "#8B0000", icon: "user" },
  {
    key: "seller" as const,
    label: "Seller(s)",
    color: "#0369a1",
    icon: "user",
  },
  {
    key: "general" as const,
    label: "Escrow / Title",
    color: "#475569",
    icon: "file",
  },
  {
    key: "listingAgent" as const,
    label: "Listing Agent",
    color: "#7c3aed",
    icon: "user",
  },
  {
    key: "sellingAgent" as const,
    label: "Selling Agent",
    color: "#0891b2",
    icon: "user",
  },
  {
    key: "listingSelling" as const,
    label: "Listing & Selling",
    color: "#0d9488",
    icon: "user",
  },
  { key: "lender" as const, label: "Lender", color: "#059669", icon: "file" },
  {
    key: "mortgageBroker" as const,
    label: "Mortgage Broker",
    color: "#d97706",
    icon: "file",
  },
  {
    key: "primaryContact" as const,
    label: "Primary Contact",
    color: "#6366f1",
    icon: "user",
  },
  { key: "client" as const, label: "Client", color: "#64748b", icon: "file" },
];

function AgentForm({
  prefix,
  state,
  set,
  grid3,
}: {
  prefix: string;
  state: PartiesState;
  set: (k: string, v: string) => void;
  grid3: React.CSSProperties;
}) {
  const f = (k: string) => (state[k as keyof PartiesState] as string) ?? "";
  return (
    <div style={grid3}>
      <div style={{ gridColumn: "span 2" }}>
        <label style={lbl}>Company Name</label>
        <input
          style={inp}
          value={f(`${prefix}Company`)}
          onChange={(e) => set(`${prefix}Company`, e.target.value)}
          placeholder="Company name"
        />
      </div>
      <div>
        <label style={lbl}>
          {prefix === "ld" ? "Company NMLS" : "Company DRE"}
        </label>
        <input
          style={inp}
          value={f(`${prefix}CompDre`) || f(`${prefix}CompNmls`)}
          onChange={(e) =>
            set(`${prefix}CompDre` || `${prefix}CompNmls`, e.target.value)
          }
          placeholder={prefix === "ld" ? "NMLS #" : "DRE #"}
        />
      </div>
      <div style={{ gridColumn: "span 2" }}>
        <label style={lbl}>Contact Name</label>
        <input
          style={inp}
          value={f(`${prefix}Contact`)}
          onChange={(e) => set(`${prefix}Contact`, e.target.value)}
          placeholder="Full name"
        />
      </div>
      <div>
        <label style={lbl}>
          {prefix === "ld" ? "Contact NMLS" : "Contact DRE"}
        </label>
        <input
          style={inp}
          value={f(`${prefix}ContDre`) || f(`${prefix}ContNmls`)}
          onChange={(e) =>
            set(`${prefix}ContDre` || `${prefix}ContNmls`, e.target.value)
          }
          placeholder={prefix === "ld" ? "NMLS #" : "DRE #"}
        />
      </div>
      <div style={{ gridColumn: "span 3" }}>
        <label style={lbl}>Address</label>
        <input
          style={inp}
          value={f(`${prefix}Addr`)}
          onChange={(e) => set(`${prefix}Addr`, e.target.value)}
          placeholder="Street address"
        />
      </div>
      <div>
        <label style={lbl}>City</label>
        <input
          style={inp}
          value={f(`${prefix}City`)}
          onChange={(e) => set(`${prefix}City`, e.target.value)}
          placeholder="City"
        />
      </div>
      <div>
        <label style={lbl}>State</label>
        <select
          style={inp}
          value={f(`${prefix}State`)}
          onChange={(e) => set(`${prefix}State`, e.target.value)}
        >
          {["CA", "NV", "AZ", "TX", "OR", "WA", "CO", "FL", "NY"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={lbl}>Zip</label>
        <input
          style={inp}
          value={f(`${prefix}Zip`)}
          onChange={(e) => set(`${prefix}Zip`, e.target.value)}
          placeholder="Zip"
        />
      </div>
      <div>
        <label style={lbl}>Phone</label>
        <input
          style={inp}
          value={f(`${prefix}Phone`)}
          onChange={(e) => set(`${prefix}Phone`, e.target.value)}
          placeholder="Phone"
        />
      </div>
      {prefix !== "pc" && prefix !== "cl" && (
        <div>
          <label style={lbl}>Fax</label>
          <input
            style={inp}
            value={f(`${prefix}Fax`)}
            onChange={(e) => set(`${prefix}Fax`, e.target.value)}
            placeholder="Fax"
          />
        </div>
      )}
      {prefix !== "pc" && prefix !== "cl" && (
        <div>
          <label style={lbl}>Mobile</label>
          <input
            style={inp}
            value={f(`${prefix}Mobile`)}
            onChange={(e) => set(`${prefix}Mobile`, e.target.value)}
            placeholder="Mobile"
          />
        </div>
      )}
      <div style={{ gridColumn: "span 2" }}>
        <label style={lbl}>Email</label>
        <input
          type="email"
          style={inp}
          value={f(`${prefix}Email`)}
          onChange={(e) => set(`${prefix}Email`, e.target.value)}
          placeholder="email@example.com"
        />
      </div>
      {prefix !== "pc" && prefix !== "cl" && (
        <div>
          <label style={lbl}>Ref No.</label>
          <input
            style={inp}
            value={f(`${prefix}Ref`)}
            onChange={(e) => set(`${prefix}Ref`, e.target.value)}
            placeholder="Ref #"
          />
        </div>
      )}
    </div>
  );
}

export default function StepParties({
  form,
  defaultValue,
  onStateChange,
}: Props) {
  const [s, setS] = useState<PartiesState>(defaultValue ?? defaultState(form));
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("buyer");
  const set = useCallback(
    (k: string, v: string) => setS((prev) => ({ ...prev, [k]: v })),
    [],
  );

  useEffect(() => {
    onStateChange?.(s);
  }, [s]);

  const addBuyer = () => {
    if (!s.bFirst.trim() && !s.bLast.trim()) return;
    setS((prev) => ({
      ...prev,
      buyers: [
        ...prev.buyers,
        {
          id: Date.now(),
          name:
            [s.bFirst, s.bMid, s.bLast].filter(Boolean).join(" ") +
            ` (${s.bVest})`,
          first: s.bFirst,
          last: s.bLast,
          mid: s.bMid,
          entity: s.bEntity,
          vesting: s.bVest,
          phone: s.bPhone,
          email: s.bEmail,
          addr: s.bAddr,
          city: s.bCity,
          state: s.bState,
          zip: s.bZip,
          ssn: s.bSSN,
        },
      ],
      bFirst: "",
      bLast: "",
      bMid: "",
      bPhone: "",
      bEmail: "",
      bAddr: "",
      bCity: "",
      bZip: "",
      bSSN: "",
    }));
  };

  const addSeller = () => {
    if (!s.sFirst.trim() && !s.sLast.trim()) return;
    setS((prev) => ({
      ...prev,
      sellers: [
        ...prev.sellers,
        {
          id: Date.now(),
          name:
            [s.sFirst, s.sMid, s.sLast].filter(Boolean).join(" ") +
            ` (${s.sVest})`,
          first: s.sFirst,
          last: s.sLast,
          mid: s.sMid,
          vesting: s.sVest,
          deedType: s.sDeedType,
          phone: s.sPhone,
          email: s.sEmail,
          addr: s.sAddr,
          docNo: s.sDocNo,
          ssn: s.sSSN,
        },
      ],
      sFirst: "",
      sLast: "",
      sMid: "",
      sPhone: "",
      sEmail: "",
      sAddr: "",
      sSSN: "",
    }));
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        overflowY: "auto",
        flex: 1,
        margin: 0,
      }}
    >
      <div
        style={{ display: "flex", borderBottom: "2px solid #e2e8f0", gap: 0 }}
      >
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "10px 20px",
                fontSize: 12,
                fontWeight: 700,
                border: "none",
                cursor: "pointer",
                borderBottom: active
                  ? `3px solid ${t.color}`
                  : "3px solid transparent",
                color: active ? t.color : "#64748b",
                background: active ? `${t.color}08` : "transparent",
                transition: "all .15s",
                marginBottom: -2,
              }}
            >
              <Icon name={t.icon} size={13} />
              {t.label}
              {t.key === "buyer" && s.buyers.length > 0 && (
                <span
                  style={{
                    background: t.color,
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: 999,
                  }}
                >
                  {s.buyers.length}
                </span>
              )}
              {t.key === "seller" && s.sellers.length > 0 && (
                <span
                  style={{
                    background: t.color,
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: 999,
                  }}
                >
                  {s.sellers.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tab === "buyer" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {s.buyers.length > 0 && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 10,
                padding: "10px 14px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#166534",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 7,
                }}
              >
                Added Buyers ({s.buyers.length})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {s.buyers.map((b) => (
                  <TagPill
                    key={b.id}
                    name={b.name}
                    onRemove={() =>
                      setS((prev) => ({
                        ...prev,
                        buyers: prev.buyers.filter((x) => x.id !== b.id),
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          )}
          <div style={sec}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <div
                  style={{
                    width: 3,
                    height: 16,
                    background: "#8B0000",
                    borderRadius: 2,
                  }}
                />{" "}
                Buyer Information
              </div>
              <span style={{ fontSize: 10, color: "#94a3b8" }}>
                Add multiple buyers using the button below
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 100px",
                gap: 11,
                marginBottom: 11,
              }}
            >
              <div>
                <label style={lbl}>First Name</label>
                <input
                  style={inp}
                  value={s.bFirst}
                  onChange={(e) => set("bFirst", e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <label style={lbl}>Last Name</label>
                <input
                  style={inp}
                  value={s.bLast}
                  onChange={(e) => set("bLast", e.target.value)}
                  placeholder="Doe"
                />
              </div>
              <div>
                <label style={lbl}>Middle / Suffix</label>
                <input
                  style={inp}
                  value={s.bMid}
                  onChange={(e) => set("bMid", e.target.value)}
                  placeholder="D. / Jr."
                />
              </div>
            </div>
           
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 11,
                marginBottom: 11,
              }}
            >
              <div>
                <label style={lbl}>Phone</label>
                <input
                  style={inp}
                  value={s.bPhone}
                  onChange={(e) => set("bPhone", e.target.value)}
                  placeholder="(555) 000-0000"
                />
              </div>
              <div>
                <label style={lbl}>Email</label>
                <input
                  style={inp}
                  value={s.bEmail}
                  onChange={(e) => set("bEmail", e.target.value)}
                  placeholder="buyer@email.com"
                  type="email"
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 80px 100px",
                gap: 11,
                marginBottom: 11,
              }}
            >
              <div>
                <label style={lbl}>Mailing Address</label>
                <input
                  style={inp}
                  value={s.bAddr}
                  onChange={(e) => set("bAddr", e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div>
                <label style={lbl}>City</label>
                <input
                  style={inp}
                  value={s.bCity}
                  onChange={(e) => set("bCity", e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <label style={lbl}>State</label>
                <select
                  style={inp}
                  value={s.bState}
                  onChange={(e) => set("bState", e.target.value)}
                >
                  {["CA", "NV", "AZ", "TX", "OR", "WA"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>Zip</label>
                <input
                  style={inp}
                  value={s.bZip}
                  onChange={(e) => set("bZip", e.target.value)}
                  placeholder="92692"
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: 11,
                marginBottom: 14,
              }}
            >
              <div>
                <label style={lbl}>SSN / Tax ID (last 4)</label>
                <input
                  style={inp}
                  value={s.bSSN}
                  onChange={(e) => set("bSSN", e.target.value)}
                  placeholder="••••"
                  maxLength={4}
                  type="password"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={addBuyer}
                style={{
                  background: "#8B0000",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Icon name="plus" size={11} /> Add Buyer
              </button>
              {s.buyers.length > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    alignSelf: "center",
                  }}
                >
                  {s.buyers.length} buyer{s.buyers.length > 1 ? "s" : ""} added
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "seller" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {form?._seller && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: 8,
                padding: "8px 14px",
              }}
            >
              <Icon name="checkCircle" size={13} style={{ color: "#d97706" }} />
              <span style={{ fontSize: 11, color: "#92400e", fontWeight: 500 }}>
                Seller pre-filled from DataTree: <strong>{form._seller}</strong>
              </span>
            </div>
          )}
          {s.sellers.length > 0 && (
            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: 10,
                padding: "10px 14px",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#1e40af",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 7,
                }}
              >
                Added Sellers ({s.sellers.length})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {s.sellers.map((sl) => (
                  <TagPill
                    key={sl.id}
                    name={sl.name}
                    onRemove={() =>
                      setS((prev) => ({
                        ...prev,
                        sellers: prev.sellers.filter((x) => x.id !== sl.id),
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          )}
          <div style={sec}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <div
                  style={{
                    width: 3,
                    height: 16,
                    background: "#0369a1",
                    borderRadius: 2,
                  }}
                />{" "}
                Seller Information
              </div>
              <span style={{ fontSize: 10, color: "#94a3b8" }}>
                Add multiple sellers using the button below
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 100px",
                gap: 11,
                marginBottom: 11,
              }}
            >
              <div>
                <label style={lbl}>First Name</label>
                <input
                  style={inp}
                  value={s.sFirst}
                  onChange={(e) => set("sFirst", e.target.value)}
                  placeholder="Michael"
                />
              </div>
              <div>
                <label style={lbl}>Last Name</label>
                <input
                  style={inp}
                  value={s.sLast}
                  onChange={(e) => set("sLast", e.target.value)}
                  placeholder="Smith"
                />
              </div>
              <div>
                <label style={lbl}>Middle / Suffix</label>
                <input
                  style={inp}
                  value={s.sMid}
                  onChange={(e) => set("sMid", e.target.value)}
                  placeholder="A. / Sr."
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 11,
                marginBottom: 11,
              }}
            >
              <div>
                <label style={lbl}>Current Vesting (from Deed)</label>
                <select
                  style={inp}
                  value={s.sVest}
                  onChange={(e) => set("sVest", e.target.value)}
                >
                  {VESTING_OPTS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>Deed Type</label>
                <select
                  style={inp}
                  value={s.sDeedType}
                  onChange={(e) => set("sDeedType", e.target.value)}
                >
                  {[
                    "Grant Deed",
                    "Quitclaim Deed",
                    "Trustee's Deed",
                    "Trustee's Deed Upon Rec. of Sale",
                    "Warranty Deed",
                  ].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 11,
                marginBottom: 11,
              }}
            >
              <div>
                <label style={lbl}>Phone</label>
                <input
                  style={inp}
                  value={s.sPhone}
                  onChange={(e) => set("sPhone", e.target.value)}
                  placeholder="(555) 000-0000"
                />
              </div>
              <div>
                <label style={lbl}>Email</label>
                <input
                  style={inp}
                  value={s.sEmail}
                  onChange={(e) => set("sEmail", e.target.value)}
                  placeholder="seller@email.com"
                  type="email"
                />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 11,
                marginBottom: 14,
              }}
            >
              <div>
                <label style={lbl}>Mailing Address</label>
                <input
                  style={inp}
                  value={s.sAddr}
                  onChange={(e) => set("sAddr", e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div>
                <label style={lbl}>Recorded Doc No.</label>
                <input
                  style={{ ...inp, background: s.sDocNo ? "#fffbeb" : "#fff" }}
                  value={s.sDocNo}
                  onChange={(e) => set("sDocNo", e.target.value)}
                  placeholder="e.g. 2021.70877"
                />
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 14 }}>
              <div>
                <label style={lbl}>SSN / Tax ID (Last 4)</label>
                <input
                  style={inp}
                  value={s.sSSN}
                  onChange={(e) => set("sSSN", e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="0000"
                  maxLength={4}
                  inputMode="numeric"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={addSeller}
                style={{
                  background: "#0369a1",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 16px",
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Icon name="plus" size={11} /> Add Seller
              </button>
              {s.sellers.length > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    alignSelf: "center",
                  }}
                >
                  {s.sellers.length} seller{s.sellers.length > 1 ? "s" : ""}{" "}
                  added
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "general" && (
        <div style={sec}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#1e293b",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <div
              style={{
                width: 3,
                height: 16,
                background: "#475569",
                borderRadius: 2,
              }}
            />{" "}
            Escrow &amp; Title Information
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 13,
            }}
          >
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Title Office</label>
              <input
                style={inp}
                value={s.titleOffice}
                onChange={(e) => set("titleOffice", e.target.value)}
                placeholder="Title office name"
              />
            </div>
            <div>
              <label style={lbl}>Title Branch</label>
              <select
                style={inp}
                value={s.branch}
                onChange={(e) => set("branch", e.target.value)}
              >
                <option>South Cal</option>
                <option>North Cal</option>
                <option>Central Cal</option>
                <option>NorCal</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Title Officer</label>
              <input
                style={inp}
                value={s.titleOfficer}
                onChange={(e) => set("titleOfficer", e.target.value)}
                placeholder="Title officer name"
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Title Officer Email</label>
              <input
                type="email"
                style={inp}
                value={s.titleOfficerEmail}
                onChange={(e) => set("titleOfficerEmail", e.target.value)}
                placeholder="Email"
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Escrow Office</label>
              <input
                style={inp}
                value={s.escrowOffice}
                onChange={(e) => set("escrowOffice", e.target.value)}
                placeholder="Escrow company name"
              />
            </div>
            <div>
              <label style={lbl}>Escrow Officer</label>
              <input
                style={inp}
                value={s.escrowOfficer}
                onChange={(e) => set("escrowOfficer", e.target.value)}
                placeholder="Escrow officer name"
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Escrow Officer Email</label>
              <input
                type="email"
                style={inp}
                value={s.escrowOfficerEmail}
                onChange={(e) => set("escrowOfficerEmail", e.target.value)}
                placeholder="Email"
              />
            </div>
            <div>
              <label style={lbl}>Loan Officer</label>
              <input
                style={inp}
                value={s.loanOfficer}
                onChange={(e) => set("loanOfficer", e.target.value)}
                placeholder="Loan officer name"
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Lender / Bank</label>
              <input
                style={{ ...inp, background: s.lender ? "#fffbeb" : "#fff" }}
                value={s.lender}
                onChange={(e) => set("lender", e.target.value)}
                placeholder="e.g. PARKSIDE LENDING LLC"
              />
            </div>
          </div>
        </div>
      )}

      {tab === "listingAgent" && (
        <div style={sec}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#1e293b",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <div
              style={{
                width: 3,
                height: 16,
                background: "#7c3aed",
                borderRadius: 2,
              }}
            />{" "}
            Listing Agent
          </div>
          <AgentForm prefix="la" state={s} set={set} grid3={grid3} />
        </div>
      )}
      {tab === "sellingAgent" && (
        <div style={sec}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#1e293b",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <div
              style={{
                width: 3,
                height: 16,
                background: "#0891b2",
                borderRadius: 2,
              }}
            />{" "}
            Selling Agent / Buyer's Agent
          </div>
          <AgentForm prefix="sa" state={s} set={set} grid3={grid3} />
        </div>
      )}
      {tab === "listingSelling" && (
        <div style={sec}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#1e293b",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <div
              style={{
                width: 3,
                height: 16,
                background: "#0d9488",
                borderRadius: 2,
              }}
            />{" "}
            Listing &amp; Selling Agent (Combined)
          </div>
          <AgentForm prefix="lsa" state={s} set={set} grid3={grid3} />
        </div>
      )}
      {tab === "lender" && (
        <div style={sec}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#1e293b",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <div
              style={{
                width: 3,
                height: 16,
                background: "#059669",
                borderRadius: 2,
              }}
            />{" "}
            Lender / Loan Officer
          </div>
          <AgentForm prefix="ld" state={s} set={set} grid3={grid3} />
        </div>
      )}
      {tab === "mortgageBroker" && (
        <div style={sec}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#1e293b",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <div
              style={{
                width: 3,
                height: 16,
                background: "#d97706",
                borderRadius: 2,
              }}
            />{" "}
            Mortgage Broker
          </div>
          <AgentForm prefix="mb" state={s} set={set} grid3={grid3} />
        </div>
      )}

      {tab === "primaryContact" && (
        <div style={sec}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#1e293b",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <div
              style={{
                width: 3,
                height: 16,
                background: "#6366f1",
                borderRadius: 2,
              }}
            />{" "}
            Primary Contact
          </div>
          <div style={grid3}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Company Name</label>
              <input
                style={inp}
                value={s.pcCompany}
                onChange={(e) => set("pcCompany", e.target.value)}
                placeholder="Company name"
              />
            </div>
            <div>
              <label style={lbl}>Company ID</label>
              <input
                style={inp}
                value={s.pcCompId}
                onChange={(e) => set("pcCompId", e.target.value)}
                placeholder="Company ID"
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Contact Name</label>
              <input
                style={inp}
                value={s.pcContact}
                onChange={(e) => set("pcContact", e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div>
              <label style={lbl}>Contact ID</label>
              <input
                style={inp}
                value={s.pcContId}
                onChange={(e) => set("pcContId", e.target.value)}
                placeholder="Contact ID"
              />
            </div>
            <div style={{ gridColumn: "span 3" }}>
              <label style={lbl}>Address</label>
              <input
                style={inp}
                value={s.pcAddr1}
                onChange={(e) => set("pcAddr1", e.target.value)}
                placeholder="Street address"
              />
            </div>
            <div>
              <label style={lbl}>City</label>
              <input
                style={inp}
                value={s.pcCity}
                onChange={(e) => set("pcCity", e.target.value)}
                placeholder="City"
              />
            </div>
            <div>
              <label style={lbl}>State</label>
              <select
                style={inp}
                value={s.pcState}
                onChange={(e) => set("pcState", e.target.value)}
              >
                {["CA", "NV", "AZ", "TX", "OR", "WA", "CO", "FL", "NY"].map(
                  (st) => (
                    <option key={st}>{st}</option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label style={lbl}>Zip</label>
              <input
                style={inp}
                value={s.pcZip}
                onChange={(e) => set("pcZip", e.target.value)}
                placeholder="Zip"
              />
            </div>
            <div>
              <label style={lbl}>Phone</label>
              <input
                style={inp}
                value={s.pcPhone}
                onChange={(e) => set("pcPhone", e.target.value)}
                placeholder="(   )   -    "
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Email</label>
              <input
                type="email"
                style={inp}
                value={s.pcEmail}
                onChange={(e) => set("pcEmail", e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>
      )}

      {tab === "client" && (
        <div style={sec}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: "#1e293b",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <div
              style={{
                width: 3,
                height: 16,
                background: "#64748b",
                borderRadius: 2,
              }}
            />{" "}
            Client
          </div>
          <div style={grid3}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Company Name</label>
              <input
                style={inp}
                value={s.clCompany}
                onChange={(e) => set("clCompany", e.target.value)}
                placeholder="Company name"
              />
            </div>
            <div>
              <label style={lbl}>Company ID</label>
              <input
                style={inp}
                value={s.clCompId}
                onChange={(e) => set("clCompId", e.target.value)}
                placeholder="Company ID"
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Contact Name</label>
              <input
                style={inp}
                value={s.clContact}
                onChange={(e) => set("clContact", e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div>
              <label style={lbl}>Contact ID</label>
              <input
                style={inp}
                value={s.clContId}
                onChange={(e) => set("clContId", e.target.value)}
                placeholder="Contact ID"
              />
            </div>
            <div style={{ gridColumn: "span 3" }}>
              <label style={lbl}>Address</label>
              <input
                style={inp}
                value={s.clAddr}
                onChange={(e) => set("clAddr", e.target.value)}
                placeholder="Street address"
              />
            </div>
            <div>
              <label style={lbl}>City</label>
              <input
                style={inp}
                value={s.clCity}
                onChange={(e) => set("clCity", e.target.value)}
                placeholder="City"
              />
            </div>
            <div>
              <label style={lbl}>State</label>
              <select
                style={inp}
                value={s.clState}
                onChange={(e) => set("clState", e.target.value)}
              >
                {["CA", "NV", "AZ", "TX", "OR", "WA", "CO", "FL", "NY"].map(
                  (st) => (
                    <option key={st}>{st}</option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label style={lbl}>Zip</label>
              <input
                style={inp}
                value={s.clZip}
                onChange={(e) => set("clZip", e.target.value)}
                placeholder="Zip"
              />
            </div>
            <div>
              <label style={lbl}>Phone</label>
              <input
                style={inp}
                value={s.clPhone}
                onChange={(e) => set("clPhone", e.target.value)}
                placeholder="(   )   -    "
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={lbl}>Email</label>
              <input
                type="email"
                style={inp}
                value={s.clEmail}
                onChange={(e) => set("clEmail", e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
