"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, Image as ImageIcon, ChevronDown, X } from "lucide-react";
import { SettingsSection } from "@/components/settings-section";
import { SettingsField } from "@/components/settings-field";
import { AlertDialog } from "@/components/alert-dialog";
import { Toast } from "@/components/toast";

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

function MetricsFilterDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="flex h-9 items-center gap-2 rounded-md border border-[#e5e7eb] bg-white px-4 text-sm font-medium text-[#030712] shadow-sm transition-colors hover:bg-[#fafafa]"
      >
        {value}
        <ChevronDown className={`size-3 text-[#6b7280] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-32 rounded-md border border-[#e5e7eb] bg-white py-1 shadow-lg">
          {["Calls", "Chats"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(opt); setOpen(false); }}
              className={`flex w-full items-center px-4 py-2 text-sm transition-colors hover:bg-[#f3f4f6] ${value === opt ? "font-medium text-[#030712]" : "text-[#6b7280]"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TargetMetricsSection() {
  const [channel, setChannel] = useState("Calls");

  return (
    <SettingsSection
      title="Target Metrics"
      collapsible={false}
      headerRight={<MetricsFilterDropdown value={channel} onChange={setChannel} />}
    >
      {channel === "Calls" ? (
        <div>
          <SettingsField label="Target Session CSAT">
            <UnitInput suffix="Stars" defaultValue={3} />
          </SettingsField>
          <SettingsField label="Repeat Contact Time Period">
            <UnitInput suffix="Hours" defaultValue={24} />
          </SettingsField>
          <SettingsField label="Service Level Target">
            <div className="flex items-center gap-2">
              <UnitInput suffix="%" width="w-[100px]" defaultValue={90} />
              <span className="text-xs text-[#6b7280]">in</span>
              <UnitInput suffix="Seconds" defaultValue={200} />
            </div>
          </SettingsField>
          <SettingsField label="Target Pick Up Time">
            <UnitInput suffix="Seconds" defaultValue={11} />
          </SettingsField>
        </div>
      ) : (
        <div>
          <SettingsField label="Target Session CSAT">
            <UnitInput suffix="Stars" defaultValue={3} />
          </SettingsField>
          <SettingsField label="Repeat Contact Time Period">
            <UnitInput suffix="Hours" defaultValue={24} />
          </SettingsField>
          <SettingsField label="Service Level Target">
            <div className="flex items-center gap-2">
              <UnitInput suffix="%" width="w-[100px]" defaultValue={80} />
              <span className="text-xs text-[#6b7280]">in</span>
              <UnitInput suffix="Seconds" defaultValue={30} />
            </div>
          </SettingsField>
          <SettingsField label="Concurrency Target">
            <UnitInput defaultValue={3} />
          </SettingsField>
          <SettingsField label="Target Pick Up Time">
            <UnitInput suffix="Seconds" defaultValue={30} />
          </SettingsField>
        </div>
      )}
    </SettingsSection>
  );
}

export function ContactCenterDetailsPage({ onNavigateAttempt, sidebarCollapsed }: { onNavigateAttempt?: (cb: (href: string, label: string) => boolean) => void; sidebarCollapsed?: boolean }) {
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingNav, setPendingNav] = useState<{ href: string; label: string } | null>(null);

  // Controlled field values
  const [centerName, setCenterName] = useState("CX");
  const [email, setEmail] = useState("cx@ujet.pt");
  const [timeout, setTimeout_] = useState("1024");

  // Avatar upload
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track which fields have been touched (show errors only after blur or save attempt)
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [saveAttempted, setSaveAttempted] = useState(false);

  // Validation
  const errors = {
    centerName: centerName.trim() === "" ? "This field is mandatory" : null,
    email: email.trim() === ""
      ? "This field is mandatory"
      : /\s/.test(email)
        ? "Email must not contain spaces"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "Please enter a valid email address. Example: username@domain.com"
          : null,
    timeout: timeout.trim() === "" || Number(timeout) < 1 ? "Value must be at least 1" : null,
  };

  const hasErrors = Object.values(errors).some((e) => e !== null);
  const showError = (field: string) => (touched[field] || saveAttempted) && errors[field as keyof typeof errors];

  const handleChange = () => {
    if (!isDirty) setIsDirty(true);
  };

  const handleSave = () => {
    setSaveAttempted(true);
    if (hasErrors) return;
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      setIsDirty(false);
      setSaveAttempted(false);
      setTouched({});
      setShowToast(true);
    }, 800);
  };

  const handleDiscard = () => {
    setCenterName("CX");
    setEmail("cx@ujet.pt");
    setTimeout_("1024");
    setAvatarUrl(null);
    setIsDirty(false);
    setSaveAttempted(false);
    setTouched({});
  };

  // Use a ref to always have the latest isDirty value
  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  // Called from parent to check if navigation should be blocked
  const checkUnsaved = useCallback((href: string, label: string): boolean => {
    if (isDirtyRef.current) {
      setPendingNav({ href, label });
      setShowLeaveDialog(true);
      return false; // block navigation
    }
    return true; // allow navigation
  }, []);

  // Register the guard with parent — keep it updated
  useEffect(() => {
    onNavigateAttempt?.(checkUnsaved);
  }, [onNavigateAttempt, checkUnsaved]);

  return (
    <div className="flex flex-col gap-6 pb-20" onChange={handleChange} onClick={(e) => {
      const target = e.target as HTMLElement;
      if (target.closest('button[role="switch"]') || target.closest('input[type="checkbox"]') || target.closest('select')) {
        handleChange();
      }
    }}>
      {/* Section 1: Contact Center Details */}
      <SettingsSection title="Contact Center Details" collapsible={false}>
        {/* Sub-heading: General Contact Center Details */}
        {/* Contact Center Name */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-medium text-[#030712]">
            Contact Center Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={centerName}
            onChange={(e) => { setCenterName(e.target.value); handleChange(); }}
            onBlur={() => setTouched((p) => ({ ...p, centerName: true }))}
            placeholder="Enter contact center name"
            className={`h-9 w-full rounded-md border px-3 text-sm text-[#030712] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712] ${showError("centerName") ? "border-red-500" : "border-[#e5e7eb]"}`}
          />
          {showError("centerName") ? (
            <span className="text-xs text-red-500">{errors.centerName}</span>
          ) : (
            <span className="text-xs text-[#6b7280]">
              Contact center name displayed in your UJET account
            </span>
          )}
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
            Support Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => { setEmail(e.target.value); handleChange(); }}
            onBlur={() => setTouched((p) => ({ ...p, email: true }))}
            placeholder="Enter support email address"
            className={`h-9 w-full rounded-md border px-3 text-sm text-[#030712] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712] ${showError("email") ? "border-red-500" : "border-[#e5e7eb]"}`}
          />
          {showError("email") ? (
            <span className="text-xs text-red-500">{errors.email}</span>
          ) : (
            <span className="text-xs text-[#6b7280]">
              Forwarding email address for support emails
            </span>
          )}
        </div>

        {/* Timeout — right-aligned field */}
        <div className="border-t border-[#e5e7eb] my-1" />
        <div className="py-3 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[#f3f4f6]">
          <div className="flex items-center justify-between gap-8">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-[#030712]">
                Timeout
              </span>
              <span className="text-xs text-[#6b7280]">Time before logging out a user for no activity</span>
            </div>
            <div className="shrink-0">
              <div className={`flex h-9 items-center rounded-md border w-[130px] focus-within:ring-2 focus-within:ring-[#030712]/20 focus-within:border-[#030712] ${showError("timeout") ? "border-red-500" : "border-[#e5e7eb]"}`}>
                <input
                  type="number"
                  value={timeout}
                  onChange={(e) => { setTimeout_(e.target.value); handleChange(); }}
                  onBlur={() => setTouched((p) => ({ ...p, timeout: true }))}
                  className="h-full flex-1 min-w-0 bg-transparent px-3 text-sm text-[#030712] outline-none"
                />
                <span className="shrink-0 pr-3 text-xs text-[#9ca3af]">Minutes</span>
              </div>
            </div>
          </div>
          {showError("timeout") && (
            <span className="mt-1.5 block text-right text-xs text-red-500">{errors.timeout}</span>
          )}
        </div>

        {/* Default Avatar — right-aligned field */}
        <SettingsField label="Default Avatar" description="Upload a .png or .jpg that is 512px square or larger" noBorder>
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="size-[40px] shrink-0 rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setAvatarUrl(null); handleChange(); }}
                  className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-[#030712] text-white transition-colors hover:bg-red-600"
                >
                  <X className="size-2.5" />
                </button>
              </div>
            ) : (
              <div className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-[#e5e7eb]">
                <ImageIcon className="size-4 text-[#9ca3af]" />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setAvatarUrl(url);
                  handleChange();
                }
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-9 items-center gap-2 rounded-md border border-[#e5e7eb] px-4 text-sm font-medium text-[#030712] hover:bg-[#f3f4f6] transition-colors"
            >
              <Upload className="size-4" />
              {avatarUrl ? "Change Image" : "Upload Image"}
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
      <TargetMetricsSection />

      {/* Unsaved changes bar */}
      {isDirty && (
        <div className="fixed bottom-0 right-0 z-50 border-t border-[#e5e7eb] bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.04)]" style={{ left: sidebarCollapsed ? "70px" : "322px" }}>
          <div className="mx-auto flex w-full max-w-[860px] items-center justify-between px-6 py-3">
            <span className="text-sm font-medium text-[#030712]">
              You have unsaved changes
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDiscard}
                className="h-9 rounded-lg border border-[#e5e7eb] bg-white px-4 text-sm font-medium text-[#030712] transition-colors hover:bg-[#f3f4f6]"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || hasErrors}
                className="h-9 rounded-lg bg-[#030712] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1a1a2e] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      <Toast
        open={showToast}
        title="Changes saved successfully."
        onClose={() => setShowToast(false)}
        bottomOffset={70}
      />

      {/* Unsaved changes leave dialog */}
      <AlertDialog
        open={showLeaveDialog}
        title="Unsaved Changes"
        description="You have unsaved changes. If you leave this page, your changes will be lost."
        confirmLabel="Discard and leave"
        cancelLabel="Stay"
        onConfirm={() => {
          setShowLeaveDialog(false);
          setIsDirty(false);
          if (pendingNav) {
            const nav = pendingNav;
            setPendingNav(null);
            window.dispatchEvent(new CustomEvent("force-navigate", { detail: nav }));
          }
        }}
        onCancel={() => {
          setShowLeaveDialog(false);
          setPendingNav(null);
        }}
      />
    </div>
  );
}
