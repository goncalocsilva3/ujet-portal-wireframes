"use client";

import { useState } from "react";
import { Info, Search, ChevronRight, Phone, MessageSquare } from "lucide-react";
import { SettingsToggle } from "@/components/settings-toggle";
import { SettingsField } from "@/components/settings-field";

// ─── UnitInput (same pattern as contact-center-details) ──

function UnitInput({
  suffix,
  width = "w-[130px]",
  defaultValue,
}: {
  suffix?: string;
  width?: string;
  defaultValue?: number;
}) {
  return (
    <div
      className={`flex h-9 items-center rounded-md border border-[#e5e7eb] ${width} focus-within:border-[#030712] focus-within:ring-2 focus-within:ring-[#030712]/20`}
    >
      <input
        type="number"
        defaultValue={defaultValue}
        className="h-full flex-1 min-w-0 bg-transparent px-3 text-sm text-[#030712] outline-none"
      />
      {suffix && (
        <span className="shrink-0 pr-3 text-xs text-[#9ca3af]">{suffix}</span>
      )}
    </div>
  );
}

// ─── Toggle Section ──────────────────────────────────────

function ToggleSection({
  title,
  description,
  tooltip,
  enabled,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  tooltip?: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-semibold text-[#030712]">{title}</h3>
            {tooltip && (
              <div className="group relative">
                <Info className="size-3.5 text-[#9ca3af] cursor-help" />
                <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 -translate-x-1/2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                  <div className="w-[280px] rounded-lg bg-[#030712] px-3 py-2 text-xs text-white shadow-lg">
                    {tooltip}
                  </div>
                </div>
              </div>
            )}
          </div>
          <span className="text-xs text-[#6b7280]">{description}</span>
        </div>
        <SettingsToggle enabled={enabled} onChange={onToggle} />
      </div>
      {enabled && children && (
        <div className="border-t border-[#e5e7eb] px-5 py-4">{children}</div>
      )}
    </div>
  );
}

// ─── Static Section ──────────────────────────────────────

function StaticSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold text-[#030712]">{title}</h3>
          {description && (
            <span className="text-xs text-[#6b7280]">{description}</span>
          )}
        </div>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

// ─── Searchable Dropdown ─────────────────────────────────

function SearchableDropdown({
  options,
  defaultValue,
  placeholder = "Search...",
}: {
  options: string[];
  defaultValue?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(defaultValue || options[0]);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#030712] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]"
      >
        <span className="truncate">{selected}</span>
        <svg
          className={`size-3.5 shrink-0 text-[#6b7280] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-[#e5e7eb] px-3 py-2">
            <Search className="size-3.5 text-[#9ca3af]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-sm text-[#030712] placeholder:text-[#9ca3af] outline-none"
              autoFocus
            />
          </div>
          <div className="max-h-[160px] overflow-y-auto py-1">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelected(opt);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full items-center px-3 py-1.5 text-left text-sm transition-colors hover:bg-[#f3f4f6] ${
                    selected === opt
                      ? "font-medium text-[#030712]"
                      : "text-[#6b7280]"
                  }`}
                >
                  {opt}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-xs text-[#9ca3af]">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Toggle with Radio Options ───────────────────────────

function ToggleWithRadio({
  label,
  defaultEnabled = false,
  defaultOption = "Optional",
}: {
  label: string;
  defaultEnabled?: boolean;
  defaultOption?: "Optional" | "Mandatory";
}) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [option, setOption] = useState(defaultOption);

  return (
    <div className="border-b border-[#f3f4f6] py-3 last:border-b-0">
      <div className="flex min-h-[36px] items-center justify-between gap-8">
        <span className="text-sm font-medium text-[#030712]">{label}</span>
        <div className="shrink-0">
          <SettingsToggle enabled={enabled} onChange={setEnabled} />
        </div>
      </div>
      {enabled && (
        <div className="ml-1 mt-2 flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={label.replace(/\s+/g, "-")}
              checked={option === "Optional"}
              onChange={() => setOption("Optional")}
              className="size-4 border-[#e5e7eb] text-[#030712] focus:ring-[#030712]/20"
            />
            <span className="text-sm text-[#030712]">Optional</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={label.replace(/\s+/g, "-")}
              checked={option === "Mandatory"}
              onChange={() => setOption("Mandatory")}
              className="size-4 border-[#e5e7eb] text-[#030712] focus:ring-[#030712]/20"
            />
            <span className="text-sm text-[#030712]">Mandatory</span>
          </label>
        </div>
      )}
    </div>
  );
}

// ─── Disposition Section (shared between calls/outbound/chats) ───

function DispositionSection({
  title,
  description,
  codeListOptions,
  defaultCodeList,
  defaultDispositionEnabled,
  defaultDispositionOption,
  defaultNotesEnabled,
  defaultNotesOption,
}: {
  title: string;
  description: string;
  codeListOptions: string[];
  defaultCodeList?: string;
  defaultDispositionEnabled?: boolean;
  defaultDispositionOption?: "Optional" | "Mandatory";
  defaultNotesEnabled?: boolean;
  defaultNotesOption?: "Optional" | "Mandatory";
}) {
  return (
    <StaticSection title={title} description={description}>
      <div className="flex flex-col">
        {/* Default Disposition Code List */}
        <SettingsField label="Default Disposition Code List">
          <div className="w-[220px]">
            <SearchableDropdown
              options={codeListOptions}
              defaultValue={defaultCodeList}
              placeholder="Search disposition codes..."
            />
          </div>
        </SettingsField>

        {/* Disposition Codes toggle + radio */}
        <ToggleWithRadio
          label="Disposition Codes"
          defaultEnabled={defaultDispositionEnabled}
          defaultOption={defaultDispositionOption}
        />

        {/* Notes toggle + radio */}
        <ToggleWithRadio
          label="Notes"
          defaultEnabled={defaultNotesEnabled}
          defaultOption={defaultNotesOption}
        />

        {/* Manage Disposition Codes */}
        <div className="mt-3 flex min-h-[36px] items-center justify-between gap-8">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-[#030712]">Manage Disposition Codes</span>
            <span className="text-xs text-[#6b7280]">Create, edit, and organize your disposition code lists</span>
          </div>
          <button
            type="button"
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#030712] shadow-sm transition-colors hover:bg-[#f3f4f6]"
          >
            Disposition Codes
            <ChevronRight className="size-3.5 text-[#6b7280]" />
          </button>
        </div>
      </div>
    </StaticSection>
  );
}

// ─── Page ────────────────────────────────────────────────

const dispositionCodeLists = [
  "List 01",
  "List 02",
  "List 03",
  "List 04",
  "List 05",
  "List 06",
];

// ─── Tab Component ───────────────────────────────────────

function WrapUpTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: "calls" | "chats";
  onTabChange: (tab: "calls" | "chats") => void;
}) {
  return (
    <div className="flex gap-1 border-b border-[#e5e7eb]">
      <button
        type="button"
        onClick={() => onTabChange("calls")}
        className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
          activeTab === "calls"
            ? "border-[#030712] text-[#030712]"
            : "border-transparent text-[#6b7280] hover:text-[#030712]"
        }`}
      >
        Calls
      </button>
      <button
        type="button"
        onClick={() => onTabChange("chats")}
        className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
          activeTab === "chats"
            ? "border-[#030712] text-[#030712]"
            : "border-transparent text-[#6b7280] hover:text-[#030712]"
        }`}
      >
        Chats
      </button>
    </div>
  );
}

// ─── Calls Tab Content ───────────────────────────────────

function CallsTabContent() {
  const [autoInbound, setAutoInbound] = useState(false);
  const [autoOutbound, setAutoOutbound] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* ─── Inbound Calls subtitle ─── */}
      <h2 className="text-base font-semibold text-[#030712] -mb-2">Inbound Calls</h2>

      {/* Automatic wrap-up for inbound calls + Disposition inside */}
      <ToggleSection
        title="Automatic Wrap-up for Inbound Calls"
        description="Automatically start wrap-up after inbound calls end."
        enabled={autoInbound}
        onToggle={setAutoInbound}
      >
        <div className="flex flex-col">
          <SettingsField
            label="Available Status"
            description="Switch status to Available after this duration"
            noBorder
          >
            <UnitInput suffix="Seconds" defaultValue={60} />
          </SettingsField>

          {/* Disposition Codes & Notes for Calls — inside inbound section */}
          <div className="border-t border-[#e5e7eb] pt-4 mt-2">
            <h4 className="text-sm font-semibold text-[#030712] mb-3">Disposition Codes & Notes for Calls</h4>

            <SettingsField label="Default Disposition Code List">
              <div className="w-[220px]">
                <SearchableDropdown
                  options={dispositionCodeLists}
                  defaultValue="List 01"
                  placeholder="Search disposition codes..."
                />
              </div>
            </SettingsField>

            <ToggleWithRadio
              label="Disposition Codes"
              defaultEnabled={true}
              defaultOption="Mandatory"
            />

            <ToggleWithRadio
              label="Notes"
              defaultEnabled={false}
              defaultOption="Optional"
            />

            <div className="mt-3 flex min-h-[36px] items-center justify-between gap-8">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-[#030712]">Manage Disposition Codes</span>
                <span className="text-xs text-[#6b7280]">Create, edit, and organize your disposition code lists</span>
              </div>
              <button
                type="button"
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#030712] shadow-sm transition-colors hover:bg-[#f3f4f6]"
              >
                Disposition Codes
                <ChevronRight className="size-3.5 text-[#6b7280]" />
              </button>
            </div>
          </div>
        </div>
      </ToggleSection>

      {/* ─── Outbound Calls subtitle ─── */}
      <h2 className="text-base font-semibold text-[#030712] -mb-2">Outbound Calls</h2>

      {/* Automatic wrap-up for outbound calls + Disposition inside */}
      <ToggleSection
        title="Automatic Wrap-up for Outbound Calls"
        description="Automatically start wrap-up after outbound calls end."
        enabled={autoOutbound}
        onToggle={setAutoOutbound}
      >
        <div className="flex flex-col">
          <SettingsField
            label="Available Status"
            description="Switch status to Available after this duration"
            noBorder
          >
            <UnitInput suffix="Seconds" defaultValue={45} />
          </SettingsField>

          <div className="border-t border-[#e5e7eb] pt-4 mt-2">
            <h4 className="text-sm font-semibold text-[#030712] mb-3">Disposition Codes & Notes for Outbound Calls</h4>

            <SettingsField label="Default Disposition Code List">
              <div className="w-[220px]">
                <SearchableDropdown
                  options={dispositionCodeLists}
                  defaultValue="List 01"
                  placeholder="Search disposition codes..."
                />
              </div>
            </SettingsField>

            <ToggleWithRadio
              label="Disposition Codes"
              defaultEnabled={false}
              defaultOption="Optional"
            />

            <ToggleWithRadio
              label="Notes"
              defaultEnabled={false}
              defaultOption="Optional"
            />

            <div className="mt-3 flex min-h-[36px] items-center justify-between gap-8">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-[#030712]">Manage Disposition Codes</span>
                <span className="text-xs text-[#6b7280]">Create, edit, and organize your disposition code lists</span>
              </div>
              <button
                type="button"
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#030712] shadow-sm transition-colors hover:bg-[#f3f4f6]"
              >
                Disposition Codes
                <ChevronRight className="size-3.5 text-[#6b7280]" />
              </button>
            </div>
          </div>
        </div>
      </ToggleSection>
    </div>
  );
}

// ─── Chats Tab Content ───────────────────────────────────

function ChatsTabContent() {
  const [autoChats, setAutoChats] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Automatic wrap-up for chats + Disposition inside */}
      <ToggleSection
        title="Automatic Wrap-up for Chats"
        description="Automatically start wrap-up after chat sessions end."
        enabled={autoChats}
        onToggle={setAutoChats}
      >
        <div className="flex flex-col">
          <SettingsField
            label="Available Status"
            description="Switch status to Available after this duration"
            noBorder
          >
            <UnitInput suffix="Seconds" defaultValue={30} />
          </SettingsField>

          <label className="flex items-start gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              defaultChecked
              className="mt-0.5 size-4 rounded border-[#e5e7eb] text-[#030712] focus:ring-[#030712]/20"
            />
            <span className="text-sm text-[#030712]">
              Continue the wrap-up after the disposition code or note is submitted, if the allowed wrap-up time has not elapsed
            </span>
          </label>

          <div className="border-t border-[#e5e7eb] pt-4 mt-2">
            <h4 className="text-sm font-semibold text-[#030712] mb-3">Disposition Codes & Notes for Chats</h4>

            <SettingsField label="Default Disposition Code List">
              <div className="w-[220px]">
                <SearchableDropdown
                  options={dispositionCodeLists}
                  defaultValue="List 01"
                  placeholder="Search disposition codes..."
                />
              </div>
            </SettingsField>

            <ToggleWithRadio
              label="Disposition Codes"
              defaultEnabled={true}
              defaultOption="Optional"
            />

            <ToggleWithRadio
              label="Notes"
              defaultEnabled={false}
              defaultOption="Optional"
            />

            <div className="mt-3 flex min-h-[36px] items-center justify-between gap-8">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-[#030712]">Manage Disposition Codes</span>
                <span className="text-xs text-[#6b7280]">Create, edit, and organize your disposition code lists</span>
              </div>
              <button
                type="button"
                className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#030712] shadow-sm transition-colors hover:bg-[#f3f4f6]"
              >
                Disposition Codes
                <ChevronRight className="size-3.5 text-[#6b7280]" />
              </button>
            </div>
          </div>
        </div>
      </ToggleSection>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────

export function WrapUpPage() {
  const [wrapUpExceeded, setWrapUpExceeded] = useState(false);
  const [activeTab, setActiveTab] = useState<"calls" | "chats">("calls");

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* 1. Wrap-up Exceeded */}
      <ToggleSection
        title="Wrap-up Exceeded"
        description={wrapUpExceeded ? "Disable Wrap-up Exceeded behaviour." : "Enable Wrap-up Exceeded behaviour."}
        tooltip="Agents who exceed wrap-up time will stop receiving new calls and chats until they finish all in-progress."
        enabled={wrapUpExceeded}
        onToggle={setWrapUpExceeded}
      />

      {/* Tabs: Calls / Chats */}
      <WrapUpTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab content */}
      {activeTab === "calls" ? <CallsTabContent /> : <ChatsTabContent />}
    </div>
  );
}
