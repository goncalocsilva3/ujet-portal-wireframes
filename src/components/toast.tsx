"use client";

import { useEffect } from "react";
import { X, CheckCircle } from "lucide-react";

interface ToastProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  /** Auto-dismiss after this many ms. Set to 0 to disable. Default 5000. */
  autoClose?: number;
  /** Bottom offset in px. Default 24. */
  bottomOffset?: number;
}

export function Toast({ open, title, description, onClose, autoClose = 5000, bottomOffset = 24 }: ToastProps) {
  useEffect(() => {
    if (!open || !autoClose) return;
    const timer = setTimeout(onClose, autoClose);
    return () => clearTimeout(timer);
  }, [open, autoClose, onClose]);

  if (!open) return null;

  const isCompact = !description;

  return (
    <div className={`fixed right-6 z-[60] flex items-start gap-3 rounded-lg border border-[#e5e7eb] bg-white px-4 py-3.5 shadow-lg ${isCompact ? "w-auto" : "w-[420px]"}`} style={{ bottom: `${bottomOffset}px` }}>
      <CheckCircle className={`size-5 shrink-0 text-[#008236] ${isCompact ? "" : "mt-0.5"}`} />
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <span className="text-sm font-medium text-[#030712]">{title}</span>
        {description && (
          <span className="break-all text-xs leading-5 text-[#6b7280]">{description}</span>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className={`flex size-5 shrink-0 items-center justify-center rounded text-[#6b7280] transition-colors hover:text-[#030712] ${isCompact ? "" : "mt-0.5"}`}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
