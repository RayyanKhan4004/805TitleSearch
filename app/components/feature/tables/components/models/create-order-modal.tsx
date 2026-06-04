"use client";

import { useState } from "react";
import Icon from "@/components/common/icon";

import { searchProperty, mapApiToForm } from "@/app/services/datatree-api";
import type {
  PropertyForm,
  PropertyData,
  CreateOrderStep,
  Buyer,
  Seller,
  FormData,
} from "@/app/components/feature/tables/types";
import { CREATE_STEPS, DEFAULT_FORM } from "../consts";
import StepMethodSelection from "./create-order/steps/step-method-selection";
import StepPropertySearch from "./create-order/steps/step-property-search";
import StepPropertyInfo from "./create-order/steps/step-property-info";
import StepFileInfo from "./create-order/steps/step-file-info";
import StepParties from "./create-order/steps/step-parties";

interface CreateOrderModalProps {
  onClose: () => void;
  onCreate: (orderData: Record<string, unknown>) => void;
}

type F = FormData;

export default function CreateOrderModal({
  onClose,
  onCreate,
}: CreateOrderModalProps) {
  const [ms, setMs] = useState<CreateOrderStep>(-1);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState("");
  const [apiResult, setApiResult] = useState<PropertyData | null>(null);

  // data state  handling data 
  const [d, setD] = useState<FormData>(DEFAULT_FORM);

  // Generic updater: d.search.apnInput = v
  const upd =
    <T extends keyof F>(section: T) =>
    (k: keyof F[T], v: string) =>
      setD((prev) => ({ ...prev, [section]: { ...prev[section], [k]: v } }));

  // Property sub-fields live deeper: d.property.addrNo = v
  const upProp = (k: keyof PropertyForm, v: string) =>
    setD((prev) => ({ ...prev, property: { ...prev.property, [k]: v } }));

  // Parties arrays need their own helpers
  const setBuyers = (buyers: Buyer[]) =>
    setD((prev) => ({ ...prev, parties: { ...prev.parties, buyers } }));
  const setSellers = (sellers: Seller[]) =>
    setD((prev) => ({ ...prev, parties: { ...prev.parties, sellers } }));

  const handleSearch = async () => {
    setSearching(true);
    setSearchErr("");
    setApiResult(null);
    try {
      const s = d.search;
      let params: Record<string, unknown> = {};
      if (s.type === "APN")
        params = { ApnDetail: { APN: s.apnInput, ZipCode: s.zipInput } };
      if (s.type === "Address")
        params = {
          AddressDetail: {
            HouseNumber: s.addrNum,
            StreetName: s.addrStr,
            City: s.addrCity,
            State: s.addrState,
            Zip: s.addrZip,
          },
        };
      if (s.type === "FullAddress")
        params = { FullAddressDetail: { FullAddress: s.fullAddr } };
      if (s.type === "OwnerName")
        params = {
          OwnerNameDetail: { OwnerName: s.ownerName, State: s.addrState },
        };
      if (s.type === "PropertyId")
        params = { PropertyIdDetail: { PropertyId: s.propId } };
      if (s.type === "Advanced")
        params = {
          AdvancedDetail: {
            County: s.advCounty,
            YearBuilt: s.advYear,
            Bedrooms: s.advBeds,
            State: "CA",
          },
        };
      const data = await searchProperty(s.type, params as never);
      if (!data) {
        setSearchErr("No property found. Please check your search criteria.");
      } else {
        setApiResult(data);
        setD((prev) => ({
          ...prev,
          property: mapApiToForm(data),
          parties: {
            ...prev.parties,
            sFirst:
              (data.OwnerTransferInformation?.SellerName || "").split(" ")[0] ||
              "",
            sLast:
              (data.OwnerTransferInformation?.SellerName || "")
                .split(" ")
                .slice(1)
                .join(" ") || "",
            sDocNo: data.OwnerTransferInformation?.TransferDocumentNumber || "",
            sDeedType: data.OwnerTransferInformation?.DeedType || "Grant Deed",
          },
          escrow: {
            ...prev.escrow,
            lender: data.LastMarketSaleInformation?.Lender || "",
          },
        }));
        setMs(1);
      }
    } catch (e) {
      setSearchErr("Search failed: " + (e as Error).message);
    } finally {
      setSearching(false);
    }
  };

  const handleCreate = () => {
    onCreate({
      property: d.property,
      buyers: d.parties.buyers,
      sellers: d.parties.sellers,
      file: d.file,
      escrow: d.escrow,
    });
  };

  const stepIndicator = (n: number) => {
    const active = ms === n;
    const done = ms > n;
    return (
      <button
        key={n}
        onClick={() => (n < ms ? setMs(n as CreateOrderStep) : undefined)}
        className="flex items-center gap-1.25 px-3 py-1.75 rounded-t-lg text-[11px] font-semibold"
        style={{
          borderBottom: active
            ? "2px solid var(--brand-primary)"
            : done
              ? "2px solid var(--status-success-emerald)"
              : "2px solid transparent",
          color: active
            ? "var(--brand-primary)"
            : done
              ? "var(--status-success-emerald)"
              : "var(--text-muted)",
          background: active
            ? "#fff5f5"
            : done
              ? "var(--status-success-bg)"
              : "transparent",
          cursor: n <= ms ? "pointer" : "default",
        }}
      >
        <div
          className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
          style={{
            background: active
              ? "var(--brand-primary)"
              : done
                ? "var(--status-success-emerald)"
                : "var(--border-primary)",
            color: active || done ? "#fff" : "var(--text-muted)",
          }}
        >
          {done ? <Icon name="check" size={8} /> : n}
        </div>
        {n}. {CREATE_STEPS[n]}
      </button>
    );
  };

  const su = upd("search");
  const fu = upd("file");
  const eu = upd("escrow");
  const pu = upd("parties");
  const p = d.parties;

  return (
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-[999] p-4">
      <div
        className="bg-white w-full rounded-[18px] overflow-hidden shadow-2xl flex flex-col max-h-[94vh] transition-[max-width] duration-300"
        style={{ maxWidth: ms === -1 ? 600 : ms === 0 ? 660 : 1100 }}
      >
        <div className="bg-header text-white px-5.5 py-3.5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <Icon name="search" size={15} className="text-white" />
            </div>
            <div>
              <div className="text-[14px] font-bold">Create New Order</div>
              <div className="text-[10px] text-text-muted mt-0.5">
                {ms === -1
                  ? "Choose how to create this order"
                  : ms === 0
                    ? "Search property via DataTree API"
                    : `Review and confirm property data — ${CREATE_STEPS[ms]}`}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-text-tertiary text-[22px] cursor-pointer leading-none hover:text-white"
          >
            ×
          </button>
        </div>

        {ms > 0 && (
          <div className="flex gap-1.25 px-5.5 pt-3 pb-0 border-b border-secondary shrink-0">
            {[1, 2, 3].map(stepIndicator)}
          </div>
        )}

        {ms === -1 && (
          <StepMethodSelection
            onSelectSearch={() => setMs(0)}
            onSelectManual={() => setMs(1)}
          />
        )}

        {ms === 0 && (
          <StepPropertySearch
            searchType={d.search.type}
            onSearchTypeChange={(v) =>
              setD((prev) => ({ ...prev, search: { ...prev.search, type: v } }))
            }
            apnInput={d.search.apnInput}
            zipInput={d.search.zipInput}
            onApnChange={(v) => su("apnInput", v)}
            onZipChange={(v) => su("zipInput", v)}
            addrNum={d.search.addrNum}
            addrStr={d.search.addrStr}
            addrCity={d.search.addrCity}
            addrState={d.search.addrState}
            addrZip={d.search.addrZip}
            onAddrNumChange={(v) => su("addrNum", v)}
            onAddrStrChange={(v) => su("addrStr", v)}
            onAddrCityChange={(v) => su("addrCity", v)}
            onAddrStateChange={(v) => su("addrState", v)}
            onAddrZipChange={(v) => su("addrZip", v)}
            fullAddr={d.search.fullAddr}
            onFullAddrChange={(v) => su("fullAddr", v)}
            ownerName={d.search.ownerName}
            onOwnerNameChange={(v) => su("ownerName", v)}
            propId={d.search.propId}
            onPropIdChange={(v) => su("propId", v)}
            advCounty={d.search.advCounty}
            advYear={d.search.advYear}
            advBeds={d.search.advBeds}
            onAdvCountyChange={(v) => su("advCounty", v)}
            onAdvYearChange={(v) => su("advYear", v)}
            onAdvBedsChange={(v) => su("advBeds", v)}
            onSearch={handleSearch}
            searching={searching}
            searchErr={searchErr}
          />
        )}

        {ms === 1 && (
          <StepPropertyInfo
            form={d.property}
            onChange={upProp}
            apiResult={apiResult}
            onReSearch={() => setMs(0)}
          />
        )}

        {ms === 2 && (
          <StepFileInfo
            clientName={d.file.clientName}
            clientFileNo={d.file.clientFileNo}
            transactionType={d.file.transactionType}
            productType={d.file.productType}
            sourceOfBusiness={d.file.sourceOfBusiness}
            loanNumber={d.file.loanNumber}
            salePrice={d.property._lastSalePrice}
            loanAmount={d.property._mtgAmt}
            onClientNameChange={(v) => fu("clientName", v)}
            onClientFileNoChange={(v) => fu("clientFileNo", v)}
            onTransactionTypeChange={(v) => fu("transactionType", v)}
            onProductTypeChange={(v) => fu("productType", v)}
            onSourceOfBusinessChange={(v) => fu("sourceOfBusiness", v)}
            onLoanNumberChange={(v) => fu("loanNumber", v)}
          />
        )}

        {ms === 3 && (
          <StepParties
            bFirst={p.bFirst} bLast={p.bLast} bMid={p.bMid} bEntity={p.bEntity} bVest={p.bVest}
            bPhone={p.bPhone} bEmail={p.bEmail} bAddr={p.bAddr} bCity={p.bCity} bState={p.bState} bZip={p.bZip}
            onBFirstChange={(v) => pu("bFirst", v)} onBLastChange={(v) => pu("bLast", v)}
            onBMidChange={(v) => pu("bMid", v)} onBEntityChange={(v) => pu("bEntity", v)}
            onBVestChange={(v) => pu("bVest", v)} onBPhoneChange={(v) => pu("bPhone", v)}
            onBEmailChange={(v) => pu("bEmail", v)} onBAddrChange={(v) => pu("bAddr", v)}
            onBCityChange={(v) => pu("bCity", v)} onBStateChange={(v) => pu("bState", v)}
            onBZipChange={(v) => pu("bZip", v)}
            buyerAdd={() => {
              const name = [p.bFirst, p.bMid, p.bLast].filter(Boolean).join(" ") + ` (${p.bVest})`;
              const buyer: Buyer = { id: Date.now(), name, first: p.bFirst, last: p.bLast, mid: p.bMid, vesting: p.bVest, entity: p.bEntity, phone: p.bPhone, email: p.bEmail, addr: p.bAddr, city: p.bCity, state: p.bState, zip: p.bZip };
              setBuyers([...p.buyers, buyer]);
              pu("bFirst", ""); pu("bLast", ""); pu("bMid", ""); pu("bPhone", ""); pu("bEmail", ""); pu("bAddr", ""); pu("bCity", ""); pu("bZip", "");
            }}
            buyers={p.buyers}
            onBuyerRemove={(id) => setBuyers(p.buyers.filter((x) => x.id !== id))}
            sFirst={p.sFirst} sLast={p.sLast} sMid={p.sMid} sVest={p.sVest}
            sDeedType={p.sDeedType} sPhone={p.sPhone} sEmail={p.sEmail} sAddr={p.sAddr} sDocNo={p.sDocNo}
            onSFirstChange={(v) => pu("sFirst", v)} onSLastChange={(v) => pu("sLast", v)}
            onSMidChange={(v) => pu("sMid", v)} onSVestChange={(v) => pu("sVest", v)}
            onSDeedTypeChange={(v) => pu("sDeedType", v)} onSPhoneChange={(v) => pu("sPhone", v)}
            onSEmailChange={(v) => pu("sEmail", v)} onSAddrChange={(v) => pu("sAddr", v)}
            onSDocNoChange={(v) => pu("sDocNo", v)}
            sellerAdd={() => {
              const name = [p.sFirst, p.sMid, p.sLast].filter(Boolean).join(" ") + ` (${p.sVest})`;
              const seller: Seller = { id: Date.now(), name, first: p.sFirst, last: p.sLast, mid: p.sMid, vesting: p.sVest, deedType: p.sDeedType, docNo: p.sDocNo, phone: p.sPhone, email: p.sEmail, addr: p.sAddr };
              setSellers([...p.sellers, seller]);
              pu("sFirst", ""); pu("sLast", ""); pu("sMid", ""); pu("sPhone", ""); pu("sEmail", ""); pu("sAddr", "");
            }}
            sellers={p.sellers}
            onSellerRemove={(id) => setSellers(p.sellers.filter((x) => x.id !== id))}
            sellerPrefill={d.property._seller || ""}
            escrowNo={d.escrow.escrowNo} escrowCompany={d.escrow.escrowCompany}
            titleOffice={d.escrow.titleOffice} escrowOffice={d.escrow.escrowOffice}
            branch={d.escrow.branch} loanOfficer={d.escrow.loanOfficer} lender={d.escrow.lender}
            onEscrowNoChange={(v) => eu("escrowNo", v)} onEscrowCompanyChange={(v) => eu("escrowCompany", v)}
            onTitleOfficeChange={(v) => eu("titleOffice", v)} onEscrowOfficeChange={(v) => eu("escrowOffice", v)}
            onBranchChange={(v) => eu("branch", v)} onLoanOfficerChange={(v) => eu("loanOfficer", v)}
            onLenderChange={(v) => eu("lender", v)}
          />
        )}

        <div className="border-t border-border px-5.5 py-3 flex justify-between items-center shrink-0 bg-[#fafafa]">
          {ms === -1 ? (
            <span className="text-[11px] text-text-muted">
              Select an option above to continue
            </span>
          ) : ms === 0 ? (
            <span className="text-[11px] text-text-muted">
              Tip: Try APN <strong>808-631-06</strong> for demo
            </span>
          ) : (
            <button
              onClick={() =>
                setMs((s) => (s === 1 ? -1 : ((s - 1) as CreateOrderStep)))
              }
              className="inline-flex items-center gap-1.25 bg-white text-text-secondary border border-border rounded-lg px-3.5 py-1.5 text-[11px] font-semibold cursor-pointer hover:bg-secondary"
            >
              <Icon name="arrowLeft" size={11} />{" "}
              {ms === 1 ? "Change Method" : "Back"}
            </button>
          )}
          <div className="flex items-center gap-1.25">
            {[-1, 0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[5px] rounded-full transition-all duration-200"
                style={{
                  width: i === ms ? 18 : 5,
                  background:
                    i === ms
                      ? "var(--brand-primary)"
                      : i < ms
                        ? "var(--status-success-emerald)"
                        : "var(--border-primary)",
                }}
              />
            ))}
          </div>
          {ms === -1 ? (
            <span />
          ) : ms === 0 ? (
            <button
              onClick={handleSearch}
              disabled={searching}
              className="inline-flex items-center gap-1.25 bg-brand text-white border-none rounded-lg px-3.5 py-1.5 text-[12px] font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {searching ? (
                <>
                  <Icon name="loader" size={12} className="animate-spin" />{" "}
                  Searching…
                </>
              ) : (
                <>
                  <Icon name="search" size={12} /> Search Property
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                if (ms < 3) setMs((s) => (s + 1) as CreateOrderStep);
                else handleCreate();
              }}
              className="inline-flex items-center gap-1.25 bg-brand text-white border-none rounded-lg px-3.5 py-1.5 text-[12px] font-semibold cursor-pointer hover:bg-brand/90"
            >
              {ms === 3 ? "Create Order →" : "Next →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
