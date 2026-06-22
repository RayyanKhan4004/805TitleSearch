"use client";

import { useState, useRef, useEffect } from "react";
import Icon from "@/components/common/icon";
import { useFetchOrderQuery, useUpdateOrderMutation } from "@/app/store/api/ordersApi";
import { buildCreatePayload } from "./create-order/mapper";
import { mapOrderDetailToForm } from "@/app/services/datatree-api";
import type { PropertyForm, FormData, OrderDetail } from "@/app/components/feature/tables/types";
import type { PartiesState } from "./create-order/steps/step-parties";
import { DEFAULT_FORM } from "../consts";
import StepPropertyInfo from "./create-order/steps/step-property-info";
import StepFileInfo from "./create-order/steps/step-file-info";
import StepParties from "./create-order/steps/step-parties";
import toast from "react-hot-toast";

interface EditOrderModalProps {
  orderId: string;
  onClose: () => void;
}

type EditStep = 1 | 2 | 3;

const STEP_LABELS: Record<EditStep, string> = {
  1: "Property Info",
  2: "File Info",
  3: "Parties",
};

function mapDetailToFormData(d: OrderDetail): FormData {
  const property = mapOrderDetailToForm(d);

  const file: FormData["file"] = {
    ...DEFAULT_FORM.file,
    editMode: true,
    editOrderNo: d.orderNumber ?? String(d.id ?? ""),
    editStatus: (d as any).status ?? "Open",
    editRush: (d as any).rush ?? false,
    clientName: d.clientName ?? "",
    clientFileNo: d.clientFileNo ?? "",
    editClientFileNo: d.clientFileNo ?? "",
    editSource: d.sourceOfBusiness ?? "",
    editCloseDate: d.estimatedClosingDate ?? "",
    editDelivery: d.expectedDelivery ?? "",
    editSegment: d.businessSegment ?? "",
    transactionType: d.transactionType ?? "",
    editTransType: d.transactionType ?? "",
    productType: d.productType ?? "",
    editProductType: d.productType ?? "",
    editUnderwriter: d.underwriter ?? "",
    editSalePrice: d.salePrice ?? "",
    editLoanAmt: d.loanAmount ?? "",
    editLoanNo: d.loanNumber ?? "",
    loanNumber: d.loanNumber ?? "",
    editInsuredAmt: d.insuredAmount ?? "",
    editPremOwners: d.premiumOwners ?? "",
    editPremLenders: d.premiumLenders ?? "",
    editPremBinder: d.premiumBinder ?? "",
    editOwnersPolicy: d.ownersPolicyNo ?? "",
    editLoanPolicy: d.loanPolicyNo ?? "",
    editBinderPolicy: d.binderPolicyNo ?? "",
    editEscrowRef: d.escrowCoRefNo ?? "",
    editTitleOfficer: d.titleOfficer ?? "",
    editTitleOfficerEmail: d.titleOfficerEmail ?? "",
    editEscrowOfficer: d.escrowOfficer ?? "",
    editEscrowOfficerEmail: d.escrowOfficerEmail ?? "",
    editTitleRep: d.titleRep ?? "",
    editTitleRepEmail: d.titleRepEmail ?? "",
    editTitleRepPct: d.titleRepPercent ?? "",
    editFileSource: d.fileSource ?? "",
    sourceOfBusiness: d.sourceOfBusiness ?? "",
  };

  const escrowTitle = (d.escrowTitles?.[0] ?? {}) as Record<string, any>;
  const escrow: FormData["escrow"] = {
    escrowNo: "",
    escrowCompany: "",
    titleOffice: d.titleOffice ?? escrowTitle.titleOffice ?? "",
    escrowOffice: d.escrowOffice ?? escrowTitle.escrowOffice ?? "",
    branch: d.titleBranchReview ?? escrowTitle.titleBranch ?? "",
    loanOfficer: d.loanOfficer ?? escrowTitle.loanOfficer ?? "",
    lender: d.lenderBank ?? escrowTitle.lenderBank ?? "",
  };

  const la = (d.listingAgents?.[0] ?? {}) as Record<string, any>;
  const sa = (d.sellingAgents?.[0] ?? {}) as Record<string, any>;
  const lsa = (d.listingSellingAgents?.[0] ?? {}) as Record<string, any>;
  const ld = (d.lenders?.[0] ?? {}) as Record<string, any>;
  const mb = (d.mortgageBrokers?.[0] ?? {}) as Record<string, any>;
  const pc = (d.primaryContacts?.[0] ?? {}) as Record<string, any>;
  const cl = (d.clients?.[0] ?? {}) as Record<string, any>;

  const parties: FormData["parties"] = {
    ...DEFAULT_FORM.parties,
    buyers: (d.buyers ?? []).map((b: any, i: number) => ({
      id: b.id ?? i + 1,
      name: [b.firstName, b.lastName].filter(Boolean).join(" "),
      first: b.firstName ?? "",
      last: b.lastName ?? "",
      mid: b.middleSuffix ?? "",
      vesting: b.vesting ?? "",
      phone: b.phone ?? "",
      email: b.email ?? "",
      addr: b.mailingAddress ?? "",
      city: b.city ?? "",
      state: b.state ?? "",
      zip: b.zip ?? "",
      entity: b.entityType ?? "",
      ssn: b.ssnTaxId ?? "",
    })),
    sellers: (d.sellers ?? []).map((s: any, i: number) => ({
      id: s.id ?? i + 1,
      name: [s.firstName, s.lastName].filter(Boolean).join(" "),
      first: s.firstName ?? "",
      last: s.lastName ?? "",
      mid: s.middleSuffix ?? "",
      vesting: s.currentVesting ?? "",
      phone: s.phone ?? "",
      email: s.email ?? "",
      addr: s.mailingAddress ?? "",
      deedType: s.deedType ?? "",
      docNo: s.recordedDocNo ?? "",
    })),
    titleOffice: d.titleOffice ?? escrowTitle.titleOffice ?? "",
    escrowOffice: d.escrowOffice ?? escrowTitle.escrowOffice ?? "",
    branch: d.titleBranchReview ?? escrowTitle.titleBranch ?? "",
    titleOfficer: d.titleOfficer ?? escrowTitle.titleOfficer ?? "",
    titleOfficerEmail: d.titleOfficerEmail ?? escrowTitle.titleOfficerEmail ?? "",
    escrowOfficer: d.escrowOfficer ?? escrowTitle.escrowOfficer ?? "",
    escrowOfficerEmail: d.escrowOfficerEmail ?? escrowTitle.escrowOfficerEmail ?? "",
    loanOfficer: d.loanOfficer ?? escrowTitle.loanOfficer ?? "",
    lender: d.lenderBank ?? escrowTitle.lenderBank ?? "",
    laCompany: la.companyName ?? "",
    laCompDre: la.companyDre ?? "",
    laContact: la.contactName ?? "",
    laContDre: la.contactDre ?? "",
    laAddr: la.address ?? "",
    laCity: la.city ?? "",
    laState: la.state ?? "",
    laZip: la.zip ?? "",
    laPhone: la.phone ?? "",
    laFax: la.fax ?? "",
    laMobile: la.mobile ?? "",
    laEmail: la.email ?? "",
    laRef: la.refNo ?? "",
    saCompany: sa.companyName ?? "",
    saCompDre: sa.companyDre ?? "",
    saContact: sa.contactName ?? "",
    saContDre: sa.contactDre ?? "",
    saAddr: sa.address ?? "",
    saCity: sa.city ?? "",
    saState: sa.state ?? "",
    saZip: sa.zip ?? "",
    saPhone: sa.phone ?? "",
    saFax: sa.fax ?? "",
    saMobile: sa.mobile ?? "",
    saEmail: sa.email ?? "",
    saRef: sa.refNo ?? "",
    lsaCompany: lsa.companyName ?? "",
    lsaCompDre: lsa.companyDre ?? "",
    lsaContact: lsa.contactName ?? "",
    lsaContDre: lsa.contactDre ?? "",
    lsaAddr: lsa.address ?? "",
    lsaCity: lsa.city ?? "",
    lsaState: lsa.state ?? "",
    lsaZip: lsa.zip ?? "",
    lsaPhone: lsa.phone ?? "",
    lsaFax: lsa.fax ?? "",
    lsaMobile: lsa.mobile ?? "",
    lsaEmail: lsa.email ?? "",
    lsaRef: lsa.refNo ?? "",
    ldCompany: ld.companyName ?? "",
    ldCompNmls: ld.companyNmls ?? "",
    ldContact: ld.contactName ?? "",
    ldContNmls: ld.contactNmls ?? "",
    ldAddr: ld.address ?? "",
    ldCity: ld.city ?? "",
    ldState: ld.state ?? "",
    ldZip: ld.zip ?? "",
    ldPhone: ld.phone ?? "",
    ldFax: ld.fax ?? "",
    ldMobile: ld.mobile ?? "",
    ldEmail: ld.email ?? "",
    ldRef: ld.refNo ?? "",
    mbCompany: mb.companyName ?? "",
    mbCompNmls: mb.companyNmls ?? "",
    mbContact: mb.contactName ?? "",
    mbContNmls: mb.contactNmls ?? "",
    mbAddr: mb.address ?? "",
    mbCity: mb.city ?? "",
    mbState: mb.state ?? "",
    mbZip: mb.zip ?? "",
    mbPhone: mb.phone ?? "",
    mbFax: mb.fax ?? "",
    mbMobile: mb.mobile ?? "",
    mbEmail: mb.email ?? "",
    mbRef: mb.refNo ?? "",
    pcCompany: pc.companyName ?? "",
    pcCompId: pc.companyId ?? "",
    pcContact: pc.contactName ?? "",
    pcContId: pc.contactId ?? "",
    pcAddr1: pc.address ?? "",
    pcCity: pc.city ?? "",
    pcState: pc.state ?? "",
    pcZip: pc.zip ?? "",
    pcPhone: pc.phone ?? "",
    pcEmail: pc.email ?? "",
    clCompany: cl.companyName ?? "",
    clCompId: cl.companyId ?? "",
    clContact: cl.contactName ?? "",
    clContId: cl.contactId ?? "",
    clAddr: cl.address ?? "",
    clCity: cl.city ?? "",
    clState: cl.state ?? "",
    clZip: cl.zip ?? "",
    clPhone: cl.phone ?? "",
    clEmail: cl.email ?? "",
  };

  return { ...DEFAULT_FORM, property, file, escrow, parties };
}

