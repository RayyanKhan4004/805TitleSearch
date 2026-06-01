"use client";

import { useState } from "react";
import Icon from "@/components/common/icon";
import RunsheetModal from "./runsheet-modal";

interface RunsheetCardProps {
  title: string;
  sub: string;
  accent: string;
}

export const PI_SAMPLE_META = {
  order: "20262416", county: "VENTURA, CA", date: "APR 28, 2026 (Full)",
  searchedBy: "805TITLE INC, 805, NRAK", plantThruDate: "APR 28, 2026 - 05:00 PM",
  searchedDate: "05/05/2026 04:39 PM PDT, IBJH", plantThruInst: "2026-31273",
  geoCoverage: "JAN 01, 1964 - APR 28, 2026",
  torTee: "MAR 19, 2020 - OCT 27, 2021",
  apn: "100-0-264-105",
  currentOwner: "MARTINEZ MARCOS C / MARTINEZ JULIE P",
  acqDocId: "2004-229498", acqDate: "08-20-2004",
  situsAddr: "664 MANOR RIDGE RD SANTA PAULA CA 93060-1654",
  mailingAddr: "664 MANOR RIDGE RD SANTA PAULA CA 93060-1654",
  tra: "04-001",
  partialLegal: "TRACT: 448601 LOT: 23 REF: 117MR 61",
  landUseCode: "1111",
  landUseDesc: "TRACT SINGLE FAMILY DWELLING - OR - SINGLE FAMILY",
  lot: "23", block: "", tract: "4486", id: "1",
  subdivision: "117M61-65",
};

export const GI_SAMPLE_META = {
  order: "20262416", county: "VENTURA, CA", date: "APR 28, 2026 (Full)",
  searchedBy: "805TITLE INC, 805, NRAK", plantThruDate: "APR 30, 2026 - 05:00 PM",
  searchedDate: "05/06/2026 12:16 PM PDT, IBJH", plantThruInst: "2026-32038",
  geoCoverage: "JAN 01, 1964 - APR 28, 2026",
  bankruptcyDate: "MAY 02, 2026",
  torTee: "MAR 19, 2020 - OCT 27, 2021",
};

