"use client";

import Icon from "@/components/common/icon";
import { CardHead, Lbl } from "../shared-atoms";
import TaxCertCard from "../tax-cert-card";
import { useState, useEffect } from "react";
import {
  useReorderTsriExceptionsMutation,
  useReorderTsriRequirementsMutation,
} from "@/app/store/api/ordersApi";
import toast from "react-hot-toast";
import { buildTsriPreviewBody } from "../prelim";
import type {
  ChainCode,
  SharedState,
  OrderDetail,
} from "@/app/components/feature/tables/types";
import {
  Button,
  Card,
  CardContent,
  Input,
  Select,
  Textarea,
  Badge,
} from "@/components/ui";

function sanitizeHtml(html: string): string {
  return html;
  // .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
  // .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
  // .replace(/href\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'href="#"')
  // .replace(/src\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, 'src="#"');
}

interface StepTSRIProps {
  shared: SharedState;
  setShared: React.Dispatch<React.SetStateAction<SharedState>>;
  onGenerate: (data: Record<string, unknown>) => void;
  orderDetail?: OrderDetail;
}

function orderDetailToCodes(od?: OrderDetail): ChainCode[] {
  const exceptions: ChainCode[] = [...(od?.tsriExceptions || [])]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((e) => ({
      id: e.id,
      type: "exception" as const,
      code: e.code,
      verbiage: e.verbiage || "",
    }));
  const requirements: ChainCode[] = [...(od?.tsriRequirements || [])]
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((r) => ({
      id: r.id,
      type: "requirement" as const,
      code: r.code,
      verbiage: r.verbiage || "",
    }));
  return [...exceptions, ...requirements];
}

