"use client";

import { useState, useRef } from "react";
import Icon from "@/components/common/icon";

import { useCreateOrderMutation } from "@/app/store/api/ordersApi";
import { useSearchReportMutation } from "@/app/store/api/propertyReportApi";
import { buildCreatePayload } from "./create-order/mapper";
import { mapReportToForm, buildApiResult } from "./create-order/property-mapper";
import type {
  PropertyForm,
  PropertyData,
  CreateOrderStep,
  FormData,
} from "@/app/components/feature/tables/types";
import type { PartiesState } from "./create-order/steps/step-parties";
import { CREATE_STEPS, DEFAULT_FORM } from "../consts";
import StepMethodSelection from "./create-order/steps/step-method-selection";
import StepPropertySearch from "./create-order/steps/step-property-search";
import StepPropertyInfo from "./create-order/steps/step-property-info";
import StepFileInfo from "./create-order/steps/step-file-info";
import StepParties from "./create-order/steps/step-parties";

interface CreateOrderModalProps {
  onClose: () => void;
}

type F = FormData;

export default function CreateOrderModal({
  onClose,
}: CreateOrderModalProps) {
  const [ms, setMs] = useState<CreateOrderStep>(-1);
  const [searchErr, setSearchErr] = useState("");
  const [apiResult, setApiResult] = useState<PropertyData | null>(null);

  const [createOrder, { isLoading: creating }] = useCreateOrderMutation();
  const [searchReport, { isLoading: searching }] = useSearchReportMutation();
  const partiesRef = useRef<PartiesState | null>(null);

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

  const handleSearch = async () => {
    setSearchErr("");
    setApiResult(null);
    try {
      const s = d.search;
      let body: Record<string, string> = {};
      if (s.type === "APN") {
        body = { searchType: "APN", apn: s.apnInput, zipCode: s.zipInput };
      } else if (s.type === "Address") {
        body = {
          searchType: "Address",
          houseNumber: s.addrNum,
          streetName: s.addrStr,
          city: s.addrCity,
          state: s.addrState,
          zip: s.addrZip,
        };
      } else if (s.type === "OwnerName") {
        body = { searchType: "OwnerName", ownerName: s.ownerName, state: s.addrState };
      } else {
        setSearchErr("Unsupported search type: " + s.type);
        return;
      }
      const res = await searchReport(body as never).unwrap();
      if (!res.found) {
        setSearchErr("No property found. Please check your search criteria.");
      } else {
        const propForm = mapReportToForm(res.form);
        setApiResult(buildApiResult(res));
        setD((prev) => ({
          ...prev,
          property: propForm,
          parties: {
            ...prev.parties,
            sFirst: (res.raw?.OwnerInformation?.OwnerNames || "").split(" ")[0] || "",
            sLast: (res.raw?.OwnerInformation?.OwnerNames || "").split(" ").slice(1).join(" ") || "",
          },
          escrow: {
            ...prev.escrow,
            lender: "",
          },
        }));
        setMs(1);
      }
    } catch (e) {
      setSearchErr("Search failed: " + (e as Error).message);
    }
  };

  const handleCreate = async () => {
    const payload = buildCreatePayload(d.property, d.file, d.escrow, partiesRef.current);
    try {
      await createOrder(payload).unwrap();
      onClose();
    } catch {
      // Error handled by RTK Query
    }
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

  return (
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-999 p-4">
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
            form={d.file}
            onChange={(field, value) => setD((prev) => ({ ...prev, file: { ...prev.file, [field]: value } }))}
            salePrice={d.property._lastSalePrice}
            loanAmount={d.property._mtgAmt}
          />
        )}

        {ms === 3 && (
          <StepParties
            form={d.property}
            defaultValue={{
              ...d.parties,
              titleOffice: d.escrow.titleOffice,
              escrowOffice: d.escrow.escrowOffice,
              branch: d.escrow.branch,
              loanOfficer: d.escrow.loanOfficer,
              lender: d.escrow.lender,
            } as unknown as PartiesState}
            onStateChange={(partyState) => {
              partiesRef.current = partyState;
              setD((prev) => ({
                ...prev,
                escrow: {
                  ...prev.escrow,
                  titleOffice: partyState.titleOffice,
                  escrowOffice: partyState.escrowOffice,
                  branch: partyState.branch,
                  loanOfficer: partyState.loanOfficer,
                  lender: partyState.lender,
                },
              }));
            }}
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
                className="h-1.25 rounded-full transition-all duration-200"
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
