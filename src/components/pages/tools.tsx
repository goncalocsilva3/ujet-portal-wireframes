"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronRight,
  ChevronDown,
  Bot,
  Users,
  BarChart3,
  Link,
  HardDrive,
  CreditCard,
  ShieldCheck,
  Monitor,
  Share2,
  Languages,
  Headset,
  MessageCircle,
  Check,
} from "lucide-react";

type ToolStatus = "Active" | "Inactive";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  status: ToolStatus;
  provider?: string;
  icon: React.ReactNode;
}

const tools: Tool[] = [
  {
    id: "1",
    name: "Agent Assist",
    description: "Real-time guidance and knowledge base integration for agents.",
    category: "AI & Automation",
    status: "Active",
    provider: "UJET",
    icon: <Bot className="size-5" />,
  },
  {
    id: "2",
    name: "Alvaria ALM",
    description: "Workforce engagement and application lifecycle management integration.",
    category: "Workforce Management",
    status: "Inactive",
    icon: <Users className="size-5" />,
  },
  {
    id: "3",
    name: "CCAI Insights",
    description: "Contact Centre AI analytics and insights for deeper understanding of customer interactions.",
    category: "Analytics",
    status: "Inactive",
    icon: <BarChart3 className="size-5" />,
  },
  {
    id: "4",
    name: "CRM",
    description: "Customer relationship management integration for unified customer data.",
    category: "Communication",
    status: "Active",
    provider: "Salesforce - Testing",
    icon: <Link className="size-5" />,
  },
  {
    id: "5",
    name: "External Storage",
    description: "Securely store and access customer data and conversation records.",
    category: "Storage",
    status: "Inactive",
    icon: <HardDrive className="size-5" />,
  },
  {
    id: "6",
    name: "Payment Providers",
    description: "Secure payment processing directly within customer conversations.",
    category: "Payments",
    status: "Active",
    provider: "Stripe",
    icon: <CreditCard className="size-5" />,
  },
  {
    id: "7",
    name: "Redaction Platform",
    description: "Automatically redact sensitive data from customer interactions and recordings.",
    category: "Security",
    status: "Inactive",
    icon: <ShieldCheck className="size-5" />,
  },
  {
    id: "8",
    name: "Screen Share",
    description: "Enable real-time screen sharing with customers for enhanced visual support.",
    category: "Collaboration",
    status: "Inactive",
    icon: <Monitor className="size-5" />,
  },
  {
    id: "9",
    name: "Social Media Platforms",
    description: "Connect and manage customer interactions across social media channels.",
    category: "Social",
    status: "Inactive",
    icon: <Share2 className="size-5" />,
  },
  {
    id: "10",
    name: "Translation Platform",
    description: "Real-time translation for multilingual customer support conversations.",
    category: "Languages",
    status: "Inactive",
    icon: <Languages className="size-5" />,
  },
  {
    id: "11",
    name: "UCaaS",
    description: "Unified communications as a service integration for seamless collaboration.",
    category: "Communication",
    status: "Inactive",
    icon: <Headset className="size-5" />,
  },
  {
    id: "12",
    name: "Virtual Agent",
    description: "AI-powered virtual agents for automated customer self-service.",
    category: "AI & Automation",
    status: "Inactive",
    icon: <MessageCircle className="size-5" />,
  },
];

const statusStyles: Record<ToolStatus, string> = {
  Active: "bg-[#f0fdf4] border border-[#b9f8cf] text-[#008236]",
  Inactive: "bg-[#f3f4f6] border border-[#e5e7eb] text-[#6b7280]",
};

// ─── Custom dropdown ─────────────────────────────────────

function Dropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 items-center gap-2 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm text-[#030712] shadow-sm transition-colors hover:bg-[#fafafa]"
      >
        <span>{value}</span>
        <ChevronDown className={`size-3.5 text-[#6b7280] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 min-w-[180px] rounded-lg border border-[#e5e7eb] bg-white py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[#030712] transition-colors hover:bg-[#f3f4f6]"
            >
              <span>{opt}</span>
              {value === opt && <Check className="size-3.5 text-[#030712]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────

export function ToolsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const categories = Array.from(new Set(tools.map((t) => t.category))).sort();

  const filtered = tools.filter((t) => {
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All Types" || t.category === typeFilter;
    const matchesStatus = statusFilter === "All Statuses" || t.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-4 px-6 py-6">
      {/* Top bar: search + filters */}
      <div className="flex items-center gap-2">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for tools"
            className="h-9 w-full overflow-hidden text-ellipsis rounded-lg border border-[#e5e7eb] bg-white pl-9 pr-3 text-sm text-[#030712] shadow-sm placeholder:text-ellipsis placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Dropdown
            value={typeFilter}
            options={["All Types", ...categories]}
            onChange={setTypeFilter}
          />
          <Dropdown
            value={statusFilter}
            options={["All Statuses", "Active", "Inactive"]}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* List */}
      <div className="rounded-lg border border-[#e5e7eb] bg-white">
        {filtered.length > 0 ? (
          filtered.map((item, idx) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 px-5 py-4 ${
                idx !== filtered.length - 1 ? "border-b border-[#e5e7eb]" : ""
              }`}
            >
              {/* Icon */}
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6] text-[#6b7280]">
                {item.icon}
              </div>

              {/* Name + category + description + status */}
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-medium text-[#030712] leading-tight">{item.name}</span>
                  <span className="inline-flex items-center rounded border border-[#e5e7eb] bg-[#f3f4f6] px-2 py-0.5 text-[10px] font-medium leading-none text-[#6b7280]">
                    {item.category}
                  </span>
                </div>
                <span className="truncate text-[12px] text-[#6b7280] leading-tight">{item.description}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-block size-1.5 rounded-full ${item.status === "Active" ? "bg-[#15803d]" : "bg-[#9ca3af]"}`} />
                  <span className={`text-[12px] leading-tight ${item.status === "Active" ? "text-[#15803d]" : "text-[#9ca3af]"}`}>
                    {item.provider ? `${item.provider} - ${item.status}` : item.status}
                  </span>
                </div>
              </div>

              {/* Chevron button */}
              <button
                type="button"
                className="flex size-8 shrink-0 items-center justify-center rounded-md border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#030712] transition-colors"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Search className="mb-2 size-8 text-[#d1d5db]" />
            <span className="text-sm font-medium text-[#6b7280]">No tools found</span>
            <span className="mt-1 text-xs text-[#9ca3af]">
              Try modifying your search or filters
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
