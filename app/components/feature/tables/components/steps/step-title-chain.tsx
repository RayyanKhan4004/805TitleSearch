"use client";

import Icon from "@/components/common/icon";
import IndexCard from "../index-card";
import { S } from "../shared-atoms";
import { useState } from "react";
import ManualSearchModal from "../models/manual-search-modal";
import { INDEX_SECTIONS } from "../consts";

export default function StepTitleChain() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between px-0.5 pb-3 border-b border-border mb-1">
        <div><h2 className="m-0 text-[15px] font-bold text-text">Index Review</h2><p className="m-0 text-[11px] text-text-muted mt-0.5">{INDEX_SECTIONS.length} sections · Review all recorded documents by category</p></div>
        <div className="flex gap-1.5"><button className={`${S.white} flex items-center gap-1.25`}><Icon name="refresh" size={11} />Refresh All</button><button className={`${S.red} flex items-center gap-1.25`}><Icon name="fileCheck" size={11} />Generate Exceptions</button></div>
      </div>
      {INDEX_SECTIONS.map((sec) => (<IndexCard key={sec.title} title={sec.title} sub={sec.sub} accent={sec.accent} initRows={sec.rows} />))}
      <div className="sticky bottom-0 z-5 bg-white border border-border rounded-lg flex items-center gap-2 px-4 py-2.5 mt-2.5" style={{ boxShadow: "var(--shadow-card)" }}>
        <button onClick={() => setShowSearch(true)} className={`${S.red} flex items-center gap-1.25 px-4.5 py-2 text-[12px]`}><Icon name="search" size={12} />Manual Search</button>
        <label className={`inline-flex items-center gap-1.25 ${S.white} text-[12px] cursor-pointer px-3.5 py-1.5`}><Icon name="upload" size={12} />Upload<input type="file" className="hidden" multiple /></label>
        <div className="flex-1" />
        <button className={`${S.white} flex items-center gap-1.25 text-[12px] px-4 py-1.5`}><Icon name="save" size={12} />Save</button>
        <button className="flex items-center gap-1.25 bg-header text-white border-none rounded-lg px-4 py-1.5 text-[12px] font-semibold cursor-pointer"><Icon name="save" size={12} />Save / Close</button>
      </div>
      {showSearch && <ManualSearchModal onClose={() => setShowSearch(false)} />}
    </div>
  );
}

export { INDEX_SECTIONS };
