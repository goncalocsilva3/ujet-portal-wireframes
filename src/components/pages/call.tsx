"use client";

import { useState } from "react";
import {
  AlertTriangle,
  FileText,
  Hash,
  PhoneIncoming,
  Users,
  ArrowRightLeft,
  MessageSquare,
  MessageCircle,
  Voicemail,
  Volume2,
  BookUser,
  CalendarClock,
  PhoneForwarded,
} from "lucide-react";
import { SettingsToggle } from "@/components/settings-toggle";
import { SettingsNavList, type NavListItem } from "@/components/settings-nav-list";
import { AlertDialog } from "@/components/alert-dialog";

const SHOW_WIP_PAGES = process.env.NEXT_PUBLIC_SHOW_WIP_PAGES === "1";

export function CallPage({ onNavigate }: { onNavigate?: (href: string, label: string, parentLabel?: string) => void } = {}) {
  const [callsEnabled, setCallsEnabled] = useState(true);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [emergencyEnabled, setEmergencyEnabled] = useState(false);
  const [showDisableEmergencyDialog, setShowDisableEmergencyDialog] = useState(false);
  const [smsDeflectionEnabled, setSmsDeflectionEnabled] = useState(false);

  const items: NavListItem[] = [
    {
      icon: <AlertTriangle className="size-4" />,
      title: "Emergency Calling",
      description: "Enable or disable emergency calling. This supports outbound 911 calls in the US region only.",
      action: "toggle",
      toggleEnabled: emergencyEnabled,
      onToggleChange: (v: boolean) => {
        if (!v) {
          setShowDisableEmergencyDialog(true);
        } else {
          setEmergencyEnabled(true);
        }
      },
    },
    {
      icon: <BookUser className="size-4" />,
      title: "Contact Lists",
      description: "Manage contact lists and configure agent page access permissions.",
      action: "chevron",
      href: "/settings/contact-lists",
    },
    {
      icon: <FileText className="size-4" />,
      title: "Call Details",
      description: "Manage call detail recording and information display.",
      action: "chevron",
      href: "/settings/call-details",
    },
    {
      icon: <CalendarClock className="size-4" />,
      title: "Scheduled Calls",
      description: "Configure scheduled call settings and advance booking options.",
      action: "chevron",
      href: "/settings/scheduled-calls",
    },
    {
      icon: <Hash className="size-4" />,
      title: "Agent Extensions",
      description: "Configure agent extension numbers and direct dial settings.",
      action: "chevron",
      href: "/settings/agent-extensions",
    },
    {
      icon: <PhoneIncoming className="size-4" />,
      title: "Direct Inbound",
      description: "Set up direct inbound call routing and handling rules.",
      action: "chevron",
      href: "/settings/direct-inbound",
    },
    {
      icon: <Users className="size-4" />,
      title: "Agent Queue",
      description: "Configure agent queue settings, capacity, and behavior.",
      action: "chevron",
      ...(SHOW_WIP_PAGES ? { href: "/settings/agent-queue" } : {}),
    },
    {
      icon: <ArrowRightLeft className="size-4" />,
      title: "Post-session Transfers",
      description: "Manage call transfer options after a session ends.",
      action: "chevron",
      ...(SHOW_WIP_PAGES ? { href: "/settings/post-session-transfers" } : {}),
    },
    {
      icon: <MessageSquare className="size-4" />,
      title: "Pre-session SMS Deflection",
      description: "Configure SMS deflection options before call sessions begin.",
      action: "toggle",
      toggleEnabled: smsDeflectionEnabled,
      onToggleChange: setSmsDeflectionEnabled,
    },
    {
      icon: <MessageCircle className="size-4" />,
      title: "Agent Call Messages & Notifications",
      description: "Set up agent messaging and notification preferences for calls.",
      action: "chevron",
      ...(SHOW_WIP_PAGES ? { href: "/settings/agent-call-messages" } : {}),
    },
    {
      icon: <Voicemail className="size-4" />,
      title: "Voicemail",
      description: "Configure voicemail settings, greetings, and delivery options.",
      action: "chevron",
      ...(SHOW_WIP_PAGES ? { href: "/settings/voicemail" } : {}),
    },
    {
      icon: <Volume2 className="size-4" />,
      title: "Caller Announcements",
      description: "Manage announcements and messages played to callers.",
      action: "chevron",
    },
    {
      icon: <PhoneForwarded className="size-4" />,
      title: "Callback Settings",
      description: "Configure callback options and queue callback behaviour.",
      action: "chevron",
      ...(SHOW_WIP_PAGES ? { href: "/settings/callback-settings" } : {}),
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Enable Calls toggle card */}
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-[#030712]">Enable Calls</span>
            <span className="text-xs text-[#6b7280]">
              Enable or disable call functionality for your contact center.
            </span>
          </div>
          <SettingsToggle
            enabled={callsEnabled}
            onChange={(v) => {
              if (!v) {
                setShowDisableDialog(true);
              } else {
                setCallsEnabled(true);
              }
            }}
          />
        </div>
      </div>

      {/* Navigation list card */}
      <SettingsNavList
        items={items}
        onNavigate={(href) => {
          const item = items.find((i) => i.href === href);
          onNavigate?.(href, item?.title ?? href, "Call");
        }}
      />

      {/* Disable confirmation dialog */}
      <AlertDialog
        open={showDisableDialog}
        onCancel={() => setShowDisableDialog(false)}
        onConfirm={() => {
          setCallsEnabled(false);
          setShowDisableDialog(false);
        }}
        title="Disable Calls"
        description="Are you sure you want to disable call functionality? This will prevent all call channels from operating in your contact center."
        confirmLabel="Disable"
        confirmVariant="primary"
      />

      {/* Disable Emergency Calling confirmation dialog */}
      <AlertDialog
        open={showDisableEmergencyDialog}
        onCancel={() => setShowDisableEmergencyDialog(false)}
        onConfirm={() => {
          setEmergencyEnabled(false);
          setShowDisableEmergencyDialog(false);
        }}
        title="Disable Emergency Calling"
        description="Are you sure you want to turn off Emergency Calling? This action will restrict agents from placing 911 calls at times of emergency."
        confirmLabel="Disable"
        confirmVariant="primary"
      />
    </div>
  );
}