export const PI_ROWS = [
  { check: true,  type: "NC",  bkpg: "",          date: "10/23/1990", doc: "158639",  grantor: "MCKEVETT JONES PAR",  grantee: "",                    ptn: "" },
  { check: false, type: "DD",  bkpg: "",          date: "11/14/1990", doc: "170303",  grantor: "MCKEVETT JONES PAR",  grantee: "NICHOLS RONALD E",    ptn: "48235" },
  { check: false, type: "TD",  bkpg: "",          date: "11/14/1990", doc: "170304",  grantor: "NICHOLS RONALD E",    grantee: "WORLD SAV",           ptn: "250000" },
  { check: true,  type: "RC",  bkpg: "",          date: "07/26/2003", doc: "280932",  grantor: "",                    grantee: "",                    ptn: "" },
  { check: false, type: "SX",  bkpg: "",          date: "11/14/1990", doc: "",        grantor: "NICHOLS RONALD E",    grantee: "CT 05 0178023",       ptn: "143000" },
  { check: false, type: "DD",  bkpg: "",          date: "10/05/1992", doc: "175999",  grantor: "NICHOLS RONALD E",    grantee: "NICHOLS TRUST",       ptn: "" },
  { check: false, type: "LN",  bkpg: "",          date: "06/15/1995", doc: "71213",   grantor: "SANTAPAULA CITY",     grantee: "",                    ptn: "" },
  { check: true,  type: "RL",  bkpg: "",          date: "01/11/1996", doc: "4168",    grantor: "ALAMILLO ANSELMO &",  grantee: "",                    ptn: "95 71213" },
  { check: false, type: "SR",  bkpg: "",          date: "05/06/2004", doc: "",        grantor: "",                    grantee: "LW 26 3503589",       ptn: "" },
  { check: true,  type: "DD",  bkpg: "",          date: "08/20/2004", doc: "229498",  grantor: "NICHOLS RONALD E &",  grantee: "MARTINEZ MARCOS C",   ptn: "87450" },
  { check: false, type: "TD",  bkpg: "",          date: "08/20/2004", doc: "229499",  grantor: "MARTINEZ MARCOS C",   grantee: "AMERICAS WHOLESALE",  ptn: "636000" },
  { check: false, type: "AS",  bkpg: "",          date: "07/19/2011", doc: "105242",  grantor: "",                    grantee: "",                    ptn: "" },
  { check: false, type: "MD",  bkpg: "",          date: "09/26/2012", doc: "171846",  grantor: "MARTINEZ MARCOS &",   grantee: "",                    ptn: "04 229499" },
  { check: true,  type: "RC",  bkpg: "",          date: "05/18/2018", doc: "57545",   grantor: "",                    grantee: "",                    ptn: "" },
  { check: false, type: "AS",  bkpg: "",          date: "05/18/2018", doc: "57546",   grantor: "",                    grantee: "",                    ptn: "" },
  { check: false, type: "TD",  bkpg: "",          date: "08/20/2004", doc: "229500",  grantor: "MARTINEZ MARCOS C",   grantee: "AMERICAS WHOLESALE",  ptn: "R79500" },
  { check: true,  type: "RC",  bkpg: "",          date: "03/25/2005", doc: "73277",   grantor: "",                    grantee: "",                    ptn: "" },
  { check: false, type: "SX",  bkpg: "",          date: "08/20/2004", doc: "",        grantor: "MARTINEZ MARCOS C",   grantee: "FN 932084",           ptn: "59000" },
  { check: false, type: "SR",  bkpg: "",          date: "11/28/2004", doc: "",        grantor: "",                    grantee: "HOM JG 4495496",      ptn: "" },
  { check: false, type: "TD",  bkpg: "",          date: "03/10/2005", doc: "59359",   grantor: "MARTINEZ JULIE P",    grantee: "CITIBANK",            ptn: "R84000" },
  { check: true,  type: "RC",  bkpg: "",          date: "10/06/2005", doc: "250091",  grantor: "",                    grantee: "",                    ptn: "" },
  { check: false, type: "TD",  bkpg: "",          date: "09/13/2005", doc: "228457",  grantor: "MARTINEZ MARCOS &",   grantee: "WASHINGTON MUTUAL",   ptn: "R112000" },
  { check: false, type: "LN",  bkpg: "",          date: "02/20/2009", doc: "22766",   grantor: "MARTINEZ MARCOS C",   grantee: "",                    ptn: "3980 477" },
  { check: true,  type: "RL",  bkpg: "",          date: "04/03/2018", doc: "37592",   grantor: "MARTINEZ MARCOS C",   grantee: "VILLA DELSOL HOMEO",  ptn: "09 22766" },
  { check: false, type: "TD",  bkpg: "",          date: "04/30/2018", doc: "49283",   grantor: "MARTINEZ MARCOS C",   grantee: "VECO CREDIT UNION",   ptn: "660000" },
  { check: true,  type: "RC",  bkpg: "",          date: "08/30/2019", doc: "102108",  grantor: "",                    grantee: "",                    ptn: "" },
  { check: false, type: "TD",  bkpg: "",          date: "07/31/2019", doc: "86690",   grantor: "MARTINEZ MARCOS C",   grantee: "JPMORGAN CHASE BAN",  ptn: "743750" },
  { check: true,  type: "RC",  bkpg: "",          date: "04/29/2020", doc: "58213",   grantor: "",                    grantee: "",                    ptn: "" },
  { check: true,  type: "TD",  bkpg: "",          date: "02/16/2021", doc: "30914",   grantor: "MARTINEZ MARCOS C &", grantee: "JPMORGAN CHASE BAN",  ptn: "828750" },
  { check: false, type: "TD",  bkpg: "",          date: "11/22/2021", doc: "1975889", grantor: "MARTINEZ MARCOS CO &",grantee: "BANK WEST",           ptn: "R122000" },
  { check: false, type: "ST",  bkpg: "",          date: "04/17/2023", doc: "26996",   grantor: "",                    grantee: "",                    ptn: "" },
  { check: true,  type: "RC",  bkpg: "",          date: "04/17/2023", doc: "26997",   grantor: "",                    grantee: "",                    ptn: "" },
  { check: true,  type: "TD",  bkpg: "",          date: "04/06/2023", doc: "24694",   grantor: "MARTINEZ MARCOS CO &",grantee: "BANK OF THE WEST",    ptn: "R250000" },
];

