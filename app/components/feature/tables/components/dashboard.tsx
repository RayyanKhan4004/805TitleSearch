"use client";

import Icon from "@/components/common/icon";
import { Button, Spinner } from "@/components/ui";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/auth-context";
import { useRouter } from "next/navigation";
import { useGetReportQuery } from "@/app/store/api/propertyReportApi";
import { useFetchOrdersQuery, useUpdateOrderRushMutation, useFetchOrderQuery, useUpdateOrderMutation } from "@/app/store/api/ordersApi";
import { mapApiToForm, mapOrderDetailToForm, mapOrderDetailToSharedState } from "@/app/services/datatree-api";
import { mapOrdersResponse } from "./models/api-mappers";
import toast from "react-hot-toast";
import type { PropertyForm } from "@/app/components/feature/tables/types";
import {
  StepDashboard,
  StepTitleChain,
  StepTSRI,
  StepDocuments,
  StepReview,
} from "./steps";
import Sidebar from "@/components/common/sidebar";
import Navbar from "@/components/common/navbar";
import { PrelimPreviewModal } from "./models";
import { EMPTY_SHARED_STATE } from "./temp";
import type { Order, OrderLock } from "@/app/components/feature/tables/types";

const WORK_STEPS = [
  { id: 1, label: "Title Chain Review", short: "Chain", icon: "link" },
  { id: 2, label: "TSRI", short: "TSRI", icon: "fileCheck" },
  { id: 3, label: "Documents & Notes", short: "Docs", icon: "clipboard" },
  { id: 4, label: "Final Review", short: "Review", icon: "shield" },
];

function flattenReportRaw(raw: Record<string, any>) {
  const subject = raw.SubjectProperty || {};
  return {
    PropertyId: subject.PropertyId,
    SitusAddress: subject.SitusAddress,
    ParsedStreetAddress: subject.ParsedStreetAddress,
    OwnerInformation: raw.OwnerInformation,
    LocationInformation: raw.LocationInformation,
    SiteInformation: raw.SiteInformation,
    PropertyCharacteristics: raw.PropertyCharacteristics,
    TaxInformation: raw.TaxInformation,
    OwnerTransferInformation: raw.OwnerTransferInformation,
    LastMarketSaleInformation: raw.LastMarketSaleInformation,
  };
}

