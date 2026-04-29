"use client";

import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SettingsFieldProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  noBorder?: boolean;
  required?: boolean;
  hint?: string;
}

export function SettingsField({
  label,
  description,
  children,
  noBorder,
  required,
  hint,
}: SettingsFieldProps) {
  return (
    <div className={`flex items-center justify-between gap-8 py-3 ${noBorder ? "" : "[&:not(:last-child)]:border-b [&:not(:last-child)]:border-[#f3f4f6]"}`}>
      <div className="flex flex-col gap-0.5">
        <span className="flex items-center gap-1.5 text-sm font-medium text-[#030712]">
          <span>
            {label}{required && <span className="text-red-500"> *</span>}
          </span>
          {hint && (
            <Tooltip>
              <TooltipTrigger
                type="button"
                aria-label={hint}
                className="inline-flex text-[#9ca3af] hover:text-[#6b7280] focus:outline-none"
              >
                <Info className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top">{hint}</TooltipContent>
            </Tooltip>
          )}
        </span>
        {description && (
          <span className="text-xs text-[#6b7280]">{description}</span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
