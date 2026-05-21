"use client";

import Icon from "@/components/common/icon";
import { statusStyle } from "../shared-atoms";
import { useState } from "react";
import { ORDERS, RECENT_FILES } from "../temp";
import { CreateOrderModal } from "../models";
import type { Order, OrderLock } from "@/app/components/feature/tables/types";

interface StepDashboardProps {
  onSelect?: (order: Order) => void;
  getOrderStatus?: (no: string) => string;
  getLock?: (no: string) => OrderLock | null;
}

export default function StepDashboard({ onSelect: _onSelect, getOrderStatus, getLock }: StepDashboardProps) {
  const [tab, setTab] = useState("Open");
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const onSelect = _onSelect || (() => {});
  const orderStatus = getOrderStatus || (() => "Open");
  const orderLock = getLock || (() => null);

  const filtered =
    tab === "All" ? ORDERS : ORDERS.filter((o) => o.status === tab);

  function statusToColor(s: string) {
    if (s === "Open") return { background: "var(--status-success-bg)", color: "var(--status-success-text)" };
    if (s === "In Review") return { background: "var(--amber-100)", color: "var(--amber-800)" };
    if (s === "Closed") return { background: "var(--status-info-bg)", color: "var(--status-info-text)" };
    return { background: "var(--status-error-bg)", color: "var(--status-error-text)" };
  }

  const handleCreate = (orderData: Record<string, unknown>) => {
    // TODO: Integrate with API to create order
    console.log("Creating order:", orderData);
    setShowModal(false);
    // After API integration, refresh orders list
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Recent Worked Files - left panel */}
      <div className="w-60 shrink-0 bg-white border-r border-border overflow-y-auto p-4 flex flex-col gap-0">
        <div className="text-[12px] font-bold text-text-secondary mb-3 flex items-center gap-1.5">
          <Icon name="file" size={13} className="text-brand" />
          Recent Worked Files
        </div>
        {RECENT_FILES.map((f) => (
          <div
            key={f.no}
            onClick={() =>
              onSelect({
                no: f.no.replace("#", ""),
                apn: "—",
                addr: f.addr,
                owner: f.owner,
                county: "—",
                fileNo: "—",
                productType: "—",
                status: f.status as Order["status"],
              })
            }
            className="border border-border rounded-lg p-[11px] mb-2 cursor-pointer transition-all duration-150 hover:bg-[#fff5f5] hover:border-brand"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-[12px] font-bold text-text">{f.no}</span>
              <div className="flex items-center gap-1.25">
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={statusToColor(orderStatus(f.no.replace("#", "")))}
                >
                  {orderStatus(f.no.replace("#", ""))}
                </span>
                {orderLock(f.no.replace("#", "")) && (
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
                    <title>{`Locked by ${orderLock(f.no.replace("#", ""))?.user}`}</title>
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                )}
              </div>
            </div>
            <div className="text-[11px] text-text-secondary mb-0.5">{f.addr}</div>
            <div className="text-[10px] text-text-muted">{f.owner}</div>
            <div className="mt-1.5 text-[10px] text-brand font-semibold flex items-center gap-0.75">
              Open file <Icon name="arrowRight" size={10} />
            </div>
          </div>
        ))}
      </div>

      {/* Orders table - main area */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3.5 bg-secondary">
        {/* Filter + Create row */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {["Open", "Closed", "Cancelled", "All"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-1.75 rounded-lg text-[12px] font-semibold border cursor-pointer transition-all duration-150"
                style={{
                  background: tab === t ? "var(--brand-primary)" : "#fff",
                  borderColor: tab === t ? "var(--brand-primary)" : "var(--border-primary)",
                  color: tab === t ? "#fff" : "var(--text-secondary)",
                  boxShadow: tab === t ? "0 2px 6px rgba(139,0,0,.2)" : "none",
                }}
              >
                {t} Files
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 bg-brand text-white border-none rounded-lg px-4.5 py-2 text-[12px] font-semibold cursor-pointer shadow-[0_2px_8px_rgba(139,0,0,.25)] hover:bg-brand/90"
          >
            <Icon name="plus" size={13} />
            Create New Order
          </button>
        </div>

        {/* Table */}
        <div className="bg-white border border-border rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,.06)]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Order No.", "File No.", "Address", "Owner", "County", "Product Type", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.05em] bg-secondary border-b border-border text-left"
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
                    colSpan={7}
                    className="py-7.5 text-center text-text-muted text-[12px]"
                  >
                    No {tab.toLowerCase()} files found.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => onSelect(row)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="cursor-pointer transition-[background] duration-100"
                    style={{
                      background: hovered === i ? "#fff5f5" : "#fff",
                      borderLeft:
                        hovered === i
                          ? "3px solid var(--brand-primary)"
                          : "3px solid transparent",
                    }}
                  >
                    <td className="px-4 py-3.25 text-[11px] text-text-secondary border-t border-secondary font-bold text-brand">
                      <div className="flex items-center gap-1.25">
                        {row.no}
                        {hovered === i && (
                          <span className="text-[9px] bg-brand text-white px-1.5 py-0.5 rounded font-semibold">
                            Open →
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.25 text-[11px] text-text-secondary border-t border-secondary">
                      <div className="text-[11px] font-semibold text-text-secondary">
                        {row.fileNo}
                      </div>
                      <div className="text-[9px] text-text-muted mt-0.5">
                        APN: {row.apn}
                      </div>
                    </td>
                    <td className="px-4 py-3.25 text-[11px] text-text-secondary border-t border-secondary">
                      {row.addr}
                    </td>
                    <td className="px-4 py-3.25 text-[11px] text-text-secondary border-t border-secondary">
                      {row.owner}
                    </td>
                    <td className="px-4 py-3.25 text-[11px] text-text-secondary border-t border-secondary">
                      {row.county}
                    </td>
                    <td className="px-4 py-3.25 text-[11px] text-text-secondary border-t border-secondary">
                      <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block whitespace-nowrap">
                        {row.productType}
                      </span>
                    </td>
                    <td className="px-4 py-3.25 text-[11px] text-text-secondary border-t border-secondary">
                      <div className="flex items-center gap-1.75">
                        <span
                          className="text-[10px] font-bold px-3 py-1 rounded-full inline-block"
                          style={statusToColor(orderStatus(row.no))}
                        >
                          {orderStatus(row.no)}
                        </span>
                        {orderLock(row.no) && (
                          <span
                            title={`Locked by ${orderLock(row.no)?.user}`}
                            className="inline-flex items-center gap-0.75 bg-amber-100 border border-amber-200 rounded-full px-1.75 py-0.5 text-[9px] font-bold text-amber-800"
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
                              <rect x="3" y="11" width="18" height="11" rx="2" />
                              <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
                            {orderLock(row.no)?.user.split(" ")[0]}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer hint */}
        <p className="m-0 text-[11px] text-text-muted text-center">
          Click any order row to open the file and access Title Chain, TSRI, and all tabs.
        </p>
      </div>

      {showModal && (
        <CreateOrderModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
