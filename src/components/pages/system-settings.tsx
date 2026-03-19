"use client";

import {
  Key,
  Code,
  Webhook,
  Phone,
  Server,
  Radio,
  Smartphone,
  Bell,
  Database,
  Shield,
  Globe,
  Layers,
  Mail,
  FileText,
  BarChart3,
} from "lucide-react";
import { SettingsNavList, type NavListItem } from "@/components/settings-nav-list";

const items: NavListItem[] = [
  {
    icon: <Key className="size-4" />,
    title: "Company Key & Secret Code",
    description: "Manage your organisation's unique company key and secret code credentials",
    action: "chevron",
  },
  {
    icon: <Code className="size-4" />,
    title: "API Credentials",
    description: "Generate and manage API keys for programmatic access to UJET services",
    action: "chevron",
    href: "/settings/api-credentials",
  },
  {
    icon: <Webhook className="size-4" />,
    title: "Webhooks",
    description: "Configure webhook endpoints to receive real-time event notifications",
    action: "chevron",
  },
  {
    icon: <Phone className="size-4" />,
    title: "Bring Your Own Carrier",
    description: "Connect and configure your existing telephony carrier with UJET",
    action: "chevron",
  },
  {
    icon: <Server className="size-4" />,
    title: "TURN Servers",
    description: "Set up TURN relay servers for WebRTC media traversal across networks",
    action: "chevron",
  },
  {
    icon: <Radio className="size-4" />,
    title: "SIPREC",
    description: "Configure SIP Recording (SIPREC) for call recording integrations",
    action: "chevron",
  },
  {
    icon: <Smartphone className="size-4" />,
    title: "Mobile Apps",
    description: "Manage mobile application settings and SDK configuration options",
    action: "chevron",
  },
  {
    icon: <Bell className="size-4" />,
    title: "Push Notification Debug",
    description: "Debug and test push notification delivery for mobile and web agents",
    action: "chevron",
  },
  {
    icon: <Database className="size-4" />,
    title: "Session Data Export",
    description: "Configure scheduled exports of session and interaction data",
    action: "chevron",
  },
  {
    icon: <Shield className="size-4" />,
    title: "External Authentication / SSO",
    description: "Set up SAML, OAuth or OIDC-based single sign-on for your organisation",
    action: "chevron",
  },
  {
    icon: <Globe className="size-4" />,
    title: "API Request Direct Access Point",
    description: "Configure direct API access points and allowed request origins",
    action: "chevron",
  },
  {
    icon: <Layers className="size-4" />,
    title: "Agent Adapter Domain Base Access Control",
    description: "Manage domain-level access controls for agent adapter integrations",
    action: "chevron",
  },
  {
    icon: <Mail className="size-4" />,
    title: "Email Account Management",
    description: "Configure and manage email accounts for agent and system communications",
    action: "chevron",
  },
  {
    icon: <FileText className="size-4" />,
    title: "Exposing Logs",
    description: "Enable or disable exposure of system logs for debugging and monitoring",
    action: "toggle",
  },
  {
    icon: <BarChart3 className="size-4" />,
    title: "Audit Dashboard",
    description: "View and manage audit trails for system activity and compliance",
    action: "chevron",
  },
];

interface SystemSettingsPageProps {
  onNavigate?: (href: string, label: string, parentLabel?: string) => void;
}

export function SystemSettingsPage({ onNavigate }: SystemSettingsPageProps) {
  return (
    <div className="flex flex-col gap-6 pb-6">
      <SettingsNavList
        items={items}
        onNavigate={(href) => {
          const item = items.find((i) => i.href === href);
          onNavigate?.(href, item?.title ?? href, "System Settings");
        }}
      />
    </div>
  );
}
