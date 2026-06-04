"use client";

import Icon from "@/components/common/icon";
import type { SearchType } from "@/app/components/feature/tables/types";
import ApnSearch from "../searches/apn-search";
import AddressSearch from "../searches/address-search";
import FullAddressSearch from "../searches/full-address-search";
import OwnerNameSearch from "../searches/owner-name-search";
import PropertyIdSearch from "../searches/property-id-search";
import AdvancedSearch from "../searches/advanced-search";

interface StepPropertySearchProps {
  searchType: SearchType;
  onSearchTypeChange: (t: SearchType) => void;
  apnInput: string;
  zipInput: string;
  onApnChange: (v: string) => void;
  onZipChange: (v: string) => void;
  addrNum: string;
  addrStr: string;
  addrCity: string;
  addrState: string;
  addrZip: string;
  onAddrNumChange: (v: string) => void;
  onAddrStrChange: (v: string) => void;
  onAddrCityChange: (v: string) => void;
  onAddrStateChange: (v: string) => void;
  onAddrZipChange: (v: string) => void;
  fullAddr: string;
  onFullAddrChange: (v: string) => void;
  ownerName: string;
  onOwnerNameChange: (v: string) => void;
  propId: string;
  onPropIdChange: (v: string) => void;
  advCounty: string;
  advYear: string;
  advBeds: string;
  onAdvCountyChange: (v: string) => void;
  onAdvYearChange: (v: string) => void;
  onAdvBedsChange: (v: string) => void;
  onSearch: () => void;
  searching: boolean;
  searchErr: string;
}

const SEARCH_TYPES: { key: SearchType; label: string; icon: string }[] = [
  { key: "APN", label: "APN", icon: "hash" },
  { key: "Address", label: "Address", icon: "mapPin" },
  { key: "FullAddress", label: "Full Address", icon: "mapPin" },
  { key: "OwnerName", label: "Owner Name", icon: "user" },
  { key: "PropertyId", label: "Property ID", icon: "file" },
  { key: "Advanced", label: "Advanced", icon: "settings" },
];

export default function StepPropertySearch({
  searchType, onSearchTypeChange,
  apnInput, zipInput, onApnChange, onZipChange,
  addrNum, addrStr, addrCity, addrState, addrZip,
  onAddrNumChange, onAddrStrChange, onAddrCityChange, onAddrStateChange, onAddrZipChange,
  fullAddr, onFullAddrChange,
  ownerName, onOwnerNameChange,
  propId, onPropIdChange,
  advCounty, advYear, advBeds, onAdvCountyChange, onAdvYearChange, onAdvBedsChange,
  onSearch, searching, searchErr,
}: StepPropertySearchProps) {
  return (
    <div className="p-6.5 flex flex-col gap-4.5">
      <div>
        <div className="text-[13px] font-bold text-text mb-3">Search by</div>
        <div className="flex flex-wrap gap-1.75">
          {SEARCH_TYPES.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => onSearchTypeChange(key)}
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
        {searchType === "APN" && <ApnSearch apnInput={apnInput} zipInput={zipInput} onApnChange={onApnChange} onZipChange={onZipChange} />}
        {searchType === "Address" && (
          <AddressSearch
            addrNum={addrNum} addrStr={addrStr} addrCity={addrCity} addrState={addrState} addrZip={addrZip}
            onNumChange={onAddrNumChange} onStrChange={onAddrStrChange}
            onCityChange={onAddrCityChange} onStateChange={onAddrStateChange} onZipChange={onAddrZipChange}
          />
        )}
        {searchType === "FullAddress" && <FullAddressSearch value={fullAddr} onChange={onFullAddrChange} />}
        {searchType === "OwnerName" && <OwnerNameSearch ownerName={ownerName} state={addrState} onNameChange={onOwnerNameChange} onStateChange={onAddrStateChange} />}
        {searchType === "PropertyId" && <PropertyIdSearch value={propId} onChange={onPropIdChange} />}
        {searchType === "Advanced" && (
          <AdvancedSearch county={advCounty} yearBuilt={advYear} bedrooms={advBeds}
            onCountyChange={onAdvCountyChange} onYearChange={onAdvYearChange} onBedsChange={onAdvBedsChange}
          />
        )}
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
  );
}
