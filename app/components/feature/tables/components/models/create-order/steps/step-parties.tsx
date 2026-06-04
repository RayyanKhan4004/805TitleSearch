"use client";

import { useState } from "react";
import Icon from "@/components/common/icon";
import type { Buyer, Seller } from "@/app/components/feature/tables/types";
import BuyerForm from "../parties/buyer-form";
import SellerForm from "../parties/seller-form";
import EscrowForm from "../parties/escrow-form";
import PartyBadgeList from "../parties/party-badge-list";

interface StepPartiesProps {
  // buyer input fields
  bFirst: string; bLast: string; bMid: string; bEntity: string; bVest: string;
  bPhone: string; bEmail: string; bAddr: string; bCity: string; bState: string; bZip: string;
  onBFirstChange: (v: string) => void; onBLastChange: (v: string) => void;
  onBMidChange: (v: string) => void; onBEntityChange: (v: string) => void;
  onBVestChange: (v: string) => void; onBPhoneChange: (v: string) => void;
  onBEmailChange: (v: string) => void; onBAddrChange: (v: string) => void;
  onBCityChange: (v: string) => void; onBStateChange: (v: string) => void;
  onBZipChange: (v: string) => void;
  buyerAdd: () => void;
  buyers: Buyer[];
  onBuyerRemove: (id: number) => void;

  // seller input fields
  sFirst: string; sLast: string; sMid: string; sVest: string; sDeedType: string;
  sPhone: string; sEmail: string; sAddr: string; sDocNo: string;
  onSFirstChange: (v: string) => void; onSLastChange: (v: string) => void;
  onSMidChange: (v: string) => void; onSVestChange: (v: string) => void;
  onSDeedTypeChange: (v: string) => void; onSPhoneChange: (v: string) => void;
  onSEmailChange: (v: string) => void; onSAddrChange: (v: string) => void;
  onSDocNoChange: (v: string) => void;
  sellerAdd: () => void;
  sellers: Seller[];
  onSellerRemove: (id: number) => void;
  sellerPrefill: string;

  // escrow fields
  escrowNo: string; escrowCompany: string;
  titleOffice: string; escrowOffice: string; branch: string; loanOfficer: string; lender: string;
  onEscrowNoChange: (v: string) => void; onEscrowCompanyChange: (v: string) => void;
  onTitleOfficeChange: (v: string) => void; onEscrowOfficeChange: (v: string) => void;
  onBranchChange: (v: string) => void; onLoanOfficerChange: (v: string) => void;
  onLenderChange: (v: string) => void;
}

const TABS = [
  { key: "buyer" as const, label: "Buyer(s)", color: "var(--brand-primary)", icon: "user" },
  { key: "seller" as const, label: "Seller(s)", color: "var(--search-source-datatree)", icon: "user" },
  { key: "general" as const, label: "Escrow / Title", color: "var(--text-tertiary)", icon: "file" },
];