export default function EditOrderModal({ orderId, onClose }: EditOrderModalProps) {
  const [step, setStep] = useState<EditStep>(1);
  const [d, setD] = useState<FormData>(DEFAULT_FORM);
  const [initialized, setInitialized] = useState(false);
  const partiesRef = useRef<PartiesState | null>(null);

  const { data: orderDetail, isLoading } = useFetchOrderQuery(orderId);
  const [updateOrder, { isLoading: saving }] = useUpdateOrderMutation();

  useEffect(() => {
    if (orderDetail && !initialized) {
      setD(mapDetailToFormData(orderDetail));
      setInitialized(true);
    }
  }, [orderDetail, initialized]);

  const upProp = (k: keyof PropertyForm, v: string) =>
    setD((prev) => ({ ...prev, property: { ...prev.property, [k]: v } }));

  const handleUpdate = async () => {
    const payload = buildCreatePayload(d.property, d.file, d.escrow, partiesRef.current);
    try {
      await updateOrder({ id: orderId, body: payload as any }).unwrap();
      toast.success("Order updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update order");
    }
  };

  const stepIndicator = (n: EditStep) => {
    const active = step === n;
    const done = step > n;
    return (
      <button
        key={n}
        onClick={() => (n < step ? setStep(n) : undefined)}
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
          background: active ? "#fff5f5" : done ? "var(--status-success-bg)" : "transparent",
          cursor: n <= step ? "pointer" : "default",
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
        {n}. {STEP_LABELS[n]}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-999 p-4">
      <div
        className="bg-white w-full rounded-[18px] overflow-hidden shadow-2xl flex flex-col max-h-[94vh]"
        style={{ maxWidth: 1100 }}
      >
        {/* Header */}
        <div className="bg-header text-white px-5.5 py-3.5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <Icon name="pencil" size={15} className="text-white" />
            </div>
            <div>
              <div className="text-[14px] font-bold">Edit Order #{orderId}</div>
              <div className="text-[10px] text-text-muted mt-0.5">
                {STEP_LABELS[step]} — update and save changes
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

        {/* Step tabs */}
        <div className="flex gap-1.25 px-5.5 pt-3 pb-0 border-b border-secondary shrink-0">
          {([1, 2, 3] as EditStep[]).map(stepIndicator)}
        </div>

        {/* Loading state */}
        {(isLoading || !initialized) && (
          <div className="flex-1 flex items-center justify-center gap-3 py-16">
            <Icon name="loader" size={18} className="animate-spin text-brand" />
            <span className="text-[13px] text-text-muted">Loading order data…</span>
          </div>
        )}

        {/* Step content */}
        {initialized && (
          <>
            {step === 1 && (
              <StepPropertyInfo
                form={d.property}
                onChange={upProp}
                apiResult={null}
                onReSearch={() => {}}
              />
            )}

            {step === 2 && (
              <StepFileInfo
                form={d.file}
                onChange={(field, value) =>
                  setD((prev) => ({ ...prev, file: { ...prev.file, [field]: value } }))
                }
                salePrice={d.property._lastSalePrice}
                loanAmount={d.property._mtgAmt}
              />
            )}

            {step === 3 && (
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
          </>
        )}

        {/* Footer */}
        <div className="border-t border-border px-5.5 py-3 flex justify-between items-center shrink-0 bg-[#fafafa]">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as EditStep)}
              className="inline-flex items-center gap-1.25 bg-white text-text-secondary border border-border rounded-lg px-3.5 py-1.5 text-[11px] font-semibold cursor-pointer hover:bg-secondary"
            >
              <Icon name="arrowLeft" size={11} /> Back
            </button>
          ) : (
            <span />
          )}

          {/* step dots */}
          <div className="flex items-center gap-1.25">
            {([1, 2, 3] as EditStep[]).map((i) => (
              <div
                key={i}
                className="h-1.25 rounded-full transition-all duration-200"
                style={{
                  width: i === step ? 18 : 5,
                  background:
                    i === step
                      ? "var(--brand-primary)"
                      : i < step
                        ? "var(--status-success-emerald)"
                        : "var(--border-primary)",
                }}
              />
            ))}
          </div>

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as EditStep)}
              className="inline-flex items-center gap-1.25 bg-brand text-white border-none rounded-lg px-3.5 py-1.5 text-[12px] font-semibold cursor-pointer hover:bg-brand/90"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="inline-flex items-center gap-1.25 bg-brand text-white border-none rounded-lg px-3.5 py-1.5 text-[12px] font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Icon name="loader" size={12} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Icon name="save" size={12} /> Update Order
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
