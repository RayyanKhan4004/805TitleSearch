"use client";

import { useState } from "react";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui";
import { searchProperty, mapApiToForm } from "@/app/services/datatree-api";
import type {
  PropertyForm,
  PropertyData,
  SearchType,
  CreateOrderStep,
  Buyer,
  Seller,
} from "@/app/components/feature/tables/types";
import { COUNTIES } from "../consts";

interface CreateOrderModalProps {
  onClose: () => void;
  onCreate: (orderData: Record<string, unknown>) => void;
}

const STEPS = [
  "Search Property",
  "Property Information",
  "File Information",
  "Transaction Parties",
];

const SEARCH_TYPES: { key: SearchType; label: string; icon: string }[] = [
  { key: "APN", label: "APN", icon: "hash" },
  { key: "Address", label: "Address", icon: "mapPin" },
  { key: "FullAddress", label: "Full Address", icon: "mapPin" },
  { key: "OwnerName", label: "Owner Name", icon: "user" },
  { key: "PropertyId", label: "Property ID", icon: "file" },
  { key: "Advanced", label: "Advanced", icon: "settings" },
];

const EMPTY_FORM: PropertyForm = {
  addrNo: "",
  dirPrefix: "",
  streetName: "",
  suffix: "",
  postDir: "",
  unitType: "",
  unitNo: "",
  city: "",
  state: "CA",
  zip: "",
  county: "",
  apn1: "",
  apn2: "",
  apn3: "",
  apn4: "",
  lot: "",
  block: "",
  tract: "",
  mapBook: "",
  page: "",
  section: "",
  township: "",
  range: "",
  shortLegal: "",
  municipality: "City",
  jurisdiction: "",
  vestingText: "",
  vestingType: "Community Property",
  landUse: "Single Family Residential",
};

const VESTING_OPTS = [
  "Community Property",
  "Joint Tenants",
  "Tenants in Common",
  "Sole and Separate",
  "Trust",
  "Corporation",
  "LLC",
  "Partnership",
];

const ENTITY_OPTS = [
  "Individual",
  "Trust",
  "Corporation",
  "LLC",
  "Partnership",
  "Estate",
  "Non-Profit",
];

