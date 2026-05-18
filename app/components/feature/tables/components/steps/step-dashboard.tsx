"use client";

import Icon from "@/components/common/icon";
import { statusStyle } from "../shared-atoms";
import { useState } from "react";
import { ORDERS, RECENT_FILES } from "../temp";
import type { CreateOrderModalProps } from "@/app/components/feature/tables/types";
import { Button, Card, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Dialog, DialogContent, DialogBody, DialogFooter, Input, Select, Textarea, Tabs, TabsList, TabsTrigger } from "@/components/ui";

function CreateOrderModal({ onClose }: CreateOrderModalProps) {
  const [ms, setMs] = useState(1);
  const steps = ["Property Information", "File Information", "Transaction Parties"];

  const sec = "bg-hover rounded-xl p-[18px] border border-border";

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="xl" title="Create New Order" subtitle="ATS Production Workflow" onClose={onClose}>
        <div className="flex gap-1.5 px-6 pt-[14px] border-b border-secondary shrink-0">
          {steps.map((label, i) => { const n = i + 1, active = ms === n, done = ms > n; return (<div key={n} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg text-[12px] font-semibold cursor-pointer ${active ? "border-b-2 border-b-brand text-brand bg-brand-subtle" : done ? "border-b-2 border-b-status-success-dark text-status-success-dark bg-status-success-green-50" : "border-b-2 border-b-transparent text-text-muted bg-transparent"}`} onClick={() => setMs(n)}><div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-bold ${active ? "bg-brand text-white" : done ? "bg-status-success-dark text-white" : "bg-border text-text-muted"}`}>{done ? <Icon name="check" size={9} /> : n}</div>{n}. {label}</div>); })}
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          {ms === 1 && (<div className="grid grid-cols-[3fr_2fr] gap-[18px]"><div><div className={sec}><div className="text-[13px] font-bold text-text mb-3.5">Property Information</div><div className="grid grid-cols-3 gap-2.75">{["Situs Address", "City", "State", "Zip Code", "County", "Assessor Vesting"].map((f) => (<div key={f}><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">{f}</label><Input placeholder={f} size="lg" /></div>))}</div></div><div className={`${sec} mt-3.5`}><div className="text-[13px] font-bold text-text mb-3.5">Legal Information</div><div className="grid grid-cols-4 gap-2.75">{["Lot", "Block", "Tract", "Map Book", "Page", "Section", "Township", "Range"].map((f) => (<div key={f}><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">{f}</label><Input placeholder="-" size="lg" /></div>))}</div></div></div><div className={sec}><div className="text-[13px] font-bold text-text mb-3.5">Parcel ID Information</div>{["APN 1", "APN 2", "APN 3", "APN 4"].map((f) => (<div key={f} className="mb-2.5"><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">{f}</label><Input placeholder="e.g. 123-456-789" size="lg" /></div>))}</div></div>)}
          {ms === 2 && (<div className={sec}><div className="text-[13px] font-bold text-text mb-3.5">File Information</div><div className="grid grid-cols-3 gap-[13px]"><div><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">Client Name</label><Select options={[{ value: "", label: "Select Client" }, { value: "ABC Title", label: "ABC Title" }, { value: "XYZ Escrow", label: "XYZ Escrow" }]} /></div><div><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">Client File No</label><Input placeholder="File number" size="lg" /></div><div><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">Transaction Type</label><Select options={[{ value: "Sale", label: "Sale" }, { value: "Refinance", label: "Refinance" }, { value: "Construction", label: "Construction" }]} /></div><div><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">Product Type</label><Input placeholder="Product type" size="lg" /></div><div><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">Source of Business</label><Input placeholder="Source" size="lg" /></div><div><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">Sale Price</label><Input placeholder="$0.00" size="lg" /></div><div><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">Loan Amount</label><Input placeholder="$0.00" size="lg" /></div><div><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">Loan Number</label><Input placeholder="Loan #" size="lg" /></div></div></div>)}
          {ms === 3 && (<div className={sec}><div className="text-[13px] font-bold text-text mb-3.5">Transaction Parties</div><div className="grid grid-cols-2 gap-[13px]"><div><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">Buyer Names</label><Textarea className="h-[78px] resize-none" placeholder="Enter buyer names..." size="lg" /></div><div><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">Seller Names</label><Textarea className="h-[78px] resize-none" placeholder="Enter seller names..." size="lg" /></div><div><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">Title Office</label><Input placeholder="Title office name" size="lg" /></div><div><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">Escrow Office</label><Input placeholder="Escrow office name" size="lg" /></div><div><label className="text-[10px] font-bold text-text-tertiary mb-1 block uppercase tracking-[0.05em]">Title Branch Review</label><Select options={[{ value: "South Cal", label: "South Cal" }, { value: "North Cal", label: "North Cal" }]} /></div></div></div>)}
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="secondary" onClick={() => setMs((s) => Math.max(1, s - 1))} disabled={ms === 1}>Back</Button>
        <div className="flex gap-1">{steps.map((_, i) => (<div key={i} className="h-1.5 rounded-full transition-all duration-200" style={{ width: i + 1 === ms ? 20 : 8, background: i + 1 === ms ? "var(--brand-primary)" : i + 1 < ms ? "var(--status-success-dark)" : "var(--border-primary)" }} />))}</div>
        <Button onClick={() => { if (ms < 3) setMs((s) => s + 1); else { alert("Order submitted successfully!"); onClose(); } }}>{ms === 3 ? "Submit Order" : "Next →"}</Button>
      </DialogFooter>
    </Dialog>
  );
}

export default function StepDashboard() {
  const [tab, setTab] = useState("Open");
  const [showModal, setShowModal] = useState(false);
  const filtered = tab === "All" ? ORDERS : ORDERS.filter((o) => o.status === tab);

  function statusToBadge(s: string): "success" | "info" | "error" | "warning" | "neutral" {
    if (s === "Open") return "success";
    if (s === "Closed") return "info";
    return "error";
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="w-60 shrink-0 bg-white border-r border-border overflow-y-auto p-4">
        <div className="text-[12px] font-bold text-text-secondary mb-3">Recent Worked Files</div>
        {RECENT_FILES.map((f) => (<div key={f.no} className="border border-border rounded-lg p-[11px] mb-2 cursor-pointer transition-[background] hover:bg-hover"><div className="flex justify-between items-center mb-1"><span className="text-[12px] font-bold text-text">{f.no}</span><Badge variant={statusToBadge(f.status)} size="sm">{f.status}</Badge></div><div className="text-[11px] text-text-secondary mb-0.5">{f.addr}</div><div className="text-[10px] text-text-muted">{f.owner}</div></div>))}
      </div>
      <div className="flex-1 overflow-y-auto p-[18px] flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {["Open", "Closed", "Cancelled", "All"].map((t) => (
              <Button key={t} variant={tab === t ? "primary" : "secondary"} onClick={() => setTab(t)}>{t} Files</Button>
            ))}
          </div>
          <Button onClick={() => setShowModal(true)}><Icon name="plus" size={12} />Create New Order</Button>
        </div>
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {["Order No.", "APN", "Address", "Owner", "County", "Status"].map((h) => (<TableHead key={h}>{h}</TableHead>))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((row, i) => (
                <TableRow key={i} className="cursor-pointer">
                  <TableCell className="font-semibold text-brand">{row.no}</TableCell>
                  <TableCell>{row.apn}</TableCell>
                  <TableCell>{row.addr}</TableCell>
                  <TableCell>{row.owner}</TableCell>
                  <TableCell>{row.county}</TableCell>
                  <TableCell><Badge variant={statusToBadge(row.status)}>{row.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
      {showModal && <CreateOrderModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
