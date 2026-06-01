/* ═══════════════════════════════════════════════════
   Entity Color Schemes
   Source of truth for entity-specific colours.
   The hex values below should match the CSS variables
   in styles/entity-colors.css.
   ═══════════════════════════════════════════════════ */

export interface EntityScheme {
  bg: string;
  border: string;
  hover: string;
  childBg: string;
  childBorder: string;
  selectBg: string;
  selectColor: string;
  selectBorder: string;
}

export const SCHEMES: Record<string, EntityScheme> = {
  XFER: {
    bg: "#f7fdf9",
    border: "#86efac",
    hover: "#f0fdf4",
    childBg: "#f0fdf4",
    childBorder: "#bbf7d0",
    selectBg: "#f7fdf9",
    selectColor: "#15803d",
    selectBorder: "#bbf7d0",
  },
  DOT: {
    bg: "#fffdf5",
    border: "#fcd34d",
    hover: "#fffbeb",
    childBg: "#fffbeb",
    childBorder: "#fde68a",
    selectBg: "#fffdf5",
    selectColor: "#92400e",
    selectBorder: "#fde68a",
  },
  LIEN: {
    bg: "#fff9f5",
    border: "#fca5a5",
    hover: "#fff7ed",
    childBg: "#fff1f0",
    childBorder: "#fecaca",
    selectBg: "#fff9f5",
    selectColor: "#b91c1c",
    selectBorder: "#fecaca",
  },
  EASE: {
    bg: "#f5f9ff",
    border: "#93c5fd",
    hover: "#eff6ff",
    childBg: "#eff6ff",
    childBorder: "#bfdbfe",
    selectBg: "#f5f9ff",
    selectColor: "#1d4ed8",
    selectBorder: "#bfdbfe",
  },
  BANKR: {
    bg: "#fdf8ff",
    border: "#d8b4fe",
    hover: "#fdf4ff",
    childBg: "#faf5ff",
    childBorder: "#e9d5ff",
    selectBg: "#fdf8ff",
    selectColor: "#7e22ce",
    selectBorder: "#e9d5ff",
  },
  MISC: {
    bg: "#fafafa",
    border: "#cbd5e1",
    hover: "#f8fafc",
    childBg: "#f8fafc",
    childBorder: "#e2e8f0",
    selectBg: "#f8fafc",
    selectColor: "#475569",
    selectBorder: "#cbd5e1",
  },
};

/* ── Legend items for the colour legend strip ── */
export const LEGEND_ITEMS = [
  { label: "Transfers",            bg: SCHEMES.XFER.bg,  border: SCHEMES.XFER.border },
  { label: "DOTs",                 bg: SCHEMES.DOT.bg,   border: SCHEMES.DOT.border },
  { label: "Liens & Judgments",    bg: SCHEMES.LIEN.bg,  border: SCHEMES.LIEN.border },
  { label: "Easements",            bg: SCHEMES.EASE.bg,  border: SCHEMES.EASE.border },
  { label: "Bankruptcy / Probate", bg: SCHEMES.BANKR.bg, border: SCHEMES.BANKR.border },
  { label: "Miscellaneous",        bg: SCHEMES.MISC.bg,  border: SCHEMES.MISC.border },
];

/* ── entityStyle: inline style object for the Entity <select> ── */
export function entityStyle(entity: string): React.CSSProperties {
  const s = SCHEMES[entity];
  if (!s) return {
    background: "var(--card-header)",
    color: "var(--text-secondary)",
    borderColor: "var(--border)",
  };
  return {
    background: s.selectBg,
    color: s.selectColor,
    borderColor: s.selectBorder,
  };
}

/* ── rowScheme: returns background / border / hover for a row at given depth ── */
export function rowScheme(entity: string, depth: number) {
  const s = SCHEMES[entity] || SCHEMES.MISC;
  if (depth === 0) return { bg: s.bg, border: s.border, hover: s.hover };
  if (depth === 1) return { bg: s.childBg, border: s.childBorder, hover: s.hover };
  return {
    bg: s.childBg,
    border: s.childBorder,
    hover: s.hover,
  };
}

/* ── scheme: simplified lookup used by IndexCard tree walker ── */
export function scheme(entity: string, depth: number) {
  const s = SCHEMES[entity] || SCHEMES.MISC;
  if (depth === 0) return s;
  return { bg: s.childBg, border: s.childBorder, hover: s.hover };
}
