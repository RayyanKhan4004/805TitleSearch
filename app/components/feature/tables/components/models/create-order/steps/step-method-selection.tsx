"use client";

import Icon from "@/components/common/icon";

interface StepMethodSelectionProps {
  onSelectSearch: () => void;
  onSelectManual: () => void;
}

export default function StepMethodSelection({ onSelectSearch, onSelectManual }: StepMethodSelectionProps) {
  return (
    <div className="p-7.5 flex flex-col gap-2.5">
      <p className="m-0 mb-1.5 text-[13px] text-text-tertiary text-center">How would you like to create this order?</p>
      <button
        onClick={onSelectSearch}
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
              <span key={t} className="bg-secondary text-text-secondary text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.05em]">{t}</span>
            ))}
          </div>
        </div>
        <Icon name="arrowRight" size={16} className="text-brand shrink-0" />
      </button>
      <button
        onClick={onSelectManual}
        className="flex items-center gap-4.5 p-5 border-2 border-border rounded-xl bg-white cursor-pointer text-left transition-all duration-180 w-full hover:border-[var(--search-source-datatree)] hover:bg-[var(--blue-50)] hover:shadow-[0_4px_16px_rgba(3,105,161,.1)]"
      >
        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--search-source-datatree)" }}>
          <Icon name="file" size={22} className="text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-bold text-text mb-1">Enter Manually</div>
          <div className="text-[12px] text-text-tertiary leading-relaxed">
            Skip the search and fill in the property details, legal information, and vesting yourself.
          </div>
          <div className="mt-2">
            <span className="bg-[var(--blue-100)] text-[var(--search-source-datatree)] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-[0.05em]">Manual Entry</span>
            <span className="text-text-muted text-[10px] ml-2">No API call required</span>
          </div>
        </div>
        <Icon name="arrowRight" size={16} className="shrink-0" style={{ color: "var(--search-source-datatree)" }} />
      </button>
    </div>
  );
}
