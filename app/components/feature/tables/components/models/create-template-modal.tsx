"use client";

import Icon from "@/components/common/icon";
import { Button, Dialog, DialogContent, DialogBody, DialogFooter, Textarea } from "@/components/ui";
import { useState } from "react";
import { EXAMPLE_TEMPLATES } from "../consts";
import type { CreateTemplateModalProps } from "@/app/components/feature/tables/types";

export default function CreateTemplateModal({ onClose, onSave }: CreateTemplateModalProps) {
  const [screen, setScreen] = useState<"picker" | "editor">("picker");
  const [selected, setSelected] = useState<{ name: string; color: string; icon: string; body?: string } | null>(null);
  const [body, setBody] = useState("");
  const [tname, setTname] = useState("");
  const [saved, setSaved] = useState(false);

  const choose = (tpl: (typeof EXAMPLE_TEMPLATES)[number]) => {
    setSelected(tpl);
    setBody(tpl.body);
    setTname(tpl.name);
    setScreen("editor");
  };

  const chooseBlank = () => {
    setSelected({ name: "Blank Template", color: "var(--text-tertiary)", icon: "file" });
    setBody("");
    setTname("New Template");
    setScreen("editor");
  };

  const handleSave = () => {
    if (!tname.trim() || !body.trim()) return;
    setSaved(true);
    setTimeout(() => {
      onSave({ name: tname.replace(/\.pdf$|\.docx$/i, "") + ".docx", date: new Date().toLocaleDateString("en-US"), size: "—", type: "template", body });
      onClose();
    }, 900);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent size="lg" title={screen === "picker" ? "Create Template" : `Editing: ${selected?.name}`} subtitle={screen === "picker" ? "Choose an example template or start from blank" : "Customize your template and save"} onClose={onClose}>
        {screen === "picker" && (
          <div className="flex flex-col gap-[18px] p-[22px]">
            <div className="text-[12px] font-bold text-text">Example Templates</div>
            <div className="grid grid-cols-2 gap-3.5">
              {EXAMPLE_TEMPLATES.map((tpl) => (
                <div key={tpl.id} onClick={() => choose(tpl)} className="border border-border rounded-xl p-[18px] cursor-pointer transition-all duration-150 bg-card-header relative hover:bg-white" style={{ "--tpl-color": tpl.color } as React.CSSProperties} onMouseEnter={(e) => { e.currentTarget.style.borderColor = tpl.color; e.currentTarget.style.background = "var(--color-white)"; e.currentTarget.style.boxShadow = `0 4px 16px ${tpl.color}22`; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--card-header)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: tpl.color + "18", border: `1px solid ${tpl.color}33` }}><Icon name={tpl.icon} size={18} style={{ color: tpl.color }} /></div>
                    <span className="uppercase tracking-[0.06em] text-[9px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: tpl.color + "18", color: tpl.color }}>{tpl.badge}</span>
                  </div>
                  <div className="text-[13px] font-bold text-text mb-1">{tpl.name}</div>
                  <div className="text-[11px] text-text-secondary leading-[1.5]">{tpl.desc}</div>
                  <div className="mt-3 flex items-center gap-1.25 text-[11px] font-semibold" style={{ color: tpl.color }}><Icon name="plus" size={11} />Use this template</div>
                </div>
              ))}
            </div>
            <div onClick={chooseBlank} className="border-2 border-dashed border-border rounded-xl p-4 cursor-pointer flex items-center gap-3.5 transition-all duration-150 hover:border-brand hover:bg-brand-subtle">
              <div className="w-9 h-9 rounded-lg bg-page flex items-center justify-center"><Icon name="plus" size={18} className="text-text-muted" /></div>
              <div><div className="text-[12px] font-bold text-text-secondary">Start from Blank</div><div className="text-[11px] text-text-muted">Create a completely custom template</div></div>
            </div>
          </div>
        )}
        {screen === "editor" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-[22px] py-2.5 border-b border-light bg-card-header flex items-center gap-2.5 shrink-0">
              <div className="flex-1"><input value={tname} onChange={(e) => setTname(e.target.value)} placeholder="Template name…" className="font-bold text-[13px] border-none bg-transparent px-0 py-0.5 text-text outline-none w-full" /></div>
              <div className="flex gap-1.5 items-center">
                <span className="text-[10px] text-text-muted">{body.length} chars</span>
                <label className="inline-flex items-center gap-1.25 bg-white text-text-secondary border border-border rounded-lg px-3 py-1.5 text-[11px] font-semibold cursor-pointer"><Icon name="upload" size={11} />Upload File<input type="file" className="hidden" accept=".pdf,.doc,.docx,.txt" /></label>
              </div>
            </div>
            <div className="flex-1 overflow-hidden flex gap-0">
              <div className="flex-1 flex flex-col border-r border-light">
                <div className="px-[22px] pt-2 pb-1 border-b border-light" style={{ background: "var(--bg-page)" }}><span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em]">Template Editor</span></div>
                <Textarea size="mono" value={body} onChange={(e) => setBody(e.target.value)} className="flex-1 w-full border-none px-[22px] py-4 resize-none outline-none box-border" placeholder="Start typing your template content here, or select an example above…" />
              </div>
              <div className="w-80 shrink-0 flex flex-col overflow-hidden">
                <div className="px-4 pt-2 pb-1 border-b border-light" style={{ background: "var(--bg-page)" }}><span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.07em]">Live Preview</span></div>
                <div className="flex-1 overflow-y-auto p-4" style={{ background: "var(--card-header)" }}>
                  <div className="bg-white border border-border rounded-lg p-3.5 text-[10px] font-mono leading-[1.7] text-text-secondary whitespace-pre-wrap break-words min-h-[200px]">{body || (<span className="text-text-muted italic">Preview will appear here…</span>)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
        <DialogFooter className="bg-card-header">
          <span className="text-[11px] text-text-muted">{screen === "picker" ? "Select a template to continue" : `Editing: ${tname || "Untitled"}`}</span>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            {screen === "editor" && (<Button onClick={handleSave} disabled={!body.trim() || !tname.trim() || saved} className={!body.trim() || !tname.trim() || saved ? "opacity-60 cursor-not-allowed" : ""}>{saved ? (<><Icon name="checkCircle" size={12} />Saved!</>) : (<><Icon name="save" size={12} />Save Template</>)}</Button>)}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
