"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";

interface RichEditorProps {
  value?: string;
  onChange?: (html: string) => void;
}

export default function RichEditor({
  value = "",
  onChange,
}: RichEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [url, setUrl] = useState("");
  const skipNextOnUpdate = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: false }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "rich-link", rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      if (skipNextOnUpdate.current) {
        skipNextOnUpdate.current = false;
        return;
      }
      onChange?.(editor.getHTML());
    },
    editorProps: {
      handleKeyDown(_view, event) {
        if (event.key === "Tab") {
          event.preventDefault();
          _view.dispatch(_view.state.tr.insertText("\u00a0\u00a0\u00a0\u00a0"));
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const incoming = (value || "").trim();
    const current = editor.getHTML().trim();
    if (incoming === "" && current !== "<p></p>") {
      skipNextOnUpdate.current = true;
      editor.commands.setContent("");
      return;
    }

    if (incoming !== current) {
      skipNextOnUpdate.current = true;
      editor.commands.setContent(incoming);
    }
  }, [editor, value]);

  const handleAddHyperlink = useCallback(() => {
    if (!editor) return;
    if (editor.state.selection.empty) return;
    const existing = editor.getAttributes("link").href ?? "";
    setUrl(existing);
    setShowLinkInput(true);
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    if (url.trim()) {
      const href = url.startsWith("http") ? url.trim() : `https://${url.trim()}`;
      editor.chain().focus().setLink({ href }).run();
    }
    setShowLinkInput(false);
    setUrl("");
  }, [editor, url]);

  const cancelLink = useCallback(() => {
    setShowLinkInput(false);
    setUrl("");
    editor?.commands.focus();
  }, [editor]);

  const handleRemoveHyperlink = useCallback(() => {
    editor?.chain().focus().unsetLink().run();
  }, [editor]);

  const handleInsertTab = useCallback(() => {
    editor?.chain().focus().insertContent("\u00a0\u00a0\u00a0\u00a0").run();
  }, [editor]);

  const btnBase =
    "inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg cursor-pointer transition-colors duration-150 select-none";

  return (
    <>
      <style>{`
        .rich-link { color: #2563eb; text-decoration: underline; cursor: pointer; }
        .rich-link:hover { color: #1d4ed8; }
        .tiptap-editor .tiptap { outline: none; min-height: 80px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; line-height: 1.6; white-space: pre-wrap; color: var(--text, #111); }
        .tiptap-editor .tiptap p.is-editor-empty:first-child::before { color: #9ca3af; content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
      `}</style>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button type="button" onClick={handleInsertTab} className={btnBase}
            style={{ background: "var(--status-info-subtle, #eff6ff)", border: "1px solid var(--status-info-blue-border, #bfdbfe)", color: "var(--status-info-blue, #2563eb)" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M4 12h16" />
              <path d="M10 6l-6 6 6 6" />
            </svg>
            Tab
          </button>

          <button type="button" onClick={handleAddHyperlink} className={btnBase}
            style={{ background: "var(--status-info-subtle, #eff6ff)", border: "1px solid var(--status-info-blue-border, #bfdbfe)", color: "var(--status-info-blue, #2563eb)" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
            Add Hyperlink
          </button>

          <button type="button" onClick={handleRemoveHyperlink} className={btnBase}
            style={{ background: "var(--status-warning-subtle, #fffbeb)", border: "1px solid var(--status-warning-border, #fde68a)", color: "var(--accent-title-point, #b45309)" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18.84 12.25l1.72-1.71h-.02a5.004 5.004 0 00-.12-7.07 5.006 5.006 0 00-6.95 0l-1.72 1.71" />
              <path d="M5.17 11.75l-1.71 1.71a5.004 5.004 0 00.12 7.07 5.006 5.006 0 006.95 0l1.71-1.71" />
              <line x1="8" y1="2" x2="8" y2="5" />
              <line x1="2" y1="8" x2="5" y2="8" />
            </svg>
            Remove Hyperlink
          </button>
        </div>

        {showLinkInput && (
          <div className="flex items-center gap-2 px-0.5">
            <input autoFocus type="url" value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") applyLink(); if (e.key === "Escape") cancelLink(); }}
              placeholder="Paste or type URL, then press Enter"
              className="flex-1 rounded-md border px-2.5 py-1.5 text-[11px] outline-none"
              style={{ borderColor: "var(--border-input, #d1d5db)" }} />
            <button type="button" onClick={applyLink}
              className="rounded-md px-3 py-1.5 text-[11px] font-bold text-white"
              style={{ background: "var(--brand, #6366f1)", border: "none" }}>Apply</button>
            <button type="button" onClick={cancelLink}
              className="rounded-md border px-2.5 py-1.5 text-[11px] font-medium"
              style={{ borderColor: "var(--border, #d1d5db)", color: "var(--text-muted, #6b7280)" }}>Cancel</button>
          </div>
        )}

        <div className="tiptap-editor w-full rounded-lg border bg-white px-3 py-2"
          style={{ borderColor: "var(--border-input-alt, #e5e7eb)" }}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
}
