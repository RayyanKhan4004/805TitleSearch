"use client";

import Icon from "@/components/common/icon";
import type { PropertyForm, PropertyData } from "@/app/components/feature/tables/types";
import SitusAddressForm from "../property/situs-address-form";
import ParcelIdForm from "../property/parcel-id-form";
import LegalInfoForm from "../property/legal-info-form";
import ShortLegalForm from "../property/short-legal-form";
import VestingForm from "../property/vesting-form";
import DatatreeSummary from "../property/datatree-summary";

interface StepPropertyInfoProps {
  form: PropertyForm;
  onChange: (k: keyof PropertyForm, v: string) => void;
  apiResult: PropertyData | null;
  onReSearch: () => void;
}

export default function StepPropertyInfo({ form, onChange, apiResult, onReSearch }: StepPropertyInfoProps) {
  return (
    <div className="p-4.5 overflow-y-auto flex-1">
      <div className="flex flex-col gap-3.5">
        {apiResult && (
          <div className="flex items-center gap-2 bg-status-success-bg border border-status-success-border rounded-lg px-3.5 py-2">
            <Icon name="checkCircle" size={14} className="text-status-success-emerald" />
            <span className="text-[11px] font-semibold text-status-success-text">
              Auto-populated from DataTree API — Property ID {apiResult.PropertyId}
            </span>
            <span className="text-[10px] text-text-muted ml-auto">
              {apiResult.LocationInformation?.NeighborhoodName} · {apiResult.SiteInformation?.LandUse} · APN {apiResult.SitusAddress?.APN}
            </span>
            <button
              onClick={onReSearch}
              className="bg-transparent border border-status-success-border text-status-success-text text-[10px] font-semibold px-2.5 py-0.5 rounded cursor-pointer hover:bg-status-success-bg/50"
            >
              Re-search
            </button>
          </div>
        )}
        <div className="grid grid-cols-[3fr_2fr] gap-3.5">
          <SitusAddressForm form={form} onChange={onChange} />
          <ParcelIdForm form={form} onChange={onChange} />
        </div>
        <div className="grid grid-cols-3 gap-3.5">
          <LegalInfoForm form={form} onChange={onChange} />
          <ShortLegalForm form={form} onChange={onChange} />
          <VestingForm form={form} onChange={onChange} />
        </div>
        <DatatreeSummary apiResult={apiResult} form={form} />
      </div>
    </div>
  );
}
