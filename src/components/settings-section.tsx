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
}

export function SettingsSection({
  title,
  description,
  children,
  defaultOpen = true,
  collapsible = true,
}: SettingsSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white">
      <button
        type="button"
        onClick={() => collapsible && setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between px-5 py-4",
          collapsible && "cursor-pointer",
          open && "border-b border-[#e5e7eb]"
        )}
      >
        <div className="flex flex-col items-start gap-0.5">
          <h3 className="text-sm font-semibold text-[#030712]">{title}</h3>
          {description && (
            <p className="text-xs text-[#6b7280]">{description}</p>
          )}
        </div>
        {collapsible && (
          <ChevronDown
            className={cn(
              "size-4 text-[#6b7280] transition-transform",
              open && "rotate-180"
            )}
          />
        )}
      </button>
      {open && <div className="px-5 py-4">{children}</div>}
    </div>
  );
}
