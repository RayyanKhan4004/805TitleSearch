"use client";

import type { PropertyForm } from "@/app/components/feature/tables/types";

interface SitusAddressFormProps {
  form: PropertyForm;
  onChange: (k: keyof PropertyForm, v: string) => void;
}

const inpCls = "w-full border border-border-input rounded-[7px] px-2.5 py-1.5 text-[11px] text-text bg-white box-border outline-none";
const lblCls = "text-[9px] font-bold text-text-muted uppercase tracking-[0.07em] mb-[3px] block";

export default function SitusAddressForm({ form, onChange }: SitusAddressFormProps) {
  return (
    <div className="bg-secondary rounded-xl p-4 border border-border">
      <div className="text-[12px] font-extrabold text-text mb-3.5 flex items-center gap-1.75">
        <div className="w-[3px] h-4 rounded-sm" style={{ background: "var(--brand-primary)" }} />
        Situs Address
      </div>
      <div className="grid grid-cols-[80px_90px_1fr_80px] gap-2.25 mb-2.25">
        <div>
          <label className={lblCls}>Addr No.</label>
          <input className={inpCls} value={form.addrNo} onChange={(e) => onChange("addrNo", e.target.value)} placeholder="27901" />
        </div>
        <div>
          <label className={lblCls}>Dir Prefix</label>
          <select className={inpCls} value={form.dirPrefix} onChange={(e) => onChange("dirPrefix", e.target.value)}>
            <option value="">None</option>
            {["N", "S", "E", "W", "NE", "NW", "SE", "SW"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lblCls}>Street Name</label>
          <input className={inpCls} value={form.streetName} onChange={(e) => onChange("streetName", e.target.value)} placeholder="ENCANTO" />
        </div>
        <div>
          <label className={lblCls}>Suffix</label>
          <select className={inpCls} value={form.suffix} onChange={(e) => onChange("suffix", e.target.value)}>
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
          <select className={inpCls} value={form.postDir} onChange={(e) => onChange("postDir", e.target.value)}>
            <option value="">None</option>
            {["N", "S", "E", "W", "NE", "NW", "SE", "SW"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lblCls}>Unit Type</label>
          <select className={inpCls} value={form.unitType} onChange={(e) => onChange("unitType", e.target.value)}>
            <option value="">None</option>
            {["Apt", "Suite", "Unit", "#", "Bldg", "Floor", "Lot", "Sp"].map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lblCls}>Unit No.</label>
          <input className={inpCls} value={form.unitNo} onChange={(e) => onChange("unitNo", e.target.value)} placeholder="2" />
        </div>
        <div>
          <label className={lblCls}>City</label>
          <input className={inpCls} value={form.city} onChange={(e) => onChange("city", e.target.value)} placeholder="MISSION VIEJO" />
        </div>
      </div>
      <div className="grid grid-cols-[70px_100px_1fr] gap-2.25">
        <div>
          <label className={lblCls}>State</label>
          <select className={inpCls} value={form.state} onChange={(e) => onChange("state", e.target.value)}>
            {["CA", "NV", "AZ", "TX", "OR", "WA", "CO", "FL", "NY"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={lblCls}>Zip Code</label>
          <input className={inpCls} value={form.zip} onChange={(e) => onChange("zip", e.target.value)} placeholder="92692" />
        </div>
        <div>
          <label className={lblCls}>County</label>
          <select className={inpCls} value={form.county} onChange={(e) => onChange("county", e.target.value)}>
            {["ALAMEDA", "ALPINE", "AMADOR", "BUTTE", "CALAVERAS", "COLUSA", "CONTRA COSTA", "DEL NORTE", "EL DORADO", "FRESNO", "GLENN", "HUMBOLDT", "IMPERIAL", "INYO", "KERN", "KINGS", "LAKE", "LASSEN", "LOS ANGELES", "MADERA", "MARIN", "MARIPOSA", "MENDOCINO", "MERCED", "MODOC", "MONO", "MONTEREY", "NAPA", "NEVADA", "ORANGE", "PLACER", "PLUMAS", "RIVERSIDE", "SACRAMENTO", "SAN BENITO", "SAN BERNARDINO", "SAN DIEGO", "SAN FRANCISCO", "SAN JOAQUIN", "SAN LUIS OBISPO", "SAN MATEO", "SANTA BARBARA", "SANTA CLARA", "SANTA CRUZ", "SHASTA", "SIERRA", "SISKIYOU", "SOLANO", "SONOMA", "STANISLAUS", "SUTTER", "TEHAMA", "TRINITY", "TULARE", "TUOLUMNE", "VENTURA", "YOLO", "YUBA"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
