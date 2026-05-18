"use client";

import Icon from "@/components/common/icon";
import { useState } from "react";
import { COUNTIES, DOC_SEARCH_TYPES } from "../consts";
import type {
  FInpProps,
  FSelProps,
  FRowProps,
  FGridProps,
  ResultBoxProps,
  SearchDataTraceProps,
  ManualSearchModalProps,
} from "@/app/components/feature/tables/types";
import { Button, Input, Select, Dialog, DialogContent, DialogFooter, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui";

const FInp = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  half = false,
  style = {},
}: FInpProps) => (
  <div className={`flex flex-col gap-0.5 ${half ? "flex-1" : ""}`}>
    {label && (
      <label className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.07em]">
        {label}
      </label>
    )}
    <Input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder || ""}
      className="text-[11px]"
      style={style}
    />
  </div>
);

const FSel = ({ label, value, onChange, options, style = {} }: FSelProps) => {
  const opts = options.map((o, i) => {
    const val = typeof o === "string" ? o : o.value;
    const lbl = typeof o === "string" ? o : o.label;
    return { value: val, label: lbl };
  });
  return (
    <div className="flex flex-col gap-0.5">
      {label && (
        <label className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.07em]">
          {label}
        </label>
      )}
      <Select
        value={value}
        onChange={onChange}
        options={opts}
        className="text-[11px]"
        style={style}
      />
    </div>
  );
};

const FRow = ({ children }: FRowProps) => (
  <div className="flex gap-2.5 items-end">{children}</div>
);
const FGrid = ({ cols = 3, children }: FGridProps) => (
  <div
    className="grid gap-2.5"
    style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}
  >
    {children}
  </div>
);
const ResultBox = ({ children }: ResultBoxProps) => (
  <div
    className="border border-border rounded-lg p-3.5 mt-2.5 text-[11px] text-text-secondary leading-[1.7]"
    style={{ background: "var(--bg-page)" }}
  >
    {children}
  </div>
);

