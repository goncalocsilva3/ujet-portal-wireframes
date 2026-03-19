"use client";

import { useState } from "react";
import { SettingsToggle } from "@/components/settings-toggle";

// ─── Toggle Section Component ────────────────────────────

function ToggleSection({
  title,
  description,
  enabled,
  onToggle,
  children,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-semibold text-[#030712]">{title}</h3>
          <span className="text-xs text-[#6b7280]">{description}</span>
        </div>
        <SettingsToggle enabled={enabled} onChange={onToggle} />
      </div>
      {enabled && (
        <div className="border-t border-[#e5e7eb] px-5 py-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Static Section Component ────────────────────────────

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

// ─── Field helpers ───────────────────────────────────────

function FieldGroup({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#030712]">{label}</label>
      {children}
      {helper && <span className="text-xs text-[#6b7280]">{helper}</span>}
    </div>
  );
}

function TextInput({ placeholder }: { placeholder: string }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className="h-9 w-full rounded-md border border-[#e5e7eb] px-3 text-sm text-[#030712] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]"
    />
  );
}

function NumberInputWithUnit({
  defaultValue,
  unit,
}: {
  defaultValue?: number;
  unit: string;
}) {
  return (
    <div className="flex h-9 w-[130px] items-center rounded-md border border-[#e5e7eb] focus-within:ring-2 focus-within:ring-[#030712]/20 focus-within:border-[#030712]">
      <input
        type="number"
        defaultValue={defaultValue}
        className="h-full flex-1 min-w-0 bg-transparent px-3 text-sm text-[#030712] outline-none"
      />
      <span className="flex h-full items-center border-l border-[#e5e7eb] px-3 text-xs text-[#6b7280] bg-[#f9fafb] rounded-r-md">
        {unit}
      </span>
    </div>
  );
}

function SelectInput({
  options,
  defaultValue,
}: {
  options: string[];
  defaultValue?: string;
}) {
  return (
    <select
      defaultValue={defaultValue}
      className="h-9 w-full rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#030712] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]"
    >
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  );
}

// ─── Inline row field (label left, control right) ────────

function InlineField({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-8 py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[#f3f4f6]">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-[#030712]">{label}</span>
        {description && (
          <span className="text-xs text-[#6b7280]">{description}</span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────

export function WrapUpPage() {
  const [wrapUpExceeded, setWrapUpExceeded] = useState(true);
  const [autoInbound, setAutoInbound] = useState(true);
  const [autoOutbound, setAutoOutbound] = useState(false);
  const [autoChats, setAutoChats] = useState(false);

  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* 1. Wrap-up Exceeded (toggle) */}
      <ToggleSection
        title="Wrap-up Exceeded"
        description="Configure behavior when wrap-up time is exceeded."
        enabled={wrapUpExceeded}
        onToggle={setWrapUpExceeded}
      >
        <div className="flex flex-col gap-4">
          <InlineField
            label="Maximum Wrap-up Time"
            description="Time allowed before wrap-up is considered exceeded"
          >
            <NumberInputWithUnit defaultValue={120} unit="Seconds" />
          </InlineField>
          <InlineField
            label="Action on Exceeded"
            description="What happens when wrap-up time runs out"
          >
            <SelectInput
              options={["Auto-close wrap-up", "Send notification", "Force ready"]}
              defaultValue="Auto-close wrap-up"
            />
          </InlineField>
        </div>
      </ToggleSection>

      {/* 2. Automatic wrap-up for inbound calls (toggle) */}
      <ToggleSection
        title="Automatic Wrap-up for Inbound Calls"
        description="Automatically start wrap-up after inbound calls end."
        enabled={autoInbound}
        onToggle={setAutoInbound}
      >
        <div className="flex flex-col gap-4">
          <InlineField
            label="Wrap-up Duration"
            description="Default duration for automatic wrap-up"
          >
            <NumberInputWithUnit defaultValue={60} unit="Seconds" />
          </InlineField>
          <InlineField
            label="Allow Extension"
            description="Allow agents to extend the wrap-up timer"
          >
            <SettingsToggle enabled={true} />
          </InlineField>
        </div>
      </ToggleSection>

      {/* 3. Disposition Codes & Notes for Calls */}
      <StaticSection
        title="Disposition Codes & Notes for Calls"
        description="Configure disposition codes and notes requirements for call wrap-up."
      >
        <div className="flex flex-col gap-4">
          <InlineField
            label="Require Disposition Code"
            description="Agents must select a disposition code before completing wrap-up"
          >
            <SettingsToggle enabled={true} />
          </InlineField>
          <InlineField
            label="Require Notes"
            description="Agents must enter notes before completing wrap-up"
          >
            <SettingsToggle enabled={false} />
          </InlineField>
          <InlineField
            label="Minimum Note Length"
            description="Minimum number of characters required for notes"
          >
            <NumberInputWithUnit defaultValue={0} unit="Chars" />
          </InlineField>
        </div>
      </StaticSection>

      {/* 4. Automatic wrap-up for outbound calls (toggle) */}
      <ToggleSection
        title="Automatic Wrap-up for Outbound Calls"
        description="Automatically start wrap-up after outbound calls end."
        enabled={autoOutbound}
        onToggle={setAutoOutbound}
      >
        <div className="flex flex-col gap-4">
          <InlineField
            label="Wrap-up Duration"
            description="Default duration for automatic wrap-up"
          >
            <NumberInputWithUnit defaultValue={45} unit="Seconds" />
          </InlineField>
          <InlineField
            label="Allow Extension"
            description="Allow agents to extend the wrap-up timer"
          >
            <SettingsToggle enabled={false} />
          </InlineField>
        </div>
      </ToggleSection>

      {/* 5. Disposition Codes & Notes for Outbound Calls */}
      <StaticSection
        title="Disposition Codes & Notes for Outbound Calls"
        description="Configure disposition codes and notes requirements for outbound call wrap-up."
      >
        <div className="flex flex-col gap-4">
          <InlineField
            label="Require Disposition Code"
            description="Agents must select a disposition code before completing wrap-up"
          >
            <SettingsToggle enabled={false} />
          </InlineField>
          <InlineField
            label="Require Notes"
            description="Agents must enter notes before completing wrap-up"
          >
            <SettingsToggle enabled={false} />
          </InlineField>
        </div>
      </StaticSection>

      {/* 6. Automatic wrap-up for chats (toggle) */}
      <ToggleSection
        title="Automatic Wrap-up for Chats"
        description="Automatically start wrap-up after chat sessions end."
        enabled={autoChats}
        onToggle={setAutoChats}
      >
        <div className="flex flex-col gap-4">
          <InlineField
            label="Wrap-up Duration"
            description="Default duration for automatic wrap-up"
          >
            <NumberInputWithUnit defaultValue={30} unit="Seconds" />
          </InlineField>
          <InlineField
            label="Allow Extension"
            description="Allow agents to extend the wrap-up timer"
          >
            <SettingsToggle enabled={true} />
          </InlineField>
        </div>
      </ToggleSection>

      {/* 7. Disposition Codes & Notes for Chats */}
      <StaticSection
        title="Disposition Codes & Notes for Chats"
        description="Configure disposition codes and notes requirements for chat wrap-up."
      >
        <div className="flex flex-col gap-4">
          <InlineField
            label="Require Disposition Code"
            description="Agents must select a disposition code before completing wrap-up"
          >
            <SettingsToggle enabled={true} />
          </InlineField>
          <InlineField
            label="Require Notes"
            description="Agents must enter notes before completing wrap-up"
          >
            <SettingsToggle enabled={true} />
          </InlineField>
          <InlineField
            label="Minimum Note Length"
            description="Minimum number of characters required for notes"
          >
            <NumberInputWithUnit defaultValue={10} unit="Chars" />
          </InlineField>
        </div>
      </StaticSection>
    </div>
  );
}
