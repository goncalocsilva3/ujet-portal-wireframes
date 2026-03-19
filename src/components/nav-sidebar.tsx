"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Settings,
  Globe,
  Monitor,
  Users,
  Headset,
  Radio,
  ListOrdered,
  Wrench,
  Megaphone,
  CalendarClock,
  Shell,
  ChevronDown,
  LayoutGrid,
  MonitorSmartphone,
} from "lucide-react";

interface NavSubItem {
  label: string;
  href: string;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  hasExpander?: boolean;
  subItems?: NavSubItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "CONTACT CENTER",
    items: [
      {
        icon: <Settings className="size-3.5" />,
        label: "General",
        hasExpander: true,
        subItems: [
          { label: "Contact Center Details", href: "/settings/contact-center-details" },
          { label: "Hours of Operation and Holidays", href: "/settings/hours-of-operation" },
          { label: "Phone Numbers", href: "/settings/phone-numbers" },
          { label: "System Settings", href: "/settings/system-settings" },
          { label: "Consumer Management", href: "/settings/consumer-management" },
        ],
      },
      { icon: <Globe className="size-3.5" />, label: "Languages and Messages", href: "/settings/languages-and-messages" },
      {
        icon: <Monitor className="size-3.5" />,
        label: "Customer Engagement",
        hasExpander: true,
        subItems: [
          { label: "Customer Satisfaction Ratings", href: "/settings/customer-satisfaction-ratings" },
          { label: "Forms", href: "/settings/forms" },
          { label: "Surveys", href: "/settings/surveys" },
        ],
      },
    ],
  },
  {
    title: "PEOPLE",
    items: [
      {
        icon: <Users className="size-3.5" />,
        label: "Users",
        hasExpander: true,
        subItems: [
          { label: "Users and Teams", href: "/settings/users-and-teams" },
          { label: "Roles and Permissions", href: "/settings/roles-and-permissions" },
          { label: "Bulk User Management", href: "/settings/bulk-user-management" },
        ],
      },
      {
        icon: <Headset className="size-3.5" />,
        label: "Agents",
        hasExpander: true,
        subItems: [
          { label: "Agent Skills", href: "/settings/agent-skills" },
          { label: "Availability Preferences", href: "/settings/availability-preferences" },
          { label: "Agent Status", href: "/settings/agent-status" },
        ],
      },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      {
        icon: <Radio className="size-3.5" />,
        label: "Channels",
        hasExpander: true,
        subItems: [
          { label: "Channel Operations", href: "/settings/channel-operations" },
          { label: "Call", href: "/settings/call" },
          { label: "Chat", href: "/settings/chat" },
          { label: "Email", href: "/settings/email" },
          { label: "Social", href: "/settings/social" },
          { label: "Blended SMS", href: "/settings/blended-sms" },
        ],
      },
      {
        icon: <ListOrdered className="size-3.5" />,
        label: "Queues",
        hasExpander: true,
        subItems: [
          { label: "Queues", href: "/settings/queues" },
          { label: "Queue Groups", href: "/settings/queue-groups" },
        ],
      },
      { icon: <Wrench className="size-3.5" />, label: "Tools", href: "/settings/tools" },
    ],
  },
  {
    title: "APPS",
    items: [
      { icon: <MonitorSmartphone className="size-3.5" />, label: "Agent Desktop Settings", href: "/settings/agent-desktop-settings" },
      {
        icon: <CalendarClock className="size-3.5" />,
        label: "WFM",
        hasExpander: true,
        subItems: [
          { label: "General Settings", href: "/settings/wfm-general-settings" },
          { label: "Bulk Import", href: "/settings/wfm-bulk-import" },
        ],
      },
      { icon: <Megaphone className="size-3.5" />, label: "Campaigns", href: "/settings/campaigns" },
      { icon: <Shell className="size-3.5" />, label: "Spiral", href: "/settings/spiral" },
    ],
  },
];

export { navGroups };
export type { NavItem, NavSubItem, NavGroup };

interface NavSidebarProps {
  activePage?: string;
  onNavigate?: (href: string, label: string, parentLabel?: string) => void;
  collapsed?: boolean;
}

export function NavSidebar({ activePage = "overview", onNavigate, collapsed = false }: NavSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const handleItemClick = (item: NavItem) => {
    if (item.hasExpander && item.subItems) {
      toggleExpand(item.label);
    } else if (item.href && onNavigate) {
      onNavigate(item.href, item.label);
    }
  };

  const handleSubItemClick = (subItem: NavSubItem, parentLabel: string) => {
    if (onNavigate) {
      onNavigate(subItem.href, subItem.label, parentLabel);
    }
  };

  if (collapsed) return null;

  return (
    <div className="flex h-screen w-[252px] flex-col border-r border-[#e5e5e5] bg-[#fafafa]">
      {/* Header - Fixed */}
      <div className="flex h-14 shrink-0 items-center border-b border-[#e5e5e5] px-3.5">
        <h1 className="text-xl font-semibold text-[#0a0a0a] tracking-tight">Settings</h1>
      </div>

      {/* Navigation - Scrollable */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="flex flex-col gap-1 p-3.5">
          {/* Overview button */}
          <button
            onClick={() => onNavigate?.("/settings/overview", "Overview")}
            className={cn(
              "flex h-8 items-center gap-2.5 rounded-md px-2.5 transition-colors",
              activePage === "overview"
                ? "bg-[#030213] text-[#fafafa]"
                : "text-[#0a0a0a] hover:bg-black/5"
            )}
          >
            <LayoutGrid className="size-3.5" />
            <span className="text-xs font-medium">Overview</span>
          </button>

          {/* Nav groups */}
          {navGroups.map((group) => (
            <div key={group.title} className="mt-3">
              <div className="px-2.5 py-1.5">
                <span className="text-[10px] font-normal uppercase tracking-widest text-[#717182]">
                  {group.title}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const isExpanded = expandedItems.has(item.label);
                  const isActive = activePage === item.href || item.subItems?.some(sub => sub.href === activePage);

                  return (
                    <div key={item.label}>
                      <button
                        onClick={() => handleItemClick(item)}
                        className={cn(
                          "flex h-8 w-full items-center gap-2.5 rounded-md px-2.5 text-[#0a0a0a] transition-colors hover:bg-black/5",
                          isActive && !item.hasExpander && "bg-black/5"
                        )}
                      >
                        {item.icon}
                        <span className="flex-1 text-left text-xs font-medium">{item.label}</span>
                        {item.hasExpander && (
                          <ChevronDown
                            className={cn(
                              "size-3.5 text-muted-foreground transition-transform duration-200",
                              isExpanded && "rotate-180"
                            )}
                          />
                        )}
                      </button>

                      {/* Sub-items */}
                      {item.hasExpander && item.subItems && (
                        <div
                          className={cn(
                            "flex flex-col gap-0.5 overflow-hidden transition-all duration-200",
                            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                          )}
                        >
                          {item.subItems.map((subItem) => (
                            <button
                              key={subItem.label}
                              onClick={() => handleSubItemClick(subItem, item.label)}
                              className={cn(
                                "flex h-8 w-full items-center rounded-md pl-5 pr-2.5 text-[#0a0a0a] transition-colors hover:bg-black/5",
                                activePage === subItem.href && "bg-black/5 font-semibold"
                              )}
                            >
                              <span className="text-xs font-medium">{subItem.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
