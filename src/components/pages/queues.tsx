"use client";

import { useState } from "react";
import {
  Phone,
  Smartphone,
  Globe,
  MessageSquare,
  Mail,
  MessagesSquare,
  ChevronRight,
} from "lucide-react";

interface QueueCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  defaultEnabled: boolean;
}

const queueCards: QueueCard[] = [
  {
    id: "ivr",
    title: "IVR (Interactive Voice Response)",
    icon: <Phone className="size-5" />,
    defaultEnabled: true,
  },
  {
    id: "mobile",
    title: "Mobile",
    icon: <Smartphone className="size-5" />,
    defaultEnabled: true,
  },
  {
    id: "web",
    title: "Web",
    icon: <Globe className="size-5" />,
    defaultEnabled: true,
  },
  {
    id: "sms",
    title: "SMS Messaging",
    icon: <MessageSquare className="size-5" />,
    defaultEnabled: false,
  },
  {
    id: "whatsapp",
    title: "Whatsapp",
    icon: <MessagesSquare className="size-5" />,
    defaultEnabled: false,
  },
  {
    id: "email",
    title: "Email",
    icon: <Mail className="size-5" />,
    defaultEnabled: true,
  },
  {
    id: "amb",
    title: "AMB",
    icon: <MessagesSquare className="size-5" />,
    defaultEnabled: false,
  },
];

export function QueuesPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const card of queueCards) {
      initial[card.id] = card.defaultEnabled;
    }
    return initial;
  });

  const toggleCard = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      <div className="flex flex-col gap-3">
        {queueCards.map((card) => {
          const isOn = enabled[card.id];
          return (
            <div
              key={card.id}
              className="flex items-center gap-4 rounded-lg border border-[#e5e7eb] bg-white px-5 py-4"
            >
              {/* Icon */}
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#6b7280]">
                {card.icon}
              </div>

              {/* Title */}
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-[#030712]">
                  {card.title}
                </span>
              </div>

              {/* Status + Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className={`inline-block size-2 rounded-full ${isOn ? "bg-[#15803d]" : "bg-[#9ca3af]"}`} />
                  <span className={`text-sm ${isOn ? "text-[#15803d]" : "text-[#9ca3af]"}`}>
                    {isOn ? "Active" : "Inactive"}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isOn}
                  onClick={() => toggleCard(card.id)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    isOn ? "bg-[#030712]" : "bg-[#cbced4]"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${
                      isOn ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Chevron button */}
              <button
                type="button"
                className="flex size-8 shrink-0 items-center justify-center rounded-md border border-[#e5e7eb] text-[#6b7280] transition-colors hover:bg-[#f3f4f6]"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
