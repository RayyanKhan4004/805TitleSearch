"use client";

import Icon from "@/components/common/icon";
import { Button } from "@/components/ui";
import { useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import {
  StepDashboard,
  StepTitleChain,
  StepTSRI,
  StepDocuments,
  StepReview,
} from "./steps";
import { STEPS, NAV_ICONS } from "./consts";
import type { Order, OrderLock } from "@/app/components/feature/tables/types";

const CURRENT_USER = "John Smith";

const WORK_STEPS = [
  { id: 1, label: "Title Chain Review", short: "Chain", icon: "link" },
  { id: 2, label: "TSRI", short: "TSRI", icon: "fileCheck" },
  { id: 3, label: "Documents & Notes", short: "Docs", icon: "clipboard" },
  { id: 4, label: "Final Review", short: "Review", icon: "shield" },
];

export default function Dashboard() {
  const { logout } = useAuth();

  /* null = no file open (dashboard only); object = selected order */
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [step, setStep] = useState(1); /* 1=Chain,2=TSRI,3=Docs,4=Review */

  /* Order status + lock tracking */
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>({});
  const [lockedBy, setLockedBy] = useState<Record<string, OrderLock | null>>({});
  const [lockAttempt, setLockAttempt] = useState<{ no: string; lock: OrderLock } | null>(null);

  /* Shared state between Title Chain + TSRI */
  const [shared, setShared] = useState({
    vesting: "John D. Doe and Jane R. Doe, husband and wife as community property, COUNTY OF SAN BERNARDINO, STATE OF CALIFORNIA.",
    legal: "LOT 22 OF TRACT 12345, IN THE CITY OF RIALTO, COUNTY OF SAN BERNARDINO, STATE OF CALIFORNIA, AS PER MAP RECORDED IN BOOK 123, PAGE 45 OF MAPS, IN THE OFFICE OF THE COUNTY RECORDER OF SAID COUNTY.",
    leaseHold: "Fee simple estate subject to leasehold interest as disclosed in supporting documents.",
    effectiveDate: "05/07/2026",
    chainCodes: [
      { id: 1, type: "exception" as const, code: "Exception 1", verbiage: "Property taxes, including any personal property taxes and any assessments collected with taxes, for the fiscal year 2025-2026, a lien not yet due and payable. APN: 0557-081-23-0000" },
      { id: 2, type: "exception" as const, code: "Exception 2", verbiage: "An easement for public utilities and incidental purposes in favor of CITY OF GLENDALE, recorded April 11, 1998 as Instrument No. 1998-0022341." },
      { id: 3, type: "exception" as const, code: "Exception 3", verbiage: "Covenants, Conditions and Restrictions of SUNSET HILLS HOA, recorded July 19, 2005 as Instrument No. 2005-0188770." },
      { id: 4, type: "exception" as const, code: "Exception 4", verbiage: "A Deed of Trust to secure an indebtedness executed by JOHN D. DOE, Trustor, in favor of BANK OF AMERICA, N.A., recorded as Instrument No. 2025-0213146. Must be paid off prior to close." },
      { id: 5, type: "exception" as const, code: "Exception 5", verbiage: "A Judgment Lien in favor of COUNTY OF LOS ANGELES, recorded January 30, 2024 as Instrument No. 2024-0031122. Must be resolved prior to close." },
      { id: 6, type: "requirement" as const, code: "Requirement 1", verbiage: "A Grant Deed from MICHAEL SMITH to JOHN D. DOE AND JANE R. DOE conveying the subject property must be executed, delivered, and duly recorded." },
      { id: 7, type: "requirement" as const, code: "Requirement 2", verbiage: "Payment of all outstanding property taxes and assessments through the date of closing." },
      { id: 8, type: "note" as const, code: "Note A", verbiage: "According to the public records, there have been no deeds conveying the property within a period of twenty-four (24) months prior to the date of this report, EXCEPT as shown herein." },
    ],
  });

  /* Generated documents from TSRI */
  const [generatedDocs, setGeneratedDocs] = useState<Array<{ name: string; date: string; size: string; type: string; body?: string }>>([]);

  const getOrderStatus = (no: string) =>
    orderStatuses[no] || "Open";

  const getLock = (no: string) => lockedBy[no] || null;
  const isLockedByMe = (no: string) => getLock(no)?.user === CURRENT_USER;
  const isLockedByOther = (no: string) => {
    const lock = getLock(no);
    return lock && lock.user !== CURRENT_USER;
  };

  const handleGeneratePrelim = (tsriData: Record<string, unknown>) => {
    const date = new Date().toLocaleDateString("en-US");
    setGeneratedDocs((d) => [
      {
        name: "Preliminary_Report_" + date.replace(/\//g, "-") + ".docx",
        date,
        size: "—",
        type: "template",
        body: tsriData.body as string | undefined,
      },
      ...d,
    ]);
    setStep(3);
  };

  const handleSelectOrder = (order: Order) => {
    const no = order.no.replace("#", "");
    /* Block if locked by someone else */
    const lock = getLock(no);
    if (lock && lock.user !== CURRENT_USER) {
      setLockAttempt({ no, lock });
      return;
    }
    /* Change status Open → In Review */
    setOrderStatuses((s) => ({ ...s, [no]: "In Review" }));
    /* Lock the order */
    setLockedBy((l) => ({
      ...l,
      [no]: { user: CURRENT_USER, since: new Date().toLocaleTimeString() },
    }));
    setSelectedOrder({ ...order, no });
    setStep(1);
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
      <aside
        className="w-[52px] shrink-0 bg-[#1e2130] flex flex-col items-center py-3 px-1.5 gap-1 z-20"
        style={{ boxShadow: "2px 0 12px rgba(0,0,0,.18)" }}
      >
        <div className="w-9 h-9 bg-[#8B0000] rounded-[10px] flex items-center justify-center mb-2.5">
          <Icon name="building" size={17} className="text-white" />
        </div>
        {NAV_ICONS.map(({ name, label, active }) => (
          <div
            key={name}
            title={label}
            className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-[background] duration-150"
            style={{
              background: active ? "#8B0000" : "transparent",
              color: active ? "#fff" : "#94a3b8",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = "#2d3348";
                e.currentTarget.style.color = "#fff";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#94a3b8";
              }
            }}
          >
            <Icon name={name} size={16} />
          </div>
        ))}
        <div className="flex-1" />
        <Icon
          name="help"
          size={16}
          className="text-[#64748b] cursor-pointer mb-1.5"
        />
        <div className="w-7 h-7 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-[10px] font-bold cursor-pointer">
          JB
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* ── Header ── */}
        <header
          className="bg-[#1e2130] flex items-center gap-2.5 px-4 h-[42px] shrink-0 z-10"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,.2)" }}
        >
          <div className="flex items-center gap-1.5 mr-2">
            <Icon name="building" size={15} style={{ color: "#f87171" }} />
            <div>
              <div className="text-white text-[12px] font-extrabold tracking-wide">
                805Title
              </div>
              <div className="text-[#f87171] text-[8px] tracking-[0.18em] font-bold">
                SEARCH
              </div>
            </div>
          </div>
          {["Dashboard", "Orders", "Search", "Title Chain", "Documents", "Tasks"].map((item) => (
            <button
              key={item}
              onClick={item === "Dashboard" ? handleCloseOrder : undefined}
              className={`border-none text-[11px] font-medium px-2 py-1 rounded-[5px] cursor-pointer ${item === "Tasks" ? "bg-white/10 text-white" : "bg-transparent text-[#94a3b8]"}`}
            >
              {item}
            </button>
          ))}
          <div className="flex-1 mx-2">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#64748b] flex">
                <Icon name="search" size={12} />
              </span>
              <input
                placeholder="Quick Search (APN, Address, Order, Instrument…)"
                className="w-full pl-7.5 pr-2.5 py-1.25 rounded-md text-[11px] outline-none box-border"
                style={{
                  background: "rgba(100,116,139,.25)",
                  border: "1px solid #475569",
                  color: "#cbd5e1",
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative cursor-pointer text-[#94a3b8]">
              <Icon name="bell" size={15} />
              <span className="absolute -top-1 -right-1 bg-[#dc2626] text-white text-[8px] font-bold w-3.25 h-3.25 rounded-full flex items-center justify-center">
                0
              </span>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer">
              <div className="w-6.5 h-6.5 rounded-full bg-[#2563eb] flex items-center justify-center text-white text-[10px] font-bold">
                JB
              </div>
              <div>
                <div className="text-white text-[11px] font-semibold">
                  John Smith
                </div>
                <div className="text-[#64748b] text-[9px]">Deceneer</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="bg-transparent border-none text-[#94a3b8] hover:text-white cursor-pointer transition-colors p-1"
              title="Sign out"
            >
              <Icon name="arrowRight" size={14} />
            </button>
          </div>
        </header>

        {/* ═══════════════════════════════════════════
            DASHBOARD MODE — no order selected
        ═══════════════════════════════════════════ */}
        {!selectedOrder && (
          <>
            {/* dashboard header bar */}
            <div className="bg-white border-b border-[#e2e8f0] flex items-center px-5 h-[38px] shrink-0 gap-2.5">
              <Icon name="dashboard" size={13} style={{ color: "#8B0000" }} />
              <span className="text-[12px] font-bold text-[#1e293b]">
                Dashboard
              </span>
              <span className="text-[#e2e8f0]">|</span>
              <span className="text-[11px] text-[#94a3b8]">
                Select a file to open the title workflow
              </span>
            </div>
            {/* full-bleed dashboard */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <StepDashboard
                onSelect={handleSelectOrder}
                getOrderStatus={getOrderStatus}
                getLock={getLock}
              />
            </div>
          </>
        )}

        {/* ═══════════════════════════════════════════
            FILE OPEN MODE — order selected
        ═══════════════════════════════════════════ */}
        {selectedOrder && (
          <>
            {/* order bar */}
            <div className="bg-white border-b border-[#e2e8f0] flex items-center px-5 h-[38px] shrink-0 gap-2.5">
              <button
                onClick={handleCloseOrder}
                className="flex items-center gap-1 bg-transparent border-none text-[#8B0000] text-[11px] font-semibold cursor-pointer pr-2.5 mr-1.5 border-r border-[#e2e8f0]"
              >
                <Icon name="arrowLeft" size={11} />
                All Files
              </button>
              <span className="text-[11px] text-[#94a3b8]">Order #:</span>
              <span className="text-[11px] font-bold text-[#1e293b]">
                {selectedOrder.no}
              </span>
              <span className="text-[#e2e8f0]">|</span>
              <span className="text-[11px] text-[#94a3b8]">
                {selectedOrder.addr}
              </span>
              <span className="text-[#e2e8f0]">|</span>
              <span className="text-[11px] text-[#94a3b8]">
                {selectedOrder.owner}
              </span>
              <span className="text-[#e2e8f0]">|</span>
              {/* live status badge */}
              {(() => {
                const st = getOrderStatus(selectedOrder.no);
                const dotColor =
                  st === "In Review" ? "#f59e0b" : st === "Closed" ? "#6366f1" : "#22c55e";
                const txtColor =
                  st === "In Review" ? "#92400e" : st === "Closed" ? "#3730a3" : "#16a34a";
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
                <span
                  className="flex items-center gap-1 bg-[#fffbeb] border border-[#fde68a] rounded-full px-2.5 py-0.5 text-[10px] font-bold text-[#92400e]"
                >
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
              <div className="flex-1" />
              <Button variant="secondary" size="sm">
                <Icon name="save" size={11} />
                Save Draft
              </Button>
              <Button size="sm" style={{ background: "#8B0000" }}>
                Create TSR
              </Button>
            </div>

            {/* work-step tabs */}
            <div className="bg-white border-b border-[#e2e8f0] shrink-0">
              <div className="flex px-4.5">
                {WORK_STEPS.map((s, i) => {
                  const idx = i + 1;
                  const active = step === idx, done = step > idx;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStep(idx)}
                      className="flex items-center gap-1.5 px-3.5 py-2.75 text-[11px] font-semibold border-none cursor-pointer relative transition-all duration-150"
                      style={{
                        borderBottom: active
                          ? "2px solid #8B0000"
                          : done
                            ? "2px solid #10b981"
                            : "2px solid transparent",
                        color: active
                          ? "#8B0000"
                          : done
                            ? "#059669"
                            : "#64748b",
                        background: active ? "rgba(139,0,0,.03)" : "transparent",
                      }}
                    >
                      <div
                        className="w-4.5 h-4.5 rounded-full shrink-0 flex items-center justify-center text-[9px] font-bold transition-[background] duration-150"
                        style={{
                          background: active
                            ? "#8B0000"
                            : done
                              ? "#10b981"
                              : "#e2e8f0",
                          color: active || done ? "#fff" : "#64748b",
                        }}
                      >
                        {done ? <Icon name="check" size={9} /> : idx}
                      </div>
                      {s.label}
                      {i < WORK_STEPS.length - 1 && (
                        <Icon
                          name="chevRight"
                          size={11}
                          className="absolute right-0 top-1/2 -translate-y-1/2 text-[#e2e8f0]"
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
                  <div className="w-8 h-8 bg-[#8B0000] rounded-lg flex items-center justify-center shrink-0">
                    <Icon name={WORK_STEPS[step - 1].icon} size={15} className="text-white" />
                  </div>
                  <div>
                    <h1 className="m-0 text-[15px] font-bold text-[#1e293b]">
                      {WORK_STEPS[step - 1].label}
                    </h1>
                    <p className="m-0 text-[10px] text-[#94a3b8]">
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
                              ? "#8B0000"
                              : i + 1 < step
                                ? "#34d399"
                                : "#e2e8f0",
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
                {step === 4 && (
                  <StepReview onSaveClose={unlockAndClose} />
                )}
              </div>

              {/* prev / next bar */}
              <div className="bg-white border-t border-[#e2e8f0] px-5 py-2.5 flex items-center justify-between shrink-0">
                <Button
                  variant="secondary"
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  disabled={step === 1}
                  className={step === 1 ? "opacity-40 cursor-not-allowed" : ""}
                >
                  <Icon name="arrowLeft" size={12} />
                  Previous Step
                </Button>
                <div className="flex items-center gap-1.25">
                  {WORK_STEPS.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => setStep(i + 1)}
                      className="cursor-pointer h-1.75 rounded-full transition-all duration-200"
                      style={{
                        width: i + 1 === step ? 18 : 7,
                        background:
                          i + 1 === step
                            ? "#8B0000"
                            : i + 1 < step
                              ? "#34d399"
                              : "#e2e8f0",
                      }}
                    />
                  ))}
                </div>
                {step < WORK_STEPS.length ? (
                  <Button
                    onClick={() => setStep((s) => s + 1)}
                    style={{ background: "#8B0000" }}
                  >
                    Next Step
                    <Icon name="arrowRight" size={12} />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {}}
                    style={{ background: "#059669" }}
                  >
                    <Icon name="checkCircle" size={12} />
                    Submit Order
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── Lock-blocked modal ── */}
        {lockAttempt && (
          <div
            className="fixed inset-0 bg-black/55 flex items-center justify-center z-[999] p-6"
            onClick={() => setLockAttempt(null)}
          >
            <div
              className="bg-white w-[420px] rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 24px 64px rgba(0,0,0,.3)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#92400e] px-5 py-3.5 flex items-center gap-2.5">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span className="text-[14px] font-bold text-white">Order Locked</span>
              </div>
              <div className="p-5.5 flex flex-col gap-3.5">
                <p className="m-0 text-[12px] text-[#475569] leading-[1.6]">
                  Order <strong className="text-[#1e293b]">#{lockAttempt.no}</strong> is currently locked and in review by:
                </p>
                <div className="bg-[#fffbeb] border border-[#fde68a] rounded-[10px] px-4 py-3 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#f59e0b] flex items-center justify-center text-white text-[13px] font-bold shrink-0">
                    {lockAttempt.lock.user[0]}
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#92400e]">{lockAttempt.lock.user}</div>
                    <div className="text-[11px] text-[#94a3b8]">Locked since {lockAttempt.lock.since}</div>
                  </div>
                </div>
                <p className="m-0 text-[11px] text-[#94a3b8] leading-[1.5]">
                  This order will become available once the examiner saves and closes the file. Please try again later or contact the examiner directly.
                </p>
                <Button
                  onClick={() => setLockAttempt(null)}
                  style={{ background: "#8B0000", justifyContent: "center", fontSize: 12, padding: "9px" }}
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
