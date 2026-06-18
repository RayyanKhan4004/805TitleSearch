"use client";

import Icon from "@/components/common/icon";
import { useMemo, useState } from "react";
import SendPrelimModal from "./send-prelim-modal";
import { PrelimDocEditor, buildPrelimReportHtml } from "../prelim";
import type { PrelimPreviewModalProps } from "@/app/components/feature/tables/types";

export default function PrelimPreviewModal({
  data,
  onClose,
}: PrelimPreviewModalProps) {
  if (!data) return null;

  const initialHtml = useMemo(() => buildPrelimReportHtml(data), [data]);
  const [docHtml, setDocHtml] = useState<string>(initialHtml);
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSend, setShowSend] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const handlePrint = () => window.print();
  const handleReset = () => setDocHtml(initialHtml);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col overflow-hidden"
      style={{ background: "rgba(15,23,42,.75)", backdropFilter: "blur(2px)" }}
    >
      {/* toolbar */}
      <div
        className="flex items-center justify-between shrink-0 border-b border-[#2d3348] px-5 py-2.5"
        style={{ background: "#1e2130" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "#8B0000" }}
          >
            <Icon name="fileCheck" size={15} style={{ color: "#fff" }} />
          </div>
          <div>
            <div className="text-[13px] font-bold text-white">
              Preliminary Report
            </div>
            <div className="text-[10px] text-text-muted">
              Order No. {data.orderNo} &nbsp;·&nbsp; {data.propertyAddress}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setEditMode((v) => !v)}
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-[7px] cursor-pointer border transition-all duration-150"
            style={{
              background: editMode ? "#fef3c7" : "rgba(255,255,255,.1)",
              borderColor: editMode ? "#f59e0b" : "#475569",
              color: editMode ? "#92400e" : "#fff",
            }}
          >
            <Icon name={editMode ? "fileCheck" : "edit3"} size={11} />
            {editMode ? "Done Editing" : "Edit Prelim"}
          </button>
          {editMode && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-[7px] cursor-pointer border border-[#475569]"
              style={{ background: "rgba(255,255,255,.1)", color: "#fff" }}
              title="Reset edits"
            >
              <Icon name="refresh" size={11} />
              Reset
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-[7px] cursor-pointer border transition-all duration-200"
            style={{
              background: saved ? "#dcfce7" : "rgba(255,255,255,.1)",
              borderColor: saved ? "#16a34a" : "#475569",
              color: saved ? "#166534" : "#fff",
            }}
          >
            <Icon name={saved ? "checkCircle" : "save"} size={11} />
            {saved ? "Saved!" : "Save"}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-[7px] cursor-pointer border border-[#475569]"
            style={{ background: "rgba(255,255,255,.1)", color: "#fff" }}
          >
            <Icon name="external" size={11} />
            Print
          </button>
          <button
            onClick={() => setShowSend(true)}
            className="flex items-center gap-1.5 text-white text-[11px] font-semibold px-3 py-1.5 rounded-[7px] cursor-pointer border-none"
            style={{ background: "#0369a1" }}
          >
            <Icon name="mail" size={11} />
            Send Prelim
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-[7px] cursor-pointer border border-[#dc2626] transition-all duration-150"
            style={{ background: "rgba(220,38,38,.15)", color: "#fca5a5" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(220,38,38,.35)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(220,38,38,.15)";
              e.currentTarget.style.color = "#fca5a5";
            }}
          >
            &#10005; Close
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <PrelimDocEditor
          value={docHtml}
          onChange={setDocHtml}
          editable={editMode}
        />
      </div>

      {showSend && (
        <SendPrelimModal
          onClose={() => setShowSend(false)}
          docs={[
            {
              name:
                "Preliminary_Report_" +
                new Date().toLocaleDateString("en-US").replace(/\//g, "-") +
                ".docx",
              date: new Date().toLocaleDateString("en-US"),
              size: "—",
            },
          ]}
        />
      )}
    </div>
  );
}