function SearchDataTrace({ source }: SearchDataTraceProps) {
  const [tab, setTab] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const TABS = [
    "Instrument / Book Page",
    "Data Tree",
    "Name Run – GI Index",
    "Grantor / Grantee",
    "Property Address / APN",
    "Subdivided Search",
    "Section Legal",
    "Business Entity",
  ];
  const color =
    source === "Data Trace"
      ? "var(--accent-data-trace)"
      : "var(--accent-title-point)";
  const mockSearch = () => setResult("__searched__");

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t, i) => (
          <button
            key={i}
            onClick={() => {
              setTab(i);
              setResult(null);
            }}
            className={`px-[13px] py-[7px] text-[11px] font-semibold rounded-[7px] border cursor-pointer whitespace-nowrap transition-all duration-150 ${tab === i ? "text-white" : "text-text-secondary bg-white border-border"}`}
            style={
              tab === i
                ? {
                    background:
                      source === "Data Trace"
                        ? "var(--accent-data-trace)"
                        : "var(--accent-title-point)",
                    borderColor:
                      source === "Data Trace"
                        ? "var(--accent-data-trace)"
                        : "var(--accent-title-point)",
                  }
                : {}
            }
          >
            {t}
          </button>
        ))}
      </div>
      <div
        className="border border-border rounded-lg p-4"
        style={{ background: "var(--bg-page)" }}
      >
        {tab === 0 && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[12px] font-bold text-text mb-0.5">
              Instrument / Book Page Search — Pull Document Image
            </div>
            <FGrid cols={3}>
              <FSel
                label="County"
                value={COUNTIES[0]}
                onChange={() => {}}
                options={COUNTIES}
              />
              <FInp label="Instrument No." placeholder="e.g. 2023-0212342" />
              <FInp label="Document Year" placeholder="e.g. 2023" />
            </FGrid>
            <FRow>
              <FInp label="Book" placeholder="Book #" style={{ width: 120 }} />
              <FInp label="Page" placeholder="Page #" style={{ width: 120 }} />
              <FSel
                label="Doc Type"
                value="Any Document"
                onChange={() => {}}
                options={DOC_SEARCH_TYPES}
              />
              <FInp label="From Date" type="date" />
              <FInp label="To Date" type="date" />
            </FRow>
            <Button onClick={mockSearch} size="lg" className="self-start">
              Pull Image
            </Button>
            {result && (
              <ResultBox>
                <div className="flex items-center justify-center h-40 bg-white rounded-md border-2 border-dashed border-border text-text-muted text-[12px]">
                  Document image preview would load here from {source} API
                </div>
              </ResultBox>
            )}
          </div>
        )}
        {tab === 1 && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[12px] font-bold text-text mb-0.5">
              Data Tree — Pull Image from Document Tree
            </div>
            <FGrid cols={2}>
              <FSel
                label="County"
                value={COUNTIES[0]}
                onChange={() => {}}
                options={COUNTIES}
              />
              <FInp
                label="APN / Parcel Number"
                placeholder="e.g. 0557-081-23-0000"
              />
            </FGrid>
            <Button onClick={mockSearch} size="lg" className="self-start">
              Load Tree
            </Button>
            {result && (
              <ResultBox>
                <div className="text-[11px] font-bold text-text mb-2">
                  Document Tree — 0557-081-23-0000
                </div>
                {[
                  {
                    year: "2025",
                    docs: [
                      "Grant Deed — 2023-0212342",
                      "Deed of Trust — 2025-0213146",
                    ],
                  },
                  {
                    year: "2022",
                    docs: [
                      "Reconveyance — 2022-0189001",
                      "Mechanic's Lien — 2021-0077893",
                    ],
                  },
                  { year: "2019", docs: ["Quitclaim Deed — 2019-0098234"] },
                ].map((g) => (
                  <div key={g.year} className="mb-2">
                    <div className="text-[10px] font-extrabold text-text-muted uppercase mb-1">
                      {g.year}
                    </div>
                    {g.docs.map((d) => (
                      <div
                        key={d}
                        className="flex items-center gap-1.5 px-2 py-1 bg-white rounded-md mb-0.5 border border-light"
                      >
                        <Icon name="file" size={11} style={{ color }} />{" "}
                        <span
                          style={{
                            color,
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                        >
                          {d}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </ResultBox>
            )}
          </div>
        )}
        {tab === 2 && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[12px] font-bold text-text mb-0.5">
              Name Run — GI Index Search
            </div>
            <FGrid cols={3}>
              <FInp label="Last Name" placeholder="e.g. SMITH" />
              <FInp label="First Name" placeholder="e.g. MICHAEL" />
              <FSel
                label="County"
                value={COUNTIES[0]}
                onChange={() => {}}
                options={COUNTIES}
              />
              <FInp label="From Date" type="date" />
              <FInp label="To Date" type="date" />
              <FSel
                label="Index Type"
                value="Both"
                onChange={() => {}}
                options={["Both", "Grantor Index", "Grantee Index"]}
              />
            </FGrid>
            <Button onClick={mockSearch} size="lg" className="self-start">
              Search GI Index
            </Button>
            {result && (
              <ResultBox>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {[
                        "Date",
                        "Doc Type",
                        "Instrument #",
                        "Grantor",
                        "Grantee",
                      ].map((h) => (
                        <TableHead
                          key={h}
                          className="border-b border-border px-2.5 py-[7px]"
                          style={{ background: "var(--table-header)" }}
                        >
                          {h}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      [
                        "05/17/2025",
                        "Grant Deed",
                        "2023-0212342",
                        "MICHAEL SMITH",
                        "JOHN D DOE",
                      ],
                      [
                        "06/12/2019",
                        "Quitclaim Deed",
                        "2019-0098234",
                        "ESTATE OF H. SMITH",
                        "MICHAEL SMITH",
                      ],
                    ].map((r, i) => (
                      <TableRow
                        key={i}
                        className={i % 2 === 0 ? "bg-white" : ""}
                        style={
                          i % 2 !== 0 ? { background: "var(--bg-page)" } : {}
                        }
                      >
                        {r.map((c, j) => (
                          <TableCell
                            key={j}
                            className={`px-2.5 py-1.5 ${j === 2 ? "text-status-info-blue-text font-medium" : "text-text-secondary font-normal"}`}
                          >
                            {c}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ResultBox>
            )}
          </div>
        )}
        {tab === 3 && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[12px] font-bold text-text mb-0.5">
              Grantor / Grantee Search
            </div>
            <FGrid cols={2}>
              <FInp label="Grantor Name" placeholder="e.g. SMITH, MICHAEL A" />
              <FInp label="Grantee Name" placeholder="e.g. DOE, JOHN D" />
            </FGrid>
            <FGrid cols={3}>
              <FSel
                label="County"
                value={COUNTIES[0]}
                onChange={() => {}}
                options={COUNTIES}
              />
              <FSel
                label="Document Type"
                value="Any Document"
                onChange={() => {}}
                options={DOC_SEARCH_TYPES}
              />
              <FInp label="Date Range" placeholder="MM/YYYY – MM/YYYY" />
            </FGrid>
            <Button onClick={mockSearch} size="lg" className="self-start">
              Search
            </Button>
            {result && (
              <ResultBox>
                <div className="text-status-success-emerald font-bold mb-1.5">
                  ✓ 3 records found
                </div>
                {[
                  {
                    instr: "2023-0212342",
                    type: "Grant Deed",
                    date: "05/17/2025",
                    gr: "MICHAEL SMITH",
                    ge: "JOHN D DOE",
                  },
                  {
                    instr: "2025-0213146",
                    type: "Deed of Trust",
                    date: "04/17/2023",
                    gr: "JOHN D DOE",
                    ge: "BANK OF AMERICA",
                  },
                  {
                    instr: "2020-0044512",
                    type: "Deed of Trust",
                    date: "03/22/2020",
                    gr: "MICHAEL SMITH",
                    ge: "WELLS FARGO",
                  },
                ].map((r, i) => (
                  <div
                    key={i}
                    className="flex gap-2.5 px-2.5 py-[7px] bg-white rounded-md mb-1 border border-light flex-wrap"
                  >
                    <span className="text-status-info-blue-text font-medium min-w-[110px]">
                      {r.instr}
                    </span>
                    <span className="text-text-secondary min-w-[130px]">
                      {r.type}
                    </span>
                    <span className="text-text-muted min-w-[90px]">
                      {r.date}
                    </span>
                    <span className="text-text-secondary">
                      {r.gr} → {r.ge}
                    </span>
                  </div>
                ))}
              </ResultBox>
            )}
          </div>
        )}
        {tab === 4 && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[12px] font-bold text-text mb-0.5">
              Property Address / APN Search
            </div>
            <FGrid cols={2}>
              <FInp
                label="APN / Parcel Number"
                placeholder="e.g. 0557-081-23-0000"
              />
              <FInp
                label="Property Address"
                placeholder="e.g. 12345 Main Street"
              />
            </FGrid>
            <FGrid cols={3}>
              <FInp label="City" placeholder="e.g. Rialto" />
              <FSel
                label="County"
                value={COUNTIES[0]}
                onChange={() => {}}
                options={COUNTIES}
              />
              <FInp label="Zip Code" placeholder="e.g. 92376" />
            </FGrid>
            <Button onClick={mockSearch} size="lg" className="self-start">
              Search
            </Button>
            {result && (
              <ResultBox>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    ["APN", "0557-081-23-0000"],
                    ["Situs Address", "12345 Main St, Rialto CA 92376"],
                    ["County", "San Bernardino"],
                    ["Legal Owner", "John D. Doe & Jane R. Doe"],
                    ["Vesting", "Community Property"],
                    ["Last Transfer", "05/17/2025"],
                    ["Doc #", "2023-0212342"],
                    ["Land Use", "Residential"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between py-1.25 border-b border-light"
                    >
                      <span className="text-text-secondary text-[11px]">
                        {k}
                      </span>
                      <span className="text-text font-semibold text-[11px]">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </ResultBox>
            )}
          </div>
        )}
        {tab === 5 && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[12px] font-bold text-text mb-0.5">
              Subdivided Search — Lot / Tract / Map Book
            </div>
            <FGrid cols={3}>
              <FInp label="Tract Number" placeholder="e.g. 12345" />
              <FInp label="Lot Number" placeholder="e.g. 22" />
              <FInp label="Block" placeholder="e.g. A" />
            </FGrid>
            <FGrid cols={4}>
              <FInp label="Map Book" placeholder="e.g. 123" />
              <FInp label="Map Page" placeholder="e.g. 45" />
              <FInp label="Unit" placeholder="e.g. 2" />
              <FSel
                label="County"
                value={COUNTIES[0]}
                onChange={() => {}}
                options={COUNTIES}
              />
            </FGrid>
            <Button onClick={mockSearch} size="lg" className="self-start">
              Search
            </Button>
            {result && (
              <ResultBox>
                <div className="text-status-success-emerald font-bold mb-1.5">
                  ✓ Subdivision record found
                </div>
                {[
                  ["Tract", "12345"],
                  ["Lot", "22"],
                  ["Map Book / Page", "123 / 45"],
                  ["County", "San Bernardino"],
                  ["Filing Date", "1962-08-10"],
                  ["Recorded Doc", "1962-0018234"],
                  ["Acreage", "0.165 acres"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex gap-2.5 py-1 border-b border-light"
                  >
                    <span className="text-text-secondary min-w-[130px] text-[11px]">
                      {k}
                    </span>
                    <span className="text-text font-semibold text-[11px]">
                      {v}
                    </span>
                  </div>
                ))}
              </ResultBox>
            )}
          </div>
        )}
        {tab === 6 && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[12px] font-bold text-text mb-0.5">
              Section Legal Search
            </div>
            <FGrid cols={4}>
              <FInp label="Section" placeholder="e.g. 14" />
              <FInp label="Township" placeholder="e.g. 01S" />
              <FInp label="Range" placeholder="e.g. 04W" />
              <FSel
                label="Meridian"
                value="San Bernardino"
                onChange={() => {}}
                options={[
                  "San Bernardino",
                  "Mount Diablo",
                  "Humboldt",
                  "Gila & Salt River",
                ]}
              />
            </FGrid>
            <FGrid cols={2}>
              <FSel
                label="County"
                value={COUNTIES[0]}
                onChange={() => {}}
                options={COUNTIES}
              />
              <FSel
                label="Quarter Section"
                value=""
                onChange={() => {}}
                options={[
                  { value: "", label: "Full Section" },
                  { value: "NE", label: "NE Quarter" },
                  { value: "NW", label: "NW Quarter" },
                  { value: "SE", label: "SE Quarter" },
                  { value: "SW", label: "SW Quarter" },
                ]}
              />
            </FGrid>
            <Button onClick={mockSearch} size="lg" className="self-start">
              Search Legal
            </Button>
            {result && (
              <ResultBox>
                <div className="text-status-success-emerald font-bold mb-1.5">
                  ✓ Section legal description found
                </div>
                <div className="font-mono text-[11px] leading-[1.8] text-text-secondary">
                  THE EAST 1/2 OF THE SOUTHEAST 1/4 OF SECTION 14, TOWNSHIP 1
                  SOUTH, RANGE 4 WEST, SAN BERNARDINO MERIDIAN, IN THE COUNTY OF
                  SAN BERNARDINO, STATE OF CALIFORNIA, ACCORDING TO THE OFFICIAL
                  PLAT THEREOF.
                </div>
              </ResultBox>
            )}
          </div>
        )}
        {tab === 7 && (
          <div className="flex flex-col gap-2.5">
            <div className="text-[12px] font-bold text-text mb-0.5">
              Business Entity Search — Pull Starter Information
            </div>
            <FGrid cols={3}>
              <FInp
                label="Entity / Company Name"
                placeholder="e.g. Sunset Hills HOA"
              />
              <FSel
                label="Entity Type"
                value=""
                onChange={() => {}}
                options={[
                  { value: "", label: "All Types" },
                  "Corporation",
                  "LLC",
                  "LP",
                  "Non-Profit",
                  "HOA",
                  "Trust",
                  "Partnership",
                ]}
              />
              <FSel
                label="State"
                value="CA"
                onChange={() => {}}
                options={["CA", "NV", "AZ", "TX", "OR", "WA"]}
              />
            </FGrid>
            <Button onClick={mockSearch} size="lg" className="self-start">
              Search Entity
            </Button>
            {result && (
              <ResultBox>
                <div className="text-status-success-emerald font-bold mb-2">
                  ✓ Entity found — Starter Pulled
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Entity Name", "SUNSET HILLS HOMEOWNERS ASSOC."],
                    ["Entity Type", "Non-Profit Corporation"],
                    ["State of Formation", "California"],
                    ["Entity No.", "C1234567"],
                    ["Status", "Active"],
                    ["Agent for Service", "John R. Agent, Esq."],
                    ["Formation Date", "07/19/2005"],
                    ["Recorded Doc", "2005-0188770"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between py-1.25 border-b border-light"
                    >
                      <span className="text-text-secondary text-[11px]">
                        {k}
                      </span>
                      <span className="text-text font-semibold text-[11px] text-right max-w-[180px]">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-2.5 p-2.5 rounded-md border border-status-success-border"
                  style={{ background: "var(--status-success-bg)" }}
                >
                  <div className="text-[10px] font-bold text-status-success-text mb-1">
                    STARTER IMPORTED
                  </div>
                  <div className="text-[11px] text-status-success-dark">
                    HOA document linked as exception — instrument 2005-0188770
                  </div>
                </div>
              </ResultBox>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchCountyTax() {
  const [result, setResult] = useState<boolean | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[12px] font-bold text-text">
        County Tax Records Search
      </div>
      <FGrid cols={3}>
        <FInp label="APN / Parcel Number" placeholder="e.g. 0557-081-23-0000" />
        <FInp label="Owner Name" placeholder="e.g. DOE, JOHN" />
        <FSel
          label="County"
          value={COUNTIES[0]}
          onChange={() => {}}
          options={COUNTIES}
        />
      </FGrid>
      <FGrid cols={2}>
        <FSel
          label="Tax Year"
          value="2025-26"
          onChange={() => {}}
          options={["2025-26", "2024-25", "2023-24", "2022-23"]}
        />
        <FSel
          label="Bill Type"
          value="All"
          onChange={() => {}}
          options={["All", "Secured", "Unsecured", "Supplemental"]}
        />
      </FGrid>
      <Button onClick={() => setResult(true)} size="lg" className="self-start">
        Retrieve Tax Info
      </Button>
      {result && (
        <ResultBox>
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div className="bg-white rounded-lg p-3 border border-border">
              <div className="text-[10px] text-text-muted font-bold uppercase mb-1.5">
                Current Bill
              </div>
              {[
                ["Tax Year", "2025–2026"],
                ["Bill No.", "2025-0557081-23"],
                ["Status", "PAID"],
                ["1st Installment", "$1,842.50 — Paid 11/01/2025"],
                ["2nd Installment", "$1,842.50 — Paid 02/01/2026"],
                ["Total Annual", "$3,685.00"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between py-1 border-b border-light text-[11px]"
                >
                  <span className="text-text-secondary">{k}</span>
                  <span
                    className={
                      v.includes("PAID")
                        ? "text-status-success-emerald font-semibold"
                        : "text-text font-semibold"
                    }
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg p-3 border border-border">
              <div className="text-[10px] text-text-muted font-bold uppercase mb-1.5">
                Assessment
              </div>
              {[
                ["Land Value", "$182,000"],
                ["Improvement Value", "$265,400"],
                ["Total Assessed", "$447,400"],
                ["Exemptions", "Homeowner — $7,000"],
                ["Net Taxable", "$440,400"],
                ["Tax Rate", "0.8372%"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between py-1 border-b border-light text-[11px]"
                >
                  <span className="text-text-secondary">{k}</span>
                  <span className="text-text font-semibold">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="border border-status-success-border rounded-lg px-3.5 py-2.5 flex items-center gap-2"
            style={{ background: "var(--status-success-bg)" }}
          >
            <Icon
              name="checkCircle"
              size={16}
              className="text-status-success-emerald"
            />
            <span className="text-[12px] font-bold text-status-success-text">
              No delinquent taxes — Current through 2025–2026
            </span>
          </div>
        </ResultBox>
      )}
    </div>
  );
}

function SearchPacer() {
  const [result, setResult] = useState<boolean | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[12px] font-bold text-text">
        PACER — Federal Bankruptcy Search
      </div>
      <FGrid cols={3}>
        <FInp label="Last Name / Business Name" placeholder="e.g. DOE" />
        <FInp label="First Name" placeholder="e.g. JOHN" />
        <FInp label="Middle Name / Initial" placeholder="e.g. D" />
      </FGrid>
      <FGrid cols={3}>
        <FInp label="SSN (Last 4)" placeholder="XXXX" type="password" />
        <FInp label="Tax ID / EIN" placeholder="e.g. 12-3456789" />
        <FSel
          label="Federal District"
          value="C.D. Cal"
          onChange={() => {}}
          options={[
            "All Districts",
            "C.D. Cal",
            "N.D. Cal",
            "S.D. Cal",
            "E.D. Cal",
            "D. Nevada",
            "D. Arizona",
          ]}
        />
      </FGrid>
      <FGrid cols={2}>
        <FInp label="Case Number" placeholder="e.g. 2:24-bk-12345" />
        <FSel
          label="Chapter"
          value="All"
          onChange={() => {}}
          options={[
            "All",
            "Chapter 7",
            "Chapter 11",
            "Chapter 13",
            "Chapter 12",
          ]}
        />
      </FGrid>
      <Button onClick={() => setResult(true)} size="lg" className="self-start">
        Search PACER
      </Button>
      {result && (
        <ResultBox>
          <div
            className="border border-status-success-border rounded-lg px-4 py-3 flex items-center gap-2.5 mb-2.5"
            style={{ background: "var(--status-success-bg)" }}
          >
            <Icon
              name="checkCircle"
              size={18}
              className="text-status-success-emerald"
            />
            <div>
              <div className="text-[13px] font-bold text-status-success-text">
                No Active Bankruptcy Found
              </div>
              <div className="text-[11px] text-status-success-dark mt-0.5">
                Search returned 0 active cases for DOE, JOHN D in C.D. Cal
              </div>
            </div>
          </div>
          <div className="text-[10px] text-text-muted font-bold uppercase mb-1.5">
            Search History
          </div>
          {[
            {
              case: "N/A",
              ch: "—",
              filed: "—",
              status: "Not Found",
              note: "No records matched",
            },
          ].map((r, i) => (
            <div
              key={i}
              className="flex gap-3 px-2.5 py-[7px] rounded-md border border-light text-[11px] flex-wrap"
              style={{ background: "var(--bg-page)" }}
            >
              <span className="text-text-secondary min-w-[80px]">
                Case: <strong className="text-text">{r.case}</strong>
              </span>
              <span className="text-status-success-text font-semibold">
                {r.status}
              </span>
              <span className="text-text-muted">{r.note}</span>
            </div>
          ))}
        </ResultBox>
      )}
    </div>
  );
}

function SearchPatriotAct() {
  const [result, setResult] = useState<boolean | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const search = () => {
    setResult(true);
    setStatus("CLEAR");
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[12px] font-bold text-text">
        Patriot Act / OFAC Compliance Search
      </div>
      <div
        className="border border-status-warning-border rounded-lg px-3 py-2 text-[11px] text-status-warning-text"
        style={{ background: "var(--status-warning-bg)" }}
      >
        Required for all parties — buyers, sellers, borrowers, and entities per
        USA PATRIOT Act / OFAC regulations.
      </div>
      <FGrid cols={3}>
        <FInp label="Full Name / Entity" placeholder="e.g. JOHN D DOE" />
        <FInp label="Date of Birth" type="date" />
        <FInp label="Country of Citizenship" placeholder="e.g. United States" />
      </FGrid>
      <FGrid cols={2}>
        <FSel
          label="ID Type"
          value=""
          onChange={() => {}}
          options={[
            { value: "", label: "Select ID Type" },
            "Driver's License",
            "Passport",
            "State ID",
            "EIN",
            "SSN",
          ]}
        />
        <FInp label="ID Number (optional)" placeholder="Last 4 digits only" />
      </FGrid>
      <div className="flex gap-2">
        <Button onClick={search} size="lg">
          Run Patriot Act Search
        </Button>
        <Button
          onClick={() => {
            setResult(true);
            setStatus("HIT");
          }}
          variant="destructive"
          size="lg"
        >
          Simulate HIT
        </Button>
      </div>
      {result && (
        <div
          className="rounded-lg overflow-hidden"
          style={{
            border: `2px solid ${status === "CLEAR" ? "var(--status-success-border)" : "var(--status-error-border)"}`,
          }}
        >
          <div
            className="px-4.5 py-3.5 flex items-center gap-2.5"
            style={{
              background:
                status === "CLEAR"
                  ? "var(--status-success-emerald-dark)"
                  : "var(--status-error-dark)",
            }}
          >
            <Icon
              name={status === "CLEAR" ? "checkCircle" : "alertTri"}
              size={22}
              className="text-white"
            />
            <div>
              <div className="text-[15px] font-extrabold text-white">
                {status === "CLEAR"
                  ? "CLEAR — No OFAC Match Found"
                  : "HIT — Possible OFAC Match"}
              </div>
              <div className="text-[11px] text-white/80 mt-0.5">
                {status === "CLEAR"
                  ? "Individual cleared against all OFAC/SDN/PEP databases"
                  : "Review required — contact compliance officer immediately"}
              </div>
            </div>
          </div>
          <div className="p-3.5 bg-white">
            {[
              ["Searched Name", "JOHN D DOE"],
              ["DOB", "01/15/1975"],
              ["Search Date", new Date().toLocaleDateString()],
              [
                "Databases Checked",
                "OFAC SDN, OFAC Non-SDN, PEP, EU Consolidated, UN Sanctions",
              ],
              ["Result", status!],
              ["Reference #", "PAT-2026-00" + Math.floor(Math.random() * 9999)],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex justify-between py-1.25 border-b border-light text-[11px]"
              >
                <span className="text-text-secondary">{k}</span>
                <span
                  style={{
                    color:
                      k === "Result"
                        ? status === "CLEAR"
                          ? "var(--status-success-emerald-dark)"
                          : "var(--status-error-dark)"
                        : "var(--text)",
                    fontWeight: k === "Result" ? 800 : 600,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchCountyAssessor() {
  const [result, setResult] = useState<boolean | null>(null);
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[12px] font-bold text-text">
        County Assessor — Property Assessment Information
      </div>
      <FGrid cols={3}>
        <FInp label="APN / Parcel Number" placeholder="e.g. 0557-081-23-0000" />
        <FInp label="Property Address" placeholder="e.g. 12345 Main Street" />
        <FSel
          label="County"
          value={COUNTIES[0]}
          onChange={() => {}}
          options={COUNTIES}
        />
      </FGrid>
      <FGrid cols={2}>
        <FInp label="Owner Name" placeholder="e.g. DOE, JOHN" />
        <FSel
          label="Assessment Year"
          value="2025-26"
          onChange={() => {}}
          options={["2025-26", "2024-25", "2023-24"]}
        />
      </FGrid>
      <Button onClick={() => setResult(true)} size="lg" className="self-start">
        Pull Assessor Page
      </Button>
      {result && (
        <div className="flex flex-col gap-2.5">
          <ResultBox>
            <div className="text-[12px] font-bold text-text mb-2.5 pb-1.5 border-b border-border">
              Assessor Page — 0557-081-23-0000
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <div className="text-[10px] font-bold text-text-muted uppercase mb-1.5">
                  Property Information
                </div>
                {[
                  ["APN", "0557-081-23-0000"],
                  ["Situs Address", "12345 Main St, Rialto CA"],
                  ["Tax Rate Area", "105-259"],
                  ["Legal Class", "Single Family Residential"],
                  ["Lot Size", "7,200 Sq Ft"],
                  ["Year Built", "1986"],
                  ["Bedrooms", "3"],
                  ["Bathrooms", "2"],
                  ["Sq Footage", "1,420 Sq Ft"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-1 border-b border-light text-[11px]"
                  >
                    <span className="text-text-secondary">{k}</span>
                    <span className="text-text font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[10px] font-bold text-text-muted uppercase mb-1.5">
                  Assessment Values
                </div>
                {[
                  ["Land Value", "$182,000"],
                  ["Improvement Value", "$265,400"],
                  ["Personal Property", "$0"],
                  ["Total Assessed", "$447,400"],
                  ["Homeowner Exemption", "$7,000"],
                  ["Net Taxable Value", "$440,400"],
                  ["Last Transfer Date", "05/17/2025"],
                  ["Last Transfer Value", "$485,000"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-1 border-b border-light text-[11px]"
                  >
                    <span className="text-text-secondary">{k}</span>
                    <span className="text-text font-semibold">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </ResultBox>
          <ResultBox>
            <div className="text-[11px] font-bold text-text mb-2">
              Ownership History
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {["Date", "Grantor", "Grantee", "Doc No.", "Doc Type"].map(
                    (h) => (
                      <TableHead
                        key={h}
                        className="px-2.5 py-1.5"
                        style={{ background: "var(--table-header)" }}
                      >
                        {h}
                      </TableHead>
                    ),
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  [
                    "05/17/2025",
                    "MICHAEL SMITH",
                    "JOHN D DOE",
                    "2023-0212342",
                    "Grant Deed",
                  ],
                  [
                    "06/12/2019",
                    "ESTATE OF H SMITH",
                    "MICHAEL SMITH",
                    "2019-0098234",
                    "Quitclaim Deed",
                  ],
                  [
                    "04/10/2010",
                    "EAGLE BUILDERS INC",
                    "ESTATE OF H SMITH",
                    "2085-0083498",
                    "Grant Deed",
                  ],
                ].map((r, i) => (
                  <TableRow
                    key={i}
                    className={i % 2 === 0 ? "bg-white" : ""}
                    style={i % 2 !== 0 ? { background: "var(--bg-page)" } : {}}
                  >
                    {r.map((c, j) => (
                      <TableCell
                        key={j}
                        className={`px-2.5 py-1.5 ${j === 3 ? "text-status-info-blue-text font-medium" : "text-text-secondary font-normal"}`}
                      >
                        {c}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ResultBox>
        </div>
      )}
    </div>
  );
}

export default function ManualSearchModal({ onClose }: ManualSearchModalProps) {
  const SOURCES = [
    "Data Trace",
    "Title Point",
    "County Tax",
    "Pacer Search",
    "Patriot Act",
    "County Assessor",
  ];
  const [source, setSource] = useState("Data Trace");
  const srcColors: Record<string, string> = {
    "Data Trace": "var(--accent-data-trace)",
    "Title Point": "var(--accent-title-point)",
    "County Tax": "var(--accent-county-tax)",
    "Pacer Search": "var(--accent-pacer)",
    "Patriot Act": "var(--status-error-dark)",
    "County Assessor": "var(--accent-assessor)",
  };
  const color = srcColors[source] || "var(--brand)";

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="xl" title="Manual Search" subtitle="Direct access to external title search sources" onClose={onClose}>
        <div
          className="px-[22px] py-[14px] border-b border-light shrink-0"
          style={{ background: "var(--card-header)" }}
        >
          <div className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-2">
            Select Search Source
          </div>
          <div className="flex gap-2 flex-wrap">
            {SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`px-4 py-2 rounded-lg text-[12px] font-semibold border cursor-pointer transition-all duration-150 ${source === s ? "text-white" : "text-text-secondary bg-white border-border"}`}
                style={
                  source === s
                    ? {
                        background:
                          s === "Data Trace"
                            ? "var(--accent-data-trace)"
                            : s === "Title Point"
                              ? "var(--accent-title-point)"
                              : s === "County Tax"
                                ? "var(--accent-county-tax)"
                                : s === "Pacer Search"
                                  ? "var(--accent-pacer)"
                                  : s === "Patriot Act"
                                    ? "var(--status-error-dark)"
                                    : "var(--accent-assessor)",
                        borderColor:
                          s === "Data Trace"
                            ? "var(--accent-data-trace)"
                            : s === "Title Point"
                              ? "var(--accent-title-point)"
                              : s === "County Tax"
                                ? "var(--accent-county-tax)"
                                : s === "Pacer Search"
                                  ? "var(--accent-pacer)"
                                  : s === "Patriot Act"
                                    ? "var(--status-error-dark)"
                                    : "var(--accent-assessor)",
                        boxShadow: "0 2px 8px rgba(0,0,0,.15)",
                      }
                    : { boxShadow: "none" }
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-[22px]">
          {(source === "Data Trace" || source === "Title Point") && (
            <SearchDataTrace source={source} />
          )}
          {source === "County Tax" && <SearchCountyTax />}
          {source === "Pacer Search" && <SearchPacer />}
          {source === "Patriot Act" && <SearchPatriotAct />}
          {source === "County Assessor" && <SearchCountyAssessor />}
        </div>
      </DialogContent>
      <DialogFooter className="bg-card-header">
        <span className="text-[11px] text-text-muted">
          Connected to: <strong style={{ color }}>{source}</strong>
        </span>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export { FInp, FSel, FRow, FGrid, ResultBox, COUNTIES, DOC_SEARCH_TYPES };