export interface GiRow {
  type: string;
  bkpg: string;
  date: string;
  doc: string;
  name: string;
  ref: string;
  remarks: string;
}

export interface GiSearch {
  role: string;
  name: string;
  nicknames: string;
  rows: GiRow[];
}

export const GI_SEARCHES: GiSearch[] = [
  {
    role: "INDIVIDUAL", name: "MARTINEZ, MARCOS",
    nicknames: "MARC, MARCO, MARK",
    rows: [
      { type: "AJ", bkpg: "",         date: "04/01/1999", doc: "64130",    name: "MARK SYLVIA MARTINEZ",  ref: "",            remarks: "CIV186310" },
      { type: "XO", bkpg: "",         date: "05/09/2013", doc: "OFAC015911",name: "MARTIN",               ref: "",            remarks: "" },
      { type: "ST", bkpg: "",         date: "05/01/2024", doc: "27175",    name: "MARTIN & VIR TRUST",    ref: "",            remarks: "" },
      { type: "LN", bkpg: "5518/573", date: "10/23/1979", doc: "117037",   name: "MARTIN M",              ref: "",            remarks: "790246" },
      { type: "RL", bkpg: "5655/139", date: "05/15/1980", doc: "46046",    name: "MARTIN M",              ref: "5518/573",    remarks: "790246" },
      { type: "MG", bkpg: "",         date: "01/12/1990", doc: "5996",     name: "MARTINEZ MARCOS",       ref: "",            remarks: "" },
      { type: "SJ", bkpg: "",         date: "03/29/2004", doc: "79755",    name: "MARTINEZ MARCOS",       ref: "",            remarks: "D302800" },
      { type: "AJ", bkpg: "",         date: "04/18/2018", doc: "44012",    name: "MARTINEZ MARCOS",       ref: "",            remarks: "56-2017-00" },
      { type: "RL", bkpg: "",         date: "07/09/2021", doc: "130368",   name: "MARTINEZ MARCOS",       ref: "2018 44012",  remarks: "56-2017-00500670-CL-CL-VTA" },
      { type: "AJ", bkpg: "",         date: "12/22/1988", doc: "195463",   name: "MARTINEZ MARK",         ref: "",            remarks: "D172447" },
      { type: "AJ", bkpg: "",         date: "05/14/1991", doc: "65858",    name: "MARTINEZ MARK",         ref: "",            remarks: "D123487" },
      { type: "BF", bkpg: "",         date: "04/14/2009", doc: "09011337", name: "MARTINEZ MARCOS",       ref: "XXX-XX-4500", remarks: "CHAPTER 7; CACENF4 - SANTA BARBARA; 664 MANOR RIDGE RD SANTA PAULA CA 93060" },
      { type: "BG", bkpg: "",         date: "10/02/2009", doc: "09011337", name: "MARTINEZ MARCOS",       ref: "XXX-XX-4500", remarks: "CHAPTER 7; CACENF4 - SANTA BARBARA; 664 MANOR RIDGE RD SANTA PAULA CA 93060" },
      { type: "OO", bkpg: "",         date: "09/05/2025", doc: "",         name: "MARTINEZ MARCOS;ST CA", ref: "",            remarks: "FIGPRP25896943" },
      { type: "OO", bkpg: "",         date: "08/28/2025", doc: "",         name: "MARTINEZ MARCOS;WFG",   ref: "",            remarks: "2688283CA" },
    ],
  },
  {
    role: "SPOUSE", name: "MARTINEZ, JULIE",
    nicknames: "JULE, JULEE, JULES, JULI, JULIA, JULIANA, JULIANNA, JULIE ANN",
    rows: [
      { type: "LN", bkpg: "",  date: "07/30/1984", doc: "83816",   name: "MARTIN J",          ref: "",          remarks: "8420600138" },
      { type: "RL", bkpg: "",  date: "09/02/1986", doc: "118691",  name: "MARTIN J",          ref: "84-83816",   remarks: "84206-1389" },
      { type: "AJ", bkpg: "",  date: "08/19/2005", doc: "207039",  name: "MARTIN J BARAB",    ref: "",           remarks: "02T00375" },
      { type: "AJ", bkpg: "",  date: "06/22/2011", doc: "92261",   name: "MARTINEZ JULIE",    ref: "",           remarks: "56-2010-00" },
      { type: "RL", bkpg: "",  date: "12/09/2011", doc: "188076",  name: "MARTINEZ JULIE",    ref: "11-92261",   remarks: "56-2010-00" },
      { type: "AJ", bkpg: "",  date: "10/07/2008", doc: "150497",  name: "MARTINEZ JULIE A",  ref: "XXX-XX-5959",remarks: "5620080031" },
      { type: "BF", bkpg: "",  date: "07/30/2025", doc: "25011010",name: "MARTINEZ JULIE P",  ref: "XXX-XX-7932",remarks: "CHAPTER 7; CACENF4 - SANTA BARBARA; 664 MANOR RIDGE RD SANTA PAULA CA 93060" },
      { type: "BG", bkpg: "",  date: "11/10/2025", doc: "25011010",name: "MARTINEZ JULIE P",  ref: "XXX-XX-7932",remarks: "CHAPTER 7; CACENF4 - SANTA BARBARA; 664 MANOR RIDGE RD SANTA PAULA CA 93060" },
      { type: "BT", bkpg: "",  date: "11/12/2025", doc: "25011010",name: "MARTINEZ JULIE P",  ref: "XXX-XX-7932",remarks: "CHAPTER 7; CACENF4 - SANTA BARBARA; 664 MANOR RIDGE RD SANTA PAULA CA 93060" },
      { type: "OO", bkpg: "",  date: "11/23/2015", doc: "",        name: "MARTINEZ JULIE;FA 55", ref: "",        remarks: "9986616D" },
    ],
  },
];

