"use client";

import Icon from "@/components/common/icon";
import { CardHead } from "../shared-atoms";
import { Button, Card, CardContent, Badge, Progress } from "@/components/ui";

export default function StepReview() {
  const sections = [
    { label: "Chain", items: [["Documents", "10 found"], ["Open Liens", "2 flagged"], ["Exceptions", "5 added"]] },
    { label: "Deeds", items: [["Quitclaim Deed", "2019-0098234"], ["Grant Deed", "2023-0212342"]] },
    { label: "DOT", items: [["Open Lien — Bank of America", "2025-0213146"], ["Released — Wells Fargo", "2020-0044512"]] },
    { label: "Documents", items: [["Attached Files", "5"], ["Notes", "3"]] },
  ];
  const checks = [
    { label: "Title chain reviewed", ok: true },
    { label: "Open liens identified", ok: true },
    { label: "Exceptions noted", ok: true },
    { label: "Supporting documents uploaded", ok: true },
    { label: "Notes added", ok: true },
    { label: "Ready for submission", ok: true },
  ];
  const pct = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);

  return (
    <div className="grid grid-cols-2 gap-[18px]">
      <Card>
        <CardHead title="Order Summary" sub="Review all data before generating documents" />
        <CardContent className="flex flex-col gap-4">
          {sections.map((s) => (<div key={s.label}><div className="text-[9px] font-extrabold text-text-muted uppercase tracking-[0.1em] mb-1.5">{s.label}</div><div className="border-l-2 border-light pl-3 flex flex-col gap-1.25">{s.items.map(([k, v]) => (<div key={k} className="flex justify-between items-center"><span className="text-[11px] text-text-secondary">{k}</span><span className="text-[11px] font-semibold text-text">{v}</span></div>))}</div></div>))}
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3.5">
        <Card>
          <CardHead title="Readiness Checklist" sub="All items should pass before submission" />
          <div className="p-4 flex flex-col gap-[7px]">
            {checks.map((c, i) => (<div key={i} className={`flex items-center gap-2.25 px-[11px] py-2 rounded-lg border ${c.ok ? "border-status-success-border bg-status-success-bg" : "border-status-warning-border bg-status-warning-bg"}`}><Icon name={c.ok ? "checkCircle" : "alertTri"} size={14} className={`shrink-0 ${c.ok ? "text-status-success-emerald" : "text-status-warning-text"}`} /><span className={`text-[11px] font-medium ${c.ok ? "text-status-success-text" : "text-status-warning-text"}`}>{c.label}</span></div>))}
            <div className="flex items-center gap-2.25 mt-0.5">
              <Progress value={pct} size="sm" color="success" className="flex-1" />
              <span className="text-[11px] font-semibold text-text-secondary whitespace-nowrap">{checks.filter((c) => c.ok).length}/{checks.length} ready</span>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-[18px] flex flex-col gap-2.25">
            <div className="text-[9px] font-bold text-text-muted uppercase tracking-[0.1em]">Order Actions</div>
            <Button variant="secondary" className="w-full justify-center px-4 py-2.5">
              <Icon name="save" size={12} />Save &amp; Close Order
            </Button>
            <Button variant="success" className="w-full justify-center px-4 py-3 text-[12px]">
              <Icon name="checkCircle" size={13} />Submit Order
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
