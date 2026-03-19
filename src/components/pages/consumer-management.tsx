"use client";

import { SettingsSection } from "@/components/settings-section";
import { SettingsField } from "@/components/settings-field";
import { SettingsToggle } from "@/components/settings-toggle";

export function ConsumerManagementPage() {
  return (
    <div className="flex flex-col gap-6 pb-6">
      <SettingsSection title="Consumer Privacy" description="Configure data privacy and retention policies" collapsible={true}>
        <SettingsField label="Enable Data Anonymization" description="Automatically anonymize consumer data after case resolution">
          <SettingsToggle enabled={false} />
        </SettingsField>
        <SettingsField label="Data Retention Period" description="How long consumer data is retained before deletion">
          <select className="h-8 w-48 rounded-md border border-[#e5e7eb] px-3 text-sm text-[#030712] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]">
            <option>30 days</option>
            <option>90 days</option>
            <option>180 days</option>
            <option>1 year</option>
            <option>Never</option>
          </select>
        </SettingsField>
        <SettingsField label="Allow Data Export Requests" description="Enable consumers to request an export of their data">
          <SettingsToggle enabled={true} />
        </SettingsField>
        <SettingsField label="GDPR Compliance Mode" description="Enable strict GDPR data handling procedures">
          <SettingsToggle enabled={true} />
        </SettingsField>
      </SettingsSection>

      <SettingsSection title="Phone Number Blocklist" description="Manage blocked phone numbers to prevent unwanted contacts" collapsible={true}>
        <SettingsField label="Enable Blocklist" description="Automatically reject calls from blocked numbers">
          <SettingsToggle enabled={true} />
        </SettingsField>
        <SettingsField label="Blocked Numbers Count" description="Total numbers currently on the blocklist">
          <span className="text-sm font-medium text-[#030712]">142</span>
        </SettingsField>
        <SettingsField label="Auto-block Spam Callers" description="Automatically add identified spam callers to the blocklist">
          <SettingsToggle enabled={false} />
        </SettingsField>
      </SettingsSection>
    </div>
  );
}
