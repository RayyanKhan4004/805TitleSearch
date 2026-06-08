"use client";

interface Props {
  filteredLength: number;
  safePage: number;
  pageSize: number;
  totalPages: number;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setCurrentPage: (page: number) => void;
}

export default function PaginationControls({
  filteredLength, safePage, pageSize, totalPages, goToPage, setPageSize, setCurrentPage,
}: Props) {
  if (filteredLength === 0) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--text-tertiary)" }}>
        <span>
          Showing <strong>{(safePage - 1) * pageSize + 1}</strong> to{" "}
          <strong>{Math.min(safePage * pageSize, filteredLength)}</strong> of{" "}
          <strong>{filteredLength}</strong> entries
        </span>
        <select
          value={pageSize}
          onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1) }}
          style={{
            fontSize: 11, padding: "4px 8px", borderRadius: 6,
            border: "1px solid var(--border-primary)", background: "var(--color-white)",
            color: "var(--text-secondary)", cursor: "pointer", outline: "none",
          }}
        >
          <option value={10}>10 / page</option>
          <option value={25}>25 / page</option>
          <option value={50}>50 / page</option>
          <option value={100}>100 / page</option>
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <PageBtn onClick={() => goToPage(1)} disabled={safePage === 1}>‹‹</PageBtn>
        <PageBtn onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>‹</PageBtn>

        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let pageNum: number;
          if (totalPages <= 7) {
            pageNum = i + 1;
          } else if (safePage <= 4) {
            pageNum = i + 1;
          } else if (safePage >= totalPages - 3) {
            pageNum = totalPages - 6 + i;
          } else {
            pageNum = safePage - 3 + i;
          }
          const isActive = pageNum === safePage;
          return (
            <button
              key={pageNum}
              onClick={() => goToPage(pageNum)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                minWidth: 30, height: 30, padding: "0 6px", borderRadius: 6,
                border: isActive ? "1px solid var(--brand-primary)" : "1px solid var(--border-primary)",
                background: isActive ? "var(--brand-primary)" : "var(--color-white)",
                color: isActive ? "var(--color-white)" : "var(--text-secondary)",
                cursor: "pointer", fontSize: 11, fontWeight: isActive ? 700 : 500,
              }}
            >
              {pageNum}
            </button>
          );
        })}

        <PageBtn onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}>›</PageBtn>
        <PageBtn onClick={() => goToPage(totalPages)} disabled={safePage === totalPages}>››</PageBtn>
      </div>
    </div>
  );
}

function PageBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 30, height: 30, borderRadius: 6, border: "1px solid var(--border-primary)",
        background: disabled ? "var(--bg-table-header)" : "var(--color-white)",
        color: disabled ? "var(--text-disabled)" : "var(--text-secondary)",
        cursor: disabled ? "default" : "pointer", fontSize: 12, fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}