export default function CreateOrderModal({ onClose, onCreate }: CreateOrderModalProps) {
  const [ms, setMs] = useState<CreateOrderStep>(-1);
  const [searchType, setSearchType] = useState<SearchType>("APN");
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState("");
  const [apiResult, setApiResult] = useState<PropertyData | null>(null);
  const [form, setForm] = useState<PropertyForm>(EMPTY_FORM);

  // Search inputs
  const [apnInput, setApnInput] = useState("");
  const [zipInput, setZipInput] = useState("");
  const [addrNum, setAddrNum] = useState("");
  const [addrStr, setAddrStr] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("CA");
  const [addrZip, setAddrZip] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [propId, setPropId] = useState("");
  const [fullAddr, setFullAddr] = useState("");
  const [advCounty, setAdvCounty] = useState("ORANGE");
  const [advYear, setAdvYear] = useState("");
  const [advBeds, setAdvBeds] = useState("");

  // Parties state
  const [partyTab, setPartyTab] = useState<"buyer" | "seller" | "general">("buyer");
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [bFirst, setBFirst] = useState("");
  const [bLast, setBLast] = useState("");
  const [bMid, setBMid] = useState("");
  const [bVest, setBVest] = useState("Community Property");
  const [bPhone, setBPhone] = useState("");
  const [bEmail, setBEmail] = useState("");
  const [bAddr, setBAddr] = useState("");
  const [bCity, setBCity] = useState("");
  const [bState, setBState] = useState("CA");
  const [bZip, setBZip] = useState("");
  const [bEntity, setBEntity] = useState("Individual");
  const [sFirst, setSFirst] = useState((form._seller || "").split(" ")[0] || "");
  const [sLast, setSLast] = useState((form._seller || "").split(" ").slice(1).join(" ") || "");
  const [sMid, setSMid] = useState("");
  const [sVest, setSVest] = useState("Community Property");
  const [sPhone, setSPhone] = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sAddr, setSAddr] = useState("");
  const [sDeedType, setSDeedType] = useState(form._deedType || "Grant Deed");
  const [sDocNo, setSDocNo] = useState(form._docNo || "");
  const [titleOffice, setTitleOffice] = useState("");
  const [escrowOffice, setEscrowOffice] = useState("");
  const [branch, setBranch] = useState("South Cal");
  const [loanOfficer, setLoanOfficer] = useState("");
  const [lender, setLender] = useState(form._lender || "");

  // File info
  const [clientName, setClientName] = useState("");
  const [clientFileNo, setClientFileNo] = useState("");
  const [transactionType, setTransactionType] = useState("Sale");
  const [productType, setProductType] = useState("");
  const [sourceOfBusiness, setSourceOfBusiness] = useState("");
  const [loanNumber, setLoanNumber] = useState("");

  const up = (k: keyof PropertyForm, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSearch = async () => {
    setSearching(true);
    setSearchErr("");
    setApiResult(null);
    try {
      let params: Record<string, unknown> = {};
      if (searchType === "APN")
        params = { ApnDetail: { APN: apnInput, ZipCode: zipInput } };
      if (searchType === "Address")
        params = {
          AddressDetail: {
            HouseNumber: addrNum,
            StreetName: addrStr,
            City: addrCity,
            State: addrState,
            Zip: addrZip,
          },
        };
      if (searchType === "FullAddress")
        params = { FullAddressDetail: { FullAddress: fullAddr } };
      if (searchType === "OwnerName")
        params = { OwnerNameDetail: { OwnerName: ownerName, State: addrState } };
      if (searchType === "PropertyId")
        params = { PropertyIdDetail: { PropertyId: propId } };
      if (searchType === "Advanced")
        params = {
          AdvancedDetail: {
            County: advCounty,
            YearBuilt: advYear,
            Bedrooms: advBeds,
            State: "CA",
          },
        };

      const data = await searchProperty(searchType, params as never);
      if (!data) {
        setSearchErr("No property found. Please check your search criteria.");
      } else {
        setApiResult(data);
        setForm(mapApiToForm(data));
        setMs(1);
      }
    } catch (e) {
      setSearchErr("Search failed: " + (e as Error).message);
    } finally {
      setSearching(false);
    }
  };

  const handleCreate = () => {
    onCreate({
      property: form,
      buyers,
      sellers,
      file: {
        clientName,
        clientFileNo,
        transactionType,
        productType,
        sourceOfBusiness,
        salePrice: form._lastSalePrice,
        loanAmount: form._mtgAmt,
        loanNumber,
      },
      escrow: {
        titleOffice,
        escrowOffice,
        branch,
        loanOfficer,
        lender,
      },
    });
  };

  const renderSearchInputs = () => {
    const inpCls =
      "w-full border border-border-input rounded-lg px-3 py-2 text-[12px] text-text bg-white outline-none box-border";
    const lblCls =
      "text-[10px] font-bold text-text-secondary mb-1 block uppercase tracking-[0.05em]";

    switch (searchType) {
      case "APN":
        return (
          <div className="grid grid-cols-[1fr_160px] gap-3">
            <div>
              <label className={lblCls}>APN / Parcel Number</label>
              <input
                className={inpCls}
                value={apnInput}
                onChange={(e) => setApnInput(e.target.value)}
                placeholder="e.g. 808-631-06"
              />
            </div>
            <div>
              <label className={lblCls}>Zip Code (optional)</label>
              <input
                className={inpCls}
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                placeholder="e.g. 92692"
              />
            </div>
          </div>
        );
      case "Address":
        return (
          <div className="grid grid-cols-[100px_1fr_160px_80px_120px] gap-3">
            <div>
              <label className={lblCls}>House No.</label>
              <input
                className={inpCls}
                value={addrNum}
                onChange={(e) => setAddrNum(e.target.value)}
                placeholder="27901"
              />
            </div>
            <div>
              <label className={lblCls}>Street Name</label>
              <input
                className={inpCls}
                value={addrStr}
                onChange={(e) => setAddrStr(e.target.value)}
                placeholder="ENCANTO"
              />
            </div>
            <div>
              <label className={lblCls}>City</label>
              <input
                className={inpCls}
                value={addrCity}
                onChange={(e) => setAddrCity(e.target.value)}
                placeholder="MISSION VIEJO"
              />
            </div>
            <div>
              <label className={lblCls}>State</label>
              <select
                className={inpCls}
                value={addrState}
                onChange={(e) => setAddrState(e.target.value)}
              >
                {["CA", "NV", "AZ", "TX", "OR", "WA"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={lblCls}>Zip Code</label>
              <input
                className={inpCls}
                value={addrZip}
                onChange={(e) => setAddrZip(e.target.value)}
                placeholder="92692"
              />
            </div>
          </div>
        );
      case "FullAddress":
        return (
          <div>
            <label className={lblCls}>Full Address (Street, City, State, Zip)</label>
            <input
              className={inpCls}
              value={fullAddr}
              onChange={(e) => setFullAddr(e.target.value)}
              placeholder="e.g. 27901 ENCANTO, MISSION VIEJO, CA 92692"
            />
          </div>
        );
      case "OwnerName":
        return (
          <div className="grid grid-cols-[1fr_120px] gap-3">
            <div>
              <label className={lblCls}>Owner Full Name</label>
              <input
                className={inpCls}
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. SARMIENTO REYNALDO"
              />
            </div>
            <div>
              <label className={lblCls}>State</label>
              <select
                className={inpCls}
                value={addrState}
                onChange={(e) => setAddrState(e.target.value)}
              >
                {["CA", "NV", "AZ", "TX", "OR", "WA"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        );
      case "PropertyId":
        return (
          <div className="max-w-[300px]">
            <label className={lblCls}>DataTree Property ID</label>
            <input
              className={inpCls}
              value={propId}
              onChange={(e) => setPropId(e.target.value)}
              placeholder="e.g. 15428964"
            />
          </div>
        );
      case "Advanced":
        return (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={lblCls}>County</label>
              <select
                className={inpCls}
                value={advCounty}
                onChange={(e) => setAdvCounty(e.target.value)}
              >
                {COUNTIES.map((c) => (
                  <option key={c}>{c.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={lblCls}>Year Built</label>
              <input
                className={inpCls}
                value={advYear}
                onChange={(e) => setAdvYear(e.target.value)}
                placeholder="e.g. 1979"
              />
            </div>
            <div>
              <label className={lblCls}>Bedrooms</label>
              <input
                className={inpCls}
                value={advBeds}
                onChange={(e) => setAdvBeds(e.target.value)}
                placeholder="e.g. 5"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderPropertyStep = () => {
    const inpCls =
      "w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none";
    const lblCls =
      "text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block";
    const secCls =
      "bg-secondary rounded-xl p-4 border border-border";
    const secTitle = (txt: string, color = "var(--brand-primary)") => (
      <div className="text-[12px] font-extrabold text-text mb-3.5 flex items-center gap-1.75">
        <div className="w-[3px] h-4 rounded-sm" style={{ background: color }} />
        {txt}
      </div>
    );

    return (
      <div className="flex flex-col gap-3.5">
        {apiResult && (
          <div className="flex items-center gap-2 bg-status-success-bg border border-status-success-border rounded-lg px-3.5 py-2">
            <Icon name="checkCircle" size={14} className="text-status-success-emerald" />
            <span className="text-[11px] font-semibold text-status-success-text">
              Auto-populated from DataTree API — Property ID {apiResult.PropertyId}
            </span>
            <span className="text-[10px] text-text-muted ml-auto">
              {apiResult.LocationInformation?.NeighborhoodName} ·{" "}
              {apiResult.SiteInformation?.LandUse} · APN{" "}
              {apiResult.SitusAddress?.APN}
            </span>
            <button
              onClick={() => setMs(0)}
              className="bg-transparent border border-status-success-border text-status-success-text text-[10px] font-semibold px-2.5 py-0.5 rounded cursor-pointer hover:bg-status-success-bg/50"
            >
              Re-search
            </button>
          </div>
        )}

        <div className="grid grid-cols-[3fr_2fr] gap-3.5">
          <div className={secCls}>
            {secTitle("Situs Address")}
            <div className="grid grid-cols-[80px_90px_1fr_80px] gap-2.25 mb-2.25">
              <div>
                <label className={lblCls}>Addr No.</label>
                <input className={inpCls} value={form.addrNo} onChange={(e) => up("addrNo", e.target.value)} placeholder="27901" />
              </div>
              <div>
                <label className={lblCls}>Dir Prefix</label>
                <select className={inpCls} value={form.dirPrefix} onChange={(e) => up("dirPrefix", e.target.value)}>
                  <option value="">None</option>
                  {["N", "S", "E", "W", "NE", "NW", "SE", "SW"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lblCls}>Street Name</label>
                <input className={inpCls} value={form.streetName} onChange={(e) => up("streetName", e.target.value)} placeholder="ENCANTO" />
              </div>
              <div>
                <label className={lblCls}>Suffix</label>
                <select className={inpCls} value={form.suffix} onChange={(e) => up("suffix", e.target.value)}>
                  <option value="">None</option>
                  {["Ave", "Blvd", "Cir", "Ct", "Dr", "Hwy", "Ln", "Pkwy", "Pl", "Rd", "St", "Ter", "Way"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-[90px_90px_80px_1fr] gap-2.25 mb-2.25">
              <div>
                <label className={lblCls}>Post Dir</label>
                <select className={inpCls} value={form.postDir} onChange={(e) => up("postDir", e.target.value)}>
                  <option value="">None</option>
                  {["N", "S", "E", "W", "NE", "NW", "SE", "SW"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lblCls}>Unit Type</label>
                <select className={inpCls} value={form.unitType} onChange={(e) => up("unitType", e.target.value)}>
                  <option value="">None</option>
                  {["Apt", "Suite", "Unit", "#", "Bldg", "Floor", "Lot", "Sp"].map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lblCls}>Unit No.</label>
                <input className={inpCls} value={form.unitNo} onChange={(e) => up("unitNo", e.target.value)} placeholder="2" />
              </div>
              <div>
                <label className={lblCls}>City</label>
                <input className={inpCls} value={form.city} onChange={(e) => up("city", e.target.value)} placeholder="MISSION VIEJO" />
              </div>
            </div>
            <div className="grid grid-cols-[70px_100px_1fr] gap-2.25">
              <div>
                <label className={lblCls}>State</label>
                <select className={inpCls} value={form.state} onChange={(e) => up("state", e.target.value)}>
                  {["CA", "NV", "AZ", "TX", "OR", "WA", "CO", "FL", "NY"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={lblCls}>Zip Code</label>
                <input className={inpCls} value={form.zip} onChange={(e) => up("zip", e.target.value)} placeholder="92692" />
              </div>
              <div>
                <label className={lblCls}>County</label>
                <select className={inpCls} value={form.county} onChange={(e) => up("county", e.target.value)}>
                  {COUNTIES.map((c) => (
                    <option key={c}>{c.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={secCls}>
            {secTitle("Parcel ID", "var(--search-source-datatree)")}
            {(["apn1", "apn2", "apn3", "apn4"] as const).map((k, i) => (
              <div key={k} className="mb-2.25">
                <label className={lblCls}>APN {i + 1}</label>
                <input className={inpCls} value={form[k]} onChange={(e) => up(k, e.target.value)} placeholder="e.g. 808-631-06" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3.5">
          <div className={secCls}>
            {secTitle("Legal Information", "var(--search-source-titlepoint)")}
            <div className="grid grid-cols-2 gap-2.25">
              {[
                ["lot", "Lot"],
                ["block", "Block"],
                ["tract", "Tract"],
                ["mapBook", "Map Book"],
                ["page", "Page"],
                ["section", "Section"],
                ["township", "Township"],
                ["range", "Range"],
              ].map(([k, l]) => (
                <div key={k}>
                  <label className={lblCls}>{l}</label>
                  <input className={inpCls} value={form[k as keyof PropertyForm] as string} onChange={(e) => up(k as keyof PropertyForm, e.target.value)} placeholder="-" />
                </div>
              ))}
            </div>
          </div>
          <div className={secCls}>
            {secTitle("Short Legal", "var(--search-source-pacer)")}
            <textarea
              rows={5}
              value={form.shortLegal}
              onChange={(e) => up("shortLegal", e.target.value)}
              className={`${inpCls} resize-none font-mono leading-relaxed`}
              placeholder="Short legal description…"
            />
            <div className="grid grid-cols-2 gap-2.25 mt-2.25">
              <div>
                <label className={lblCls}>Municipality</label>
                <select className={inpCls} value={form.municipality} onChange={(e) => up("municipality", e.target.value)}>
                  <option>City</option>
                  <option>Township</option>
                  <option>Unincorporated</option>
                </select>
              </div>
              <div>
                <label className={lblCls}>Jurisdiction</label>
                <input className={inpCls} value={form.jurisdiction} onChange={(e) => up("jurisdiction", e.target.value)} />
              </div>
            </div>
          </div>
          <div className={secCls}>
            {secTitle("Assessor Vesting", "var(--status-success-emerald)")}
            <textarea
              rows={3}
              value={form.vestingText}
              onChange={(e) => up("vestingText", e.target.value)}
              className={`${inpCls} resize-none font-mono leading-relaxed mb-2.25`}
              placeholder="Owner name as on assessor roll"
            />
            <div className="mb-2.25">
              <label className={lblCls}>Vesting Type</label>
              <select className={inpCls} value={form.vestingType} onChange={(e) => up("vestingType", e.target.value)}>
                {VESTING_OPTS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={lblCls}>Land Use</label>
              <select className={inpCls} value={form.landUse} onChange={(e) => up("landUse", e.target.value)}>
                {[
                  "Single Family Residential",
                  "Multi-Family Residential",
                  "Condominium",
                  "Planned Unit Development",
                  "Commercial",
                  "Industrial",
                  "Vacant Land",
                ].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {apiResult && (
          <div className="bg-header rounded-lg p-3 flex flex-wrap gap-4">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] self-center mr-1">
              From DataTree
            </span>
            {[
              ["Year Built", form._yearBuilt],
              ["Sq Ft", form._livingArea ? Number(form._livingArea).toLocaleString() : "-"],
              ["Beds / Baths", `${form._bedrooms} bd / ${form._bathrooms} ba`],
              ["Lot", form._lotSqFt ? `${Number(form._lotSqFt).toLocaleString()} sqft` : "-"],
              ["Flood Zone", form._floodZone],
              ["Assessed", form._assessedValue],
              ["Annual Tax", form._annualTax],
              ["Last Sale", `${form._lastSaleDate} · ${form._lastSalePrice}`],
              ["Lender", form._lender],
              ["1st Mtg", `${form._mtgAmt} @ ${form._mtgRate}`],
            ]
              .filter(([, v]) => v && v !== "-" && !v?.startsWith("undefined"))
              .map(([k, v]) => (
                <div key={k as string}>
                  <div className="text-[8px] font-bold text-text-tertiary uppercase tracking-[0.06em]">
                    {k}
                  </div>
                  <div className="text-[11px] font-semibold text-header-search-text">
                    {v}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  const renderPartiesStep = () => {
    const inpCls =
      "w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none";
    const lblCls =
      "text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block";
    const secCls =
      "bg-secondary rounded-xl p-4 border border-border";

    const TABS = [
      { key: "buyer" as const, label: "Buyer(s)", color: "var(--brand-primary)", icon: "user" },
      { key: "seller" as const, label: "Seller(s)", color: "var(--search-source-datatree)", icon: "user" },
      { key: "general" as const, label: "Escrow / Title", color: "var(--text-tertiary)", icon: "file" },
    ];

    return (
      <div className="p-4.5 flex flex-col gap-3.5 overflow-y-auto flex-1">
        <div className="flex border-b-2 border-border gap-0">
          {TABS.map((t) => {
            const active = partyTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setPartyTab(t.key)}
                className="flex items-center gap-1.75 px-5 py-2.5 text-[12px] font-bold border-none cursor-pointer transition-all duration-150 mb-[-2px]"
                style={{
                  borderBottom: active ? `3px solid ${t.color}` : "3px solid transparent",
                  color: active ? t.color : "var(--text-tertiary)",
                  background: active ? `${t.color}08` : "transparent",
                }}
              >
                <Icon name={t.icon} size={13} />
                {t.label}
                {t.key === "buyer" && buyers.length > 0 && (
                  <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: t.color }}>
                    {buyers.length}
                  </span>
                )}
                {t.key === "seller" && sellers.length > 0 && (
                  <span className="text-[9px] font-bold text-white px-1.5 py-0.5 rounded-full" style={{ background: t.color }}>
                    {sellers.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {partyTab === "buyer" && (
          <div className="flex flex-col gap-3.5">
            {buyers.length > 0 && (
              <div className="bg-status-success-bg/30 border border-status-success-border rounded-lg p-2.5 px-3.5">
                <div className="text-[10px] font-bold text-status-success-text uppercase tracking-[0.06em] mb-1.75">
                  Added Buyers ({buyers.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {buyers.map((b) => (
                    <span
                      key={b.id}
                      className="inline-flex items-center gap-1.25 bg-secondary border border-border text-text-secondary text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    >
                      {b.name}
                      <button
                        onClick={() => setBuyers(buyers.filter((x) => x.id !== b.id))}
                        className="bg-transparent border-none cursor-pointer text-text-muted text-[13px] leading-none p-0 hover:text-status-error"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className={secCls}>
              <div className="flex items-center justify-between mb-3.5">
                <div className="text-[12px] font-extrabold text-text flex items-center gap-1.75">
                  <div className="w-[3px] h-4 bg-brand rounded-sm" />
                  Buyer Information
                </div>
                <span className="text-[10px] text-text-muted">Add multiple buyers using the button below</span>
              </div>
              <div className="grid grid-cols-[1fr_1fr_100px] gap-2.75 mb-2.75">
                <div>
                  <label className={lblCls}>First Name</label>
                  <input className={inpCls} value={bFirst} onChange={(e) => setBFirst(e.target.value)} placeholder="John" />
                </div>
                <div>
                  <label className={lblCls}>Last Name</label>
                  <input className={inpCls} value={bLast} onChange={(e) => setBLast(e.target.value)} placeholder="Doe" />
                </div>
                <div>
                  <label className={lblCls}>Middle / Suffix</label>
                  <input className={inpCls} value={bMid} onChange={(e) => setBMid(e.target.value)} placeholder="D. / Jr." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.75 mb-2.75">
                <div>
                  <label className={lblCls}>Entity Type</label>
                  <select className={inpCls} value={bEntity} onChange={(e) => setBEntity(e.target.value)}>
                    {ENTITY_OPTS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={lblCls}>How Title Will Be Held (Vesting)</label>
                  <select className={inpCls} value={bVest} onChange={(e) => setBVest(e.target.value)}>
                    {VESTING_OPTS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.75 mb-2.75">
                <div>
                  <label className={lblCls}>Phone</label>
                  <input className={inpCls} value={bPhone} onChange={(e) => setBPhone(e.target.value)} placeholder="(555) 000-0000" />
                </div>
                <div>
                  <label className={lblCls}>Email</label>
                  <input className={inpCls} value={bEmail} onChange={(e) => setBEmail(e.target.value)} placeholder="buyer@email.com" type="email" />
                </div>
              </div>
              <div className="grid grid-cols-[2fr_1fr_80px_100px] gap-2.75 mb-2.75">
                <div>
                  <label className={lblCls}>Mailing Address</label>
                  <input className={inpCls} value={bAddr} onChange={(e) => setBAddr(e.target.value)} placeholder="Street address" />
                </div>
                <div>
                  <label className={lblCls}>City</label>
                  <input className={inpCls} value={bCity} onChange={(e) => setBCity(e.target.value)} placeholder="City" />
                </div>
                <div>
                  <label className={lblCls}>State</label>
                  <select className={inpCls} value={bState} onChange={(e) => setBState(e.target.value)}>
                    {["CA", "NV", "AZ", "TX", "OR", "WA"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={lblCls}>Zip</label>
                  <input className={inpCls} value={bZip} onChange={(e) => setBZip(e.target.value)} placeholder="92692" />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (!bFirst.trim() && !bLast.trim()) return;
                    setBuyers((b) => [
                      ...b,
                      {
                        id: Date.now(),
                        name: [bFirst, bMid, bLast].filter(Boolean).join(" ") + ` (${bVest})`,
                      },
                    ]);
                    setBFirst("");
                    setBLast("");
                    setBMid("");
                    setBPhone("");
                    setBEmail("");
                    setBAddr("");
                    setBCity("");
                    setBZip("");
                  }}
                  className="inline-flex items-center gap-1.25 bg-brand text-white border-none rounded-lg px-4 py-1.5 text-[11px] font-semibold cursor-pointer hover:bg-brand/90"
                >
                  <Icon name="plus" size={11} />
                  Add Buyer
                </button>
                {buyers.length > 0 && (
                  <span className="text-[11px] text-text-tertiary self-center">
                    {buyers.length} buyer{buyers.length > 1 ? "s" : ""} added
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {partyTab === "seller" && (
          <div className="flex flex-col gap-3.5">
            {form._seller && (
              <div className="flex items-center gap-1.75 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2">
                <Icon name="checkCircle" size={13} className="text-amber-600" />
                <span className="text-[11px] text-amber-800 font-medium">
                  Seller pre-filled from DataTree: <strong>{form._seller}</strong>
                </span>
              </div>
            )}
            {sellers.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 px-3.5">
                <div className="text-[10px] font-bold text-blue-800 uppercase tracking-[0.06em] mb-1.75">
                  Added Sellers ({sellers.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sellers.map((s) => (
                    <span
                      key={s.id}
                      className="inline-flex items-center gap-1.25 bg-secondary border border-border text-text-secondary text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    >
                      {s.name}
                      <button
                        onClick={() => setSellers(sellers.filter((x) => x.id !== s.id))}
                        className="bg-transparent border-none cursor-pointer text-text-muted text-[13px] leading-none p-0 hover:text-status-error"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className={secCls}>
              <div className="flex items-center justify-between mb-3.5">
                <div className="text-[12px] font-extrabold text-text flex items-center gap-1.75">
                  <div className="w-[3px] h-4 rounded-sm" style={{ background: "var(--search-source-datatree)" }} />
                  Seller Information
                </div>
                <span className="text-[10px] text-text-muted">Add multiple sellers using the button below</span>
              </div>
              <div className="grid grid-cols-[1fr_1fr_100px] gap-2.75 mb-2.75">
                <div>
                  <label className={lblCls}>First Name</label>
                  <input className={inpCls} value={sFirst} onChange={(e) => setSFirst(e.target.value)} placeholder="Michael" />
                </div>
                <div>
                  <label className={lblCls}>Last Name</label>
                  <input className={inpCls} value={sLast} onChange={(e) => setSLast(e.target.value)} placeholder="Smith" />
                </div>
                <div>
                  <label className={lblCls}>Middle / Suffix</label>
                  <input className={inpCls} value={sMid} onChange={(e) => setSMid(e.target.value)} placeholder="A. / Sr." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.75 mb-2.75">
                <div>
                  <label className={lblCls}>Current Vesting (from Deed)</label>
                  <select className={inpCls} value={sVest} onChange={(e) => setSVest(e.target.value)}>
                    {VESTING_OPTS.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={lblCls}>Deed Type</label>
                  <select className={inpCls} value={sDeedType} onChange={(e) => setSDeedType(e.target.value)}>
                    {["Grant Deed", "Quitclaim Deed", "Trustee's Deed", "Trustee's Deed Upon Rec. of Sale", "Warranty Deed"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.75 mb-2.75">
                <div>
                  <label className={lblCls}>Phone</label>
                  <input className={inpCls} value={sPhone} onChange={(e) => setSPhone(e.target.value)} placeholder="(555) 000-0000" />
                </div>
                <div>
                  <label className={lblCls}>Email</label>
                  <input className={inpCls} value={sEmail} onChange={(e) => setSEmail(e.target.value)} placeholder="seller@email.com" type="email" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.75 mb-3.5">
                <div>
                  <label className={lblCls}>Mailing Address</label>
                  <input className={inpCls} value={sAddr} onChange={(e) => setSAddr(e.target.value)} placeholder="Street address (if different from property)" />
                </div>
                <div>
                  <label className={lblCls}>Recorded Doc No.</label>
                  <input
                    className={inpCls}
                    value={sDocNo}
                    onChange={(e) => setSDocNo(e.target.value)}
                    placeholder="e.g. 2021.70877"
                    style={{ background: sDocNo ? "var(--amber-50)" : "#fff" }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (!sFirst.trim() && !sLast.trim()) return;
                    setSellers((s) => [
                      ...s,
                      {
                        id: Date.now(),
                        name: [sFirst, sMid, sLast].filter(Boolean).join(" ") + ` (${sVest})`,
                      },
                    ]);
                    setSFirst("");
                    setSLast("");
                    setSMid("");
                    setSPhone("");
                    setSEmail("");
                    setSAddr("");
                  }}
                  className="inline-flex items-center gap-1.25 text-white border-none rounded-lg px-4 py-1.5 text-[11px] font-semibold cursor-pointer"
                  style={{ background: "var(--search-source-datatree)" }}
                >
                  <Icon name="plus" size={11} />
                  Add Seller
                </button>
                {sellers.length > 0 && (
                  <span className="text-[11px] text-text-tertiary self-center">
                    {sellers.length} seller{sellers.length > 1 ? "s" : ""} added
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {partyTab === "general" && (
          <div className={secCls}>
            <div className="text-[12px] font-extrabold text-text mb-3.5 flex items-center gap-1.75">
              <div className="w-[3px] h-4 rounded-sm" style={{ background: "var(--text-tertiary)" }} />
              Escrow & Title Information
            </div>
            <div className="grid grid-cols-2 gap-3.25">
              <div>
                <label className={lblCls}>Title Office</label>
                <input className={inpCls} value={titleOffice} onChange={(e) => setTitleOffice(e.target.value)} placeholder="Title office name" />
              </div>
              <div>
                <label className={lblCls}>Escrow Office</label>
                <input className={inpCls} value={escrowOffice} onChange={(e) => setEscrowOffice(e.target.value)} placeholder="Escrow company name" />
              </div>
              <div>
                <label className={lblCls}>Title Branch Review</label>
                <select className={inpCls} value={branch} onChange={(e) => setBranch(e.target.value)}>
                  <option>South Cal</option>
                  <option>North Cal</option>
                  <option>Central Cal</option>
                  <option>NorCal</option>
                </select>
              </div>
              <div>
                <label className={lblCls}>Loan Officer</label>
                <input className={inpCls} value={loanOfficer} onChange={(e) => setLoanOfficer(e.target.value)} placeholder="Loan officer name" />
              </div>
              <div>
                <label className={lblCls}>Lender / Bank</label>
                <input
                  className={inpCls}
                  value={lender}
                  onChange={(e) => setLender(e.target.value)}
                  placeholder="e.g. PARKSIDE LENDING LLC"
                  style={{ background: lender ? "var(--amber-50)" : "#fff" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-[999] p-4">
      <div
        className="bg-white w-full rounded-[18px] overflow-hidden shadow-2xl flex flex-col max-h-[94vh] transition-[max-width] duration-300"
        style={{ maxWidth: ms === -1 ? 600 : ms === 0 ? 660 : 1100 }}
      >
        {/* Modal header */}
        <div className="bg-header text-white px-5.5 py-3.5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
              <Icon name="search" size={15} className="text-white" />
            </div>
            <div>
              <div className="text-[14px] font-bold">Create New Order</div>
              <div className="text-[10px] text-text-muted mt-0.5">
                {ms === -1
                  ? "Choose how to create this order"
                  : ms === 0
                    ? "Search property via DataTree API"
                    : `Review and confirm property data — ${STEPS[ms]}`}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-text-tertiary text-[22px] cursor-pointer leading-none hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Step indicator */}
        {ms > 0 && (
          <div className="flex gap-1.25 px-5.5 pt-3 pb-0 border-b border-secondary shrink-0">
            {STEPS.slice(1).map((label, i) => {
              const n = i + 1;
              const active = ms === n;
              const done = ms > n;
              return (
                <button
                  key={n}
                  onClick={() => (n < ms ? setMs(n as CreateOrderStep) : undefined)}
                  className="flex items-center gap-1.25 px-3 py-1.75 rounded-t-lg text-[11px] font-semibold"
                  style={{
                    borderBottom: active
                      ? "2px solid var(--brand-primary)"
                      : done
                        ? "2px solid var(--status-success-emerald)"
                        : "2px solid transparent",
                    color: active
                      ? "var(--brand-primary)"
                      : done
                        ? "var(--status-success-emerald)"
                        : "var(--text-muted)",
                    background: active
                      ? "#fff5f5"
                      : done
                        ? "var(--status-success-bg)"
                        : "transparent",
                    cursor: n <= ms ? "pointer" : "default",
                  }}
                >
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold"
                    style={{
                      background: active
                        ? "var(--brand-primary)"
                        : done
                          ? "var(--status-success-emerald)"
                          : "var(--border-primary)",
                      color: active || done ? "#fff" : "var(--text-muted)",
                    }}
                  >
                    {done ? <Icon name="check" size={8} /> : n}
                  </div>
                  {n}. {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Landing */}
        {ms === -1 && (
          <div className="p-7.5 flex flex-col gap-2.5">
            <p className="m-0 mb-1.5 text-[13px] text-text-tertiary text-center">
              How would you like to create this order?
            </p>
            <button
              onClick={() => setMs(0)}
              className="flex items-center gap-4.5 p-5 border-2 border-border rounded-xl bg-white cursor-pointer text-left transition-all duration-180 w-full hover:border-brand hover:bg-[#fff5f5] hover:shadow-[0_4px_16px_rgba(139,0,0,.12)]"
            >
              <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center shrink-0">
                <Icon name="search" size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-bold text-text mb-1">Search by Property</div>
                <div className="text-[12px] text-text-tertiary leading-relaxed">
                  Search via <strong>DataTree API</strong> using APN, Address, Owner Name, or Property ID. All fields auto-populate from the data source.
                </div>
                <div className="flex flex-wrap gap-1.25 mt-2">
                  {["APN", "Address", "Full Address", "Owner Name", "Property ID", "Advanced"].map((t) => (
                    <span
                      key={t}
                      className="bg-secondary text-text-secondary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.05em]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <Icon name="arrowRight" size={16} className="text-brand shrink-0" />
            </button>
            <button
              onClick={() => setMs(1)}
              className="flex items-center gap-4.5 p-5 border-2 border-border rounded-xl bg-white cursor-pointer text-left transition-all duration-180 w-full hover:border-[var(--search-source-datatree)] hover:bg-[var(--blue-50)] hover:shadow-[0_4px_16px_rgba(3,105,161,.1)]"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "var(--search-source-datatree)" }}
              >
                <Icon name="file" size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-bold text-text mb-1">Enter Manually</div>
                <div className="text-[12px] text-text-tertiary leading-relaxed">
                  Skip the search and fill in the property details, legal information, and vesting yourself.
                </div>
                <div className="mt-2">
                  <span className="bg-[var(--blue-100)] text-[var(--search-source-datatree)] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.05em]">
                    Manual Entry
                  </span>
                  <span className="text-text-muted text-[10px] ml-2">No API call required</span>
                </div>
              </div>
              <Icon name="arrowRight" size={16} className="shrink-0" style={{ color: "var(--search-source-datatree)" }} />
            </button>
          </div>
        )}

        {/* Step 0: Search */}
        {ms === 0 && (
          <div className="p-6.5 flex flex-col gap-4.5">
            <div>
              <div className="text-[13px] font-bold text-text mb-3">Search by</div>
              <div className="flex flex-wrap gap-1.75">
                {SEARCH_TYPES.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => setSearchType(key)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[12px] font-semibold border cursor-pointer transition-all duration-150"
                    style={{
                      background: searchType === key ? "var(--brand-primary)" : "#fff",
                      borderColor: searchType === key ? "var(--brand-primary)" : "var(--border-primary)",
                      color: searchType === key ? "#fff" : "var(--text-secondary)",
                      boxShadow: searchType === key ? "0 2px 8px rgba(139,0,0,.2)" : "none",
                    }}
                  >
                    <Icon name={icon} size={12} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-secondary border border-border rounded-xl p-4">
              {renderSearchInputs()}
            </div>
            {searchErr && (
              <div className="flex items-center gap-1.75 bg-[#fff5f5] border border-[#fecaca] rounded-lg px-3.5 py-2.25 text-[11px] text-status-error">
                <Icon name="alertTri" size={13} /> {searchErr}
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3.5 py-2.25 text-[10px] text-blue-700 flex items-center gap-1.75">
              <Icon name="file" size={12} />
              Powered by <strong>DataTree API</strong> — POST /api/Report/GetReport · ProductName: PropertyDetailReport
            </div>
          </div>
        )}

        {/* Step 1: Property */}
        {ms === 1 && <div className="p-4.5 overflow-y-auto flex-1">{renderPropertyStep()}</div>}

        {/* Step 2: File Info */}
        {ms === 2 && (
          <div className="p-4.5 overflow-y-auto flex-1">
            <div className="bg-secondary rounded-xl p-4 border border-border">
              <div className="text-[13px] font-bold text-text mb-3.5">File Information</div>
              <div className="grid grid-cols-3 gap-3.25">
                <div>
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block">Client Name</label>
                  <select
                    className="w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  >
                    <option>Select Client</option>
                    <option>ABC Title</option>
                    <option>XYZ Escrow</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block">Client File No</label>
                  <input
                    className="w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none"
                    value={clientFileNo}
                    onChange={(e) => setClientFileNo(e.target.value)}
                    placeholder="File number"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block">Transaction Type</label>
                  <select
                    className="w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none"
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                  >
                    <option>Sale</option>
                    <option>Refinance</option>
                    <option>Construction</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block">Product Type</label>
                  <input
                    className="w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    placeholder="Product type"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block">Source of Business</label>
                  <input
                    className="w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none"
                    value={sourceOfBusiness}
                    onChange={(e) => setSourceOfBusiness(e.target.value)}
                    placeholder="Source"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block">Sale Price</label>
                  <input
                    className="w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-[#fffbeb] box-border outline-none"
                    value={form._lastSalePrice || ""}
                    readOnly
                    placeholder="$0.00"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block">Loan Amount</label>
                  <input
                    className="w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-[#fffbeb] box-border outline-none"
                    value={form._mtgAmt || ""}
                    readOnly
                    placeholder="$0.00"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block">Loan Number</label>
                  <input
                    className="w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none"
                    value={loanNumber}
                    onChange={(e) => setLoanNumber(e.target.value)}
                    placeholder="Loan #"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Parties */}
        {ms === 3 && renderPartiesStep()}

        {/* Footer */}
        <div className="border-t border-border px-5.5 py-3 flex justify-between items-center shrink-0 bg-[#fafafa]">
          {ms === -1 ? (
            <span className="text-[11px] text-text-muted">Select an option above to continue</span>
          ) : ms === 0 ? (
            <span className="text-[11px] text-text-muted">
              Tip: Try APN <strong>808-631-06</strong> for demo
            </span>
          ) : (
            <button
              onClick={() => setMs((s) => (s === 1 ? -1 : (s - 1) as CreateOrderStep))}
              className="inline-flex items-center gap-1.25 bg-white text-text-secondary border border-border rounded-lg px-3.5 py-1.5 text-[11px] font-semibold cursor-pointer hover:bg-secondary"
            >
              <Icon name="arrowLeft" size={11} />
              {ms === 1 ? "Change Method" : "Back"}
            </button>
          )}
          <div className="flex items-center gap-1.25">
            {[-1, 0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[5px] rounded-full transition-all duration-200"
                style={{
                  width: i === ms ? 18 : 5,
                  background: i === ms ? "var(--brand-primary)" : i < ms ? "var(--status-success-emerald)" : "var(--border-primary)",
                }}
              />
            ))}
          </div>
          {ms === -1 ? (
            <span />
          ) : ms === 0 ? (
            <button
              onClick={handleSearch}
              disabled={searching}
              className="inline-flex items-center gap-1.25 bg-brand text-white border-none rounded-lg px-3.5 py-1.5 text-[12px] font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {searching ? (
                <>
                  <Icon name="loader" size={12} className="animate-spin" />
                  Searching…
                </>
              ) : (
                <>
                  <Icon name="search" size={12} />
                  Search Property
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => {
                if (ms < 3) setMs((s) => (s + 1) as CreateOrderStep);
                else handleCreate();
              }}
              className="inline-flex items-center gap-1.25 bg-brand text-white border-none rounded-lg px-3.5 py-1.5 text-[12px] font-semibold cursor-pointer hover:bg-brand/90"
            >
              {ms === 3 ? "Create Order →" : "Next →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
