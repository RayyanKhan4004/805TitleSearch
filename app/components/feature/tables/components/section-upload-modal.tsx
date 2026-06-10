"use client";

import { useState, useRef } from "react";
import Icon from "@/components/common/icon";
import { UPLOAD_CATS } from "./temp";
import type { UploadCat } from "./temp";
import { useUploadFileMutation, useUpdateOrderMutation } from "@/app/store/api/ordersApi";
import toast from "react-hot-toast";

interface SectionUploadModalProps {
  onClose: () => void;
  orderId?: string;
}

export default function SectionUploadModal({
  onClose,
  orderId,
}: SectionUploadModalProps) {
  const [section, setSection] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadFile] = useUploadFileMutation();
  const [updateOrder] = useUpdateOrderMutation();

  const cat: UploadCat | undefined = UPLOAD_CATS.find(
    (c) => c.label === section,
  );
  const accentColor = cat?.accent || "#8B0000";

  /* ── FE form key → BE DTO field name ── */
  const FIELD_TO_DTO: Record<string, Record<string, string>> = {
    "Assessor Page": {
      apn: "apn1",
      owner: "assessorOwner",
      assessed: "assessorPropertyTax",
      landUse: "assessorLandUse",
    },
    "Assessor Map": {
      mapRef: "tract",
      parcelNo: "apn1",
      notes: "additionalNotes",
    },
    "Tract Map": {
      tractNo: "tract",
      bookPage: "__split__",
    },
    "Tax Cert": {
      apn: "apn1",
    },
    Runsheet: {
      orderNo: "clientFileNo",
      notes: "additionalNotes",
      searchedBy: "additionalNotes",
      searchDate: "additionalNotes",
      geoCov: "additionalNotes",
    },
    Starters: {
      policyNo: "remarks",
      policyDate: "documentDate",
      insured: "grantee",
      company: "grantor",
      amount: "amount",
    },
    "Title Chain Review": {
      recDate: "recDate",
      docDate: "documentDate",
      instrNo: "instrument",
      entityTitle: "entityTitle",
      docTitle: "docTitle",
      grantor: "grantor",
      grantee: "grantee",
      amount: "amount",
      lienPos: "lienPosition",
      notes: "remarks",
    },
  };

  /* Sections that produce a titleChainReviews entry instead of top-level fields */
  const TCR_SECTIONS = new Set(["Starters", "Title Chain Review"]);

  const upd = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    if (!section) return;
    setUploading(true);
    try {
      let fileUrl = ""
      if (selectedFile) {
        const fd = new FormData()
        fd.append("file", selectedFile)
        fileUrl = await uploadFile(fd).unwrap()
      }

      /* PATCH order with uploaded data if we have an orderId */
      if (orderId) {
        const body: Record<string, unknown> = {}
        const fieldMap = FIELD_TO_DTO[section] || {}

        if (TCR_SECTIONS.has(section)) {
          const chainEntry: Record<string, unknown> = {
            documentSection: section === "Starters" ? "starters" : "title_chain_review",
            isStarter: section === "Starters",
          }
          if (fileUrl) {
            chainEntry.fileUrl = fileUrl
            chainEntry.fileName = selectedFile?.name || null
            chainEntry.fileKey = fileUrl.split("?")[0].split("/").slice(-2).join("/")
            chainEntry.fileMimeType = selectedFile?.type || null
          }
          for (const [k, v] of Object.entries(form)) {
            if (v) chainEntry[fieldMap[k] || k] = v
          }
          body.titleChainReviews = [chainEntry]
        } else {
          if (fileUrl) body.fileUrl = fileUrl
          const runsheetParts: string[] = []
          for (const [k, v] of Object.entries(form)) {
            if (!v) continue
            const mapped = fieldMap[k] || k
            if (mapped === "__split__" && k === "bookPage") {
              const parts = v.split(" / ")
              if (parts[0]) body.mapBook = parts[0]
              if (parts[1]) body.page = parts[1]
            } else if (mapped === "additionalNotes" && section === "Runsheet") {
              runsheetParts.push(`${k}: ${v}`)
            } else {
              body[mapped] = v
            }
          }
          if (runsheetParts.length > 0) {
            const existing = (body.additionalNotes as string) || ""
            body.additionalNotes = existing
              ? existing + "\n" + runsheetParts.join("\n")
              : runsheetParts.join("\n")
          }
        }
        await updateOrder({ id: orderId, body }).unwrap()
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 800);
    } catch {
      toast.error("Upload failed")
    } finally {
      setUploading(false);
    }
  };

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
  };

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
          style={{
            background: "linear-gradient(135deg,#8B0000 0%,#6f0000 100%)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-[34px] h-[34px] rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,.15)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <div className="text-[14px] font-bold text-white">
                Upload Document
              </div>
              <div
                className="text-[10px]"
                style={{ color: "rgba(255,255,255,.65)" }}
              >
                Select a section, fill in details, and attach a file
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white text-[12px] font-bold flex items-center gap-1 border-none rounded-lg px-2.5 py-1.5 cursor-pointer"
            style={{ background: "rgba(255,255,255,.15)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,.15)")
            }
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
              onChange={(e) => {
                setSection(e.target.value);
                setForm({});
              }}
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
                <option key={c.key} value={c.label}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* section fields */}
          {cat && (
            <>
              <div className="mb-[18px]">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div
                    style={{
                      width: 3,
                      height: 16,
                      background: accentColor,
                      borderRadius: 2,
                    }}
                  />
                  <span className="text-[11px] font-bold text-[#334155]">
                    {cat.label} — Details
                  </span>
                </div>
                <div
                  className="grid gap-[9px_12px]"
                  style={{
                    gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))",
                  }}
                >
                  {cat.fields.map((f) => (
                    <div key={f.key} className="flex flex-col gap-1">
                      <label className="text-[9px] font-bold text-[#64748b] uppercase tracking-[0.06em]">
                        {f.label}
                      </label>
                      {f.type === "select" ? (
                        <select
                          value={form[f.key] || ""}
                          onChange={(e) => upd(f.key, e.target.value)}
                          style={inpStyle}
                        >
                          <option value="">Select…</option>
                          {f.options?.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      ) : f.type === "textarea" ? (
                        <textarea
                          value={form[f.key] || ""}
                          rows={2}
                          onChange={(e) => upd(f.key, e.target.value)}
                          placeholder={f.placeholder}
                          style={{
                            ...inpStyle,
                            resize: "vertical",
                            lineHeight: 1.5,
                          }}
                        />
                      ) : (
                        <input
                          type={f.type}
                          value={form[f.key] || ""}
                          onChange={(e) => upd(f.key, e.target.value)}
                          placeholder={f.placeholder}
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
                  <div
                    style={{
                      width: 3,
                      height: 16,
                      background: accentColor,
                      borderRadius: 2,
                    }}
                  />
                  <span className="text-[11px] font-bold text-[#334155]">
                    Attach File
                  </span>
                  <span className="text-[9px] text-[#94a3b8]">
                    PDF · JPG · PNG · TIFF (optional)
                  </span>
                </div>
                <div
                  className="border-2 border-dashed rounded-xl p-[18px_16px] cursor-pointer transition-all duration-200"
                  style={{ borderColor: selectedFile ? "#16a34a" : "#cbd5e1", background: selectedFile ? "#f0fdf4" : "#fafafa" }}
                  onClick={() => fileRef.current?.click()}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*,.pdf"
                    style={{ display: "none" }}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  {selectedFile ? (
                    <div className="flex items-center gap-2.5">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                      <span className="text-[11px] font-semibold text-[#166534]">{selectedFile.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }} className="ml-auto bg-transparent border-none text-[#94a3b8] cursor-pointer text-[14px]">×</button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-[7px]">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span className="text-[11px] font-semibold text-[#334155]">
                        Click to browse or drag a file here
                      </span>
                      <span className="text-[9px] text-[#94a3b8]">
                        PDF, JPG, PNG, TIFF up to 25MB
                      </span>
                    </div>
                  )}
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
            disabled={!section || uploading}
            className="text-white border-none rounded-lg px-5 py-2 text-[12px] font-semibold cursor-pointer disabled:opacity-40"
            style={{ background: accentColor }}
          >
            {uploading ? (
              <span className="flex items-center gap-1">
                <Icon name="loader" size={11} className="animate-spin" /> Uploading…
              </span>
            ) : saved ? (
              <span className="flex items-center gap-1">
                <Icon name="check" size={11} /> Saved
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Icon name="save" size={11} /> Upload & Save
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
