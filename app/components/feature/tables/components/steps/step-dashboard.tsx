"use client";

import Icon from "@/components/common/icon";
import { statusStyle } from "../shared-atoms";
import { useState } from "react";
import { CreateOrderModal } from "../models";
import type { Order, OrderLock } from "@/app/components/feature/tables/types";

interface StepDashboardProps {
  orders: Order[];
  onSelect?: (order: Order) => void;
  getOrderStatus?: (no: string) => string;
  getLock?: (no: string) => OrderLock | null;
  onRushToggle?: (no: string) => void;
  onStatusChange?: (no: string, status: Order["status"]) => void;
}

export default function StepDashboard({
  orders,
  onSelect: _onSelect,
  getOrderStatus,
  getLock,
  onRushToggle,
  onStatusChange,
}: StepDashboardProps) {
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [showFunnel, setShowFunnel] = useState(false);
  const [expandedSection, setExpandedSection] = useState<"status" | "country" | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [rushFilter, setRushFilter] = useState(false);
  const [statusDropdownFilter, setStatusDropdownFilter] = useState("");
  const onSelect = _onSelect || (() => {});
  const orderStatus = getOrderStatus || (() => "Open");
  const orderLock = getLock || (() => null);

  const ALL_STATUSES = ["Open", "In Review", "Closed", "Cancelled"];
  const ALL_COUNTRIES = [...new Set(orders.map((o) => o.county))].sort();

  const hasActiveFilters = statusFilter.length > 0 || countryFilter.length > 0 || rushFilter;

  const toggleStatus = (s: string) =>
    setStatusFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const toggleCountry = (c: string) =>
    setCountryFilter((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  const clearFilters = () => {
    setStatusFilter([]);
    setCountryFilter([]);
    setRushFilter(false);
    setExpandedSection(null);
    setShowFunnel(false);
  };

  const sorted = [...orders].sort((a, b) => {
    if (a.rush && !b.rush) return -1;
    if (!a.rush && b.rush) return 1;
    return 0;
  });

  const filtered = sorted.filter((o) => {
    if (statusDropdownFilter && o.status !== statusDropdownFilter) return false;
    if (statusFilter.length > 0 && !statusFilter.includes(o.status)) return false;
    if (rushFilter && !o.rush) return false;
    if (countryFilter.length > 0 && !countryFilter.includes(o.county)) return false;
    return true;
  });

  const toggleRush = (no: string) => {
    onRushToggle?.(no);
  };

  const handleStatusChange = (no: string, status: Order["status"]) => {
    onStatusChange?.(no, status);
  };

  function statusToColor(s: string) {
    if (s === "Open")
      return {
        background: "var(--status-success-bg)",
        color: "var(--status-success-text)",
      };
    if (s === "In Review")
      return { background: "var(--amber-100)", color: "var(--amber-800)" };
    if (s === "Closed")
      return {
        background: "var(--status-info-bg)",
        color: "var(--status-info-text)",
      };
    return {
      background: "var(--status-error-bg)",
      color: "var(--status-error-text)",
    };
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Recent Worked Files - left panel */}
      <div className="w-60 shrink-0 bg-white border-r border-border overflow-y-auto p-4 flex flex-col gap-0">
        <div className="text-[12px] font-bold text-text-secondary mb-3 flex items-center gap-1.5">
          <Icon name="file" size={13} className="text-brand" />
          Recent Worked Files
        </div>
        {orders.slice(0, 3).map((f) => (
          <div
            key={f.no}
            onClick={() => onSelect(f)}
            className="border border-border rounded-lg p-[11px] mb-2 cursor-pointer transition-all duration-150 hover:bg-[#fff5f5] hover:border-brand"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[12px] font-bold text-text">{f.no}</span>
              <div className="flex items-center gap-1.25">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={statusToColor(orderStatus(f.no))}
                >
                  {orderStatus(f.no)}
                </span>
                {orderLock(f.no) && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--amber-500)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <title>{`Locked by ${orderLock(f.no)?.user}`}</title>
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                )}
              </div>
            </div>
            <div className="text-[11px] text-text-secondary mb-0.5">
              {f.addr}
            </div>
            <div className="text-[10px] text-text-muted">{f.owner || f.clientName}</div>
            <div className="mt-1.5 text-[10px] text-brand font-semibold flex items-center gap-0.75">
              Open file <Icon name="arrowRight" size={10} />
            </div>
          </div>
        ))}
      </div>

      {/* Orders table - main area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          background: "#f8fafc",
        }}
      >
        {/* Filter + Create row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="relative">
            <button
              onClick={() => { setShowFunnel(!showFunnel); setExpandedSection(null) }}
              title="Filters"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "7px 12px",
                borderRadius: 9,
                fontSize: 12,
                fontWeight: 600,
                border: "1px solid",
                cursor: "pointer",
                background: hasActiveFilters ? "#8B0000" : "#fff",
                borderColor: hasActiveFilters ? "#8B0000" : "#e2e8f0",
                color: hasActiveFilters ? "#fff" : "#475569",
                position: "relative",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
              {hasActiveFilters && (
                <span style={{
                  position: "absolute",
                  top: -4, right: -4,
                  width: 8, height: 8,
                  borderRadius: "50%",
                  background: "#dc2626",
                }} />
              )}
            </button>
            {showFunnel && (
              <div
                className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,.18)] border border-border z-50 p-2"
                style={{ minWidth: 240 }}
              >
                {/* Status section */}
                <div className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === "status" ? null : "status")}
                    className="flex items-center justify-between w-full px-3 py-2 text-[12px] font-semibold text-left cursor-pointer border-none rounded-lg transition-all"
                    style={{ color: statusFilter.length > 0 ? "#8B0000" : "#334155", background: expandedSection === "status" ? "#f8fafc" : "transparent" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={(e) => { if (expandedSection !== "status") e.currentTarget.style.background = "transparent" }}
                  >
                    <span>Status</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {statusFilter.length > 0 && (
                        <span className="text-[10px] font-bold text-white px-1.5 py-0.25 rounded-full" style={{ background: "#8B0000" }}>{statusFilter.length}</span>
                      )}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: expandedSection === "status" ? "rotate(90deg)" : "none", transition: "transform .15s" }}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </span>
                  </button>
                  {expandedSection === "status" && (
                    <div className="px-3 pb-2 flex flex-col gap-0.5">
                      {ALL_STATUSES.map((s) => {
                        const checked = statusFilter.includes(s);
                        return (
                          <label
                            key={s}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[11px] transition-all"
                            style={{ background: checked ? "#fff5f5" : "transparent", color: checked ? "#8B0000" : "#475569", fontWeight: checked ? 600 : 400 }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleStatus(s)}
                              className="accent-brand w-3 h-3"
                            />
                            {s}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Country section */}
                <div className="rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedSection(expandedSection === "country" ? null : "country")}
                    className="flex items-center justify-between w-full px-3 py-2 text-[12px] font-semibold text-left cursor-pointer border-none rounded-lg transition-all"
                    style={{ color: countryFilter.length > 0 ? "#8B0000" : "#334155", background: expandedSection === "country" ? "#f8fafc" : "transparent" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={(e) => { if (expandedSection !== "country") e.currentTarget.style.background = "transparent" }}
                  >
                    <span>Country</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {countryFilter.length > 0 && (
                        <span className="text-[10px] font-bold text-white px-1.5 py-0.25 rounded-full" style={{ background: "#8B0000" }}>{countryFilter.length}</span>
                      )}
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ transform: expandedSection === "country" ? "rotate(90deg)" : "none", transition: "transform .15s" }}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </span>
                  </button>
                  {expandedSection === "country" && (
                    <div className="px-3 pb-2 flex flex-col gap-0.5">
                      {ALL_COUNTRIES.map((c) => {
                        const checked = countryFilter.includes(c);
                        return (
                          <label
                            key={c}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-[11px] transition-all"
                            style={{ background: checked ? "#fff5f5" : "transparent", color: checked ? "#8B0000" : "#475569", fontWeight: checked ? 600 : 400 }}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleCountry(c)}
                              className="accent-brand w-3 h-3"
                            />
                            {c}
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Rush toggle */}
                <label
                  className="flex items-center justify-between px-3 py-2 text-[12px] font-semibold cursor-pointer rounded-lg transition-all"
                  style={{ color: rushFilter ? "#8B0000" : "#334155", background: rushFilter ? "#fff5f5" : "transparent" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={(e) => { if (!rushFilter) e.currentTarget.style.background = "transparent" }}
                >
                  <span>Rush Only</span>
                  <input
                    type="checkbox"
                    checked={rushFilter}
                    onChange={() => setRushFilter(!rushFilter)}
                    className="accent-brand w-3.5 h-3.5"
                  />
                </label>

                {hasActiveFilters && (
                  <>
                    <div className="border-t border-border my-1.5" />
                    <button
                      onClick={clearFilters}
                      className="w-full text-center text-[10px] font-semibold text-brand cursor-pointer bg-transparent border-none py-1.5 rounded-lg hover:bg-[#fff5f5] transition-all"
                    >
                      Clear all filters
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#8B0000",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              padding: "8px 18px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(139,0,0,.25)",
            }}
          >
            <Icon name="plus" size={13} />
            Create New Order
          </button>
        </div>

        {/* table — exact replica of .html styling */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,.06)",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {[
                  "Order No.",
                  "APN No.",
                  "Address",
                  "Owner",
                  "County",
                  "Product Type",
                  "Status",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      background: "#f8fafc",
                      borderBottom: "1px solid #e2e8f0",
                      textAlign: "left",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 30,
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: 12,
                    }}
                  >
                    No files match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => onSelect(row)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      cursor: "pointer",
                      transition: "background .1s",
                      background: row.rush
                        ? hovered === i
                          ? "#ffeaea"
                          : "#fff5f5"
                        : hovered === i
                          ? "#fff5f5"
                          : "#fff",
                      borderLeft: row.rush
                        ? "3px solid #dc2626"
                        : hovered === i
                          ? "3px solid #8B0000"
                          : "3px solid transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 11,
                        borderTop: "1px solid #f1f5f9",
                        fontWeight: 700,
                        color: "#8B0000",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          flexWrap: "wrap",
                        }}
                      >
                        {row.no}
                        {row.rush && (
                          <span
                            style={{
                              fontSize: 8,
                              background: "#dc2626",
                              color: "#fff",
                              padding: "1px 7px",
                              borderRadius: 4,
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              whiteSpace: "nowrap",
                            }}
                          >
                            RUSH
                          </span>
                        )}
                        {hovered === i && (
                          <span
                            style={{
                              fontSize: 9,
                              background: "#8B0000",
                              color: "#fff",
                              padding: "1px 6px",
                              borderRadius: 4,
                              fontWeight: 600,
                            }}
                          >
                            Open →
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 11,
                        borderTop: "1px solid #f1f5f9",
                        color: "#475569",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#334155",
                        }}
                      >
                        {row.fileNo}
                      </div>
                      <div
                        style={{ fontSize: 9, color: "#94a3b8", marginTop: 1 }}
                      >
                        APN: {row.apn}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 11,
                        borderTop: "1px solid #f1f5f9",
                        color: "#475569",
                        verticalAlign: "middle",
                      }}
                    >
                      {row.addr}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 11,
                        borderTop: "1px solid #f1f5f9",
                        color: "#475569",
                        verticalAlign: "middle",
                      }}
                    >
                      {row.owner}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 11,
                        borderTop: "1px solid #f1f5f9",
                        color: "#475569",
                        verticalAlign: "middle",
                      }}
                    >
                      {row.county}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 11,
                        borderTop: "1px solid #f1f5f9",
                        color: "#475569",
                        verticalAlign: "middle",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          background: "#eff6ff",
                          color: "#1d4ed8",
                          padding: "3px 8px",
                          borderRadius: 6,
                          display: "inline-block",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.productType}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 11,
                        borderTop: "1px solid #f1f5f9",
                        color: "#475569",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                        }}
                      >
                        <select
                          value={row.status}
                          onChange={(e) => handleStatusChange(row.no, e.target.value as Order["status"])}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            ...statusToColor(row.status),
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "4px 12px",
                            borderRadius: 999,
                            border: "none",
                            cursor: "pointer",
                            outline: "none",
                            appearance: "auto",
                          }}
                        >
                          <option value="Open" style={{ background: "#fff", color: "#000" }}>Open</option>
                          <option value="In Review" style={{ background: "#fff", color: "#000" }}>In Review</option>
                          <option value="Closed" style={{ background: "#fff", color: "#000" }}>Closed</option>
                          <option value="Cancelled" style={{ background: "#fff", color: "#000" }}>Cancelled</option>
                        </select>
                        {orderLock(row.no) && (
                          <span
                            title={"Locked by " + orderLock(row.no)?.user}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                              background: "#fef3c7",
                              border: "1px solid #fde68a",
                              borderRadius: 999,
                              padding: "2px 7px",
                              fontSize: 9,
                              fontWeight: 700,
                              color: "#92400e",
                            }}
                          >
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="3"
                                y="11"
                                width="18"
                                height="11"
                                rx="2"
                              />
                              <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                            {orderLock(row.no)?.user.split(" ")[0]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 11,
                        borderTop: "1px solid #f1f5f9",
                        color: "#475569",
                        verticalAlign: "middle",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "#334155",
                        }}
                      >
                        {row.date}
                      </div>
                    </td>
                    {/* Actions — Rush toggle */}
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: 11,
                        borderTop: "1px solid #f1f5f9",
                        color: "#475569",
                        verticalAlign: "middle",
                        textAlign: "center",
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRush(row.no);
                        }}
                        title={row.rush ? "Remove Rush flag" : "Mark as Rush"}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "5px 11px",
                          borderRadius: 7,
                          fontSize: 10,
                          fontWeight: 700,
                          cursor: "pointer",
                          border: "1px solid",
                          transition: "all .15s",
                          background: row.rush ? "#dc2626" : "#fff",
                          borderColor: row.rush ? "#dc2626" : "#e2e8f0",
                          color: row.rush ? "#fff" : "#94a3b8",
                        }}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        Rush
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer hint */}
        <p className="m-0 text-[11px] text-text-muted text-center">
          Click any order row to open the file and access Title Chain, TSRI, and
          all tabs.
        </p>
      </div>

      {showModal && (
        <CreateOrderModal
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
