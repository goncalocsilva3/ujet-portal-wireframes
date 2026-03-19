"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Phone,
  MessageSquare,
  Mail,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
  separator?: "chevron" | "pipe";
  clickable?: boolean;
}

interface TopBarProps {
  breadcrumbs?: Breadcrumb[];
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  onBreadcrumbClick?: (href: string, label: string) => void;
  onSearchClick?: () => void;
}

export function TopBar({
  breadcrumbs = [],
  sidebarCollapsed = false,
  onToggleSidebar,
  onBreadcrumbClick,
  onSearchClick,
}: TopBarProps) {
  return (
    <div className="flex h-14 w-full items-center justify-between border-b border-[#e5e5e5] bg-white px-4">
      {/* Left: toggle + breadcrumbs */}
      <div className="flex items-center gap-2.5">
        {/* Sidebar toggle button */}
        <button
          onClick={onToggleSidebar}
          className="flex size-8 items-center justify-center rounded-md border border-[rgba(0,0,0,0.1)] bg-white text-[#0a0a0a] transition-colors hover:bg-black/5"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="size-3.5" />
          ) : (
            <PanelLeftClose className="size-3.5" />
          )}
        </button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const separator = crumb.separator ?? "chevron";
            const isClickable = crumb.clickable !== false && !isLast && crumb.href;
            return (
              <div key={crumb.label} className="flex items-center gap-1">
                {index > 0 && (
                  separator === "pipe" ? (
                    <span className="text-xs text-muted-foreground px-0.5">|</span>
                  ) : (
                    <ChevronRight className="size-3 text-muted-foreground" />
                  )
                )}
                {isLast ? (
                  <span className="text-xs font-medium text-[#0a0a0a]">
                    {crumb.label}
                  </span>
                ) : isClickable ? (
                  <button
                    onClick={() => crumb.href && onBreadcrumbClick?.(crumb.href, crumb.label)}
                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-[#0a0a0a]"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">
                    {crumb.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Right: search + actions + user */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={onSearchClick}
          className="flex h-7 w-28 items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-white px-2.5 text-xs text-muted-foreground transition-colors hover:border-muted-foreground/30"
        >
          <Search className="size-3.5 shrink-0" />
          <span className="flex-1 text-left">Search</span>
          <kbd className="rounded bg-[#ececf0] px-1 font-mono text-[10px]">/</kbd>
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button className="flex size-7 items-center justify-center rounded-md border border-[rgba(0,0,0,0.1)] bg-white text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground">
            <Phone className="size-3.5" />
          </button>
          <button className="flex size-7 items-center justify-center rounded-md border border-[rgba(0,0,0,0.1)] bg-white text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground">
            <MessageSquare className="size-3.5" />
          </button>
          <button className="flex size-7 items-center justify-center rounded-md border border-[rgba(0,0,0,0.1)] bg-white text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground">
            <Mail className="size-3.5" />
          </button>
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-[rgba(0,0,0,0.1)]" />

        {/* User */}
        <button className="flex items-center gap-2 rounded-md px-1 py-1 transition-colors hover:bg-black/5">
          <Avatar className="size-7">
            <AvatarFallback className="bg-gray-200 text-[10px] font-medium text-gray-600">
              SJ
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-xs font-normal text-[#0a0a0a]">Sarah Johnson</span>
            <span className="inline-flex items-center rounded-md border border-[rgba(0,0,0,0.1)] bg-[#ececf0] px-1.5 py-0 text-[10px] font-medium text-muted-foreground">
              Admin
            </span>
          </div>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