export default function RunsheetCard({ title, sub, accent }: RunsheetCardProps) {
  const [open, setOpen] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("pi");
  const [piRows, setPiRows] = useState(PI_ROWS);
  const [giSearches, setGiSearches] = useState(GI_SEARCHES);

  const totalSearches = giSearches.length;
  const totalGiRows = giSearches.reduce((a, s) => a + s.rows.length, 0);

  return (
    <>
      <div className="overflow-hidden rounded-xl" style={{ border: "1px solid var(--border-primary)", background: "var(--bg-card)" }}>
        <div
          className="flex items-center justify-between px-4 py-2.75 cursor-pointer select-none"
          style={{ borderBottom: open ? "1px solid #f1f5f9" : "none", background: "#fafafa" }}
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-0.75 h-7 rounded-sm shrink-0" style={{ background: accent }} />
            <div>
              <div className="text-[13px] font-bold text-[#1e293b]">{title}</div>
              <div className="text-[10px] text-[#94a3b8] mt-0.5">{sub}</div>
            </div>
            <span
              className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-1"
              style={{ background: "#f5f3ff", color: "#7c3aed", border: "1px solid #e9d5ff" }}
            >
              {piRows.length} PI &middot; {totalGiRows} GI
            </span>
          </div>
          <Icon name={open ? "chevDown" : "chevRight"} size={13} style={{ color: "#94a3b8" }} />
        </div>

        {open && (
          <div className="flex flex-col gap-2.5 px-4 py-3.5">
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Property Index (PI)", val: `${piRows.length} recorded documents`, color: "#0369a1" },
                { label: "General Index (GI)", val: `${totalSearches} names \u00b7 ${totalGiRows} entries`, color: "#7c3aed" },
              ].map(({ label, val, color }) => (
                <div key={label} className="rounded-lg px-3.5 py-2.5 bg-white" style={{ border: "1px solid #e2e8f0" }}>
                  <div className="text-[10px] font-bold mb-0.75" style={{ color }}>{label}</div>
                  <div className="text-[12px] font-semibold text-[#334155]">{val}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-1.75 rounded-lg text-[12px] font-bold cursor-pointer transition-all duration-150"
                style={{
                  padding: "8px 16px",
                  background: "#f5f3ff",
                  border: "1px solid #c4b5fd",
                  color: "#6d28d9",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#7c3aed"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f5f3ff"; e.currentTarget.style.color = "#6d28d9"; }}
              >
                <Icon name="external" size={12} />
                Open Full Runsheet
              </button>
              <span className="text-[10px] text-[#94a3b8] italic">
                Opens PI Chain + GI Search in a new full-screen view
              </span>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <RunsheetModal
          piRows={piRows}
          setPiRows={setPiRows}
          giSearches={giSearches}
          setGiSearches={setGiSearches}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
