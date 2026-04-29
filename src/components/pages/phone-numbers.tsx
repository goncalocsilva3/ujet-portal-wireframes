"use client";

import { useState } from "react";
import { Search, Pencil, Trash2, CheckCircle, Info, Plus, ChevronDown, Loader2 } from "lucide-react";
import { SettingsSection } from "@/components/settings-section";
import { SettingsField } from "@/components/settings-field";
import { SettingsToggle } from "@/components/settings-toggle";
import { Toast } from "@/components/toast";

export function PhoneNumbersGeneralTab() {
  const [sipOutEnabled, setSipOutEnabled] = useState(false);
  return (
    <div className="flex flex-col gap-6 pb-6">
      <SettingsSection title="Phone Number Settings" collapsible={false}>
        <SettingsField label="Global Outbound Phone Number">
          <input
            type="text"
            defaultValue="+1 415-322-2283"
            disabled
            className="h-8 w-72 rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-3 text-sm text-[#6b7280] cursor-not-allowed"
          />
        </SettingsField>
        <SettingsField label="Total Phone Numbers">
          <input
            type="text"
            defaultValue="6"
            disabled
            className="h-8 w-72 rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-3 text-sm text-[#6b7280] cursor-not-allowed"
          />
        </SettingsField>
        <SettingsField label="SIP Out Configuration" description={sipOutEnabled ? "Disable SIP Out" : "Enable SIP Out"}>
          <SettingsToggle enabled={sipOutEnabled} onChange={setSipOutEnabled} />
        </SettingsField>
        <SettingsField label="Default Country Code">
          <select
            disabled
            className="h-8 w-72 rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-3 text-sm text-[#6b7280] cursor-not-allowed"
          >
            <option>[US] United States of America (+1)</option>
          </select>
        </SettingsField>
      </SettingsSection>
    </div>
  );
}

type PhoneStatus = "Verified" | "Unverified" | "Verified for Call" | "Verified for SMS" | "Verified for WhatsApp";
type PhoneType = "Global" | "Direct";

const allStatuses: PhoneStatus[] = ["Verified", "Verified for Call", "Verified for SMS", "Verified for WhatsApp", "Unverified"];

const statusStyles: Record<PhoneStatus, string> = {
  Verified: "bg-green-50 text-green-700",
  "Verified for Call": "bg-green-50 text-green-700",
  "Verified for SMS": "bg-green-50 text-green-700",
  "Verified for WhatsApp": "bg-green-50 text-green-700",
  Unverified: "bg-red-50 text-red-600",
};

const typeStyles: Record<PhoneType, string> = {
  Global: "bg-[#f3f4f6] text-[#374151]",
  Direct: "bg-[#eff6ff] text-[#1d4ed8]",
};

interface QueueInfo {
  title: string;
  items: string[];
}

interface PhoneRow {
  id: string;
  number: string;
  type: PhoneType | null;
  label: string;
  status: PhoneStatus;
  queues: QueueInfo | null;
  defaultOutbound?: boolean;
}

const phoneNumberRows: PhoneRow[] = [
  {
    id: "1",
    number: "+1 415-322-2283",
    type: "Global",
    label: "Twilio Global (US)",
    status: "Verified for Call",
    queues: { title: "Assigned Queues", items: ["General Support", "Sales Team", "VIP Line"] },
    defaultOutbound: true,
  },
  {
    id: "2",
    number: "+1 628-265-8822",
    type: "Direct",
    label: "Customer Support Line",
    status: "Verified",
    queues: { title: "SMS (Inbound)", items: ["PH", "Nik SMS"] },
  },
  {
    id: "3",
    number: "+1 628-237-2866",
    type: "Direct",
    label: "Sales & Inbound",
    status: "Verified",
    queues: { title: "Assigned Queues", items: ["IVR", "PH Team", "Cristene", "VAI-1034 Cristene 1"] },
  },
  {
    id: "4",
    number: "+1 628-400-1122",
    type: "Direct",
    label: "Technical Support",
    status: "Verified for SMS",
    queues: { title: "Assigned Queues", items: ["Tier 2 Support", "Dev Escalation"] },
  },
  {
    id: "5",
    number: "+44 20 7946 0958",
    type: null,
    label: "UK Operations",
    status: "Unverified",
    queues: null,
  },
  {
    id: "6",
    number: "+1 628-500-0099",
    type: "Direct",
    label: "WhatsApp Business",
    status: "Verified for WhatsApp",
    queues: { title: "Assigned Queues", items: ["WhatsApp Queue", "Mobile Team"] },
  },
];

