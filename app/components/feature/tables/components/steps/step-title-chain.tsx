"use client";

import Icon from "@/components/common/icon";
import IndexCard from "../index-card";
import LegalVestingDrawer from "../legal-vesting-drawer";
import GenieSectionCard from "../genie-section-card";
import TaxCertCard from "../tax-cert-card";
import AssessorCard from "../assessor-card";
import SectionTableCard from "../section-table-card";
import SectionUploadModal from "../section-upload-modal";
import { Button } from "@/components/ui";
import { useState, useEffect } from "react";
import ManualSearchModal from "../models/manual-search-modal";
import { INDEX_SECTIONS } from "../consts";
import { FIELDS } from "../temp";
import { mapTransactionsToIndexRows } from "@/app/services/transaction-mapper";
import {
  useFetchCodeBookQuery,
  useUploadFileMutation,
  useDeleteTitleChainReviewMutation,
  useDeleteAssessorMapMutation,
  useDeleteTractMapMutation,
  useDeleteRunsheetMutation,
  useDeleteStarterMutation,
  usePatchAssessorMapMutation,
  usePatchTractMapMutation,
  usePatchRunsheetMutation,
  usePatchStarterMutation,
  usePatchTitleChainReviewMutation,
} from "@/app/store/api/ordersApi";
import type {
  SharedState,
  PropertyForm,
  ChainCode,
  CodeBookEntry,
  OrderDetail,
  IndexRow,
} from "@/app/components/feature/tables/types";

/* ── Map API CodeBookEntry to GenieSectionCard's expected shape ── */
interface GenieCodeItem {
  code: string;
  label: string;
  body: string;
}

function mapCodeBookToGenieItems(entries: CodeBookEntry[]): GenieCodeItem[] {
  return entries
    .filter((e) => e.isActive)
    .map((e) => {
      const dashIdx = e.code.indexOf(" - ");
      const label = dashIdx !== -1 ? e.code.slice(dashIdx + 3).trim() : e.code;
      return { code: e.code, label, body: e.verbiage };
    });
}

function mapTitleChainToIndexRows(
  chain: Record<string, unknown>[],
): IndexRow[] {
  return chain.map((item, i) => {
    const abbr = String(item.abbr || "");
    const category = String(item.category || item.entityTitle || "");
    const bookPage = String(item.bookPage || "");
    return {
      _id: `tc-${i}`,
      apiId: item.id != null ? Number(item.id) : undefined,
      rec: String(item.recDate || ""),
      abbr,
      entity:
        category === "Transfers" || category === "Transfer"
          ? "XFER"
          : category === "DOTs"
            ? "DOT"
            : category === "Liens & Judgments"
              ? "LIEN"
              : category === "Easement & Restrictions"
                ? "EASE"
                : "MISC",
      docTitle: String(item.docTitle || ""),
      instr: String(item.instrument || ""),
      book: bookPage.split("-")[0] || "",
      pg: bookPage.split("-")[1] || "",
      grantor: String(item.grantor || ""),
      grantee: String(item.grantee || ""),
      parentInstr: null,
      fileUrl: item.fileUrl ? String(item.fileUrl) : undefined,
    };
  });
}

interface StepTitleChainProps {
  shared: SharedState;
  setShared: React.Dispatch<React.SetStateAction<SharedState>>;
  propertyForm?: PropertyForm;
  reportRaw?: Record<string, any>;
  transactions?: Record<string, any>[];
  orderDetail?: OrderDetail;
  isLoading?: boolean;
  onSave?: (dates?: { typeDate: string; effectiveDate: string }) => void;
  onSaveClose?: () => void;
}

