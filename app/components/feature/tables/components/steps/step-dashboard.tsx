"use client";

import Icon from "@/components/common/icon";
import { useState, useEffect } from "react";
import { CreateOrderModal } from "../models";
import type { Order, OrderLock } from "@/app/components/feature/tables/types";
import RecentFilesPanel from "./recent-files-panel";
import FilterControls from "./filter-controls";
import OrdersTable from "./orders-table";
import PaginationControls from "./pagination-controls";

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
  const [expandedSection, setExpandedSection] = useState<
    "status" | "country" | null
  >(null);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [rushFilter, setRushFilter] = useState(false);
  const [statusDropdownFilter, setStatusDropdownFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const onSelect = _onSelect || (() => {});
  const orderStatus = getOrderStatus || (() => "Open");
  const orderLock = getLock || (() => null);

  const allStatuses = ["Open", "In Review", "Closed", "Cancelled"];
  const allCountries = [...new Set(orders.map((o) => o.county))].sort();
  const hasActiveFilters =
    statusFilter.length > 0 || countryFilter.length > 0 || rushFilter;

  const clearFilters = () => {
    setStatusFilter([]);
    setCountryFilter([]);
    setRushFilter(false);
    setExpandedSection(null);
    setShowFunnel(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, countryFilter, rushFilter, statusDropdownFilter]);

  const sorted = [...orders].sort((a, b) => {
    if (a.rush && !b.rush) return -1;
    if (!a.rush && b.rush) return 1;
    return 0;
  });

  const filtered = sorted.filter((o) => {
    if (statusDropdownFilter && o.status !== statusDropdownFilter) return false;
    if (statusFilter.length > 0 && !statusFilter.includes(o.status))
      return false;
    if (rushFilter && !o.rush) return false;
    if (countryFilter.length > 0 && !countryFilter.includes(o.county))
      return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

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
      <RecentFilesPanel
        orders={orders}
        onSelect={onSelect}
        getOrderStatus={orderStatus}
        getLock={orderLock}
        statusToColor={statusToColor}
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          background: "var(--bg-page)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FilterControls
              showFunnel={showFunnel}
              setShowFunnel={setShowFunnel}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              countryFilter={countryFilter}
              setCountryFilter={setCountryFilter}
              rushFilter={rushFilter}
              setRushFilter={setRushFilter}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
              allStatuses={allStatuses}
              allCountries={allCountries}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "var(--brand-primary)",
              color: "var(--color-white)",
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

        <OrdersTable
          orders={paginated}
          onSelect={onSelect}
          hovered={hovered}
          setHovered={setHovered}
          getOrderStatus={orderStatus}
          orderLock={orderLock}
          onRushToggle={(no) => onRushToggle?.(no)}
          onStatusChange={(no, status) => onStatusChange?.(no, status)}
          statusToColor={statusToColor}
        />

        <PaginationControls
          filteredLength={filtered.length}
          safePage={safePage}
          pageSize={pageSize}
          totalPages={totalPages}
          goToPage={goToPage}
          setPageSize={setPageSize}
          setCurrentPage={setCurrentPage}
        />

        <p className="m-0 text-[11px] text-text-muted text-center">
          Click any order row to open the file and access Title Chain, TSRI, and
          all tabs.
        </p>
      </div>

      {showModal && <CreateOrderModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
