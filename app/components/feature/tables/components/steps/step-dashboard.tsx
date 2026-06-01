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

export default function StepDashboard({
  onSelect: _onSelect,
  getOrderStatus,
  getLock,
}: StepDashboardProps) {
  const [tab, setTab] = useState("Open");
  const [showModal, setShowModal] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const onSelect = _onSelect || (() => {});
  const orderStatus = getOrderStatus || (() => "Open");
  const orderLock = getLock || (() => null);

  const filtered = tab === "All" ? ORDERS : ORDERS.filter((o) => o.status === tab);

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
            <div className="text-[11px] text-text-secondary mb-0.5">
              {f.addr}
            </div>
            <div className="text-[10px] text-text-muted">{f.owner}</div>
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
          <div style={{ display: "flex", gap: 6 }}>
            {["Open", "Closed", "Cancelled", "All"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 9,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "1px solid",
                  cursor: "pointer",
                  background: tab === t ? "#8B0000" : "#fff",
                  borderColor: tab === t ? "#8B0000" : "#e2e8f0",
                  color: tab === t ? "#fff" : "#475569",
                  boxShadow: tab === t ? "0 2px 6px rgba(139,0,0,.2)" : "none",
                }}
              >
                {t} Files
              </button>
            ))}
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
                  "File No.",
                  "Address",
                  "Owner",
                  "County",
                  "Product Type",
                  "Status",
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
                    colSpan={7}
                    style={{
                      padding: 30,
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: 12,
                    }}
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
                    style={{
                      cursor: "pointer",
                      background: hovered === i ? "#fff5f5" : "#fff",
                      borderLeft:
                        hovered === i
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
                        }}
                      >
                        {row.no}
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
                        <span
                          style={{
                            ...statusToColor(orderStatus(row.no)),
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "4px 12px",
                            borderRadius: 999,
                            display: "inline-block",
                          }}
                        >
                          {orderStatus(row.no)}
                        </span>
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
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
