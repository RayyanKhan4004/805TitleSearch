"use client";

import Icon from "@/components/common/icon";
import IndexCard from "../index-card";
import { Button } from "@/components/ui";
import { useState } from "react";
import ManualSearchModal from "../models/manual-search-modal";
import { INDEX_SECTIONS } from "../consts";

export default function StepTitleChain() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between px-0.5 pb-3 border-b border-border mb-1">
        <div><h2 className="m-0 text-[15px] font-bold text-text">Index Review</h2><p className="m-0 text-[11px] text-text-muted mt-0.5">{INDEX_SECTIONS.length} sections · Review all recorded documents by category</p></div>
        <div className="flex gap-1.5"><Button variant="secondary"><Icon name="refresh" size={11} />Refresh All</Button><Button><Icon name="fileCheck" size={11} />Generate Exceptions</Button></div>
      </div>
      {INDEX_SECTIONS.map((sec) => (<IndexCard key={sec.title} title={sec.title} sub={sec.sub} accent={sec.accent} initRows={sec.rows} />))}
      <div className="sticky bottom-0 z-5 bg-white border border-border rounded-lg flex items-center gap-2 px-4 py-2.5 mt-2.5" style={{ boxShadow: "var(--shadow-card)" }}>
        <Button onClick={() => setShowSearch(true)} size="lg"><Icon name="search" size={12} />Manual Search</Button>
        <label className="inline-flex items-center gap-1.25 bg-white text-text-secondary border border-border rounded-lg px-3.5 py-1.5 text-[12px] font-semibold cursor-pointer"><Icon name="upload" size={12} />Upload<input type="file" className="hidden" multiple /></label>
        <div className="flex-1" />
        <Button variant="secondary" size="lg"><Icon name="save" size={12} />Save</Button>
        <Button size="lg" style={{ background: "var(--header-bg)", color: "var(--header-text)" }}><Icon name="save" size={12} />Save / Close</Button>
      </div>
      {showSearch && <ManualSearchModal onClose={() => setShowSearch(false)} />}
    </div>
  );
}

export { INDEX_SECTIONS };
