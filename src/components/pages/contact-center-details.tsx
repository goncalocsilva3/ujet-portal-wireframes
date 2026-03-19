"use client";

import { Upload, Image as ImageIcon } from "lucide-react";
import { SettingsSection } from "@/components/settings-section";
import { SettingsField } from "@/components/settings-field";

function UnitInput({ suffix, width = "w-[130px]", defaultValue }: { suffix?: string; width?: string; defaultValue?: number }) {
  return (
    <div className={`flex h-9 items-center rounded-md border border-[#e5e7eb] ${width} focus-within:ring-2 focus-within:ring-[#030712]/20 focus-within:border-[#030712]`}>
      <input
        type="number"
        defaultValue={defaultValue}
        className="h-full flex-1 min-w-0 bg-transparent px-3 text-sm text-[#030712] outline-none"
      />
      {suffix && (
        <span className="shrink-0 pr-3 text-xs text-[#9ca3af]">
          {suffix}
        </span>
      )}
    </div>
  );
}

export function ContactCenterDetailsPage() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Section 1: Support Center Details */}
      <SettingsSection title="Support Center Details" collapsible={false}>
        {/* Sub-heading: General Support Center Details */}
        <h4 className="text-sm font-medium text-[#030712] mb-4">
          General Support Center Details
        </h4>

        {/* Support Center Name */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-medium text-[#030712]">
            Support Center Name
          </label>
          <input
            type="text"
            placeholder="Enter support center name"
            className="h-9 w-full rounded-md border border-[#e5e7eb] px-3 text-sm text-[#030712] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]"
          />
          <span className="text-xs text-[#6b7280]">
            Support center name displayed in your UJET account
          </span>
        </div>

        {/* Display Name */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-medium text-[#030712]">
            Display Name
          </label>
          <input
            type="text"
            placeholder="Enter display name"
            className="h-9 w-full rounded-md border border-[#e5e7eb] px-3 text-sm text-[#030712] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]"
          />
          <span className="text-xs text-[#6b7280]">
            Name displayed to your users in your application
          </span>
        </div>

        {/* Support Email Address */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-medium text-[#030712]">
            Support Email Address
          </label>
          <input
            type="text"
            placeholder="Enter support email address"
            className="h-9 w-full rounded-md border border-[#e5e7eb] px-3 text-sm text-[#030712] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]"
          />
          <span className="text-xs text-[#6b7280]">
            Forwarding email address for support emails
          </span>
        </div>

        {/* Timeout — right-aligned field */}
        <div className="border-t border-[#e5e7eb] my-1" />
        <SettingsField label="Timeout" description="Time before logging out a user for no activity">
          <UnitInput suffix="Minutes" defaultValue={15} />
        </SettingsField>

        {/* Default Avatar — right-aligned field */}
        <SettingsField label="Default Avatar" description="Upload a .png or .jpg that is 512px square or larger" noBorder>
          <div className="flex items-center gap-3">
            <div className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#e5e7eb]">
              <ImageIcon className="size-4 text-[#9ca3af]" />
            </div>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-[#e5e7eb] px-4 text-sm font-medium text-[#030712] hover:bg-[#f3f4f6] transition-colors"
            >
              <Upload className="size-4" />
              Upload Image
            </button>
          </div>
        </SettingsField>
        <div className="py-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="size-4 rounded border-[#e5e7eb] text-[#006ee3] focus:ring-[#006ee3]/20"
            />
            <span className="text-sm text-[#030712]">
              Overwrite all uploaded Avatars with default
            </span>
          </label>
        </div>
      </SettingsSection>

      {/* Section 2: Target Metrics */}
      <SettingsSection title="Target Metrics" collapsible={false}>
        {/* Call metrics */}
        <h4 className="text-sm font-medium text-[#030712] mb-1">Call</h4>
        <div>
          <SettingsField label="Target Session CSAT">
            <UnitInput suffix="Stars" />
          </SettingsField>
          <SettingsField label="Repeat Contact Time Period">
            <UnitInput suffix="Hours" />
          </SettingsField>
          <SettingsField label="Service Level Target">
            <div className="flex items-center gap-2">
              <UnitInput suffix="%" width="w-[100px]" />
              <span className="text-xs text-[#6b7280]">in</span>
              <UnitInput suffix="Seconds" />
            </div>
          </SettingsField>
          <SettingsField label="Target Pick Up Time">
            <UnitInput suffix="Seconds" />
          </SettingsField>
        </div>

        <div className="border-t border-[#e5e7eb] my-5" />

        {/* Chat metrics */}
        <h4 className="text-sm font-medium text-[#030712] mb-1">Chat</h4>
        <div>
          <SettingsField label="Target Session CSAT">
            <UnitInput suffix="Stars" />
          </SettingsField>
          <SettingsField label="Repeat Contact Time Period">
            <UnitInput suffix="Hours" />
          </SettingsField>
          <SettingsField label="Service Level Target">
            <div className="flex items-center gap-2">
              <UnitInput suffix="%" width="w-[100px]" />
              <span className="text-xs text-[#6b7280]">in</span>
              <UnitInput suffix="Seconds" />
            </div>
          </SettingsField>
          <SettingsField label="Concurrency Target">
            <UnitInput />
          </SettingsField>
          <SettingsField label="Target Pick Up Time">
            <UnitInput suffix="Seconds" />
          </SettingsField>
        </div>
      </SettingsSection>
    </div>
  );
}