function QueueCell({ queues, defaultOutbound }: { queues: QueueInfo; defaultOutbound?: boolean }) {
  return (
    <div className="group relative inline-flex items-center gap-1.5">
      <span className="text-sm text-[#030712]">
        {defaultOutbound
          ? "Default for queues without assigned outbound numbers"
          : `${queues.items.length} queue${queues.items.length !== 1 ? "s" : ""}`}
      </span>
      {!defaultOutbound && (
        <>
          <Info className="size-3.5 shrink-0 text-[#6b7280]" />
          {/* Tooltip — pt-2 creates seamless hover bridge */}
          <div className="pointer-events-none absolute top-full left-0 z-50 pt-2 group-hover:pointer-events-auto group-hover:block hidden">
            <div className="min-w-[160px] rounded-lg border border-[#e5e7eb] bg-white shadow-xl">
              <div className="px-3 pb-2.5 pt-2.5">
                <p className="mb-2 text-xs font-semibold text-[#030712]">{queues.title}</p>
                <ul className="flex flex-col gap-1">
                  {queues.items.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className="whitespace-nowrap text-xs text-[#2563eb] hover:underline"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function PhoneNumberManagementTab({ sidebarCollapsed = false }: { sidebarCollapsed?: boolean } = {}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [unverifiedCount, setUnverifiedCount] = useState(0);

  const handleVerifyNumbers = () => {
    if (verifying) return;
    setVerifying(true);
    setTimeout(() => {
      const count = phoneNumberRows.filter((r) => r.status === "Unverified").length;
      setUnverifiedCount(count);
      setVerifying(false);
      setToastOpen(true);
    }, 2000);
  };

  const filteredRows = phoneNumberRows.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      r.number.toLowerCase().includes(q) ||
      r.label.toLowerCase().includes(q) ||
      (r.type?.toLowerCase().includes(q) ?? false) ||
      r.status.toLowerCase().includes(q) ||
      (r.queues?.items.some((item) => item.toLowerCase().includes(q)) ?? false);
    return matchesStatus && matchesSearch;
  });

  const allSelected = filteredRows.length > 0 && selectedIds.size === filteredRows.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredRows.map((r) => r.id)));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
    <Toast
      open={toastOpen}
      title="Phone Numbers checked successfully."
      description={unverifiedCount > 0
        ? `We weren't able to verify ${unverifiedCount} phone number${unverifiedCount > 1 ? "s" : ""}.`
        : "All phone numbers were verified."}
      onClose={() => setToastOpen(false)}
    />
    <div className="flex flex-col gap-4 px-6 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search phone numbers, labels, assigned queues..."
              className="h-9 w-full overflow-hidden text-ellipsis rounded-lg border border-[#e5e7eb] bg-white pl-9 pr-3 text-sm text-[#030712] shadow-sm placeholder:text-ellipsis placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setSelectedIds(new Set()); }}
              className="h-9 appearance-none rounded-lg border border-[#e5e7eb] bg-white pl-3 pr-8 text-sm text-[#030712] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]"
            >
              <option value="all">All Statuses</option>
              {allStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#6b7280]" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleVerifyNumbers}
            disabled={verifying}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#030712] shadow-sm hover:bg-[#f9fafb] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {verifying ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle className="size-4" />
            )}
            {verifying ? "Verifying..." : "Verify Numbers"}
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#030712] px-3 text-sm font-medium text-white shadow-sm hover:bg-[#1a1a2e] transition-colors"
          >
            <Plus className="size-4" />
            Add Number
          </button>
        </div>
      </div>

      {/* Table — overflow-visible so tooltips can render above the table boundary */}
      <div className="rounded-lg border border-[#e5e7eb]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
              <th className="w-10 rounded-tl-lg px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected; }}
                  onChange={toggleAll}
                  className="size-4 rounded border-[#e5e7eb] cursor-pointer accent-[#030712]"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] whitespace-nowrap">
                Phone Number
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                Label
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] whitespace-nowrap">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280] whitespace-nowrap">
                Assigned Queues / Agents
              </th>
              <th className="w-[90px] rounded-tr-lg px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={7} className="rounded-b-lg">
                  <div className="flex flex-col items-center justify-center py-12">
                    <Search className="mb-2 size-8 text-[#d1d5db]" />
                    <span className="text-sm font-medium text-[#6b7280]">No phone numbers found</span>
                    <span className="mt-1 text-xs text-[#9ca3af]">
                      Try modifying your search or filters
                    </span>
                  </div>
                </td>
              </tr>
            )}
            {filteredRows.map((row, idx) => {
              const isLast = idx === filteredRows.length - 1;
              return (
                <tr
                  key={row.id}
                  className="border-b border-[#e5e7eb] last:border-b-0 hover:bg-[#f9fafb] transition-colors"
                >
                  <td className={`w-10 px-4 py-3${isLast ? " rounded-bl-lg" : ""}`}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(row.id)}
                      onChange={() => toggleRow(row.id)}
                      className="size-4 rounded border-[#e5e7eb] cursor-pointer accent-[#030712]"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-[#030712] whitespace-nowrap">{row.number}</td>
                  <td className="px-4 py-3">
                    {row.type ? (
                      <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${typeStyles[row.type]}`}>
                        {row.type}
                      </span>
                    ) : (
                      <span className="text-sm text-[#9ca3af]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#030712]">{row.label}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {row.queues ? (
                      <QueueCell queues={row.queues} defaultOutbound={row.defaultOutbound} />
                    ) : (
                      <span className="text-sm text-[#9ca3af]">—</span>
                    )}
                  </td>
                  <td className={`px-4 py-3${isLast ? " rounded-br-lg" : ""}`}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#030712] transition-colors"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="flex size-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Table footer */}
        <div className="rounded-b-lg border-t border-[#e5e7eb] bg-[#f9fafb] px-4 py-2.5">
          <span className="text-xs text-[#6b7280]">
            Showing {filteredRows.length} of {phoneNumberRows.length} items
          </span>
        </div>
      </div>

      {/* Floating bulk action bar */}
      {selectedIds.size > 0 && (
        <div
          className="fixed bottom-6 -translate-x-1/2 z-50 flex items-center gap-3 rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 shadow-lg"
          style={{ left: `calc(50% + ${sidebarCollapsed ? "35px" : "161px"})` }}
        >
          <span className="text-sm font-medium text-[#030712]">
            {selectedIds.size} item{selectedIds.size > 1 ? "s" : ""} selected
          </span>
          <div className="h-4 w-px bg-[#e5e7eb]" />
          <button
            type="button"
            onClick={handleVerifyNumbers}
            disabled={verifying}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm font-medium text-[#030712] hover:bg-[#f9fafb] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {verifying ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle className="size-4" />
            )}
            {verifying ? "Verifying..." : "Verify"}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        </div>
      )}
    </div>
    </>
  );
}