export default function Dashboard() {
  const { logout, user } = useAuth();
    const router = useRouter();
  const currentUserName = user ? `${user.firstName} ${user.lastName}` : "Unknown";

  const { data: ordersData, isLoading: isLoadingOrders } = useFetchOrdersQuery({ page: 1, pageSize: 500 });
  const [updateOrderRush] = useUpdateOrderRushMutation();
  const [updateOrder, { isLoading: isSaving }] = useUpdateOrderMutation();

  const [reportParams, setReportParams] = useState<{
    searchType: string; apn: string; zipCode: string;
  } | null>(null);
  const { data: reportData, isLoading: isLoadingReport } = useGetReportQuery(
    reportParams!,
    { skip: !reportParams },
  );
  const [orderDetailId, setOrderDetailId] = useState<string | null>(null);
  const { data: orderDetail } = useFetchOrderQuery(orderDetailId!, {
    skip: !orderDetailId,
  });
  const [propertyForm, setPropertyForm] = useState<PropertyForm | null>(null);

  /* null = no file open (dashboard only); object = selected order */
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [step, setStep] = useState(1); /* 1=Chain,2=TSRI,3=Docs,4=Review */

  /* Order status + lock tracking */
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(
    {},
  );
  const [lockedBy, setLockedBy] = useState<Record<string, OrderLock | null>>(
    {},
  );
  const [lockAttempt, setLockAttempt] = useState<{
    no: string;
    lock: OrderLock;
  } | null>(null);
  const [prelimData, setPrelimData] = useState(null); /* null = not showing */

  /* Shared state between Title Chain + TSRI */
  const [shared, setShared] = useState(EMPTY_SHARED_STATE);

  /* Generated documents from TSRI */
  const [generatedDocs, setGeneratedDocs] = useState<
    Array<{
      name: string;
      date: string;
      size: string;
      type: string;
      body?: string;
    }>
  >([]);

  const getOrderStatus = (no: string) => orderStatuses[no] || "Open";

  const getLock = (no: string) => lockedBy[no] || null;
  const isLockedByMe = (no: string) => getLock(no)?.user === currentUserName;
  // const isLockedByOther = (no: string) => {
  //   const lock = getLock(no);
  //   return lock && lock.user !== currentUserName;
  // };

  function buildPrelimData(tsri: any, shared: any) {
    const exceptions = (shared.chainCodes || []).filter(
      (c: any) => c.type === "exception",
    );
    const requirements = (shared.chainCodes || []).filter(
      (c: any) => c.type === "requirement",
    );
    const notes = (shared.chainCodes || []).filter(
      (c: any) => c.type === "note",
    );
    return {
      orderNo: "2026-000123",
      fileNo: "ESC-2026-4412",
      titleOfficer: "John Smith",
      titleEmail: "john.smith@805title.com",
      titlePhone: "(805) 568-6006",
      titleFax: "(805) 568-7838",
      propertyAddress: "12345 Main Street, Apt 2, Rialto, CA 92376",
      effectiveDate: tsri.effectiveDate || shared.effectiveDate || "05/07/2026",
      effectiveTime: "8:00 AM",
      county: "San Bernardino",
      city: "Rialto",
      vestingName: tsri.vesting || shared.vesting || "",
      vestingType: "Community Property",
      leaseHold: tsri.leaseHold || shared.leaseHold || "",
      legal: tsri.legal || shared.legal || "",
      apn: "0557-081-23-0000",
      exceptions,
      requirements,
      notes,
      easements: tsri.easements || "",
      extraNotes: tsri.notes || "",
    };
  }

  function buildPrelimBody(tsri: any, shared: any) {
    const d = buildPrelimData(tsri, shared);
    return [
      `PRELIMINARY REPORT — Order No. ${d.orderNo}`,
      `Property: ${d.propertyAddress}`,
      `Effective: ${d.effectiveDate} at ${d.effectiveTime}`,
      `Vesting: ${d.vestingName}`,
      `Legal: ${d.legal}`,
      `APN: ${d.apn}`,
      ...d.exceptions.map(
        (e: any, i: number) => `Exception ${i + 1}: ${e.verbiage}`,
      ),
      ...d.requirements.map(
        (r: any, i: number) => `Note ${i + 1}: ${r.verbiage}`,
      ),
    ].join("\n");
  }

  const handleGeneratePrelim = (tsriData: any) => {
    const date = new Date().toLocaleDateString("en-US");
    const pData = buildPrelimData(tsriData, shared);
    setPrelimData(pData as any); /* open preview modal */
    setGeneratedDocs((d) => [
      {
        name: "Preliminary_Report_" + date.replace(/\//g, "-") + ".docx",
        date,
        size: "—",
        type: "template",
        body: buildPrelimBody(tsriData, shared),
        prelimData: pData,
      },
      ...d,
    ]);
  };

  useEffect(() => {
    if (reportData?.found && reportParams) {
      const propertyData = flattenReportRaw(reportData.raw);
      const pf = mapApiToForm(propertyData);
      setPropertyForm(pf);
      setShared((s) => ({
        ...s,
        vesting:
          reportData.form.vesting ||
          reportData.form.vestingText ||
          "",
        legal:
          reportData.form.legalDescription ||
          reportData.form.shortLegal ||
          "",
        effectiveDate: new Date().toLocaleDateString("en-US"),
      }));
    }
  }, [reportData]);

  /* Populate property form + shared state from order detail (GET /orders/:id) */
  useEffect(() => {
    if (orderDetail) {
      const pf = mapOrderDetailToForm(orderDetail);
      setPropertyForm(pf);
      const odShared = mapOrderDetailToSharedState(orderDetail);
      setShared((s) => ({
        ...s,
        vesting: odShared.vesting,
        legal: odShared.legal,
        leaseHold: odShared.leaseHold,
        effectiveDate: odShared.effectiveDate,
        typeDate: odShared.typeDate,
        areaType: odShared.areaType,
        cityName: odShared.cityName,
        townshipName: odShared.townshipName,
        unincorporatedName: odShared.unincorporatedName,
        propertyClassification: odShared.propertyClassification,
      }));
    }
  }, [orderDetail]);

  const handleSelectOrder = async (order: Order) => {
    const no = order.no.replace("#", "");
    /* Block if locked by someone else */
    const lock = getLock(no);
    if (lock && lock.user !== currentUserName) {
      setLockAttempt({ no, lock });
      return;
    }
    /* Change status Open → In Review */
    setOrderStatuses((s) => ({ ...s, [no]: "In Review" }));
    /* Lock the order */
    setLockedBy((l) => ({
      ...l,
      [no]: { user: currentUserName, since: new Date().toLocaleTimeString() },
    }));
    setSelectedOrder({ ...order, no });
    setStep(1);

    setPropertyForm(null);
    setOrderDetailId(order.id ? String(order.id) : order.no.replace("#", ""));
    setReportParams({
      searchType: "APN",
      apn: order.apn1 || order.apn || "",
      zipCode: order.zipCode || "",
    });
  };

  /* Save — PATCH order detail with current title chain data */
  const handleSave = async (dates?: { typeDate: string; effectiveDate: string }) => {
    if (!orderDetailId) return;
    const body: Record<string, any> = {
      legalDescription: shared.legal || null,
      vesting: shared.vesting || null,
      shortLegal: propertyForm?.shortLegal || null,
      leaseHoldInterest: shared.leaseHold || null,
      effectiveDate: dates?.effectiveDate || shared.effectiveDate || null,
      typeDate: dates?.typeDate || shared.typeDate || null,
      city: shared.cityName || null,
      cityTownshipName: shared.townshipName || null,
      municipality: shared.unincorporatedName || null,
      propertyClassification: shared.propertyClassification || null,
    };
    try {
      await updateOrder({ id: orderDetailId, body: body as any }).unwrap();
      toast.success("Order saved");
    } catch {
      toast.error("Failed to save order");
    }
  };

  /* unlockAndClose — called ONLY from Save & Close button */
  const unlockAndClose = () => {
    if (selectedOrder) {
      const no = selectedOrder.no;
      setOrderStatuses((s) => ({ ...s, [no]: "Open" }));
      setLockedBy((l) => ({ ...l, [no]: null }));
    }
    setSelectedOrder(null);
  };

  /* backToDashboard — called from ← All Files; keeps lock + In Review */
  const handleCloseOrder = () => {
    setSelectedOrder(null);
    /* Status stays "In Review", lock stays active */
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9]">
      {/* ── Sidebar ── */}
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* ── Header ── */}
        <Navbar onDashboardClick={() => setSelectedOrder(null)} />

        {/* ═══════════════════════════════════════════
            DASHBOARD MODE — no order selected
        ═══════════════════════════════════════════ */}
        {!selectedOrder && (
          <>
            {/* dashboard header bar */}
            <div className="bg-white border-b border-border flex items-center px-5 h-9.5 shrink-0 gap-2.5">
              <Icon name="dashboard" size={13} style={{ color: "var(--brand-primary)" }} />
              <span className="text-[12px] font-bold text-text">
                Dashboard
              </span>
              <span className="text-border">|</span>
              <span className="text-[11px] text-text-muted">
                Select a file to open the title workflow
              </span>
            </div>
            {/* full-bleed dashboard */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {isLoadingOrders ? (
                <div className="flex items-center justify-center flex-1">
                  <Spinner className="text-brand" />
                </div>
              ) : (
                <StepDashboard
                  orders={ordersData ? mapOrdersResponse(ordersData.data) : []}
                  onSelect={handleSelectOrder}
                  getOrderStatus={getOrderStatus}
                  getLock={getLock}
                  onRushToggle={(no) => updateOrderRush({ no, rush: true })}
                />
              )}
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════
            FILE OPEN MODE — order selected
        ═══════════════════════════════════════════ */}
        {selectedOrder && (
          <>
            {/* order bar */}
            <div className="bg-white border-b border-border flex items-center px-5 h-9.5 shrink-0 gap-2.5">
              <button
                onClick={handleCloseOrder}
                className="flex items-center gap-1 bg-transparent border-none text-brand text-[11px] font-semibold cursor-pointer pr-2.5 mr-1.5 border-r border-border"
              >
                <Icon name="arrowLeft" size={11} />
                All Files
              </button>
              <span className="text-[11px] text-text-muted">Order #:</span>
              <span className="text-[11px] font-bold text-text">
                {selectedOrder.no}
              </span>
              <span className="text-border">|</span>
              <span className="text-[11px] text-text-muted">
                {selectedOrder.addr}
              </span>
              <span className="text-border">|</span>
              <span className="text-[11px] text-text-muted">
                {selectedOrder.owner}
              </span>
              <span className="text-border">|</span>
              {/* live status badge */}
              {(() => {
                const st = getOrderStatus(selectedOrder.no);
                const dotColor =
                  st === "In Review"
                    ? "var(--status-warning-border)"
                    : st === "Closed"
                      ? "var(--status-info-bg)"
                      : "var(--status-success-dark)";
                const txtColor =
                  st === "In Review"
                    ? "var(--status-warning-text)"
                    : st === "Closed"
                      ? "var(--status-info-text)"
                      : "var(--status-success-emerald-dark)";
                return (
                  <span
                    className="flex items-center gap-1 text-[11px] font-semibold"
                    style={{ color: txtColor }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{ background: dotColor }}
                    />
                    {st}
                  </span>
                );
              })()}
              {/* lock indicator */}
              {isLockedByMe(selectedOrder.no) && (
                <span className="flex items-center gap-1 bg-status-warning-subtle border border-status-warning-border rounded-full px-2.5 py-0.5 text-[10px] font-bold text-status-warning-text">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Locked by You
                </span>
              )}
              {isLoadingReport && (
                <span className="flex items-center gap-1.5 text-text-muted text-[10px]">
                  <Spinner size="xs" variant="default" />
                  Loading property data…
                </span>
              )}
              <div className="flex-1" />
              <Button variant="secondary" size="sm">
                <Icon name="save" size={11} />
                Save Draft
              </Button>
              {/* <Button size="sm" style={{ background: "#8B0000" }}>
                Create TSR
              </Button> */}
            </div>

            {/* work-step tabs */}
            <div className="bg-white border-b border-border shrink-0">
              <div className="flex px-4.5">
                {WORK_STEPS.map((s, i) => {
                  const idx = i + 1;
                  const active = step === idx,
                    done = step > idx;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStep(idx)}
                      className="flex items-center gap-1.5 px-3.5 py-2.75 text-[11px] font-semibold border-none cursor-pointer relative transition-all duration-150"
                      style={{
                        borderBottom: active
                          ? "2px solid var(--brand-primary)"
                          : done
                            ? "2px solid var(--status-success-emerald)"
                            : "2px solid transparent",
                        color: active
                          ? "var(--brand-primary)"
                          : done
                            ? "var(--status-success-emerald-dark)"
                            : "var(--text-tertiary)",
                        background: active
                          ? "var(--brand-primary-subtle)"
                          : "transparent",
                      }}
                    >
                      <div
                        className="w-4.5 h-4.5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold transition-[background] duration-150"
                        style={{
                          background: active
                            ? "var(--brand-primary)"
                            : done
                              ? "var(--status-success-emerald)"
                              : "var(--border-primary)",
                          color: active || done ? "var(--color-white)" : "var(--text-tertiary)",
                        }}
                      >
                        {done ? <Icon name="check" size={9} /> : idx}
                      </div>
                      {s.label}
                      {i < WORK_STEPS.length - 1 && (
                        <Icon
                          name="chevRight"
                          size={11}
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-border"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {/* step heading */}
              <div className="px-5 pt-3.5 pb-0 shrink-0">
                <div className="flex items-center gap-2.75 max-w-300 mx-auto">
                  <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shrink-0">
                    <Icon
                      name={WORK_STEPS[step - 1].icon}
                      size={15}
                      className="text-header-text"
                    />
                  </div>
                  <div>
                    <h1 className="m-0 text-[15px] font-bold text-text">
                      {WORK_STEPS[step - 1].label}
                    </h1>
                    <p className="m-0 text-[10px] text-text-muted">
                      Step {step} of {WORK_STEPS.length}
                    </p>
                  </div>
                  <div className="flex-1" />
                  <div className="flex items-center gap-1">
                    {WORK_STEPS.map((_, i) => (
                      <div
                        key={i}
                        className="h-1.25 rounded-full transition-[width,background] duration-300"
                        style={{
                          width: i + 1 === step ? 22 : 10,
                          background:
                            i + 1 === step
                              ? "var(--brand-primary)"
                              : i + 1 < step
                                ? "var(--ui-progress-complete)"
                                : "var(--ui-progress-bg)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* active step */}
              <div className="flex-1 overflow-y-auto pt-3 px-5 max-w-310 w-full mx-auto box-border">
                {step === 1 && (
                  <StepTitleChain
                    shared={shared}
                    setShared={setShared}
                    propertyForm={propertyForm ?? undefined}
                    reportRaw={reportData?.raw}
                    isLoading={isLoadingReport || isSaving}
                    onSave={handleSave}
                    onSaveClose={unlockAndClose}
                  />
                )}
                {step === 2 && (
                  <StepTSRI
                    shared={shared}
                    setShared={setShared}
                    onGenerate={handleGeneratePrelim}
                  />
                )}
                {step === 3 && (
                  <StepDocuments
                    extraDocs={generatedDocs}
                    onSaveClose={unlockAndClose}
                  />
                )}
                {step === 4 && <StepReview onSaveClose={unlockAndClose} />}
              </div>

              {/* prev / next bar */}
          
            </div>
          </>
        )}

        {/* ── Lock-blocked modal ── */}
        {prelimData && (
          <PrelimPreviewModal
            data={prelimData}
            onClose={() => setPrelimData(null)}
          />
        )}
        {lockAttempt && (
          <div
            className="fixed inset-0 bg-black/55 flex items-center justify-center z-999 p-6"
            onClick={() => setLockAttempt(null)}
          >
              <div
                className="bg-white w-105 rounded-2xl overflow-hidden"
                style={{ boxShadow: "var(--modal-shadow-strong)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-status-warning-text px-5 py-3.5 flex items-center gap-2.5">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-white)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <span className="text-[14px] font-bold text-(--color-white)">
                    Order Locked
                  </span>
                </div>
                <div className="p-5.5 flex flex-col gap-3.5">
                  <p className="m-0 text-[12px] text-text-secondary leading-[1.6]">
                    Order{" "}
                    <strong className="text-text">#{lockAttempt.no}</strong>{" "}
                    is currently locked and in review by:
                  </p>
                  <div className="bg-status-warning-subtle border border-status-warning-border rounded-[10px] px-4 py-3 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-status-warning-border flex items-center justify-center text-white text-[13px] font-bold shrink-0">
                      {lockAttempt.lock.user[0]}
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-status-warning-text">
                        {lockAttempt.lock.user}
                      </div>
                      <div className="text-[11px] text-text-muted">
                        Locked since {lockAttempt.lock.since}
                      </div>
                    </div>
                  </div>
                  <p className="m-0 text-[11px] text-text-muted leading-normal">
                    This order will become available once the examiner saves and
                    closes the file. Please try again later or contact the
                    examiner directly.
                  </p>
                  <Button
                    onClick={() => setLockAttempt(null)}
                    style={{
                      background: "var(--brand-primary)",
                      justifyContent: "center",
                      fontSize: 12,
                      padding: "9px",
                    }}
                  >
                    OK, Got It
                  </Button>
                </div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
