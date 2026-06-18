"use client";

import { useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import Icon from "@/components/common/icon";

interface PrelimDocEditorProps {
  value: string;
  onChange?: (html: string) => void;
  editable?: boolean;
}

const btnBase =
  "inline-flex items-center justify-center min-w-[28px] h-7 px-2 text-[11px] font-semibold rounded cursor-pointer transition-colors duration-150 select-none border";

function ToolbarButton({
  active,
  onClick,
  disabled,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={btnBase}
      style={{
        background: active ? "#1e2130" : "#fff",
        borderColor: active ? "#1e2130" : "#e2e8f0",
        color: active ? "#fff" : "#334155",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = useCallback(() => {
    const previous = editor.getAttributes("link").href ?? "";
    const url = window.prompt("URL (leave empty to remove)", previous);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const href = url.startsWith("http") ? url : `https://${url}`;
    editor.chain().focus().setLink({ href }).run();
  }, [editor]);

  return (
    <div
      className="sticky top-0 z-10 flex flex-wrap items-center gap-1 px-3 py-2 border-b"
      style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}
    >
      <ToolbarButton
        title="Undo (Ctrl+Z)"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        ↶
      </ToolbarButton>
      <ToolbarButton
        title="Redo (Ctrl+Y)"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        ↷
      </ToolbarButton>
      <span className="mx-1 h-5 w-px" style={{ background: "#cbd5e1" }} />
      <ToolbarButton
        active={editor.isActive("bold")}
        title="Bold (Ctrl+B)"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("italic")}
        title="Italic (Ctrl+I)"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("strike")}
        title="Strikethrough"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <s>S</s>
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("code")}
        title="Inline code"
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        {"<>"}
      </ToolbarButton>
      <span className="mx-1 h-5 w-px" style={{ background: "#cbd5e1" }} />
      <ToolbarButton
        active={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("paragraph")}
        title="Paragraph"
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        ¶
      </ToolbarButton>
      <span className="mx-1 h-5 w-px" style={{ background: "#cbd5e1" }} />
      <ToolbarButton
        active={editor.isActive("bulletList")}
        title="Bullet list"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("orderedList")}
        title="Numbered list"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive("blockquote")}
        title="Quote"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        ❝
      </ToolbarButton>
      <span className="mx-1 h-5 w-px" style={{ background: "#cbd5e1" }} />
      <ToolbarButton
        active={editor.isActive("link")}
        title="Insert / edit link"
        onClick={setLink}
      >
        <Icon name="link" size={12} />
      </ToolbarButton>
      <ToolbarButton
        title="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        —
      </ToolbarButton>
    </div>
  );
}

export default function PrelimDocEditor({
  value,
  onChange,
  editable = true,
}: PrelimDocEditorProps) {
  const skipNextOnUpdate = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
          class: "rich-link",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
    ],
    content: value,
    editable,
    onUpdate({ editor }) {
      if (skipNextOnUpdate.current) {
        skipNextOnUpdate.current = false;
        return;
      }
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  useEffect(() => {
    if (!editor) return;
    const incoming = (value || "").trim();
    const current = editor.getHTML().trim();
    if (incoming !== current) {
      skipNextOnUpdate.current = true;
      editor.commands.setContent(incoming || "<p></p>");
    }
    // intentionally only on initial mount / external resets
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return (
    <div className="flex h-full flex-col" style={{ background: "#d1d5db" }}>
      <style>{`
        .prelim-doc-editor .tiptap {
          outline: none;
          font-family: 'Times New Roman', Times, serif;
          font-size: 11.5px;
          line-height: 1.6;
          color: #111;
        }
        .prelim-doc-editor .tiptap h1 { font-size: 18px; font-weight: 700; margin: 18px 0 8px; }
        .prelim-doc-editor .tiptap h2 { font-size: 15px; font-weight: 700; margin: 16px 0 6px; }
        .prelim-doc-editor .tiptap h3 { font-size: 13px; font-weight: 700; margin: 14px 0 6px; }
        .prelim-doc-editor .tiptap p { margin: 0 0 8px; }
        .prelim-doc-editor .tiptap ul, .prelim-doc-editor .tiptap ol { padding-left: 24px; margin: 0 0 10px; }
        .prelim-doc-editor .tiptap blockquote { border-left: 3px solid #cbd5e1; padding-left: 12px; color: #475569; margin: 8px 0; }
        .prelim-doc-editor .tiptap hr { border: none; border-top: 1px solid #ddd; margin: 14px 0; }
        .prelim-doc-editor .tiptap table { border-collapse: collapse; }
        .prelim-doc-editor .tiptap td, .prelim-doc-editor .tiptap th { border: 1px solid #ccc; padding: 7px 12px; }
        .rich-link { color: #2563eb; text-decoration: underline; cursor: pointer; }
      `}</style>
      {editor && editable && <Toolbar editor={editor} />}
      <div className="flex-1 overflow-y-auto py-7 prelim-doc-editor">
        <div
          className="max-w-[760px] mx-auto bg-white shadow-lg"
          style={{
            padding: "48px 64px",
            minHeight: 700,
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
