"use client";

import { useRef, useEffect } from "react";
import Icon from "@/components/common/icon";
import type { AssessorData } from "@/app/components/feature/tables/types";

interface Props {
  data: AssessorData;
  onClose: () => void;
}

export default function AssessorModal({ data, onClose }: Props) {
  const d = data;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const fmtD = (v: number | null | undefined) =>
    v != null
      ? "$" +
        v.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "—";

  const NA = () => <span style={{ color: "#94a3b8" }}>—</span>;

  const Field = ({
    label,
    val,
    mono,
  }: {
    label: string;
    val: React.ReactNode;
    mono?: boolean;
  }) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span
        style={{
          fontSize: 9,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: 1,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          color: "#1e293b",
          fontWeight: 500,
          fontFamily: mono ? "'Courier New',monospace" : "inherit",
        }}
      >
        {val ?? <NA />}
      </span>
    </div>
  );

  const SectionHead = ({ title }: { title: string }) => (
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: "#0369a1",
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: 5,
        marginBottom: 10,
      }}
    >
      {title}
    </div>
  );

  const Grid = ({
    cols,
    children,
  }: {
    cols: string;
    children: React.ReactNode;
  }) => (
    <div
      style={{ display: "grid", gridTemplateColumns: cols, gap: "6px 16px" }}
    >
      {children}
    </div>
  );

  const handleDownload = () => {
    const body = ref.current;
    if (!body) return;
    const blob = new Blob([body.outerHTML], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `PropertyDetailReport_${d.apn.replace(/[^a-z0-9]/gi, "_")}.html`;
    a.click();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.72)",
        backdropFilter: "blur(2px)",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "#0c2340",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          borderBottom: "1px solid #1a3a5c",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              background: "#0369a1",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon name="fileCheck" size={15} style={{ color: "#fff" }} />
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>
              Property Detail Report
            </div>
            <div style={{ color: "#7dd3fc", fontSize: 10 }}>
              DataTrace · {d.county} County, CA · Data as of {d.countyDataAsOf}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer border border-[#7dd3fc] text-[#7dd3fc] hover:bg-[#0369a1] hover:text-white hover:border-[#0369a1] transition-all"
            style={{ background: "rgba(125,211,252,.12)" }}
          >
            <Icon name="upload" size={11} />
            Download Report
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer border border-[#475569] text-white transition-all"
            style={{ background: "rgba(255,255,255,.08)" }}
          >
            <Icon name="external" size={11} />
            Print
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg cursor-pointer border border-[#dc2626] text-[#fca5a5] hover:bg-[#dc2626] hover:text-white transition-all"
            style={{ background: "rgba(220,38,38,.15)" }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          background: "#e5e7eb",
          padding: "24px 0",
        }}
      >
        <div
          ref={ref}
          id="assessor-report-body"
          style={{
            maxWidth: 960,
            margin: "0 auto",
            background: "#fff",
            boxShadow: "0 4px 32px rgba(0,0,0,.2)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 20px 10px",
              borderBottom: "2px solid #0369a1",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#0369a1",
                    marginBottom: 2,
                  }}
                >
                  Property Detail Report
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}
                >
                  {d.streetAddress}, {d.city}, {d.state} {d.zip}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    marginTop: 2,
                    fontFamily: "'Courier New',monospace",
                  }}
                >
                  APN: {d.apn}
                </div>
              </div>
              <div
                style={{ textAlign: "right", fontSize: 10, color: "#94a3b8" }}
              >
                <div style={{ fontWeight: 600, color: "#475569" }}>
                  {d.county} County Data as of: {d.countyDataAsOf}
                </div>
                <div>Report generated: {d.reportDate}</div>
              </div>
            </div>
          </div>

          <div style={{ padding: "16px 20px" }}>
            <div style={{ marginBottom: 16 }}>
              <SectionHead title="Owner Information" />
              <Grid cols="1fr 1fr">
                <Field label="Owner Name" val={d.ownerName} />
                <Field label="Owner 1" val={d.owner1} />
                <Field label="Owner 2" val={d.owner2 || <NA />} />
                <Field label="Mailing Address" val={d.mailingAddress} />
                <Field label="Occupancy" val={d.occupancy} />
              </Grid>
            </div>

            <div style={{ borderTop: "1px solid #e2e8f0", margin: "14px 0" }} />

            <div style={{ marginBottom: 16 }}>
              <SectionHead title="Location Information" />
              <Grid cols="1fr 1fr 1fr">
                <Field label="Legal Description" val={d.legalDescription} />
                <Field label="APN" val={d.apn} mono />
                <Field label="Munic / Twnshp" val={d.munic} />
                <Field label="Tract #" val={d.tractNumber} />
                <Field
                  label="Legal Lot / Block"
                  val={`${d.legalLot} / ${d.legalBlock}`}
                />
                <Field label="Map Reference" val={d.mapRef} />
                <Field label="County" val={`${d.county}, CA`} />
              </Grid>
            </div>

            <div style={{ borderTop: "1px solid #e2e8f0", margin: "14px 0" }} />

            <div style={{ marginBottom: 16 }}>
              <SectionHead title="Property Characteristics" />
              <Grid cols="1fr 1fr 1fr">
                <Field
                  label="Living Area"
                  val={`${d.characteristics.livingArea.toLocaleString()} Sq. Ft.`}
                />
                <Field label="Bedrooms" val={d.characteristics.bedrooms} />
                <Field
                  label="Baths (F/H)"
                  val={`${d.characteristics.fullBath} / ${d.characteristics.halfBath}`}
                />
                <Field label="Year Built" val={d.characteristics.yearBuilt} />
                <Field label="Stories" val={d.characteristics.stories} />
                <Field
                  label="Parking Type"
                  val={d.characteristics.parkingType || <NA />}
                />
                <Field
                  label="Garage Area"
                  val={
                    d.characteristics.garageArea ? (
                      `${d.characteristics.garageArea} Sq. Ft.`
                    ) : (
                      <NA />
                    )
                  }
                />
                <Field label="Pool" val={d.characteristics.pool || <NA />} />
              </Grid>
            </div>

            <div style={{ borderTop: "1px solid #e2e8f0", margin: "14px 0" }} />

            <div style={{ marginBottom: 16 }}>
              <SectionHead title="Site Information" />
              <Grid cols="1fr 1fr">
                <Field label="Land Use" val={d.site.landUse} />
                <Field label="County Use" val={d.site.countyUse} />
                <Field
                  label="Acres"
                  val={d.site.acres != null ? String(d.site.acres) : <NA />}
                />
                <Field
                  label="Lot Area"
                  val={
                    d.site.lotArea != null ? (
                      `${d.site.lotArea.toLocaleString()} Sq. Ft.`
                    ) : (
                      <NA />
                    )
                  }
                />
                <Field label="Flood Zone Code" val={d.site.floodZoneCode} />
                <Field label="Flood Map" val={d.site.floodMap} />
              </Grid>
            </div>

            <div style={{ borderTop: "1px solid #e2e8f0", margin: "14px 0" }} />

            <div style={{ marginBottom: 16 }}>
              <SectionHead title="Tax Information" />
              <Grid cols="1fr 1fr 1fr">
                <Field label="Assessed Year" val={d.tax.assessedYear} />
                <Field label="Tax Year" val={d.tax.taxYear} />
                <Field label="Tax Area" val={d.tax.taxArea} />
                <Field label="Property Tax" val={fmtD(d.tax.propertyTax)} />
                <Field label="Assessed Value" val={fmtD(d.tax.assessedValue)} />
                <Field label="Land Value" val={fmtD(d.tax.landValue)} />
                <Field
                  label="Improvement Value"
                  val={fmtD(d.tax.improvementValue)}
                />
              </Grid>
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid #e2e8f0",
              padding: "10px 20px",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "#94a3b8",
            }}
          >
            <span>
              DataTrace Property Detail Report — {d.county} County, CA
            </span>
            <span>APN: {d.apn}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
