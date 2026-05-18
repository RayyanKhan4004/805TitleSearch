"use client";

import Icon from "@/components/common/icon";
import { Button } from "@/components/ui";
import { useState } from "react";
import { useAuth } from "@/app/context/auth-context";
import {
  StepDashboard,
  StepLegalVesting,
  StepTitleChain,
  StepDocuments,
  StepReview,
} from "./steps";
import { STEPS, NAV_ICONS } from "./consts";

export default function Dashboard() {
  const { logout } = useAuth();
  const [step, setStep] = useState(0);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-page">
      <aside
        className="w-13 shrink-0 bg-header flex flex-col items-center py-3 px-1.5 gap-1 z-20"
        style={{ boxShadow: "var(--shadow-sidebar)" }}
      >
        <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center mb-2.5">
          <Icon name="building" size={17} className="text-white" />
        </div>
        {NAV_ICONS.map(({ name, label, active }) => (
          <div
            key={name}
            title={label}
            className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-[background] duration-150"
            style={{
              background: active ? "var(--brand-primary)" : "transparent",
              color: active ? "var(--header-text)" : "var(--sidebar-icon)",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.background = "var(--sidebar-hover)";
                e.currentTarget.style.color = "var(--sidebar-icon-active)";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--sidebar-icon)";
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
          className="text-text-tertiary cursor-pointer mb-1.5"
        />
        <div className="w-7 h-7 rounded-full bg-ui-avatar flex items-center justify-center text-ui-avatar-text text-[10px] font-bold cursor-pointer">
          JB
        </div>
      </aside>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header
          className="bg-header flex items-center gap-2.5 px-4 h-10.5 shrink-0 z-10"
          style={{ boxShadow: "var(--shadow-header)" }}
        >
          <div className="flex items-center gap-1.5 mr-2">
            <Icon
              name="building"
              size={14}
              style={{ color: "var(--logo-accent)" }}
            />
            <div>
              <div className="text-header-text text-[11px] font-bold tracking-wider">
                YOUR TITLE
              </div>
              <div className="text-header-muted text-[8px] tracking-[0.15em]">
                COMPANY
              </div>
            </div>
          </div>
          {["Tasks"].map((item) => (
            <button
              key={item}
              className={`border-none text-[11px] font-medium px-2 py-1 rounded-[5px] cursor-pointer ${item === "Tasks" ? "bg-white/10 text-header-text" : "bg-transparent text-text-muted"}`}
            >
              {item}
            </button>
          ))}
          <div className="flex-1 mx-2">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary flex">
                <Icon name="search" size={12} />
              </span>
              <input
                placeholder="Quick Search (APN, Address, Order, Instrument…)"
                className="w-full pl-7.5 pr-2.5 py-1.25 border rounded-md text-[11px] outline-none box-border"
                style={{
                  background: "var(--header-search-bg)",
                  borderColor: "var(--header-search-border)",
                  color: "var(--header-search-text)",
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative cursor-pointer text-text-muted">
              <Icon name="bell" size={15} />
              <span className="absolute -top-1 -right-1 bg-ui-notification text-ui-notification-text text-[8px] font-bold w-3.25 h-3.25 rounded-full flex items-center justify-center">
                0
              </span>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer">
              <div className="w-6.5 h-6.5 rounded-full bg-ui-avatar flex items-center justify-center text-ui-avatar-text text-[10px] font-bold">
                JB
              </div>
              <div>
                <div className="text-header-text text-[11px] font-semibold">
                  John Smith
                </div>
                <div className="text-header-muted text-[9px]">Deceneer</div>
              </div>
            </div>
            <button
              onClick={logout}
              className="bg-transparent border-none text-text-muted hover:text-white cursor-pointer transition-colors p-1"
              title="Sign out"
            >
              <Icon name="arrowRight" size={14} />
            </button>
          </div>
        </header>
        <div className="bg-white border-b border-border flex items-center px-5 h-9.5 shrink-0 gap-2.5">
          <span className="text-[11px] text-text-muted">Order #:</span>
          <span className="text-[11px] font-bold text-text">2026-000123</span>
          <span className="text-border">|</span>
          <span className="text-[11px] text-text-muted">
            Type: <strong className="text-text-secondary">Sale</strong>
          </span>
          <span className="text-border">|</span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-status-success-emerald-dark">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            In Progress
          </span>
          <div className="flex-1" />
          <Button variant="secondary" size="sm">
            <Icon name="save" size={11} />
            Save Draft
          </Button>
          <Button size="sm">
            Create TSR
          </Button>
        </div>
        <div className="bg-white border-b border-border shrink-0">
          <div className="flex px-4.5">
            {STEPS.map((s, i) => {
              const active = step === i,
                done = step > i;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(i)}
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
                        ? "var(--status-success-dark)"
                        : "var(--text-tertiary)",
                    background: active ? "rgba(139,0,0,.03)" : "transparent",
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
                      color: active || done ? "#fff" : "var(--text-tertiary)",
                    }}
                  >
                    {done ? <Icon name="check" size={9} /> : i + 1}
                  </div>
                  {s.label}
                  {i < STEPS.length - 1 && (
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
        <div className="flex-1 overflow-hidden flex flex-col">
          {step !== 0 && (
            <div className="px-5 pt-4 pb-0 shrink-0">
              <div className="flex items-center gap-2.75 max-w-300 mx-auto">
                <div className="w-8.5 h-8.5 bg-brand rounded-lg flex items-center justify-center shrink-0">
                  <Icon
                    name={STEPS[step].icon}
                    size={16}
                    className="text-white"
                  />
                </div>
                <div>
                  <h1 className="m-0 text-[16px] font-bold text-text">
                    {STEPS[step].label}
                  </h1>
                  <p className="m-0 text-[10px] text-text-muted">
                    Step {step + 1} of {STEPS.length}
                  </p>
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-1">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className="h-1.25 rounded-full transition-[width,background] duration-300"
                      style={{
                        width: i === step ? 22 : 10,
                        background:
                          i === step
                            ? "var(--brand-primary)"
                            : i < step
                              ? "var(--ui-progress-complete)"
                              : "var(--border-primary)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div
            className={
              step === 0
                ? "flex-1 overflow-hidden flex flex-col"
                : "flex-1 overflow-y-auto pt-3.5 px-5 max-w-310 w-full mx-auto box-border"
            }
          >
            {step === 0 && <StepDashboard />}
            {step === 1 && <StepLegalVesting />}
            {step === 2 && <StepTitleChain />}
            {step === 3 && <StepDocuments />}
            {step === 4 && <StepReview />}
          </div>
          <div className="bg-white border-t border-border px-5 py-2.75 flex items-center justify-between shrink-0">
            <Button
              variant="secondary"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className={step === 0 ? "opacity-40 cursor-not-allowed" : ""}
            >
              <Icon name="arrowLeft" size={12} />
              Previous Step
            </Button>
            <div className="flex items-center gap-1.25">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setStep(i)}
                  className="cursor-pointer h-1.75 rounded-full transition-all duration-200"
                  style={{
                    width: i === step ? 18 : 7,
                    background:
                      i === step
                        ? "var(--brand-primary)"
                        : i < step
                          ? "var(--ui-progress-complete)"
                          : "var(--border-primary)",
                  }}
                />
              ))}
            </div>
            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
              >
                Next Step
                <Icon name="arrowRight" size={12} />
              </Button>
            ) : (
              <Button
                variant="success"
              >
                <Icon name="checkCircle" size={12} />
                Submit Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
