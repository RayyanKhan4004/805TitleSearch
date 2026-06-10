"use client";

import { useMemo, useState } from "react";
import Sidebar from "@/components/common/sidebar";
import Navbar from "@/components/common/navbar";
import Icon from "@/components/common/icon";
import { useFetchCodeBookQuery } from "@/app/store/api/ordersApi";
import type { CodeBookEntry } from "@/app/components/feature/tables/types";

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Exception: { bg: "#fef2f2", border: "#fecaca", text: "#dc2626" },
  Requirement: { bg: "#eff6ff", border: "#bfdbfe", text: "#2563eb" },
  Tax: { bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a" },
  Note: { bg: "#fefce8", border: "#fde68a", text: "#ca8a04" },
};

function getCategoryStyle(category: string) {
  for (const [key, val] of Object.entries(CATEGORY_COLORS)) {
    if (category.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { bg: "#f8fafc", border: "#e2e8f0", text: "#64748b" };
}

export default function CodeBookPage() {
  const [search, setSearch] = useState("");
  const { data: entries, isLoading } = useFetchCodeBookQuery();

  const grouped = useMemo(() => {
    if (!entries) return {};
    const map: Record<string, CodeBookEntry[]> = {};
    for (const e of entries) {
      if (!e.isActive) continue;
      if (search) {
        const q = search.toLowerCase();
        if (
          !e.code.toLowerCase().includes(q) &&
          !e.category.toLowerCase().includes(q) &&
          !e.verbiage.toLowerCase().includes(q)
        )
          continue;
      }
      (map[e.category] ||= []).push(e);
    }
    return map;
  }, [entries, search]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg-page">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar />
        <div className="flex items-center gap-2.5 px-5 h-9.5 border-b border-border bg-white shrink-0">
          <Icon name="file" size={13} className="text-brand" />
          <span className="text-[12px] font-bold text-text">Code Book</span>
          <span className="text-border">|</span>
          <span className="text-[11px] text-text-muted">
            Browse all codebook entries grouped by category
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search codes by code, category, or content…"
              className="w-full border border-border-input-alt rounded-lg px-3.5 py-2 text-[12px] bg-white outline-none"
            />

            {isLoading && (
              <div className="text-center text-text-muted text-[13px] py-10">
                Loading code book…
              </div>
            )}

            {!isLoading &&
              Object.entries(grouped).map(([category, codes]) => {
                const style = getCategoryStyle(category);
                return (
                  <div
                    key={category}
                    className="bg-white border border-border rounded-xl overflow-hidden"
                  >
                    <div
                      className="flex items-center gap-2.5 px-4 py-2.5 border-b"
                      style={{ background: style.bg, borderColor: style.border }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: style.text }}
                      />
                      <span
                        className="text-[12px] font-extrabold uppercase tracking-wider"
                        style={{ color: style.text }}
                      >
                        {category}
                      </span>
                      <span
                        className="text-[10px] font-semibold ml-auto"
                        style={{ color: style.text }}
                      >
                        {codes.length} code{codes.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="divide-y divide-border">
                      {codes.map((entry) => (
                        <div
                          key={entry.id}
                          className="px-4 py-2.5 flex flex-col gap-1"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded border"
                              style={{
                                background: style.bg,
                                borderColor: style.border,
                                color: style.text,
                              }}
                            >
                              {entry.code}
                            </span>
                          </div>
                          <p className="m-0 text-[11px] text-text leading-relaxed whitespace-pre-wrap">
                            {entry.verbiage}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

            {!isLoading && Object.keys(grouped).length === 0 && (
              <div className="text-center text-text-muted text-[13px] py-10">
                {search
                  ? "No codes match your search."
                  : "No active codes found."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
