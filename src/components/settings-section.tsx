"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  collapsible?: boolean;
  headerRight?: React.ReactNode;
}

export function SettingsSection({
  title,
  description,
  children,
  defaultOpen = true,
  collapsible = true,
  headerRight,
}: SettingsSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white">
      {collapsible ? (
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between px-5 py-4 cursor-pointer",
          open && "border-b border-[#e5e7eb]"
        )}
      >
        <div className="flex flex-col items-start gap-0.5">
          <h3 className="text-sm font-semibold text-[#030712]">{title}</h3>
          {description && (
            <p className="text-xs text-[#6b7280]">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {headerRight}
          <ChevronDown
            className={cn(
              "size-4 text-[#6b7280] transition-transform",
              open && "rotate-180"
            )}
          />
        </div>
      </button>
      ) : (
      <div
        className={cn(
          "flex w-full items-center justify-between px-5 py-4",
          open && "border-b border-[#e5e7eb]"
        )}
      >
        <div className="flex flex-col items-start gap-0.5">
          <h3 className="text-sm font-semibold text-[#030712]">{title}</h3>
          {description && (
            <p className="text-xs text-[#6b7280]">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {headerRight}
        </div>
      </div>
      )}
      {open && <div className="px-5 py-4">{children}</div>}
    </div>
  );
}
