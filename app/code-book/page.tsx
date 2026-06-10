"use client";

import { useState, useMemo } from "react";
import Sidebar from "@/components/common/sidebar";
import Navbar from "@/components/common/navbar";
import Icon from "@/components/common/icon";
import {
  useFetchCodeBookQuery,
  useCreateCodeBookMutation,
  useUpdateCodeBookMutation,
  useDeleteCodeBookMutation,
} from "@/app/store/api/ordersApi";
import type { CodeBookEntry } from "@/app/components/feature/tables/types";
import toast from "react-hot-toast";

/* ── Modal ─────────────────────────────────────────────────────────── */
interface ModalProps {
  mode: "create" | "edit";
  initial?: { code: string; verbiage: string };
  onClose: () => void;
  onSave: (data: { code: string; verbiage: string }) => Promise<void>;
}

function CodeBookModal({ mode, initial, onClose, onSave }: ModalProps) {
  const [code, setCode] = useState(initial?.code ?? "");
  const [verbiage, setVerbiage] = useState(initial?.verbiage ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !verbiage.trim()) return;
    setSaving(true);
    try {
      await onSave({ code: code.trim(), verbiage: verbiage.trim() });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-lg overflow-hidden"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e2e8f0] bg-[#f8fafc]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#8B0000] rounded-lg flex items-center justify-center">
              <Icon name={mode === "create" ? "file" : "pencil"} size={13} className="text-white" />
            </div>
            <span className="text-[13px] font-bold text-[#1e293b]">
              {mode === "create" ? "New Code" : "Edit Code"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#94a3b8] hover:text-[#1e293b] bg-transparent border-none cursor-pointer p-1 transition-colors"
          >
            <Icon name="x" size={14} />
          </button>
        </div>

        {/* body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider">
              Code
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. CAA1 - CLTA"
              disabled={mode === "edit"}
              className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#8B0000] disabled:bg-[#f8fafc] disabled:text-[#94a3b8] transition-colors"
            />
            {mode === "edit" && (
              <p className="text-[10px] text-[#94a3b8] m-0">Code cannot be changed after creation.</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-[#475569] uppercase tracking-wider">
              Verbiage
            </label>
            <textarea
              value={verbiage}
              onChange={(e) => setVerbiage(e.target.value)}
              placeholder="Enter the full verbiage text…"
              rows={6}
              className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#8B0000] resize-y transition-colors leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[12px] font-semibold text-[#64748b] bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg cursor-pointer hover:bg-[#e2e8f0] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !code.trim() || !verbiage.trim()}
              className="px-4 py-2 text-[12px] font-semibold text-white rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              style={{ background: "#8B0000" }}
            >
              {saving ? "Saving…" : mode === "create" ? "Create Code" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────── */
export default function CodeBookPage() {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<
    null | { mode: "create" } | { mode: "edit"; entry: CodeBookEntry }
  >(null);
  const [confirmDelete, setConfirmDelete] = useState<CodeBookEntry | null>(null);

  const { data: entries, isLoading } = useFetchCodeBookQuery();
  const [createCodeBook] = useCreateCodeBookMutation();
  const [updateCodeBook] = useUpdateCodeBookMutation();
  const [deleteCodeBook] = useDeleteCodeBookMutation();

  const filtered = useMemo(() => {
    if (!entries) return [];
    const q = search.toLowerCase();
    return entries.filter(
      (e) =>
        e.isActive &&
        (!q ||
          (e.code ?? "").toLowerCase().includes(q) ||
          (e.category ?? "").toLowerCase().includes(q) ||
          (e.verbiage ?? "").toLowerCase().includes(q)),
    );
  }, [entries, search]);

  async function handleDelete(entry: CodeBookEntry) {
    try {
      await deleteCodeBook(entry.id).unwrap();
      toast.success("Code deleted");
      setConfirmDelete(null);
    } catch {
      toast.error("Failed to delete code");
    }
  }

  async function handleSave(data: { code: string; verbiage: string }) {
    if (modal?.mode === "create") {
      await createCodeBook(data).unwrap();
      toast.success("Code created successfully");
    } else if (modal?.mode === "edit") {
      await updateCodeBook({ code: data.code, verbiage: data.verbiage }).unwrap();
      toast.success("Code updated successfully");
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f1f5f9]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar />

        {/* sub-header */}
        <div className="flex items-center gap-2.5 px-5 h-9.5 border-b border-[#e2e8f0] bg-white shrink-0">
          <Icon name="file" size={13} className="text-[#8B0000]" />
          <span className="text-[12px] font-bold text-[#1e293b]">Code Book</span>
          <span className="text-[#e2e8f0]">|</span>
          <span className="text-[11px] text-[#94a3b8]">
            Manage all codebook entries
          </span>
          <div className="flex-1" />
          <button
            onClick={() => setModal({ mode: "create" })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white rounded-lg cursor-pointer transition-opacity hover:opacity-90"
            style={{ background: "#8B0000" }}
          >
            <Icon name="plus" size={11} />
            New Code
          </button>
        </div>

        {/* toolbar */}
        <div className="px-5 pt-4 pb-3 bg-[#f1f5f9] shrink-0">
          <div className="relative max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
              <Icon name="search" size={13} />
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code, category, or verbiage…"
              className="w-full pl-8 pr-3 py-2 border border-[#e2e8f0] rounded-lg text-[12px] bg-white outline-none focus:border-[#8B0000] transition-colors"
            />
          </div>
        </div>

        {/* table */}
        <div className="flex-1 overflow-auto px-5 pb-5">
          <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
            {/* table head */}
            <div
              className="grid text-[10px] font-bold uppercase tracking-wider text-[#94a3b8] border-b border-[#e2e8f0] bg-[#f8fafc]"
              style={{ gridTemplateColumns: "200px 1fr 88px" }}
            >
              <div className="px-4 py-2.5">Code</div>
              <div className="px-4 py-2.5 border-l border-[#e2e8f0]">Verbiage</div>
              <div className="px-4 py-2.5 border-l border-[#e2e8f0] text-center">Actions</div>
            </div>

            {isLoading && (
              <div className="py-14 text-center text-[13px] text-[#94a3b8]">
                Loading…
              </div>
            )}

            {!isLoading && filtered.length === 0 && (
              <div className="py-14 text-center text-[13px] text-[#94a3b8]">
                {search ? "No codes match your search." : "No active codes found."}
              </div>
            )}

            {!isLoading && (
              <div className="divide-y divide-[#f1f5f9]">
                {filtered.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid items-start hover:bg-[#fafafa] transition-colors"
                    style={{ gridTemplateColumns: "200px 1fr 88px" }}
                  >
                    {/* code */}
                    <div className="px-4 py-3 flex flex-col gap-1 self-start">
                      <span className="font-mono text-[11px] font-extrabold text-[#1e293b]">
                        {entry.code}
                      </span>
                      {entry.category && (
                        <span className="text-[9px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                          {entry.category}
                        </span>
                      )}
                    </div>

                    {/* verbiage */}
                    <div className="px-4 py-3 border-l border-[#f1f5f9] self-start">
                      <p className="m-0 text-[11px] text-[#475569] leading-relaxed whitespace-pre-wrap">
                        {entry.verbiage}
                      </p>
                    </div>

                    {/* actions */}
                    <div className="px-4 py-3 border-l border-[#f1f5f9] flex items-start justify-center gap-1">
                      <button
                        onClick={() => setModal({ mode: "edit", entry })}
                        title="Edit verbiage"
                        className="w-7 h-7 rounded-md flex items-center justify-center text-[#64748b] hover:text-[#8B0000] hover:bg-[#fef2f2] bg-transparent border-none cursor-pointer transition-colors"
                      >
                        <Icon name="pencil" size={13} />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(entry)}
                        title="Delete code"
                        className="w-7 h-7 rounded-md flex items-center justify-center text-[#64748b] hover:text-[#dc2626] hover:bg-[#fef2f2] bg-transparent border-none cursor-pointer transition-colors"
                      >
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!isLoading && filtered.length > 0 && (
            <p className="text-[10px] text-[#94a3b8] mt-2 text-right">
              {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
            </p>
          )}
        </div>
      </div>

      {/* modals */}
      {modal?.mode === "create" && (
        <CodeBookModal
          mode="create"
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
      {modal?.mode === "edit" && (
        <CodeBookModal
          mode="edit"
          initial={{ code: modal.entry.code, verbiage: modal.entry.verbiage }}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {confirmDelete && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-sm overflow-hidden"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,.25)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#e2e8f0] bg-[#fef2f2]">
              <Icon name="trash" size={14} className="text-[#dc2626]" />
              <span className="text-[13px] font-bold text-[#dc2626]">Delete Code</span>
            </div>
            <div className="p-5 flex flex-col gap-3.5">
              <p className="m-0 text-[12px] text-[#475569] leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-mono font-bold text-[#1e293b]">{confirmDelete.code}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2.5">
                <button
                  onClick={() => setConfirmDelete(null)}
                  className="px-4 py-2 text-[12px] font-semibold text-[#64748b] bg-[#f1f5f9] border border-[#e2e8f0] rounded-lg cursor-pointer hover:bg-[#e2e8f0] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  className="px-4 py-2 text-[12px] font-semibold text-white bg-[#dc2626] rounded-lg cursor-pointer hover:bg-[#b91c1c] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
