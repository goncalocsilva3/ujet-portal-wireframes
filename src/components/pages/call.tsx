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

export function CallPage() {
  const [callsEnabled, setCallsEnabled] = useState(true);
  const [emergencyEnabled, setEmergencyEnabled] = useState(false);
  const [smsDeflectionEnabled, setSmsDeflectionEnabled] = useState(false);

  const items: NavListItem[] = [
    {
      icon: <AlertTriangle className="size-4" />,
      title: "Emergency Calling",
      description: "Configure emergency calling settings and E911 information.",
      action: "toggle",
      toggleEnabled: emergencyEnabled,
      onToggleChange: setEmergencyEnabled,
    },
    {
      icon: <BookUser className="size-4" />,
      title: "Contact Lists",
      description: "Manage contact lists and configure agent page access permissions.",
      action: "chevron",
    },
    {
      icon: <FileText className="size-4" />,
      title: "Call Details",
      description: "Manage call detail recording and information display.",
      action: "chevron",
    },
    {
      icon: <CalendarClock className="size-4" />,
      title: "Scheduled Calls",
      description: "Configure scheduled call settings and advance booking options.",
      action: "chevron",
    },
    {
      icon: <Hash className="size-4" />,
      title: "Agent Extensions",
      description: "Configure agent extension numbers and direct dial settings.",
      action: "chevron",
    },
    {
      icon: <PhoneIncoming className="size-4" />,
      title: "Direct Inbound",
      description: "Set up direct inbound call routing and handling rules.",
      action: "chevron",
    },
    {
      icon: <Users className="size-4" />,
      title: "Agent Queue",
      description: "Configure agent queue settings, capacity, and behavior.",
      action: "chevron",
    },
    {
      icon: <ArrowRightLeft className="size-4" />,
      title: "Post-session Transfers",
      description: "Manage call transfer options after a session ends.",
      action: "chevron",
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
    },
    {
      icon: <Voicemail className="size-4" />,
      title: "Voicemail",
      description: "Configure voicemail settings, greetings, and delivery options.",
      action: "chevron",
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
              Enable or disable call functionality for your support center.
            </span>
          </div>
          <SettingsToggle enabled={callsEnabled} onChange={setCallsEnabled} />
        </div>
      </div>

      {/* Navigation list card */}
      <SettingsNavList items={items} />
    </div>
  );
}
