"use client";

import {
  Settings,
  Globe,
  Users,
  Headset,
  Radio,
  ListOrdered,
  Megaphone,
  Wrench,
  Monitor,
  CalendarClock,
  Shell,
} from "lucide-react";

interface OverviewLink {
  label: string;
  href: string;
}

interface OverviewCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  links: OverviewLink[];
}

const overviewCards: OverviewCard[] = [
  {
    icon: <Settings className="size-4" />,
    title: "General",
    description: "Configure core system operations and settings",
    links: [
      { label: "Contact Center Details", href: "/settings/contact-center-details" },
      { label: "Hours of Operation and Holidays", href: "/settings/hours-of-operation" },
      { label: "Phone Numbers", href: "/settings/phone-numbers" },
      { label: "System Settings", href: "/settings/system-settings" },
      { label: "Consumer Management", href: "/settings/consumer-management" },
      { label: "Agent Desktop Settings", href: "/settings/agent-desktop-settings" },
    ],
  },
  {
    icon: <Globe className="size-4" />,
    title: "Languages",
    description: "Manage languages and system messages",
    links: [
      { label: "Languages and Messages", href: "/settings/languages-and-messages" },
    ],
  },
  {
    icon: <Users className="size-4" />,
    title: "Users and Teams",
    description: "Manage users, teams, and permissions",
    links: [
      { label: "Users and Teams", href: "/settings/users-and-teams" },
      { label: "Roles and Permissions", href: "/settings/roles-and-permissions" },
      { label: "Bulk User Management", href: "/settings/bulk-user-management" },
    ],
  },
  {
    icon: <Headset className="size-4" />,
    title: "Agents",
    description: "Manage agent skills, availability, and status",
    links: [
      { label: "Agent Skills", href: "/settings/agent-skills" },
      { label: "Availability Preferences", href: "/settings/availability-preferences" },
      { label: "Agent Status", href: "/settings/agent-status" },
    ],
  },
  {
    icon: <Radio className="size-4" />,
    title: "Channels",
    description: "Configure communication channels",
    links: [
      { label: "Channel Operations", href: "/settings/channel-operations" },
      { label: "Call", href: "/settings/call" },
      { label: "Chat", href: "/settings/chat" },
      { label: "Email", href: "/settings/email" },
      { label: "Social", href: "/settings/social" },
      { label: "Blended SMS", href: "/settings/blended-sms" },
    ],
  },
  {
    icon: <ListOrdered className="size-4" />,
    title: "Queues",
    description: "Set up and manage queue configurations",
    links: [
      { label: "Queues", href: "/settings/queues" },
      { label: "Queue Groups", href: "/settings/queue-groups" },
    ],
  },
  {
    icon: <Megaphone className="size-4" />,
    title: "Campaigns",
    description: "Manage campaigns and campaign settings",
    links: [
      { label: "Campaigns", href: "/settings/campaigns" },
    ],
  },
  {
    icon: <Wrench className="size-4" />,
    title: "Tools",
    description: "Integrate and configure external tools",
    links: [
      { label: "Tools", href: "/settings/tools" },
    ],
  },
  {
    icon: <Monitor className="size-4" />,
    title: "Customer Engagement",
    description: "Create and manage customer engagement tools",
    links: [
      { label: "Customer Satisfaction Ratings", href: "/settings/customer-satisfaction-ratings" },
      { label: "Forms", href: "/settings/forms" },
      { label: "Surveys", href: "/settings/surveys" },
    ],
  },
  {
    icon: <CalendarClock className="size-4" />,
    title: "WFM",
    description: "Workforce management settings and configuration",
    links: [
      { label: "General Settings", href: "/settings/wfm-general-settings" },
      { label: "Bulk Import", href: "/settings/wfm-bulk-import" },
    ],
  },
  {
    icon: <Shell className="size-4" />,
    title: "Spiral",
    description: "Configure Spiral integration settings",
    links: [
      { label: "Spiral", href: "/settings/spiral" },
    ],
  },
];

interface OverviewPageProps {
  onNavigate: (href: string, label: string) => void;
}

export function OverviewPage({ onNavigate }: OverviewPageProps) {
  return (
    <div className="w-full pb-10">
      {/* Section header */}
      <h2 className="mb-6 text-base font-semibold text-[#030712]">All Settings</h2>

      {/* Sections grid */}
      <div className="grid grid-cols-3 gap-x-10 gap-y-9">
        {overviewCards.map((card) => (
          <div key={card.title} className="flex flex-col gap-2.5">
            {/* Section header */}
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 flex size-[25px] shrink-0 items-center justify-center rounded-[7px] border border-black/10 bg-[#ececf0]">
                <span className="text-[#6b7280] [&>svg]:size-3.5">{card.icon}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-medium text-[#0a0a0a] leading-snug tracking-[-0.23px]">
                  {card.title}
                </span>
                <span className="text-[13px] text-[#717182] leading-snug tracking-[-0.08px]">
                  {card.description}
                </span>
              </div>
            </div>

            {/* Links with left border */}
            <div className="ml-[12px] flex flex-col">
              {card.links.map((link) => (
                <button
                  key={link.href}
                  onClick={() => onNavigate(link.href, link.label)}
                  className="flex h-[31px] items-center border-l border-black/10 pl-[15px] text-left text-[14px] font-medium text-[#717182] tracking-[-0.15px] transition-colors hover:text-[#0a0a0a]"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
