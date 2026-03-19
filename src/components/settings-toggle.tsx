"use client";

import { cn } from "@/lib/utils";

interface SettingsToggleProps {
  enabled?: boolean;
  onChange?: (enabled: boolean) => void;
}

export function SettingsToggle({
  enabled = false,
  onChange,
}: SettingsToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange?.(!enabled)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
        enabled ? "bg-[#030712]" : "bg-[#cbced4]"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform",
          enabled ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}
