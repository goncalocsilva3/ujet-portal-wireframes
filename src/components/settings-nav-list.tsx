"use client";

import { ChevronRight } from "lucide-react";
import { SettingsToggle } from "@/components/settings-toggle";

export interface NavListItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: "chevron" | "toggle";
  toggleEnabled?: boolean;
  onToggleChange?: (enabled: boolean) => void;
  href?: string;
}

interface SettingsNavListProps {
  items: NavListItem[];
  onNavigate?: (href: string) => void;
}

export function SettingsNavList({ items, onNavigate }: SettingsNavListProps) {
  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white">
      {items.map((item, index) => (
        <div
          key={item.title}
          onClick={() => item.href && onNavigate?.(item.href)}
          className={`flex items-center gap-3.5 px-5 py-3.5 ${
            index !== items.length - 1 ? "border-b border-[#e5e7eb]" : ""
          } ${item.action === "chevron" ? "cursor-pointer hover:bg-[#fafafa] transition-colors" : ""}`}
        >
          {/* Icon */}
          <div className="flex size-[35px] shrink-0 items-center justify-center rounded-full bg-[#f3f4f6]">
            <div className="text-[#6b7280]">{item.icon}</div>
          </div>

          {/* Title + Description */}
          <div className="flex flex-1 flex-col gap-0.5">
            <span className="text-[16px] font-medium text-[#030712] leading-tight">
              {item.title}
            </span>
            <span className="text-[12px] text-[#6b7280] leading-tight">
              {item.description}
            </span>
          </div>

          {/* Action */}
          {item.action === "toggle" ? (
            <SettingsToggle
              enabled={item.toggleEnabled ?? false}
              onChange={item.onToggleChange}
            />
          ) : (
            <button
              type="button"
              className="flex size-8 shrink-0 items-center justify-center rounded-md border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f3f4f6] transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
