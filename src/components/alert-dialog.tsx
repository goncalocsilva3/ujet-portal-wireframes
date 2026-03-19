"use client";

import { TriangleAlert, X } from "lucide-react";

interface AlertDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "primary" = black (default), "destructive" = red (use for delete/irreversible actions) */
  confirmVariant?: "primary" | "destructive";
  onConfirm: () => void;
  onCancel: () => void;
}

export function AlertDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
}: AlertDialogProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        className="relative w-[400px] rounded-[8px] border border-[#e5e7eb] bg-white"
        style={{
          boxShadow:
            "0px 10px 15px -3px rgba(0,0,0,0.10), 0px 4px 6px -4px rgba(0,0,0,0.10)",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-3 top-3 flex size-7 items-center justify-center rounded-md text-[#6b7280] opacity-70 transition-opacity hover:opacity-100"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#e5e7eb] px-5 py-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fef2f2]">
            <TriangleAlert className="size-4 text-[#e7000b]" />
          </div>
          <h3 className="text-[18px] font-semibold leading-tight text-[#030712]">
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm leading-5 text-[#6b7280]">{description}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#e5e7eb] px-5 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#030712] shadow-sm transition-colors hover:bg-[#f3f4f6]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-white shadow-sm transition-colors ${
              confirmVariant === "destructive"
                ? "bg-[#e7000b] hover:bg-[#c40009]"
                : "bg-[#030712] hover:bg-[#1a1a2e]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
