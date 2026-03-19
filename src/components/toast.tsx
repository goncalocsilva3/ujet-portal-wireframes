"use client";

import { X, CheckCircle } from "lucide-react";

interface ToastProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export function Toast({ open, title, description, onClose }: ToastProps) {
  if (!open) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex w-[420px] items-start gap-3 rounded-lg border border-[#e5e7eb] bg-white px-4 py-3.5 shadow-lg">
      <CheckCircle className="mt-0.5 size-5 shrink-0 text-[#008236]" />
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <span className="text-sm font-medium text-[#030712]">{title}</span>
        <span className="break-all text-xs leading-5 text-[#6b7280]">{description}</span>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded text-[#6b7280] transition-colors hover:text-[#030712]"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
