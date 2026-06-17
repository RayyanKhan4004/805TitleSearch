"use client";

import Icon from "@/components/common/icon";
import { useState } from "react";
import SendPrelimModal from "./send-prelim-modal";
import { BOIL1, BOIL2 } from "../temp";
import { renderRichString } from "../prelim";
import type { PrelimPreviewModalProps } from "@/app/components/feature/tables/types";

export default function PrelimPreviewModal({
  data,
  onClose,
}: PrelimPreviewModalProps) {
  if (!data) return null;

  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [editData, setEditData] = useState({ ...data });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };
  const handlePrint = () => window.print();

  const editField = (key: string, label: string, rows = 1) => (
    <div style={{ marginBottom: 8 }}>
      <div className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-0.5">
        {label}
      </div>
      {rows > 1 ? (
        <textarea
          rows={rows}
          value={(editData as any)[key] || ""}
          onChange={(e) =>
            setEditData((d) => ({ ...d, [key]: e.target.value }))
          }
          className="w-full border border-[#fecaca] rounded-[6px] p-[6px_9px] text-[11.5px] resize-vertical outline-none bg-[#fffbeb] text-text box-border"
          style={{ fontFamily: "'Times New Roman', serif", lineHeight: 1.6 }}
        />
      ) : (
        <input
          value={(editData as any)[key] || ""}
          onChange={(e) =>
            setEditData((d) => ({ ...d, [key]: e.target.value }))
          }
          className="w-full border border-[#fecaca] rounded-[6px] p-[6px_9px] text-[11.5px] outline-none bg-[#fffbeb] text-text box-border"
          style={{ fontFamily: "'Times New Roman', serif" }}
        />
      )}
    </div>
  );

  const allExceptions = [
    ...editData.exceptions.map((e) => e.verbiage),
    ...(editData.easements ? [editData.easements] : []),
  ];
  const allRequirements = [
    ...editData.requirements.map((r) => r.verbiage),
    ...(editData.extraNotes ? [editData.extraNotes] : []),
    ...editData.notes.map((n) => n.verbiage),
  ];

  const numItem = (n: number, body: React.ReactNode) => (
    <div
      key={n}
      className="flex gap-2 mb-2.5 text-[11.5px] leading-[1.6] text-justify"
    >
      <span className="min-w-[22px] font-semibold">{n}.</span>
      <div className="flex-1">
        {typeof body === "string" ? renderRichString(body) : body}
      </div>
    </div>
  );



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
              Preliminary Report Preview
            </div>
            <div className="text-[10px] text-text-muted">
              Order No. {editData.orderNo} &nbsp;·&nbsp;{" "}
              {editData.propertyAddress}
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
            {editMode ? "View Mode" : "Edit Prelim"}
          </button>
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

      <div className="flex-1 flex overflow-hidden">
        {editMode && (
          <div
            className="w-[300px] shrink-0 overflow-y-auto p-4 border-r border-[#2d3348]"
            style={{ background: "#1e2130" }}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-white mb-3">
              <Icon name="edit3" size={13} style={{ color: "#f59e0b" }} />
              Edit Fields
            </div>
            <div className="text-[9px] text-text-muted mb-4 leading-[1.5]">
              Changes reflect in the preview instantly. Yellow fields are
              editable.
            </div>
            {editField("orderNo", "Order No.")}
            {editField("propertyAddress", "Property Address")}
            {editField("effectiveDate", "Effective Date")}
            {editField("effectiveTime", "Effective Time")}
            {editField("titleOfficer", "Title Officer")}
            {editField("titleEmail", "Title Officer Email")}
            {editField("titlePhone", "Phone")}
            {editField("titleFax", "Fax")}
            {editField("county", "County")}
            {editField("city", "City")}
            {editField("apn", "APN")}
            {editField("vestingName", "Vesting Name", 3)}
            {editField("vestingType", "Vesting Type")}
            {editField("leaseHold", "Lease Hold Interest", 2)}
            {editField("legal", "Legal Description (Exhibit A)", 6)}
          </div>
        )}

        <div
          className="flex-1 overflow-y-auto py-7"
          style={{ background: "#d1d5db" }}
        >
          <div
            className="max-w-[760px] mx-auto bg-white shadow-lg"
            style={{
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: 11.5,
              lineHeight: 1.6,
              color: "#111",
              padding: "48px 64px",
            }}
          >
            <div className="text-right text-[11px] font-bold mb-6">
              Order No.: {editData.orderNo}
            </div>

            <div className="text-center mb-1.5">
              <span
                style={{
                  fontFamily: "Georgia,'Times New Roman',serif",
                  fontSize: 54,
                  fontWeight: "bold",
                  color: "#1B2A4A",
                  letterSpacing: "-1px",
                }}
              >
                805<em>title</em>
              </span>
            </div>
            <div
              className="text-center text-[11.5px] leading-[1.9] mb-9"
              style={{ color: "#333" }}
            >
              31344 Via Colinas #106
              <br />
              Westlake Village, CA 91362
              <br />
              Tel: (805) 568-6006&nbsp;&nbsp;Fax: (805) 568-7838
            </div>

            {[
              ["ORDER NO.", editData.orderNo],
              ["TITLE OFFICER:", editData.titleOfficer],
              ["Email:", editData.titleEmail],
              ["PHONE:", editData.titlePhone],
              ["FAX:", editData.titleFax],
            ].map(([lbl, val]) => (
              <div key={lbl} className="mb-0.5 text-[11.5px]">
                <strong>{lbl}</strong>&nbsp;&nbsp;{val}
              </div>
            ))}

            <div className="h-10" />
            <div className="mb-0.5 text-[11.5px]">
              <strong>PROPERTY ADDRESS:</strong>&nbsp;&nbsp;
              {editData.propertyAddress}
            </div>
            <div className="mb-5 text-[11.5px]">
              Dated: <strong>{editData.effectiveDate}</strong> at{" "}
              {editData.effectiveTime}
            </div>

            <div className="text-center font-bold text-[13.5px] mb-1.5">
              PRELIMINARY REPORT
            </div>
            <hr className="border-none border-t-2 border-black my-2.5" />

            <p className="text-justify mb-2.5 text-[11.5px]">{BOIL1}</p>
            <p className="text-justify mb-2.5 text-[11.5px]">{BOIL2}</p>
            <p className="text-justify mb-2.5 text-[11.5px] font-bold">
              Please read the exceptions shown or referred to below and the
              exceptions and exclusions set forth in Exhibit A of this report
              carefully. The exceptions and exclusions are meant to provide you
              with notice of matters which are not covered under the terms of
              the title insurance policy and should be carefully considered.
            </p>
            <p className="text-justify mb-2.5 text-[11.5px] font-bold">
              It is important to note that this preliminary report is not a
              written representation as to the condition of title and may not
              list all liens, defects, and encumbrances affecting title to the
              land.
            </p>
            <p className="text-justify mb-7 text-[11.5px]">
              This report (and any supplements or amendments hereto) is issued
              solely for the purpose of facilitating the issuance of a policy of
              title insurance and no liability is assumed hereby.
            </p>
            <p className="text-justify mb-7 text-[11.5px] italic">
              The policy(s) of title insurance to be issued hereunder will be
              policy(s) of Westcor Land Title Insurance Company.
            </p>

            <div
              className="relative mx-[-64px] border-t-3 border-dashed"
              style={{ borderTop: "3px dashed #cbd5e1" }}
            >
              <span
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.07em] whitespace-nowrap px-3 rounded-full"
                style={{ background: "#e5e7eb", color: "#94a3b8" }}
              >
                Page 2 begins here
              </span>
            </div>

            <div className="text-center font-bold text-[13px] my-6 mb-2">
              PRELIMINARY REPORT
            </div>

            <table className="w-full border-collapse mb-4">
              <tbody>
                <tr>
                  <td
                    className="border border-[#ccc] p-[7px_12px] text-[11.5px] align-top font-normal w-[28%]"
                    style={{ background: "#f9f9f9" }}
                  >
                    File Number:
                  </td>
                  <td className="border border-[#ccc] p-[7px_12px] text-[11.5px] align-top">
                    {editData.orderNo}
                  </td>
                </tr>
                <tr>
                  <td
                    className="border border-[#ccc] p-[7px_12px] text-[11.5px] align-top font-normal w-[28%]"
                    style={{ background: "#f9f9f9" }}
                  >
                    Address Reference:
                  </td>
                  <td className="border border-[#ccc] p-[7px_12px] text-[11.5px] align-top">
                    {editData.propertyAddress}
                  </td>
                </tr>
                <tr>
                  <td
                    className="border border-[#ccc] p-[7px_12px] text-[11.5px] align-top font-normal w-[28%]"
                    style={{ background: "#f9f9f9" }}
                  >
                    Effective Date:
                  </td>
                  <td className="border border-[#ccc] p-[7px_12px] text-[11.5px] align-top">
                    <strong>{editData.effectiveDate}</strong> at{" "}
                    {editData.effectiveTime}
                  </td>
                </tr>
              </tbody>
            </table>

            {numItem(
              1,
              "The estate or interest in the land hereinafter described or referred to covered by this Report is:\n\nFee Simple" +
                (editData.leaseHold ? " / " + editData.leaseHold : ""),
            )}
            {numItem(
              2,
              <span>
                Title to said estate or interest at the date hereof is vested
                in:
                <br />
                <br />
                <span style={{ color: "#0F3460", fontWeight: 600 }}>
                  {editData.vestingName
                    ? renderRichString(editData.vestingName)
                    : "(Vesting not entered)"}
                  {editData.vestingType ? ", " + editData.vestingType : ""}
                </span>
              </span>,
            )}
            {numItem(
              3,
              <span>
                The land referred to in this Report is situated in the State of
                California, County of <strong>{editData.county}</strong>, and is
                described as follows:
                <br />
                <br />
                The land is described as set forth in Exhibit A attached hereto
                and made a part hereof.
              </span>,
            )}

            <div
              className="relative mx-[-64px] border-t-3 border-dashed my-8"
              style={{ borderTop: "3px dashed #cbd5e1" }}
            >
              <span
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.07em] whitespace-nowrap px-3 rounded-full"
                style={{ background: "#e5e7eb", color: "#94a3b8" }}
              >
                Page 3 begins here
              </span>
            </div>

            <p className="text-justify mt-4 mb-3 text-[11.5px]">
              As of the date hereof items to be considered and exceptions to
              coverage in addition to the printed exceptions and exclusions in
              said policy form would be as follows:
            </p>

            {allExceptions.length > 0 ? (
              allExceptions.map((ex, i) => numItem(i + 1, ex))
            ) : (
              <p className="italic text-text-muted text-[11.5px]">
                No exceptions recorded in TSRI.
              </p>
            )}

            <hr className="border-none border-t border-[#ddd] my-3.5" />

            <div
              className="relative mx-[-64px] border-t-3 border-dashed my-8"
              style={{ borderTop: "3px dashed #cbd5e1" }}
            >
              <span
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.07em] whitespace-nowrap px-3 rounded-full"
                style={{ background: "#e5e7eb", color: "#94a3b8" }}
              >
                Page 4 begins here
              </span>
            </div>

            <div className="font-bold text-[12.5px] my-4 mb-2.5">
              INFORMATIONAL NOTES:
            </div>
            {allRequirements.length > 0 ? (
              allRequirements.map((r, i) => numItem(i + 1, r))
            ) : (
              <p className="italic text-text-muted text-[11.5px]">
                No notes recorded in TSRI.
              </p>
            )}

            <hr className="border-none border-t border-[#ddd] my-3.5" />

            <div
              className="relative mx-[-64px] border-t-3 border-dashed my-8"
              style={{ borderTop: "3px dashed #cbd5e1" }}
            >
              <span
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.07em] whitespace-nowrap px-3 rounded-full"
                style={{ background: "#e5e7eb", color: "#94a3b8" }}
              >
                Page 5 begins here
              </span>
            </div>

            <div className="text-center font-bold text-[13.5px] my-6 mb-3.5">
              EXHIBIT A
            </div>
            <p className="text-justify mb-2.5 text-[11.5px]">
              The Land referred to herein below is situated in the City of{" "}
              <strong>{editData.city}</strong>, County of{" "}
              <strong>{editData.county}</strong>, State of California, and is
              described as follows:
            </p>
            <div className="mb-2.5 text-[11.5px]">
              APN:&nbsp;<strong>{editData.apn}</strong>
            </div>
            <p className="text-justify font-bold text-[11.5px] whitespace-pre-wrap">
              {editData.legal
                ? renderRichString(editData.legal)
                : "(Legal description not entered in Legal & Vesting section)"}
            </p>

            <div
              className="text-center mt-12 text-[10.5px] pt-3 border-t border-[#ddd]"
              style={{ color: "#888" }}
            >
              — End of Preliminary Report —
            </div>
          </div>
        </div>
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
