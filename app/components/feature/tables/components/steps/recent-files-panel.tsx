"use client";

import Icon from "@/components/common/icon";
import type { Order, OrderLock } from "@/app/components/feature/tables/types";

interface Props {
  orders: Order[];
  onSelect: (order: Order) => void;
  getOrderStatus: (no: string) => string;
  getLock: (no: string) => OrderLock | null;
  statusToColor: (s: string) => { background: string; color: string };
}

export default function RecentFilesPanel({ orders, onSelect, getOrderStatus, getLock, statusToColor }: Props) {
  return (
    <div className="w-60 shrink-0 bg-white border-r border-border overflow-y-auto p-4 flex flex-col gap-0">
      <div className="text-[12px] font-bold text-text-secondary mb-3 flex items-center gap-1.5">
        <Icon name="file" size={13} className="text-brand" />
        Recent Worked Files
      </div>
      {orders.slice(0, 3).map((f) => (
        <div
          key={f.no}
          onClick={() => onSelect(f)}
          className="border border-border rounded-lg p-[11px] mb-2 cursor-pointer transition-all duration-150 hover:bg-[var(--brand-primary-subtle)] hover:border-brand"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="text-[12px] font-bold text-text">{f.id}</span>
            <div className="flex items-center gap-1.25">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={statusToColor(getOrderStatus(f.no))}
              >
                {getOrderStatus(f.no)}
              </span>
              {getLock(f.no) && (
                <span title={`Locked by ${getLock(f.no)?.user}`}>
                  <Icon name="lock" size={10} style={{ color: "var(--amber-500)" }} />
                </span>
              )}
            </div>
          </div>
          <div className="text-[11px] text-text-secondary mb-0.5">{f.addr}</div>
          <div className="text-[10px] text-text-muted">{f.owner || f.clientName}</div>
          <div className="mt-1.5 text-[10px] text-brand font-semibold flex items-center gap-0.75">
            Open file <Icon name="arrowRight" size={10} />
          </div>
        </div>
      ))}
    </div>
  );
}
