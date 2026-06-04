"use client";

interface PartyBadgeListProps {
  label: string;
  names: string[];
}

export default function PartyBadgeList({ label, names }: PartyBadgeListProps) {
  if (!names.length) return null;
  return (
    <div className="mb-1.5 last:mb-0">
      <span className="text-[8px] font-bold text-text-muted uppercase tracking-[0.06em] mr-1.5">{label}:</span>
      {names.map((n, i) => (
        <span key={i} className="inline-block bg-[var(--accent-blue-subtle,#eef2ff)] text-text text-[10px] font-semibold px-[6px] py-[2px] rounded-full mr-1 mb-[2px]">
          {n}
        </span>
      ))}
    </div>
  );
}
