"use client"

import { useState, useRef } from "react"
import Icon from "@/components/common/icon"
import { UPLOAD_CATS } from "./temp"
import type { UploadCat } from "./temp"

interface SectionUploadModalProps {
  onClose: () => void
}

export default function SectionUploadModal({ onClose }: SectionUploadModalProps) {
  const [section, setSection] = useState("")
  const [form, setForm] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const cat: UploadCat | undefined = UPLOAD_CATS.find((c) => c.label === section)
  const accentColor = cat?.accent || "#8B0000"

  const upd = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!section) return
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 800)
  }

  const inpStyle: React.CSSProperties = {
    border: "1px solid #e2e8f0",
    borderRadius: 7,
    padding: "7px 11px",
    fontSize: 11,
    background: "#fff",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    color: "#1e293b",
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-5"
      style={{ background: "rgba(0,0,0,.55)", backdropFilter: "blur(3px)" }}
    >
      <div
        className="bg-white w-full max-w-[640px] max-h-[90vh] flex flex-col overflow-hidden"
        style={{ borderRadius: 16, boxShadow: "0 24px 64px rgba(0,0,0,.22)" }}
      >
        {/* header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9] shrink-0"
          style={{ background: "linear-gradient(135deg,#8B0000 0%,#6f0000 100%)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,.15)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <div className="text-[14px] font-bold text-white">Upload Document</div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,.65)" }}>
                Select a section, fill in details, and attach a file
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white text-[12px] font-bold flex items-center gap-1 border-none rounded-lg px-2.5 py-1.5 cursor-pointer"
            style={{ background: "rgba(255,255,255,.15)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.15)")}
          >
            ✕ Close
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* section dropdown */}
          <div className="mb-[18px]">
            <label className="text-[10px] font-bold text-[#475569] uppercase tracking-[0.07em] block mb-1.5">
              Document Section *
            </label>
            <select
              value={section}
              onChange={(e) => { setSection(e.target.value); setForm({}) }}
              style={{
                ...inpStyle,
                fontSize: 12,
                fontWeight: section ? 600 : 400,
                color: section ? "#1e293b" : "#94a3b8",
                borderColor: section ? accentColor : "#e2e8f0",
                borderWidth: section ? 2 : 1,
              }}
            >
              <option value="">— Select a section —</option>
              {UPLOAD_CATS.map((c) => (
                <option key={c.key} value={c.label}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* section fields */}
          {cat && (
            <>
              <div className="mb-[18px]">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div style={{ width: 3, height: 16, background: accentColor, borderRadius: 2 }} />
                  <span className="text-[11px] font-bold text-[#334155]">{cat.label} — Details</span>
                </div>
                <div className="grid gap-[9px_12px]" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))" }}>
                  {cat.fields.map((f) => (
                    <div key={f.k} className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-[#64748b] uppercase tracking-[0.06em]">{f.lbl}</label>
                      {f.t === "select" ? (
                        <select value={form[f.k] || ""} onChange={(e) => upd(f.k, e.target.value)} style={inpStyle}>
                          <option value="">Select…</option>
                          {f.opts?.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      ) : f.t === "textarea" ? (
                        <textarea
                          value={form[f.k] || ""}
                          rows={2}
                          onChange={(e) => upd(f.k, e.target.value)}
                          placeholder={f.ph}
                          style={{ ...inpStyle, resize: "vertical", lineHeight: 1.5 }}
                        />
                      ) : (
                        <input
                          type={f.t}
                          value={form[f.k] || ""}
                          onChange={(e) => upd(f.k, e.target.value)}
                          placeholder={f.ph}
                          style={inpStyle}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* file upload */}
              <div className="mb-5">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div style={{ width: 3, height: 16, background: accentColor, borderRadius: 2 }} />
                  <span className="text-[11px] font-bold text-[#334155]">Attach File</span>
                  <span className="text-[9px] text-[#94a3b8]">PDF · JPG · PNG · TIFF (optional)</span>
                </div>
                <div
                  className="border-2 border-dashed rounded-xl p-[18px_16px] cursor-pointer transition-all duration-200"
                  style={{ borderColor: "#cbd5e1", background: "#fafafa" }}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept="image/*,.pdf" style={{ display: "none" }} />
                  <div className="flex flex-col items-center gap-[7px]">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="text-[11px] font-semibold text-[#334155]">Click to browse or drag a file here</span>
                    <span className="text-[9px] text-[#94a3b8]">PDF, JPG, PNG, TIFF up to 25MB</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* footer */}
        <div className="border-t border-[#f1f5f9] px-5 py-3 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="bg-white text-[#475569] border border-[#e2e8f0] rounded-lg px-4 py-2 text-[12px] font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!section}
            className="text-white border-none rounded-lg px-5 py-2 text-[12px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: accentColor }}
          >
            {saved ? (
              <span className="flex items-center gap-1"><Icon name="check" size={11} /> Saved</span>
            ) : (
              <span className="flex items-center gap-1"><Icon name="save" size={11} /> Upload & Save</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