export default function StepTSRI({
  shared,
  setShared,
  onGenerate,
  orderDetail,
}: StepTSRIProps) {
  const [proposedInsured, setProposedInsured] = useState(
    `${(shared.vesting || "").split(",")[0] || "John D. Doe and Jane R. Doe"}`,
  );
  const [effectiveDate, setEffectiveDate] = useState(
    shared.effectiveDate || "05/07/2026",
  );
  const [effectiveTime, setEffectiveTime] = useState("7:30 a.m.");
  const [leaseHold, setLeaseHold] = useState(shared.leaseHold || "");
  const [vesting, setVesting] = useState(shared.vesting || "");
  const [legal, setLegal] = useState(shared.legal || "");
  const [easements, setEasements] = useState("");
  const [notes, setNotes] = useState("");
  const [codes, setCodes] = useState<ChainCode[]>(() => {
    const fromApi = orderDetailToCodes(orderDetail);
    return fromApi.length > 0 ? fromApi : shared.chainCodes || [];
  });
  useEffect(() => {
    const fromApi = orderDetailToCodes(orderDetail);
    if (fromApi.length > 0) {
      setCodes(fromApi);
      setShared((s) => ({ ...s, chainCodes: fromApi }));
    }
  }, [orderDetail, setShared]);
  const [newCode, setNewCode] = useState<{
    type: "exception" | "requirement" | "note";
    code: string;
    verbiage: string;
  }>({
    type: "exception",
    code: "",
    verbiage: "",
  });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [synced, setSynced] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setShared((s) => ({ ...s, vesting, legal, effectiveDate }));
  }, [vesting, legal, effectiveDate, setShared]);

  const buildPrelimBody = () =>
    buildTsriPreviewBody({
      effectiveDate,
      effectiveTime,
      leaseHold,
      vesting,
      legal,
      easements,
      notes,
      exceptions,
      requirements,
      notesCodes,
      orderDetail,
    });

  const handleAutoGenerateExceptions = () => {
    /* Auto-populate standard exceptions based on state/county */
    const stdExceptions: ChainCode[] = [
      {
        id: Date.now() + 1,
        type: "exception",
        code: "Exception 1",
        verbiage:
          "Property taxes, including any personal property taxes and any assessments collected with taxes, for the fiscal year 2025-2026, a lien not yet due and payable. APN: 0557-081-23-0000",
      },
      {
        id: Date.now() + 2,
        type: "exception",
        code: "Exception 2",
        verbiage:
          "Any liens or other assessments, bonds or special district levies of San Bernardino County.",
      },
      {
        id: Date.now() + 3,
        type: "exception",
        code: "Exception 3",
        verbiage:
          "An easement for public utilities and incidental purposes in favor of CITY OF GLENDALE, recorded April 11, 1998 as Instrument No. 1998-0022341.",
      },
      {
        id: Date.now() + 4,
        type: "exception",
        code: "Exception 4",
        verbiage:
          "Covenants, Conditions and Restrictions of SUNSET HILLS HOA, recorded July 19, 2005 as Instrument No. 2005-0188770.",
      },
    ];
    const next = [...codes, ...stdExceptions];
    setCodes(next);
    setShared((s) => ({ ...s, chainCodes: next }));
  };

  const handleAutoGenerateRequirements = () => {
    /* Auto-populate standard requirements based on order type */
    const stdRequirements: ChainCode[] = [
      {
        id: Date.now() + 5,
        type: "requirement",
        code: "Requirement 1",
        verbiage:
          "Payment of the full consideration to or for the account of the grantors or mortgagors, as applicable.",
      },
      {
        id: Date.now() + 6,
        type: "requirement",
        code: "Requirement 2",
        verbiage:
          "Instruments in recordable form which must be executed, delivered and duly filed for record.",
      },
      {
        id: Date.now() + 7,
        type: "requirement",
        code: "Requirement 3",
        verbiage:
          "A Grant Deed from MICHAEL SMITH to JOHN D. DOE AND JANE R. DOE conveying the land described in Schedule A.",
      },
    ];
    const next = [...codes, ...stdRequirements];
    setCodes(next);
    setShared((s) => ({ ...s, chainCodes: next }));
  };

  const handleSync = () => {
    setVesting(shared.vesting);
    setLegal(shared.legal);
    setLeaseHold(shared.leaseHold);
    setEffectiveDate(shared.effectiveDate);
    setCodes(shared.chainCodes);
    setSynced(true);
    setTimeout(() => setSynced(false), 2500);
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
      onGenerate({
        proposedInsured,
        effectiveDate,
        effectiveTime,
        leaseHold,
        vesting,
        legal,
        easements,
        notes,
        codes,
        taxCerts: orderDetail?.taxCerts || [],
        body: buildPrelimBody(),
      });
    }, 1600);
  };

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [dragReqIdx, setDragReqIdx] = useState<number | null>(null);
  const [dragOverReqIdx, setDragOverReqIdx] = useState<number | null>(null);

  const [reorderTsriExceptions] = useReorderTsriExceptionsMutation();
  const [reorderTsriRequirements] = useReorderTsriRequirementsMutation();

  const addCode = () => {
    if (!newCode.code.trim() || !newCode.verbiage.trim()) return;
    const next = [...codes, { ...newCode, id: Date.now() }];
    setCodes(next);
    setShared((s) => ({ ...s, chainCodes: next }));
    setNewCode({ type: "exception", code: "", verbiage: "" });
  };

  const removeCode = (id: number) => {
    const next = codes.filter((c) => c.id !== id);
    setCodes(next);
    setShared((s) => ({ ...s, chainCodes: next }));
  };

  const moveCode = (from: number, to: number) => {
    const next = [...codes];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setCodes(next);
    setShared((s) => ({ ...s, chainCodes: next }));
  };

  const exceptions = codes.filter((c) => c.type === "exception");
  const requirements = codes.filter((c) => c.type === "requirement");
  const notesCodes = codes.filter((c) => c.type === "note");

  const codeTypeStyle = (t: string) =>
    t === "exception"
      ? "bg-orange-50 text-orange-800 border border-orange-200"
      : t === "requirement"
        ? "bg-blue-50 text-blue-800 border border-blue-200"
        : "bg-green-50 text-green-800 border border-green-200";

  return (
    <div className="flex flex-col gap-3.5">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-0.5 pb-3 border-b border-border mb-1">
        <div>
          <h2 className="m-0 text-[15px] font-bold text-text">
            Title Search Report Index (TSRI)
          </h2>
          <p className="m-0 text-[11px] text-text-muted mt-0.5">
            Compile all title data into a structured report — auto-populates
            Preliminary Report
          </p>
        </div>
        <div className="flex gap-1.5">
          <Button variant="secondary" onClick={handleSync}>
            <Icon name="refresh" size={11} />
            {synced ? "✓ Synced!" : "Sync from Chain & Legal"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Icon name="eye" size={11} />
            {showPreview ? "Hide Preview" : "Preview Report"}
          </Button>
          <Button variant="secondary" onClick={handleAutoGenerateExceptions}>
            <Icon name="fileCheck" size={11} />
            Auto Exceptions
          </Button>
          <Button variant="secondary" onClick={handleAutoGenerateRequirements}>
            <Icon name="checkCircle" size={11} />
            Auto Requirements
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={generating || generated}
            variant={generated ? "success" : "primary"}
          >
            {generating ? (
              <>
                <Icon name="loader" size={11} className="spin" />
                Generating Prelim…
              </>
            ) : generated ? (
              <>
                <Icon name="checkCircle" size={11} />
                Prelim Generated — Saved to Docs
              </>
            ) : (
              <>
                <Icon name="fileCheck" size={11} />
                Generate Preliminary Report
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-4.5">
        {/* LEFT column */}
        <div className="flex flex-col gap-4">
          {/* Proposed Insured */}
          <Card>
            <CardHead
              title="Proposed Insured"
              sub="Name(s) to be insured on the policy"
              accent="#8B0000"
            />
            <CardContent>
              <Lbl>Proposed Insured</Lbl>
              <Textarea
                rows={3}
                value={proposedInsured}
                onChange={(e) => setProposedInsured(e.target.value)}
                size="mono"
                placeholder="e.g. JOHN D. DOE AND JANE R. DOE, husband and wife…"
              />
            </CardContent>
          </Card>

          {/* Effective Date */}
          <Card>
            <CardHead
              title="Effective Date"
              sub="Date and time the search is effective"
              accent="#0369a1"
            />
            <CardContent className="grid grid-cols-2 gap-3.5">
              <div>
                <Lbl>Effective Date</Lbl>
                <Input
                  type="date"
                  value={
                    effectiveDate.split("/").length === 3
                      ? `${effectiveDate.split("/")[2]}-${effectiveDate.split("/")[0].padStart(2, "0")}-${effectiveDate.split("/")[1].padStart(2, "0")}`
                      : effectiveDate
                  }
                  onChange={(e) => {
                    const [y, m, d] = e.target.value.split("-");
                    setEffectiveDate(`${m}/${d}/${y}`);
                  }}
                />
              </div>
              <div>
                <Lbl>Effective Time</Lbl>
                <Select
                  value={effectiveTime}
                  onChange={(e) => setEffectiveTime(e.target.value)}
                  options={[
                    { value: "7:30 a.m.", label: "7:30 a.m." },
                    { value: "8:00 a.m.", label: "8:00 a.m." },
                    { value: "12:00 p.m.", label: "12:00 p.m." },
                    { value: "5:00 p.m.", label: "5:00 p.m." },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Lease Hold Interest */}
          <Card>
            <CardHead
              title="Lease Hold Interest"
              sub="Leasehold details and remarks"
              accent="#7c3aed"
            />
            <CardContent>
              <Lbl>Lease Hold Description</Lbl>
              <Textarea
                rows={3}
                value={leaseHold}
                onChange={(e) => setLeaseHold(e.target.value)}
                size="mono"
                placeholder="Fee simple estate / leasehold interest description…"
              />
            </CardContent>
          </Card>

          {/* Vesting — read-only HTML render */}
          <Card>
            <CardHead
              title="Vesting"
              sub="Current ownership vesting — auto-populated from Legal & Vesting"
              accent="#059669"
              right={
                <Badge variant="success" size="sm">
                  AUTO
                </Badge>
              }
            />
            <CardContent>
              <Lbl>Vesting as it will appear in Schedule A</Lbl>
              <div
                className="w-full rounded-lg border border-border-input-alt bg-white px-3 py-2.5 text-[11px] text-text font-mono leading-relaxed"
                style={{ whiteSpace: "pre-wrap", minHeight: 60 }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(vesting) }}
              />
            </CardContent>
          </Card>

          {/* Legal Description — read-only HTML render */}
          <Card>
            <CardHead
              title="Legal Description"
              sub="Verify and edit the parcel legal description"
              accent="#d97706"
              right={
                <div className="flex items-center gap-1.5">
                  <span className="bg-status-success-emerald text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    AI
                  </span>
                  <button className="bg-transparent border-none cursor-pointer text-text-muted flex">
                    <Icon name="copy" size={13} />
                  </button>
                  <button className="bg-transparent border-none cursor-pointer text-text-muted flex">
                    <Icon name="cpu" size={13} />
                  </button>
                </div>
              }
            />
            <CardContent>
              <div
                className="w-full rounded-lg border border-border-input-alt bg-white px-3 py-2.5 text-[11px] text-text font-mono leading-relaxed"
                style={{ whiteSpace: "pre-wrap", minHeight: 100 }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(legal) }}
              />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[10px] text-text-muted">
                  {legal.length} chars
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Tax Cert */}
          <TaxCertCard
            title="Tax Cert"
            sub="Tax certificate and payment records"
            accent="#7c3aed"
            orderId={orderDetail?.id}
            readOnly
            initialAddedCodes={[...(orderDetail?.taxCerts || [])]
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
              .map((t) => ({
                id: t.id,
                code: t.code,
                verbiage: t.verbiage || "",
              }))}
          />
        </div>

        {/* RIGHT column */}
        <div className="flex flex-col gap-4">
          {/* Easements & Restrictions */}
          <Card>
            <CardHead
              title="Easements & Restrictions"
              sub="Schedule B — Exceptions (auto-populated from Title Chain codes)"
              accent="#dc2626"
              right={
                <Badge variant="error" size="sm">
                  {exceptions.length} items
                </Badge>
              }
            />
            <CardContent className="flex flex-col gap-2">
              {exceptions.length === 0 && (
                <p className="text-[11px] text-text-muted italic py-2">
                  No exceptions yet — add from Title Chain codes or use Auto
                  Exceptions above.
                </p>
              )}
              {exceptions.map((c, i) => {
                const globalIdx = codes.findIndex(
                  (x) => x.id === c.id && x.type === c.type,
                );
                const isDrag = dragIdx === globalIdx;
                const isOver = dragOverIdx === i;
                return (
                  <div
                    key={`${c.type}-${c.id}`}
                    draggable
                    onDragStart={() => setDragIdx(globalIdx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverIdx(i);
                    }}
                    onDragEnd={() => {
                      setDragIdx(null);
                      setDragOverIdx(null);
                    }}
                    onDrop={() => {
                      if (dragIdx !== null && dragIdx !== globalIdx) {
                        moveCode(dragIdx, globalIdx);
                        const next = [...codes];
                        const [moved] = next.splice(dragIdx, 1);
                        next.splice(globalIdx, 0, moved);
                        const items = next
                          .filter((x) => x.type === "exception" && x.id)
                          .map((x, idx) => ({ id: x.id, sortOrder: idx + 1 }));
                        if (orderDetail?.id && items.length > 0) {
                          reorderTsriExceptions({
                            orderId: String(orderDetail.id),
                            items,
                          })
                            .unwrap()
                            .catch(() =>
                              toast.error("Failed to save exception order"),
                            );
                        }
                      }
                      setDragIdx(null);
                      setDragOverIdx(null);
                    }}
                    className={`border rounded-lg p-2.5 relative transition-all duration-150 ${
                      isDrag
                        ? "opacity-40 border-brand shadow-md"
                        : "border-red-100 bg-red-50/50"
                    } ${isOver ? "ring-2 ring-brand pt-5" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="cursor-grab active:cursor-grabbing text-red-200 hover:text-red-400 transition-colors flex"
                          onMouseDown={(e) =>
                            (e.currentTarget.style.cursor = "grabbing")
                          }
                          onMouseUp={(e) =>
                            (e.currentTarget.style.cursor = "grab")
                          }
                        >
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ flexShrink: 0 }}
                          >
                            <circle
                              cx="9"
                              cy="5"
                              r="1.5"
                              fill="currentColor"
                              stroke="none"
                            />
                            <circle
                              cx="15"
                              cy="5"
                              r="1.5"
                              fill="currentColor"
                              stroke="none"
                            />
                            <circle
                              cx="9"
                              cy="12"
                              r="1.5"
                              fill="currentColor"
                              stroke="none"
                            />
                            <circle
                              cx="15"
                              cy="12"
                              r="1.5"
                              fill="currentColor"
                              stroke="none"
                            />
                            <circle
                              cx="9"
                              cy="19"
                              r="1.5"
                              fill="currentColor"
                              stroke="none"
                            />
                            <circle
                              cx="15"
                              cy="19"
                              r="1.5"
                              fill="currentColor"
                              stroke="none"
                            />
                          </svg>
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${codeTypeStyle(c.type)}`}
                        >
                          {c.code}
                        </span>
                      </div>
                      <button
                        onClick={() => removeCode(c.id)}
                        className="bg-transparent border-none cursor-pointer text-red-300 text-[11px] p-0 leading-none"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-[11px] text-text-secondary m-0 leading-normal pl-4.5">
                      {c.verbiage}
                    </p>
                  </div>
                );
              })}
              <div className="mt-1">
                <Lbl>Additional Easements / Free-text</Lbl>
                <Textarea
                  rows={3}
                  value={easements}
                  onChange={(e) => setEasements(e.target.value)}
                  size="mono"
                  placeholder="Additional easement or restriction language…"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notes & Requirements */}
          <Card>
            <CardHead
              title="Notes & Requirements"
              sub="Schedule B — Requirements and Notes (auto-populated)"
              accent="#0891b2"
              right={
                <Badge variant="info" size="sm">
                  {requirements.length + notesCodes.length} items
                </Badge>
              }
            />
            <CardContent className="flex flex-col gap-2">
              {[...requirements, ...notesCodes].map((c, i) => {
                const globalIdx = codes.findIndex(
                  (x) => x.id === c.id && x.type === c.type,
                );
                const isDragReq = dragReqIdx === globalIdx;
                const isOverReq = dragOverReqIdx === i;
                return (
                  <div
                    key={`${c.type}-${c.id}`}
                    draggable
                    onDragStart={() => setDragReqIdx(globalIdx)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOverReqIdx(i);
                    }}
                    onDragEnd={() => {
                      setDragReqIdx(null);
                      setDragOverReqIdx(null);
                    }}
                    onDrop={() => {
                      if (dragReqIdx !== null && dragReqIdx !== globalIdx) {
                        moveCode(dragReqIdx, globalIdx);
                        const next = [...codes];
                        const [moved] = next.splice(dragReqIdx, 1);
                        next.splice(globalIdx, 0, moved);
                        const items = next
                          .filter((x) => x.type === "requirement" && x.id)
                          .map((x, idx) => ({ id: x.id, sortOrder: idx + 1 }));
                        if (orderDetail?.id && items.length > 0) {
                          reorderTsriRequirements({
                            orderId: String(orderDetail.id),
                            items,
                          })
                            .unwrap()
                            .catch(() =>
                              toast.error("Failed to save requirement order"),
                            );
                        }
                      }
                      setDragReqIdx(null);
                      setDragOverReqIdx(null);
                    }}
                    className={`rounded-lg p-2.5 relative border transition-all duration-150 ${
                      isDragReq
                        ? "opacity-40 border-brand shadow-md"
                        : c.type === "requirement"
                          ? "border-blue-200 bg-blue-50"
                          : "border-green-200 bg-green-50"
                    } ${isOverReq ? "ring-2 ring-brand pt-5" : ""}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="cursor-grab active:cursor-grabbing text-blue-200 hover:text-blue-400 transition-colors flex"
                          onMouseDown={(e) =>
                            (e.currentTarget.style.cursor = "grabbing")
                          }
                          onMouseUp={(e) =>
                            (e.currentTarget.style.cursor = "grab")
                          }
                        >
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            style={{ flexShrink: 0 }}
                          >
                            <circle
                              cx="9"
                              cy="5"
                              r="1.5"
                              fill="currentColor"
                              stroke="none"
                            />
                            <circle
                              cx="15"
                              cy="5"
                              r="1.5"
                              fill="currentColor"
                              stroke="none"
                            />
                            <circle
                              cx="9"
                              cy="12"
                              r="1.5"
                              fill="currentColor"
                              stroke="none"
                            />
                            <circle
                              cx="15"
                              cy="12"
                              r="1.5"
                              fill="currentColor"
                              stroke="none"
                            />
                            <circle
                              cx="9"
                              cy="19"
                              r="1.5"
                              fill="currentColor"
                              stroke="none"
                            />
                            <circle
                              cx="15"
                              cy="19"
                              r="1.5"
                              fill="currentColor"
                              stroke="none"
                            />
                          </svg>
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${codeTypeStyle(c.type)}`}
                        >
                          {c.code}
                        </span>
                      </div>
                      <button
                        onClick={() => removeCode(c.id)}
                        className="bg-transparent border-none cursor-pointer text-blue-300 text-[11px] p-0 leading-none"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-[11px] text-text-secondary m-0 leading-normal pl-4.5">
                      {c.verbiage}
                    </p>
                  </div>
                );
              })}
              <div className="mt-1">
                <Lbl>Additional Notes / Free-text</Lbl>
                <Textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  size="mono"
                  placeholder="Additional notes or requirements…"
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Code manually */}
          <Card>
            <CardHead
              title="Add Code / Verbiage"
              sub="Manually add a Schedule B exception, requirement, or note"
              accent="#475569"
            />
            <CardContent className="flex flex-col gap-2.5">
              <div className="grid grid-cols-[120px_1fr] gap-2.5">
                <div>
                  <Lbl>Type</Lbl>
                  <Select
                    value={newCode.type}
                    onChange={(e) =>
                      setNewCode((c) => ({
                        ...c,
                        type: e.target.value as
                          | "exception"
                          | "requirement"
                          | "note",
                      }))
                    }
                    options={[
                      { value: "exception", label: "Exception" },
                      { value: "requirement", label: "Requirement" },
                      { value: "note", label: "Note" },
                    ]}
                  />
                </div>
                <div>
                  <Lbl>Code Label</Lbl>
                  <Input
                    value={newCode.code}
                    onChange={(e) =>
                      setNewCode((c) => ({ ...c, code: e.target.value }))
                    }
                    placeholder="e.g. Exception 6, Requirement 3, Note B"
                  />
                </div>
              </div>
              <div>
                <Lbl>Verbiage</Lbl>
                <Textarea
                  rows={3}
                  value={newCode.verbiage}
                  onChange={(e) =>
                    setNewCode((c) => ({ ...c, verbiage: e.target.value }))
                  }
                  size="mono"
                  placeholder="Full verbiage for this code…"
                />
              </div>
              <Button
                onClick={addCode}
                disabled={!newCode.code.trim() || !newCode.verbiage.trim()}
                className="self-start"
              >
                <Icon name="plus" size={11} />
                Add Code
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/55 flex items-center justify-center z-999 p-6"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-white w-225 max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,.28)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#1e2130] px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#8B0000] rounded-lg flex items-center justify-center">
                  <Icon name="fileCheck" size={16} className="text-white" />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-white">
                    Preliminary Report Preview
                  </div>
                  <div className="text-[10px] text-[#94a3b8]">
                    Formatted as it will appear in the final document
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="bg-white/10 border-none text-[#94a3b8] rounded-md px-2.5 py-1 cursor-pointer text-[11px] flex items-center gap-1 hover:bg-white/20"
              >
                <Icon name="x" size={11} />
                Close
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              <pre className="text-[11px] text-[#1e293b] leading-[1.7] font-mono whitespace-pre-wrap bg-[#f8fafc] border border-[#e2e8f0] rounded-lg p-4">
                {buildPrelimBody()}
              </pre>
            </div>
            <div className="border-t border-[#e2e8f0] px-5 py-3 flex items-center justify-between shrink-0">
              <div className="text-[11px] text-[#94a3b8]">
                {exceptions.length} exceptions · {requirements.length}{" "}
                requirements · {notesCodes.length} notes
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(buildPrelimBody());
                  }}
                >
                  <Icon name="copy" size={11} />
                  Copy to Clipboard
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={generating || generated}
                  style={{ background: "#8B0000" }}
                >
                  {generating ? (
                    <>
                      <Icon name="loader" size={11} className="spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Icon name="fileCheck" size={11} />
                      Generate & Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
