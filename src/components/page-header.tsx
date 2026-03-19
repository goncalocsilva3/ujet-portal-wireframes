"use client";

import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  value: string;
}

interface PageHeaderAction {
  label?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "outline" | "icon";
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: PageHeaderAction[];
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  onBack?: () => void;
}

export function PageHeader({
  title,
  description,
  actions,
  tabs,
  activeTab,
  onTabChange,
  onBack,
}: PageHeaderProps) {
  return (
    <div className="w-full border-b border-[#e5e7eb]">
      {/* Title row */}
      <div className="flex items-center justify-between px-6 pt-4 pb-4">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[#6b7280] shadow-sm transition-colors hover:bg-[#f3f4f6] hover:text-[#030712]"
            >
              <ArrowLeft className="size-4" />
            </button>
          )}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-xl font-semibold leading-7 text-[#030712]">
              {title}
            </h2>
            {description && (
              <p className="text-sm leading-5 text-[#6b7280]">{description}</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        {actions && actions.length > 0 && (
          <div className="flex items-center gap-2">
            {actions.map((action, index) => {
              if (action.variant === "primary") {
                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#030712] px-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#1a1a2e] [&_svg]:size-4"
                    style={{
                      boxShadow:
                        "0px 1px 2px 0px rgba(0,0,0,0.05), inset 0px -1px 1px 0px rgba(0,0,0,0.2), inset 0px 1px 1px 0px rgba(255,255,255,0.3)",
                    }}
                  >
                    {action.icon}
                    {action.label}
                  </button>
                );
              }

              if (action.variant === "icon") {
                return (
                  <button
                    key={index}
                    onClick={action.onClick}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e5e7eb] bg-white text-[#030712] shadow-sm transition-colors hover:bg-gray-50 [&_svg]:size-4"
                  >
                    {action.icon}
                  </button>
                );
              }

              // Default: outline variant
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-2.5 text-sm font-medium text-[#030712] shadow-sm transition-colors hover:bg-gray-50 [&_svg]:size-4"
                >
                  {action.icon}
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="flex border-t border-[#e5e7eb] px-6">
          {tabs.map((tab) => {
            const isActive = tab.value === activeTab;
            return (
              <button
                key={tab.value}
                onClick={() => onTabChange?.(tab.value)}
                className={cn(
                  "relative px-4 py-3 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[#030712]"
                    : "text-[#6b7280] hover:text-[#030712]"
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#030712]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