export default function StepTitleChain({
  shared,
  setShared,
  propertyForm,
  reportRaw,
  transactions,
  orderDetail,
  isLoading,
  onSave,
  onSaveClose,
}: StepTitleChainProps) {
  console.log(orderDetail);
  const chainFromOrderDetail = orderDetail?.titleChainReviews
    ? mapTitleChainToIndexRows(
        orderDetail.titleChainReviews as Record<string, unknown>[],
      )
    : [];
  const tx = reportRaw?.Transactions;
  const apiChainRows =
    tx && Array.isArray(tx) && tx.length > 0
      ? mapTransactionsToIndexRows(tx)
      : chainFromOrderDetail;

  const [showSearch, setShowSearch] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [typeDate, setTypeDate] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [codes, setCodes] = useState<ChainCode[]>(shared?.chainCodes || []);
  const { data: codeBookEntries } = useFetchCodeBookQuery();
  const genieCodes = codeBookEntries
    ? mapCodeBookToGenieItems(codeBookEntries)
    : [];
  const [uploadFile] = useUploadFileMutation();
  const [deleteTitleChainReview] = useDeleteTitleChainReviewMutation();
  const [deleteAssessorMap] = useDeleteAssessorMapMutation();
  const [deleteTractMap] = useDeleteTractMapMutation();
  const [deleteRunsheet] = useDeleteRunsheetMutation();
  const [deleteStarter] = useDeleteStarterMutation();
  const [patchAssessorMap] = usePatchAssessorMapMutation();
  const [patchTractMap] = usePatchTractMapMutation();
  const [patchRunsheet] = usePatchRunsheetMutation();
  const [patchStarter] = usePatchStarterMutation();
  const [patchTitleChainReview] = usePatchTitleChainReviewMutation();

  const handleFileUpload = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("file", file);
    return uploadFile(fd).unwrap();
  };

  useEffect(() => {
    setTypeDate(shared.typeDate || "");
    setEffectiveDate(shared.effectiveDate || "");
  }, [shared.typeDate, shared.effectiveDate]);

  const addCode = (code: ChainCode) => {
    const next = [...codes, code];
    setCodes(next);
    if (setShared) {
      setShared((s) => ({ ...s, chainCodes: next }));
    }
  };
  /* ── Derive values from orderDetail + propertyForm ── */
  const assessorMapFields = FIELDS["Assessor Map"] || [];
  const assessorMapRows: Array<Record<string, string>> = (orderDetail?.assessorMaps || []).map((r) => ({
    _apiId: String(r.id),
    mapRef: r.mapReference || "",
    parcelNo: r.parcelNo || "",
    mapDate: r.mapDate || "",
    notes: r.notes || "",
    fileUrl: r.fileUrl || "",
  }));
  /* scalar fallback when no section records exist yet */
  const assessorMapValues: Record<string, string> = assessorMapRows.length === 0 ? {
    mapRef: orderDetail?.tract || propertyForm?.tract || "",
    parcelNo: orderDetail?.apn1 || propertyForm?.apn1 || "",
    mapDate: "",
    notes: orderDetail?.additionalNotes || "",
    fileUrl: reportRaw?.FileLink || "",
  } : {};

  const tractMapFields = FIELDS["Tract Map"] || [];
  const tractMapRows: Array<Record<string, string>> = (orderDetail?.tractMaps || []).map((r) => ({
    _apiId: String(r.id),
    tractNo: r.tractNo || "",
    bookPage: r.bookPage || "",
    recDate: r.recordedDate || "",
    subdivision: r.subdivision || "",
    fileUrl: r.fileUrl || "",
  }));
  const tractMapValues: Record<string, string> = tractMapRows.length === 0 ? {
    tractNo: orderDetail?.tract || propertyForm?.tract || "",
    bookPage:
      orderDetail?.mapBook || propertyForm?.mapBook
        ? `${orderDetail?.mapBook || propertyForm?.mapBook}${orderDetail?.page || propertyForm?.page ? ` / ${orderDetail?.page || propertyForm?.page}` : ""}`
        : "",
    recDate: "",
    subdivision: "",
    fileUrl: reportRaw?.FileLink || "",
  } : {};

  const starterFields = FIELDS["Starters"] || [];
  const starterRows: Array<Record<string, string>> = (orderDetail?.starters || []).map((r) => ({
    _apiId: String(r.id),
    policyNo: r.priorPolicyNo || "",
    policyDate: r.policyDate || "",
    insured: r.insured || "",
    company: r.titleCompany || "",
    amount: r.policyAmount || "",
    fileUrl: r.fileUrl || "",
  }));
  const starterValues: Record<string, string> = {};

  const runsheetFields = FIELDS["Runsheet"] || [];
  const runsheetRows: Array<Record<string, string>> = (orderDetail?.runsheets || []).map((r) => ({
    _apiId: String(r.id),
    orderNo: r.orderNo || "",
    searchedBy: r.searchedBy || "",
    searchDate: r.searchDate || "",
    geoCov: r.geoCoverage || "",
    notes: r.notes || "",
    fileUrl: r.fileUrl || "",
  }));
  const runsheetValues: Record<string, string> = runsheetRows.length === 0 ? {
    orderNo: orderDetail?.clientFileNo || "",
    searchedBy: orderDetail?.runsheetGINames || "",
    searchDate: "",
    geoCov: "",
    notes: orderDetail?.additionalNotes || "",
    fileUrl: reportRaw?.FileLink || "",
  } : {};

  const initialExceptions =
    orderDetail?.tsriExceptions?.map((e) => ({
      code: e.code || "",
      verbiage: e.verbiage || "",
    })) || [];

  const initialRequirements =
    orderDetail?.tsriRequirements?.map((e) => ({
      code: e.code || "",
      verbiage: e.verbiage || "",
    })) || [];

  const initialTaxCerts =
    orderDetail?.taxCerts?.map((e) => ({
      code: e.code || "",
      verbiage: e.verbiage || "",
    })) || [];

  const exceptionCodes: GenieCodeItem[] =
    orderDetail?.tsriExceptions?.map((e) => ({
      code: e.code,
      label: e.code,
      body: e.verbiage ?? "",
    })) || [];

  const requirementCodes: GenieCodeItem[] =
    orderDetail?.tsriRequirements?.map((e) => ({
      code: e.code,
      label: e.code,
      body: e.verbiage ?? "",
    })) || [];
  return (
    <div className="flex flex-col gap-4">
      {/* ── Legal & Vesting — slide-down panel ── */}
      <LegalVestingDrawer
        shared={shared}
        setShared={setShared}
        propertyForm={propertyForm}
        isLoading={isLoading}
      />

      {/* ── Type Date & Effective Date ── */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="p-[12px_18px] grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1.25">
              <Icon name="file" size={11} className="text-text-secondary" />
              Type Date
            </label>
            <input
              type="date"
              value={typeDate}
              onChange={(e) => setTypeDate(e.target.value)}
              className="w-full border border-border-input-alt rounded-lg px-2.5 py-2 text-[12px] text-ui-code bg-white outline-none"
            />
            {typeDate && (
              <span className="text-[10px] text-text-tertiary">
                {new Date(typeDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1.25">
              <Icon name="calendar" size={11} className="text-brand" />
              Effective Date
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full border rounded-lg px-2.5 py-2 text-[12px] text-ui-code outline-none"
              style={{
                borderColor: effectiveDate
                  ? "var(--status-error-bg)"
                  : "#d1d5db",
                background: effectiveDate
                  ? "var(--brand-primary-subtle)"
                  : "#fff",
              }}
            />
            {effectiveDate && (
              <span className="text-[10px] text-brand font-semibold flex items-center gap-1">
                <Icon name="checkCircle" size={10} />
                {new Date(effectiveDate + "T00:00:00").toLocaleDateString(
                  "en-US",
                  {
                    weekday: "short",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  },
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          SECTION B — Index Review
      ════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center justify-between pb-2.5 border-b-2 border-accent-data-trace mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-accent-data-trace rounded-lg flex items-center justify-center shrink-0">
              <Icon name="link" size={14} className="text-white" />
            </div>
            <div>
              <h3 className="m-0 text-[13px] font-bold text-text">
                Index Review
              </h3>
              <p className="m-0 text-[10px] text-text-muted mt-0.25">
                {INDEX_SECTIONS.length} sections · Review all recorded documents
                by category
              </p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <button className="inline-flex items-center gap-1.25 bg-white text-text-secondary border border-border rounded-lg px-3.5 py-1.5 text-[11px] font-semibold cursor-pointer">
              <Icon name="refresh" size={11} />
              Refresh All
            </button>
            <button className="inline-flex items-center gap-1.25 bg-brand text-white border-none rounded-lg px-3.5 py-1.5 text-[11px] font-semibold cursor-pointer">
              <Icon name="fileCheck" size={11} />
              Generate Exceptions
            </button>
          </div>
        </div>

        {INDEX_SECTIONS.map((sec) => {
          if (sec.title === "Assessor Page")
            return (
              <AssessorCard
                key="Assessor Page"
                data={propertyForm}
                dataRaw={reportRaw}
                transactions={transactions}
                isLoading={isLoading}
              />
            );
          if (sec.title === "Assessor Map")
            return (
              <SectionTableCard
                key={sec.title}
                title={sec.title}
                sub={sec.sub}
                accent={sec.accent}
                fields={assessorMapFields}
                rows={assessorMapRows.length > 0 ? assessorMapRows : undefined}
                values={assessorMapValues}
                onFileUpload={handleFileUpload}
                onDeleteRow={
                  orderDetail?.id
                    ? async (apiId) => { await deleteAssessorMap({ orderId: String(orderDetail.id), id: apiId }).unwrap(); }
                    : undefined
                }
                onUpdateRow={
                  orderDetail?.id
                    ? async (apiId, vals, file) => {
                        const fd = new FormData();
                        if (vals.mapRef) fd.append("mapReference", vals.mapRef);
                        if (vals.parcelNo) fd.append("parcelNo", vals.parcelNo);
                        if (vals.mapDate) fd.append("mapDate", vals.mapDate);
                        if (vals.notes) fd.append("notes", vals.notes);
                        if (file) fd.append("file", file);
                        await patchAssessorMap({ orderId: String(orderDetail.id), id: apiId, data: fd });
                      }
                    : undefined
                }
              />
            );
          if (sec.title === "Tract Map")
            return (
              <SectionTableCard
                key={sec.title}
                title={sec.title}
                sub={sec.sub}
                accent={sec.accent}
                fields={tractMapFields}
                rows={tractMapRows.length > 0 ? tractMapRows : undefined}
                values={tractMapValues}
                onFileUpload={handleFileUpload}
                onDeleteRow={
                  orderDetail?.id
                    ? async (apiId) => { await deleteTractMap({ orderId: String(orderDetail.id), id: apiId }).unwrap(); }
                    : undefined
                }
                onUpdateRow={
                  orderDetail?.id
                    ? async (apiId, vals, file) => {
                        const fd = new FormData();
                        if (vals.tractNo) fd.append("tractNo", vals.tractNo);
                        if (vals.bookPage) fd.append("bookPage", vals.bookPage);
                        if (vals.recDate) fd.append("recordedDate", vals.recDate);
                        if (vals.subdivision) fd.append("subdivision", vals.subdivision);
                        if (file) fd.append("file", file);
                        await patchTractMap({ orderId: String(orderDetail.id), id: apiId, data: fd });
                      }
                    : undefined
                }
              />
            );
          if (sec.title === "Tax Cert")
            return (
              <TaxCertCard
                key={`taxcert-${orderDetail?.id ?? "none"}`}
                title={sec.title}
                sub={sec.sub}
                accent={sec.accent}
                orderId={orderDetail?.id}
                codes={orderDetail?.taxCerts}
                initialAddedCodes={
                  orderDetail?.taxCerts?.map((e) => ({
                    id: e.id,
                    code: e.code,
                    verbiage: e.verbiage || "",
                  })) || []
                }
              />
            );
          if (sec.title === "Runsheet")
            return (
              <SectionTableCard
                key={sec.title}
                title={sec.title}
                sub={sec.sub}
                accent={sec.accent}
                fields={runsheetFields}
                rows={runsheetRows.length > 0 ? runsheetRows : undefined}
                values={runsheetValues}
                onFileUpload={handleFileUpload}
                onDeleteRow={
                  orderDetail?.id
                    ? async (apiId) => { await deleteRunsheet({ orderId: String(orderDetail.id), id: apiId }).unwrap(); }
                    : undefined
                }
                onUpdateRow={
                  orderDetail?.id
                    ? async (apiId, vals, file) => {
                        const fd = new FormData();
                        if (vals.orderNo) fd.append("orderNo", vals.orderNo);
                        if (vals.searchedBy) fd.append("searchedBy", vals.searchedBy);
                        if (vals.searchDate) fd.append("searchDate", vals.searchDate);
                        if (vals.geoCov) fd.append("geoCoverage", vals.geoCov);
                        if (vals.notes) fd.append("notes", vals.notes);
                        if (file) fd.append("file", file);
                        await patchRunsheet({ orderId: String(orderDetail.id), id: apiId, data: fd });
                      }
                    : undefined
                }
              />
            );
          if (sec.title === "Other Exceptions")
            return (
              <GenieSectionCard
                key={`exceptions-${orderDetail?.id ?? "none"}`}
                title={sec.title}
                sub="Schedule B Exceptions — from Genie Code Book"
                accent={sec.accent}
                orderId={orderDetail?.id ? String(orderDetail.id) : undefined}
                sectionType="exception"
                initialAddedCodes={
                  orderDetail?.tsriExceptions?.map((e) => ({
                    id: e.id,
                    code: e.code,
                    verbiage: e.verbiage || "",
                  })) || []
                }
              />
            );
          if (sec.title === "Other Requirements")
            return (
              <GenieSectionCard
                key={`requirements-${orderDetail?.id ?? "none"}`}
                title={sec.title}
                sub="Informational Notes & Requirements — from Genie Code Book"
                accent={sec.accent}
                orderId={orderDetail?.id ? String(orderDetail.id) : undefined}
                sectionType="requirement"
                initialAddedCodes={
                  orderDetail?.tsriRequirements?.map((e) => ({
                    id: e.id,
                    code: e.code,
                    verbiage: e.verbiage || "",
                  })) || []
                }
              />
            );
          if (sec.title === "Starters")
            return (
              <SectionTableCard
                key={sec.title}
                title={sec.title}
                sub={sec.sub}
                accent={sec.accent}
                fields={starterFields}
                rows={starterRows.length > 0 ? starterRows : undefined}
                values={starterValues}
                onFileUpload={handleFileUpload}
                onDeleteRow={
                  orderDetail?.id
                    ? async (apiId) => { await deleteStarter({ orderId: String(orderDetail.id), id: apiId }).unwrap(); }
                    : undefined
                }
                onUpdateRow={
                  orderDetail?.id
                    ? async (apiId, vals, file) => {
                        const fd = new FormData();
                        if (vals.policyNo) fd.append("priorPolicyNo", vals.policyNo);
                        if (vals.policyDate) fd.append("policyDate", vals.policyDate);
                        if (vals.insured) fd.append("insured", vals.insured);
                        if (vals.company) fd.append("titleCompany", vals.company);
                        if (vals.amount) fd.append("policyAmount", vals.amount);
                        if (file) fd.append("file", file);
                        await patchStarter({ orderId: String(orderDetail.id), id: apiId, data: fd });
                      }
                    : undefined
                }
              />
            );
          const isTitleChain = sec.title === "Title Chain Review";
          return (
            <IndexCard
              key={sec.title}
              title={sec.title}
              sub={sec.sub}
              accent={sec.accent}
              initRows={
                isTitleChain && apiChainRows.length > 0
                  ? apiChainRows
                  : sec.rows
              }
              allowAddRow={isTitleChain}
              showCode={false}
              onFileUpload={isTitleChain ? handleFileUpload : undefined}
              onDeleteRow={
                isTitleChain && orderDetail?.id
                  ? async (apiId) => {
                      await deleteTitleChainReview({
                        orderId: String(orderDetail.id),
                        id: apiId,
                      }).unwrap();
                    }
                  : undefined
              }
              onUpdateRow={
                isTitleChain && orderDetail?.id
                  ? async (apiId, vals, file) => {
                      const fd = new FormData();
                      if (vals.rec) fd.append("recDate", vals.rec);
                      if (vals.abbr) fd.append("abbr", vals.abbr);
                      if (vals.grantor) fd.append("grantor", vals.grantor);
                      if (vals.grantee) fd.append("grantee", vals.grantee);
                      if (vals.instr) fd.append("instrument", vals.instr);
                      if (vals.book || vals.pg) fd.append("bookPage", `${vals.book || ""}-${vals.pg || ""}`);
                      if (vals.entity) fd.append("entityTitle", vals.entity);
                      if (vals.docTitle) fd.append("docTitle", vals.docTitle);
                      if (file) fd.append("file", file);
                      await patchTitleChainReview({
                        orderId: String(orderDetail.id),
                        id: apiId,
                        data: fd,
                      });
                    }
                  : undefined
              }
            />
          );
        })}
      </div>

      {/* ── bottom action bar ── */}
      <div
        className="sticky bottom-0 z-10 bg-white border border-border rounded-xl flex items-center gap-2 px-4 py-2.5 mt-1.5"
        style={{ boxShadow: "0 -2px 14px rgba(0,0,0,.08)" }}
      >
        <button
          onClick={() => setShowSearch(true)}
          className="inline-flex items-center gap-1.25 bg-brand text-white border-none rounded-lg px-4.5 py-2 text-[12px] font-semibold cursor-pointer"
        >
          <Icon name="search" size={12} />
          Manual Search
        </button>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center gap-1.25 bg-white text-text-secondary border border-border rounded-lg px-3.5 py-1.75 text-[12px] font-semibold cursor-pointer"
        >
          <Icon name="upload" size={12} />
          Upload
        </button>
        <div className="flex-1" />
        <button
          onClick={() => onSave?.({ typeDate, effectiveDate })}
          className="inline-flex items-center gap-1.25 bg-white text-text-secondary border border-border rounded-lg px-4 py-1.75 text-[12px] font-semibold cursor-pointer"
        >
          <Icon name="save" size={12} />
          Save
        </button>
        <button
          onClick={() => {
            onSave?.({ typeDate, effectiveDate });
            onSaveClose?.();
          }}
          className="inline-flex items-center gap-1.25 bg-header text-white border-none rounded-lg px-4 py-1.75 text-[12px] font-semibold cursor-pointer"
        >
          <Icon name="save" size={12} />
          Save &amp; Close
        </button>
        <Button
          className="inline-flex items-center gap-1.25 bg-header text-white border-none rounded-lg px-4 py-1.75 text-[12px] font-semibold cursor-pointer"
          size="md"
          style={{ background: "#8B0000" }}
        >
          Create TSR
        </Button>
      </div>

      {showSearch && <ManualSearchModal onClose={() => setShowSearch(false)} />}
      {showUploadModal && (
        <SectionUploadModal
          onClose={() => setShowUploadModal(false)}
          orderId={orderDetail?.id ? String(orderDetail.id) : undefined}
        />
      )}
    </div>
  );
}

export { INDEX_SECTIONS };
