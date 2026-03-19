"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Home,
  BarChart3,
  Megaphone,
  CalendarClock,
  Settings,
  Bell,
  HelpCircle,
} from "lucide-react";

interface IconSidebarItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: number;
}

const mainItems: IconSidebarItem[] = [
  { icon: <Home className="size-[18px]" />, label: "Home" },
  { icon: <BarChart3 className="size-[18px]" />, label: "Dashboards" },
  { icon: <Megaphone className="size-[18px]" />, label: "Campaigns" },
  { icon: <CalendarClock className="size-[18px]" />, label: "WFM" },
  { icon: <Settings className="size-[18px]" />, label: "Settings", active: true },
];

const bottomItems: IconSidebarItem[] = [
  { icon: <Bell className="size-[14px]" />, label: "Notifications", badge: 3 },
  { icon: <HelpCircle className="size-[18px]" />, label: "Help" },
];

function SidebarButton({ item }: { item: IconSidebarItem }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          className={cn(
            "flex w-14 flex-col items-center justify-center gap-1 rounded-lg py-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white/80",
            item.active && "bg-white/15 text-white"
          )}
        >
          <div className="relative">
            {item.icon}
            {item.badge && (
              <Badge className="absolute -right-2 -top-2 flex size-[18px] items-center justify-center rounded-full bg-red-600 p-0 text-[10px] font-medium text-white border-transparent hover:bg-red-600">
                {item.badge}
              </Badge>
            )}
          </div>
          <span className="text-[10px] tracking-wide">{item.label}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{item.label}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function IconSidebar() {
  return (
    <div className="flex h-screen w-[70px] flex-col bg-[#1a1a1a] border-r border-white/10">
      {/* Logo */}
      <div className="flex h-14 items-center justify-center border-b border-white/10">
        <div className="flex size-[35px] items-center justify-center rounded-full bg-white/10">
          <span className="text-base font-medium text-white/70">U</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="flex flex-1 flex-col items-center gap-2.5 pt-3.5 px-[7px]">
        {mainItems.map((item) => (
          <SidebarButton key={item.label} item={item} />
        ))}
      </div>

      {/* Bottom nav */}
      <div className="flex flex-col items-center gap-2.5 border-t border-white/10 px-[7px] pt-4 pb-4">
        {bottomItems.map((item) => (
          <SidebarButton key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}
