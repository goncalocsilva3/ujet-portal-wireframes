"use client";

import {
  Phone,
  Clock,
  Database,
  History,
  Mail,
  HelpCircle,
  GitBranch,
  Radio,
  Megaphone,
} from "lucide-react";
import { SettingsNavList, type NavListItem } from "@/components/settings-nav-list";

const items: NavListItem[] = [
  {
    icon: <Phone className="size-4" />,
    title: "Phone Numbers Management",
    description: "Manage phone numbers and call routing configuration",
    action: "chevron",
    href: "/settings/phone-numbers",
  },
  {
    icon: <Clock className="size-4" />,
    title: "Wrap-up",
    description: "Configure wrap-up settings and after-call work options",
    action: "chevron",
    href: "/settings/wrap-up",
  },
  {
    icon: <Database className="size-4" />,
    title: "Data Parameters",
    description: "Define and manage data parameters for interactions",
    action: "chevron",
  },
  {
    icon: <History className="size-4" />,
    title: "Interaction History",
    description: "Configure interaction history retention and display settings",
    action: "chevron",
  },
  {
    icon: <Mail className="size-4" />,
    title: "Web: Collect Customer Email",
    description: "Configure email collection for web-based interactions",
    action: "chevron",
  },
  {
    icon: <HelpCircle className="size-4" />,
    title: "Mobile: Display FAQ Page",
    description: "Set up FAQ page display options for mobile customers",
    action: "chevron",
  },
  {
    icon: <GitBranch className="size-4" />,
    title: "Routing",
    description: "Configure routing rules and interaction distribution",
    action: "chevron",
  },
  {
    icon: <Radio className="size-4" />,
    title: "Barge",
    description: "Configure barge-in settings for supervisor monitoring",
    action: "chevron",
  },
  {
    icon: <Megaphone className="size-4" />,
    title: "Announcements",
    description: "Manage system announcements and notifications",
    action: "chevron",
  },
];

interface ChannelOperationsPageProps {
  onNavigate?: (href: string, label: string) => void;
}

export function ChannelOperationsPage({ onNavigate }: ChannelOperationsPageProps) {
  return (
    <div className="flex flex-col gap-6 pb-6">
      <SettingsNavList
        items={items}
        onNavigate={(href) => {
          const item = items.find((i) => i.href === href);
          onNavigate?.(href, item?.title ?? href);
        }}
      />
    </div>
  );
}
