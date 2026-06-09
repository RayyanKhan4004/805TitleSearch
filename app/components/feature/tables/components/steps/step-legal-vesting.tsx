"use client";

import Icon from "@/components/common/icon";
import { CardHead, Lbl } from "../shared-atoms";
import { useState, useEffect } from "react";
import type { SharedState } from "@/app/components/feature/tables/types";
import {
  Card,
  CardContent,
  Button,
  Textarea,
  Input,
  Select,
  Badge,
} from "@/components/ui";

interface StepLegalVestingProps {
  shared?: SharedState;
  setShared?: React.Dispatch<React.SetStateAction<SharedState>>;
}

export default function StepLegalVesting({
  shared,
  setShared,
}: StepLegalVestingProps) {
  const [legal, setLegal] = useState(
    shared?.legal ||
      "",
  );
  const [vesting, setVesting] = useState(
    shared?.vesting ||
      "",
  );
  const [lease, setLease] = useState(
    shared?.leaseHold ||
      "",
  );
  const [areaType, setAreaType] = useState("City");
  const [areaName, setAreaName] = useState("Rialto");
  const [propType, setPropType] = useState("Single Family Residence");
  const [loading, setLoading] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (setShared) {
      setShared((s) => ({ ...s, legal, vesting, leaseHold: lease }));
    }
  }, [legal, vesting, lease, setShared]);

  const handleUpdate = () => {
    setLoading(true);
    setUpdated(false);
    setTimeout(() => {
      setVesting(
        "John D. Doe and Jane R. Doe, husband and wife as community property with right of survivorship, COUNTY OF SAN BERNARDINO, STATE OF CALIFORNIA.",
      );
      setLoading(false);
      setUpdated(true);
      setTimeout(() => setUpdated(false), 3000);
    }, 1500);
  };

  const aiBadge = "text-white text-[9px] font-bold px-1.5 py-0.5 rounded";
  const pill =
    "bg-status-info-blue-50 border border-status-info-blue-border text-status-info-blue-text text-[10px] font-semibold px-2.5 py-1 rounded-full";

  return (
    <div className="grid grid-cols-2 gap-[18px]">
      <Card>
        <CardHead
          title="Legal Description"
          sub="Verify and edit the parcel legal description"
          right={
            <div className="flex items-center gap-1.5">
              <span
                className={aiBadge}
                style={{ background: "var(--status-success-emerald)" }}
              >
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
        <CardContent className="flex flex-col gap-2.5">
          <Textarea
            size="mono"
            rows={14}
            value={legal}
            onChange={(e) => setLegal(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <button className="bg-transparent border-none text-status-info-blue-text text-[11px] font-semibold cursor-pointer">
              Convert to Fields
            </button>
            <span className="text-[10px] text-text-muted">
              {legal.length} chars
            </span>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHead
            title="Vesting Box"
            sub="Current ownership vesting from deed"
            right={
              <div className="flex items-center gap-1.5">
                <span
                  className={aiBadge}
                  style={{ background: "var(--status-success-emerald)" }}
                >
                  AI
                </span>
                <button className="bg-transparent border-none cursor-pointer text-text-muted flex">
                  <Icon name="copy" size={13} />
                </button>
                <button className="bg-transparent border-none cursor-pointer text-text-muted flex">
                  <Icon name="external" size={13} />
                </button>
              </div>
            }
          />
          <CardContent className="flex flex-col gap-3">
            <Textarea
              size="mono"
              rows={5}
              value={vesting}
              onChange={(e) => setVesting(e.target.value)}
            />
            <div>
              <Lbl>Parsed Vestees</Lbl>
              <div className="flex gap-1.5 flex-wrap mt-1">
                <span className={pill}>John D. Doe</span>
                <span className={pill}>Jane R. Doe</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              {updated ? (
                <span className="flex items-center gap-1 text-[10px] text-status-success-emerald font-semibold">
                  <Icon name="checkCircle" size={11} />
                  Updated
                </span>
              ) : (
                <span />
              )}
              <Button onClick={handleUpdate} disabled={loading}>
                {loading ? (
                  <>
                    <Icon name="loader" size={11} className="spin" />
                    Updating…
                  </>
                ) : (
                  <>
                    <Icon name="refresh" size={11} />
                    Update Vesting
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHead
            title="Lease Hold Interest"
            sub="Leasehold details and ownership remarks"
          />
          <CardContent>
            <Textarea
              size="mono"
              rows={4}
              value={lease}
              onChange={(e) => setLease(e.target.value)}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHead
            title="City / Township / Unincorporated Area"
            sub="Jurisdiction and area classification"
          />
          <CardContent className="grid grid-cols-2 gap-3.5">
            <div>
              <Lbl>Area Type</Lbl>
              <Select
                value={areaType}
                onChange={(e) => setAreaType(e.target.value)}
                options={[
                  { value: "City", label: "City" },
                  { value: "Township", label: "Township" },
                  {
                    value: "Unincorporated Area",
                    label: "Unincorporated Area",
                  },
                ]}
              />
            </div>
            <div>
              <Lbl>Area Name</Lbl>
              <Input
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHead
            title="Property Type"
            sub="Select the classification of the subject property"
            right={
              <Badge
                variant={
                  propType === "Single Family Residence"
                    ? "success"
                    : propType === "Multi-Family Residence"
                      ? "info"
                      : propType === "Condominium"
                        ? "info"
                        : "warning"
                }
              >
                {propType}
              </Badge>
            }
          />
          <CardContent className="flex flex-col gap-3.5">
            <div>
              <Lbl>Property Classification</Lbl>
              <Select
                value={propType}
                onChange={(e) => setPropType(e.target.value)}
                className="text-[12px] px-3 py-2"
                options={[
                  {
                    value: "Single Family Residence",
                    label: "Single Family Residence",
                  },
                  {
                    value: "Multi-Family Residence",
                    label: "Multi-Family Residence",
                  },
                  { value: "Condominium", label: "Condominium" },
                  {
                    value: "Planned Unit Development",
                    label: "Planned Unit Development",
                  },
                ]}
              />
            </div>
            {propType === "Single Family Residence" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Lbl>Lot Size</Lbl>
                  <Input placeholder="e.g. 7,200 Sq Ft" />
                </div>
                <div>
                  <Lbl>Year Built</Lbl>
                  <Input placeholder="e.g. 1986" />
                </div>
              </div>
            )}
            {propType === "Multi-Family Residence" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Lbl>Number of Units</Lbl>
                  <Input placeholder="e.g. 4" />
                </div>
                <div>
                  <Lbl>Building Type</Lbl>
                  <Select
                    options={[
                      { value: "Duplex", label: "Duplex" },
                      { value: "Triplex", label: "Triplex" },
                      { value: "Fourplex", label: "Fourplex" },
                      {
                        value: "Apartment Building",
                        label: "Apartment Building",
                      },
                    ]}
                  />
                </div>
              </div>
            )}
            {propType === "Condominium" && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Lbl>Unit No.</Lbl>
                  <Input placeholder="e.g. 204" />
                </div>
                <div>
                  <Lbl>Building / Phase</Lbl>
                  <Input placeholder="e.g. Building A" />
                </div>
                <div>
                  <Lbl>HOA Name</Lbl>
                  <Input placeholder="e.g. Sunset Hills HOA" />
                </div>
              </div>
            )}
            {propType === "Planned Unit Development" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Lbl>PUD / Project Name</Lbl>
                  <Input placeholder="e.g. Riverview Estates" />
                </div>
                <div>
                  <Lbl>Phase / Tract</Lbl>
                  <Input placeholder="e.g. Phase 2, Tract 12345" />
                </div>
              </div>
            )}
            <div className="flex gap-1.5 flex-wrap pt-0.5">
              {[
                [
                  "Single Family Residence",
                  "Detached single-unit residential property",
                ],
                [
                  "Multi-Family Residence",
                  "Two or more residential units on one parcel",
                ],
                ["Condominium", "Individual unit with shared common areas"],
                [
                  "Planned Unit Development",
                  "Mixed residential community with shared amenities",
                ],
              ]
                .filter(([t]) => t === propType)
                .map(([, desc]) => (
                  <div
                    key={desc}
                    className="flex items-center gap-1.5 border border-border rounded-[7px] px-[11px] py-1.5 text-[11px] text-text-secondary"
                    style={{ background: "var(--bg-page)" }}
                  >
                    <Icon name="fileCheck" size={11} className="text-brand" />
                    {desc}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
