"use client";

import Icon from "@/components/common/icon";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  Input,
  Textarea,
  Select,
} from "@/components/ui";
import { useState } from "react";
import { RECIPIENTS, PREFILLS } from "../temp";
import type { SendPrelimModalProps } from "@/app/components/feature/tables/types";

export default function SendPrelimModal({
  onClose,
  docs,
}: SendPrelimModalProps) {
  const [to, setTo] = useState("title_officer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState(
    "Preliminary Report - Order No. 2026-000123",
  );
  const [message, setMessage] = useState(
    "Please find attached the Preliminary Report for the above referenced order.\n\nPlease review and advise of any additional requirements or exceptions.\n\nThank you.",
  );
  const [docSel, setDocSel] = useState(docs.length > 0 ? docs[0].name : "");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleToChange = (v: string) => {
    setTo(v);
    const p = PREFILLS[v] || { name: "", email: "" };
    setName(p.name);
    setEmail(p.email);
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1400);
  };

  const docOptions = docs.map((d) => ({ value: d.name, label: d.name }));
  docOptions.push({
    value: "__prelim__",
    label: "Preliminary Report - Auto-Generated",
  });
  docOptions.push({
    value: "__final__",
    label: "Final Prelim - Order 2026-000123.docx",
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        size="md"
        title="Send Preliminary Report"
        subtitle="Deliver document to Title Officer, Client, or Escrow"
        onClose={onClose}
      >
        {!sent ? (
          <div className="flex flex-col gap-4 p-5.5">
            <div>
              <label className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.07em] mb-1 block">
                Send To
              </label>
              <div className="flex flex-wrap gap-1.5">
                {RECIPIENTS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => handleToChange(r.value)}
                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-semibold border cursor-pointer transition-all duration-150 ${to === r.value ? "text-white" : "bg-white border-border text-text-secondary"}`}
                    style={
                      to === r.value
                        ? {
                            background: "var(--accent-data-trace)",
                            borderColor: "var(--accent-data-trace)",
                          }
                        : {}
                    }
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Recipient Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
              <Input
                label="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                type="email"
              />
            </div>
            <Input
              label="CC (optional)"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="cc@domain.com, cc2@domain.com"
            />
            <Select
              label="Attach Document"
              value={docSel}
              onChange={(e) => setDocSel(e.target.value)}
              options={docOptions}
            />
            <Input
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="resize-none leading-[1.6] font-inherit"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-10 gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: "var(--status-success-bg)" }}
            >
              <Icon
                name="checkCircle"
                size={32}
                className="text-status-success-emerald"
              />
            </div>
            <div className="text-center">
              <div className="text-[16px] font-bold text-text mb-1.5">
                Document Sent Successfully
              </div>
              <div className="text-[12px] text-text-secondary">
                <strong>
                  {docSel === "__prelim__"
                    ? "Preliminary Report"
                    : docSel === "__final__"
                      ? "Final Prelim"
                      : docSel}
                </strong>{" "}
                was sent to <strong>{name || email}</strong>
              </div>
              {cc && (
                <div className="text-[11px] text-text-muted mt-1">CC: {cc}</div>
              )}
            </div>
            <Button onClick={onClose} size="lg">
              Done
            </Button>
          </div>
        )}
        {!sent && (
          <DialogFooter className="bg-card-header">
            <span className="text-[11px] text-text-muted">
              Sending as:{" "}
              <strong className="text-text">
                John Smith - 805 Title Search
              </strong>
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={!email || !name || sending}
                style={{ background: "var(--accent-data-trace)" }}
              >
                {sending ? (
                  <>
                    <Icon name="loader" size={11} className="spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Icon name="mail" size={11} />
                    Send Document
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
