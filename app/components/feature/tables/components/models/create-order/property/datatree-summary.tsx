"use client";

import type { PropertyForm, PropertyData } from "@/app/components/feature/tables/types";

interface DatatreeSummaryProps {
  apiResult: PropertyData | null;
  form: PropertyForm;
}

export default function DatatreeSummary({ apiResult, form }: DatatreeSummaryProps) {
  if (!apiResult) return null;
  return (
    <div className="bg-header rounded-lg p-3 flex flex-wrap gap-4">
      <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] self-center mr-1">From DataTree</span>
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
        .filter(([, v]) => v && v !== "-" && !String(v).startsWith("undefined"))
        .map(([k, v]) => (
          <div key={k as string}>
            <div className="text-[8px] font-bold text-text-tertiary uppercase tracking-[0.06em]">{k}</div>
            <div className="text-[11px] font-semibold text-header-search-text">{v}</div>
          </div>
        ))}
    </div>
  );
}
