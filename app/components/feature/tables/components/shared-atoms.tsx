"use client";

import Icon from "@/components/common/icon";
import type { CardHeadProps, LblProps, InpProps, SelProps, BtnProps } from "@/app/components/feature/tables/types";

export const S = {
  card: "bg-white border border-border rounded-xl shadow-card",
  inp: "w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border",
  lbl: "text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-0.5 block",
  th: "px-2.5 py-2 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.05em] bg-table-header border-b border-border text-left",
  td: "px-2.5 py-2 text-[11px] border-t border-secondary text-text-secondary align-middle",
  red: "bg-brand text-white border-none rounded-lg px-3.5 py-1.5 text-[11px] font-semibold cursor-pointer",
  white: "bg-white text-text-secondary border border-border rounded-lg px-3.5 py-1.5 text-[11px] font-semibold cursor-pointer",
};

export function CardHead({ title, sub, right }: CardHeadProps) {
  return (
    <div className="flex items-center justify-between px-4.5 py-[13px] border-b border-secondary">
      <div>
        <div className="text-[13px] font-bold text-text">{title}</div>
        {sub && <div className="text-[10px] text-text-muted mt-0.5">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

export function Lbl({ children }: LblProps) {
  return <div className={S.lbl}>{children}</div>;
}

export function Inp({ value, onChange, placeholder = "", type = "text" }: InpProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={S.inp}
    />
  );
}

export function Sel({ value, onChange, options }: SelProps) {
  return (
    <select value={value} onChange={onChange} className={S.inp}>
      {options.map((o, i) => {
        const val = typeof o === "string" ? o : o.value;
        const label = typeof o === "string" ? o : o.label;
        return (
          <option key={i} value={val}>{label}</option>
        );
      })}
    </select>
  );
}

export function Btn({ children, onClick, style = {}, disabled = false }: BtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.25 ${S.red}`}
      style={{
        ...style,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

export function statusStyle(s: string) {
  if (s === "Open") return { background: "var(--status-success-bg)", color: "var(--status-success-text)" };
  if (s === "Closed") return { background: "var(--status-info-bg)", color: "var(--status-info-text)" };
  return { background: "var(--status-error-bg)", color: "var(--status-error-text)" };
}
