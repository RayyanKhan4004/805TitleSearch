"use client"

import { useState, useRef, useEffect } from "react"
import Icon from "@/components/common/icon"
import { Button } from "@/components/ui"

interface UploadPopoverProps {
  onUpload: (files: FileList) => void
  onClose: () => void
}

export default function UploadPopover({ onUpload, onClose }: UploadPopoverProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [onClose])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length) onUpload(e.dataTransfer.files)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) onUpload(e.target.files)
  }

  return (
    <div
      ref={popoverRef}
      className="absolute top-full right-0 mt-1.5 w-75 bg-white rounded-xl shadow-[0_8px_32px_rgba(0,0,0,.18)] border border-border z-50 overflow-hidden"
    >
      <div className="px-4 pt-3 pb-2 border-b border-border">
        <div className="text-[12px] font-bold text-text">Upload Document</div>
        <div className="text-[10px] text-text-muted">Attach files to this order</div>
      </div>

      <div
        className="mx-3 my-3 rounded-xl border-2 border-dashed p-6 flex flex-col items-center gap-2 transition-colors cursor-pointer"
        style={{
          borderColor: dragOver ? "var(--brand-primary)" : "var(--border-input)",
          background: dragOver ? "var(--bg-hover)" : "var(--bg-page)",
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Icon name="upload" size={22} style={{ color: "var(--text-muted)" }} />
        <span className="text-[11px] font-semibold text-text">
          {dragOver ? "Drop to upload" : "Click or drag files here"}
        </span>
        <span className="text-[9px] text-text-muted">PDF, DOC, DOCX, TIF, JPG up to 25MB</span>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={handleChange} />
      </div>

      <div className="px-3 pb-3 flex gap-1.5">
        <Button variant="secondary" size="sm" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" className="flex-1" onClick={() => inputRef.current?.click()}>
          <Icon name="upload" size={10} />
          Browse Files
        </Button>
      </div>
    </div>
  )
}
