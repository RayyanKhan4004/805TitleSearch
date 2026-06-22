"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import type { Order, OrderLock } from "@/app/components/feature/tables/types";
import Icon from "@/components/common/icon";

interface Props {
  orders: Order[];
  onSelect: (order: Order) => void;
  hovered: number | null;
  setHovered: (i: number | null) => void;
  getOrderStatus: (no: string) => string;
  orderLock: (no: string) => OrderLock | null;
  onRushToggle: (no: string) => void;
  onStatusChange: (no: string, status: Order["status"]) => void;
  onDelete: (id: string) => void;
  onEdit?: (id: string) => void;
  statusToColor: (s: string) => { background: string; color: string };
}

export default function OrdersTable({
  orders,
  onSelect,
  hovered,
  setHovered,
  getOrderStatus,
  orderLock,
  onRushToggle,
  onStatusChange,
  onDelete,
  onEdit,
  statusToColor,
}: Props) {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<Order>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("no", {
        header: "Order No.",
        cell: (info) => {
          const row = info.row.original;
          const orderId = row.id ?? -1;
          const isHovered = hovered === orderId;
          return (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontWeight: 700 }}>{row.no || row.id}</span>
              {row.rush && <RushBadge />}
              {isHovered && <OpenBadge />}
            </div>
          );
        },
      }),
      columnHelper.accessor("fileNo", {
        header: "APN No.",
        cell: (info) => {
          const row = info.row.original;
          return (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--ui-code-text)",
                }}
              >
                {row.fileNo}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "var(--text-muted)",
                  marginTop: 1,
                }}
              >
                APN: {row.apn}
              </div>
            </>
          );
        },
      }),
      columnHelper.accessor("addr", { header: "Address" }),
      columnHelper.accessor("owner", { header: "Owner" }),
      columnHelper.accessor("county", { header: "County" }),
      columnHelper.accessor("state", { header: "State" }),
      columnHelper.accessor("productType", {
        header: "Product Type",
        cell: (info) => (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              background: "var(--status-info-subtle)",
              color: "var(--status-info-blue)",
              padding: "3px 8px",
              borderRadius: 6,
              display: "inline-block",
              whiteSpace: "nowrap",
            }}
          >
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const row = info.row.original;
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <select
                value={row.status}
                onChange={(e) =>
                  onStatusChange(row.no, e.target.value as Order["status"])
                }
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
                <option
                  value="Open"
                  style={{ background: "#fff", color: "#000" }}
                >
                  Open
                </option>
                <option
                  value="In Review"
                  style={{ background: "#fff", color: "#000" }}
                >
                  In Review
                </option>
                <option
                  value="Closed"
                  style={{ background: "#fff", color: "#000" }}
                >
                  Closed
                </option>
                <option
                  value="Cancelled"
                  style={{ background: "#fff", color: "#000" }}
                >
                  Cancelled
                </option>
              </select>
              {orderLock(row.no) && (
                <span
                  title={"Locked by " + orderLock(row.no)?.user}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    background: "var(--status-warning-bg)",
                    border: "1px solid var(--status-warning-border)",
                    borderRadius: 999,
                    padding: "2px 7px",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "var(--status-warning-text)",
                  }}
                >
                  <Icon name="lock" size={9} />
                  {orderLock(row.no)?.user.split(" ")[0]}
                </span>
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--ui-code-text)",
            }}
          >
            {info.getValue()}
          </div>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const row = info.row.original;
          const id = row.id ? String(row.id) : row.no;
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRushToggle(row.no);
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
                  background: row.rush ? "var(--status-error-dark)" : "var(--color-white)",
                  borderColor: row.rush ? "var(--status-error-dark)" : "var(--border-primary)",
                  color: row.rush ? "var(--color-white)" : "var(--text-muted)",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                Rush
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(id);
                }}
                title="Edit order"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  border: "1px solid var(--border-primary)",
                  background: "var(--color-white)",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#3b82f6";
                  (e.currentTarget as HTMLButtonElement).style.color = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--color-white)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-primary)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                }}
              >
                <Icon name="pencil" size={12} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmDeleteId(id);
                }}
                title="Delete order"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  border: "1px solid var(--border-primary)",
                  background: "var(--color-white)",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#dc2626";
                  (e.currentTarget as HTMLButtonElement).style.color = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--color-white)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border-primary)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                }}
              >
                <Icon name="trash" size={12} />
              </button>
            </div>
          );
        },
      }),
    ],
    [
      columnHelper,
      hovered,
      orderLock,
      onRushToggle,
      onStatusChange,
      onDelete,
      onEdit,
      statusToColor,
    ],
  );

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
    <div
      style={{
        background: "var(--color-white)",
        border: "1px solid var(--border-primary)",
        borderRadius: 12,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", minWidth: 900, borderCollapse: "collapse" }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{
                      padding: "12px 16px",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      background: "var(--bg-table-header)",
                      borderBottom: "1px solid var(--border-primary)",
                      textAlign: "left",
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                      userSelect: "none",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {{ asc: " ↑", desc: " ↓" }[
                      header.column.getIsSorted() as string
                    ] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  style={{
                    padding: 30,
                    textAlign: "center",
                    color: "var(--text-muted)",
                    fontSize: 12,
                  }}
                >
                  No files match the selected filter.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => {
                const original = row.original;
                const orderId = original.id ?? -1;
                const isHovered = hovered === orderId;
                return (
                  <tr
                    key={original.id ?? original.no}
                    onClick={() => onSelect(original)}
                    onMouseEnter={() =>
                      setHovered(orderId !== -1 ? orderId : null)
                    }
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      cursor: "pointer",
                      transition: "background .1s",
                      background: original.rush
                        ? isHovered
                          ? "var(--status-error-bg)"
                          : "var(--brand-primary-subtle)"
                        : isHovered
                          ? "var(--brand-primary-subtle)"
                          : "var(--color-white)",
                      borderLeft: original.rush
                        ? "3px solid var(--status-error-dark)"
                        : isHovered
                          ? "3px solid var(--brand-primary)"
                          : "3px solid transparent",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          padding: "13px 16px",
                          fontSize: 11,
                          borderTop: "1px solid var(--border-secondary)",
                          color: "var(--text-secondary)",
                          verticalAlign: "middle",
                          whiteSpace:
                            cell.column.id === "date" ? "nowrap" : undefined,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>


    {confirmDeleteId && (
      <div
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
        onClick={() => setConfirmDeleteId(null)}
      >
        <div
          style={{ background: "#fff", borderRadius: 14, width: 360, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", background: "#fef2f2", borderBottom: "1px solid #fecaca" }}>
            <Icon name="trash" size={15} style={{ color: "#dc2626" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#dc2626" }}>Delete Order</span>
          </div>
          <div style={{ padding: "18px", fontSize: 12, color: "#475569", lineHeight: 1.6 }}>
            Are you sure you want to delete order <strong style={{ color: "#1e293b" }}>#{confirmDeleteId}</strong>? This action cannot be undone.
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "0 18px 16px" }}>
            <button
              onClick={() => setConfirmDeleteId(null)}
              style={{ padding: "7px 16px", fontSize: 12, fontWeight: 600, color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 8, cursor: "pointer" }}
            >
              Cancel
            </button>
            <button
              onClick={() => { onDelete(confirmDeleteId); setConfirmDeleteId(null); }}
              style={{ padding: "7px 16px", fontSize: 12, fontWeight: 600, color: "#fff", background: "#dc2626", border: "none", borderRadius: 8, cursor: "pointer" }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

function RushBadge() {
  return (
    <span
      style={{
        fontSize: 8,
        background: "var(--status-error-dark)",
        color: "var(--color-white)",
        padding: "1px 7px",
        borderRadius: 4,
        fontWeight: 700,
        letterSpacing: "0.06em",
        whiteSpace: "nowrap",
      }}
    >
      RUSH
    </span>
  );
}

function OpenBadge() {
  return (
    <span
      style={{
        fontSize: 9,
        background: "var(--brand-primary)",
        color: "var(--color-white)",
        padding: "1px 6px",
        borderRadius: 4,
        fontWeight: 600,
      }}
    >
      Open →
    </span>
  );
}
