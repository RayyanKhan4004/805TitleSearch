"use client";

interface AdvancedSearchProps {
  county: string;
  yearBuilt: string;
  bedrooms: string;
  onCountyChange: (v: string) => void;
  onYearChange: (v: string) => void;
  onBedsChange: (v: string) => void;
}

const STATES = ["CA", "NV", "AZ", "TX", "OR", "WA"];
const COUNTIES = [
  "ALAMEDA", "ALPINE", "AMADOR", "BUTTE", "CALAVERAS", "COLUSA", "CONTRA COSTA",
  "DEL NORTE", "EL DORADO", "FRESNO", "GLENN", "HUMBOLDT", "IMPERIAL", "INYO",
  "KERN", "KINGS", "LAKE", "LASSEN", "LOS ANGELES", "MADERA", "MARIN", "MARIPOSA",
  "MENDOCINO", "MERCED", "MODOC", "MONO", "MONTEREY", "NAPA", "NEVADA", "ORANGE",
  "PLACER", "PLUMAS", "RIVERSIDE", "SACRAMENTO", "SAN BENITO", "SAN BERNARDINO",
  "SAN DIEGO", "SAN FRANCISCO", "SAN JOAQUIN", "SAN LUIS OBISPO", "SAN MATEO",
  "SANTA BARBARA", "SANTA CLARA", "SANTA CRUZ", "SHASTA", "SIERRA", "SISKIYOU",
  "SOLANO", "SONOMA", "STANISLAUS", "SUTTER", "TEHAMA", "TRINITY", "TULARE",
  "TUOLUMNE", "VENTURA", "YOLO", "YUBA",
];

const inpCls = "w-full border border-border-input rounded-lg px-3 py-2 text-[12px] text-text bg-white outline-none box-border";
const lblCls = "text-[10px] font-bold text-text-secondary mb-1 block uppercase tracking-[0.05em]";

export default function AdvancedSearch({ county, yearBuilt, bedrooms, onCountyChange, onYearChange, onBedsChange }: AdvancedSearchProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div>
        <label className={lblCls}>County</label>
        <select className={inpCls} value={county} onChange={(e) => onCountyChange(e.target.value)}>
          {COUNTIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={lblCls}>Year Built</label>
        <input className={inpCls} value={yearBuilt} onChange={(e) => onYearChange(e.target.value)} placeholder="e.g. 1979" />
      </div>
      <div>
        <label className={lblCls}>Bedrooms</label>
        <input className={inpCls} value={bedrooms} onChange={(e) => onBedsChange(e.target.value)} placeholder="e.g. 5" />
      </div>
    </div>
  );
}