export default function StepParties({
  bFirst, bLast, bMid, bEntity, bVest, bPhone, bEmail, bAddr, bCity, bState, bZip,
  onBFirstChange, onBLastChange, onBMidChange, onBEntityChange, onBVestChange,
  onBPhoneChange, onBEmailChange, onBAddrChange, onBCityChange, onBStateChange, onBZipChange,
  buyerAdd, buyers, onBuyerRemove,
  sFirst, sLast, sMid, sVest, sDeedType, sPhone, sEmail, sAddr, sDocNo,
  onSFirstChange, onSLastChange, onSMidChange, onSVestChange, onSDeedTypeChange,
  onSPhoneChange, onSEmailChange, onSAddrChange, onSDocNoChange,
  sellerAdd, sellers, onSellerRemove, sellerPrefill,
  escrowNo, escrowCompany, titleOffice, escrowOffice, branch, loanOfficer, lender,
  onEscrowNoChange, onEscrowCompanyChange, onTitleOfficeChange, onEscrowOfficeChange,
  onBranchChange, onLoanOfficerChange, onLenderChange,
}: StepPartiesProps) {
  const [tab, setTab] = useState<"buyer" | "seller" | "general">("buyer");

  return (
    <div className="p-4.5 flex flex-col gap-3.5 overflow-y-auto flex-1">
      <div className="flex border-b-2 border-border gap-0">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-1.75 px-5 py-2.5 text-[12px] font-bold border-none cursor-pointer transition-all duration-150 mb-[-2px]"
              style={{
                borderBottom: active ? `3px solid ${t.color}` : "3px solid transparent",
                color: active ? t.color : "var(--text-tertiary)",
                background: active ? `${t.color}08` : "transparent",
              }}
            >
              <Icon name={t.icon} size={13} />
              {t.label}
              {t.key === "buyer" && buyers.length > 0 && (
                <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: t.color }}>{buyers.length}</span>
              )}
              {t.key === "seller" && sellers.length > 0 && (
                <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: t.color }}>{sellers.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {tab === "buyer" && (
        <div className="flex flex-col gap-3.5">
          {buyers.length > 0 && (
            <div className="bg-status-success-bg/30 border border-status-success-border rounded-lg p-2.5 px-3.5">
              <div className="text-[10px] font-bold text-status-success-text uppercase tracking-[0.06em] mb-1.75">Added Buyers ({buyers.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {buyers.map((b) => (
                  <span key={b.id} className="inline-flex items-center gap-1.25 bg-secondary border border-border text-text-secondary text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {b.name}
                    <button onClick={() => onBuyerRemove(b.id)} className="bg-transparent border-none cursor-pointer text-text-muted text-[13px] leading-none p-0 hover:text-status-error">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          <BuyerForm
            first={bFirst} last={bLast} mid={bMid} entity={bEntity} vest={bVest}
            phone={bPhone} email={bEmail} addr={bAddr} city={bCity} state={bState} zip={bZip}
            onFirstChange={onBFirstChange} onLastChange={onBLastChange} onMidChange={onBMidChange}
            onEntityChange={onBEntityChange} onVestChange={onBVestChange}
            onPhoneChange={onBPhoneChange} onEmailChange={onBEmailChange}
            onAddrChange={onBAddrChange} onCityChange={onBCityChange}
            onStateChange={onBStateChange} onZipChange={onBZipChange}
            onAdd={buyerAdd} count={buyers.length}
          />
        </div>
      )}

      {tab === "seller" && (
        <div className="flex flex-col gap-3.5">
          {sellers.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 px-3.5">
              <div className="text-[10px] font-bold text-blue-800 uppercase tracking-[0.06em] mb-1.75">Added Sellers ({sellers.length})</div>
              <div className="flex flex-wrap gap-1.5">
                {sellers.map((s) => (
                  <span key={s.id} className="inline-flex items-center gap-1.25 bg-secondary border border-border text-text-secondary text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    {s.name}
                    <button onClick={() => onSellerRemove(s.id)} className="bg-transparent border-none cursor-pointer text-text-muted text-[13px] leading-none p-0 hover:text-status-error">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
          <SellerForm
            prefillName={sellerPrefill}
            first={sFirst} last={sLast} mid={sMid} vest={sVest} deedType={sDeedType}
            phone={sPhone} email={sEmail} addr={sAddr} docNo={sDocNo}
            onFirstChange={onSFirstChange} onLastChange={onSLastChange} onMidChange={onSMidChange}
            onVestChange={onSVestChange} onDeedTypeChange={onSDeedTypeChange}
            onPhoneChange={onSPhoneChange} onEmailChange={onSEmailChange}
            onAddrChange={onSAddrChange} onDocNoChange={onSDocNoChange}
            onAdd={sellerAdd} count={sellers.length}
          />
        </div>
      )}

      {tab === "general" && (
        <EscrowForm
          escrowNo={escrowNo} escrowCompany={escrowCompany}
          titleOffice={titleOffice} escrowOffice={escrowOffice}
          branch={branch} loanOfficer={loanOfficer} lender={lender}
          onEscrowNoChange={onEscrowNoChange} onEscrowCompanyChange={onEscrowCompanyChange}
          onTitleOfficeChange={onTitleOfficeChange} onEscrowOfficeChange={onEscrowOfficeChange}
          onBranchChange={onBranchChange} onLoanOfficerChange={onLoanOfficerChange}
          onLenderChange={onLenderChange}
        />
      )}
    </div>
  );
}
