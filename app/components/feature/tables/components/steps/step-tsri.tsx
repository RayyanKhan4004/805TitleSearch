"use client";

import Icon from "@/components/common/icon";
import { CardHead, Lbl } from "../shared-atoms";
import { useState } from "react";
import type { ChainCode, SharedState } from "@/app/components/feature/tables/types";
import { Button, Card, CardContent, Input, Select, Textarea, Badge } from "@/components/ui";

interface StepTSRIProps {
  shared: SharedState;
  setShared: React.Dispatch<React.SetStateAction<SharedState>>;
  onGenerate: (data: Record<string, unknown>) => void;
}

export default function StepTSRI({ shared, setShared, onGenerate }: StepTSRIProps) {
  const [proposedInsured, setProposedInsured] = useState(
    `${(shared.vesting || "").split(",")[0] || "John D. Doe and Jane R. Doe"}`,
  );
  const [effectiveDate, setEffectiveDate] = useState(shared.effectiveDate || "05/07/2026");
  const [effectiveTime, setEffectiveTime] = useState("7:30 a.m.");
  const [leaseHold, setLeaseHold] = useState(shared.leaseHold || "");
  const [vesting, setVesting] = useState(shared.vesting || "");
  const [legal, setLegal] = useState(shared.legal || "");
  const [easements, setEasements] = useState("");
  const [notes, setNotes] = useState("");
  const [codes, setCodes] = useState<ChainCode[]>(shared.chainCodes || []);
  const [newCode, setNewCode] = useState<{ type: "exception" | "requirement" | "note"; code: string; verbiage: string }>({
    type: "exception",
    code: "",
    verbiage: "",
  });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [synced, setSynced] = useState(false);

  // Sync back to shared when vesting/legal/effectiveDate change
  useState(() => {
    setShared((s) => ({ ...s, vesting, legal, effectiveDate }));
  });

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
      });
    }, 1600);
  };

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
          <h2 className="m-0 text-[15px] font-bold text-text">Title Search Report Index (TSRI)</h2>
          <p className="m-0 text-[11px] text-text-muted mt-0.5">Compile all title data into a structured report — auto-populates Preliminary Report</p>
        </div>
        <div className="flex gap-1.5">
          <Button variant="secondary" onClick={handleSync}>
            <Icon name="refresh" size={11} />
            {synced ? "✓ Synced!" : "Sync from Chain & Legal"}
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
      <div className="grid grid-cols-2 gap-[18px]">
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

          {/* Vesting */}
          <Card>
            <CardHead
              title="Vesting"
              sub="Current ownership vesting — auto-populated from Legal & Vesting"
              accent="#059669"
              right={
                <Badge variant="success" size="sm">AUTO</Badge>
              }
            />
            <CardContent>
              <Lbl>Vesting as it will appear in Schedule A</Lbl>
              <Textarea
                rows={4}
                value={vesting}
                onChange={(e) => setVesting(e.target.value)}
                size="mono"
                placeholder="Vesting from deed…"
              />
            </CardContent>
          </Card>

          {/* Legal Description */}
          <Card>
            <CardHead
              title="Legal Description"
              sub="Full parcel legal description — auto-populated"
              accent="#d97706"
              right={
                <Badge variant="warning" size="sm">AUTO</Badge>
              }
            />
            <CardContent>
              <Lbl>Legal Description (Schedule A)</Lbl>
              <Textarea
                rows={5}
                value={legal}
                onChange={(e) => setLegal(e.target.value)}
                size="mono"
              />
              <div className="text-[9px] text-text-muted mt-1 text-right">{legal.length} chars</div>
            </CardContent>
          </Card>
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
                <Badge variant="error" size="sm">{exceptions.length} items</Badge>
              }
            />
            <CardContent className="flex flex-col gap-2">
              {exceptions.map((c) => (
                <div
                  key={c.id}
                  className="border border-red-100 rounded-lg bg-red-50/50 p-2.5 relative"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${codeTypeStyle(c.type)}`}>
                      {c.code}
                    </span>
                    <button
                      onClick={() => removeCode(c.id)}
                      className="bg-transparent border-none cursor-pointer text-red-300 text-[11px] p-0 leading-none"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-[11px] text-text-secondary m-0 leading-[1.5]">{c.verbiage}</p>
                </div>
              ))}
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
                <Badge variant="info" size="sm">{requirements.length + notesCodes.length} items</Badge>
              }
            />
            <CardContent className="flex flex-col gap-2">
              {[...requirements, ...notesCodes].map((c) => (
                <div
                  key={c.id}
                  className={`rounded-lg p-2.5 relative border ${c.type === "requirement" ? "border-blue-200 bg-blue-50" : "border-green-200 bg-green-50"}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${codeTypeStyle(c.type)}`}>
                      {c.code}
                    </span>
                    <button
                      onClick={() => removeCode(c.id)}
                      className="bg-transparent border-none cursor-pointer text-blue-300 text-[11px] p-0 leading-none"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-[11px] text-text-secondary m-0 leading-[1.5]">{c.verbiage}</p>
                </div>
              ))}
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
                    onChange={(e) => setNewCode((c) => ({ ...c, type: e.target.value as "exception" | "requirement" | "note" }))}
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
                    onChange={(e) => setNewCode((c) => ({ ...c, code: e.target.value }))}
                    placeholder="e.g. Exception 6, Requirement 3, Note B"
                  />
                </div>
              </div>
              <div>
                <Lbl>Verbiage</Lbl>
                <Textarea
                  rows={3}
                  value={newCode.verbiage}
                  onChange={(e) => setNewCode((c) => ({ ...c, verbiage: e.target.value }))}
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
    </div>
  );
}
