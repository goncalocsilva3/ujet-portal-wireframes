"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Check, ChevronDown } from "lucide-react";
import { SettingsSection } from "@/components/settings-section";
import { SettingsField } from "@/components/settings-field";
import { SettingsToggle } from "@/components/settings-toggle";
import { AlertDialog } from "@/components/alert-dialog";
import { Toast } from "@/components/toast";
import { useDirtyTracking, useTrackedState } from "@/lib/dirty-tracking";

function NumberInput({
  value,
  onChange,
  suffix,
  width = 130,
}: {
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  width?: number;
}) {
  return (
    <div
      className="flex h-9 items-center rounded-md border border-[#e5e7eb] focus-within:border-[#030712] focus-within:ring-2 focus-within:ring-[#030712]/20"
      style={{ width }}
    >
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[#030712] outline-none"
      />
      {suffix && (
        <span className="shrink-0 pr-3 text-xs text-[#9ca3af]">{suffix}</span>
      )}
    </div>
  );
}

function Dropdown({
  value,
  options,
  onChange,
  width = 200,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  width?: number;
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
    <div ref={ref} className="relative" style={{ width }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-[#e5e7eb] bg-white px-3 text-sm text-[#030712] shadow-sm transition-colors hover:bg-[#fafafa]"
      >
        <span>{value}</span>
        <ChevronDown
          className={`size-3.5 text-[#6b7280] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-[#e5e7eb] bg-white py-1 shadow-lg">
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

function VoicemailSection() {
  const [enabled, setEnabled] = useTrackedState(true);
  const [maxLength, setMaxLength] = useTrackedState("3");
  const [greeting, setGreeting] = useTrackedState("Default greeting");
  const [requirePin, setRequirePin] = useTrackedState(false);

  return (
    <SettingsSection title="Voicemail" collapsible={false}>
      <SettingsField
        label="Enable voicemail"
        description="Allow callers to leave a voicemail when no agent is available."
      >
        <SettingsToggle enabled={enabled} onChange={setEnabled} />
      </SettingsField>
      <SettingsField label="Maximum voicemail length">
        <NumberInput
          value={maxLength}
          onChange={setMaxLength}
          suffix="Minutes"
        />
      </SettingsField>
      <SettingsField label="Voicemail greeting">
        <Dropdown
          value={greeting}
          options={[
            "Default greeting",
            "After-hours greeting",
            "Custom recording",
          ]}
          onChange={setGreeting}
        />
      </SettingsField>
      <SettingsField label="Require PIN to access voicemail" noBorder>
        <SettingsToggle enabled={requirePin} onChange={setRequirePin} />
      </SettingsField>
    </SettingsSection>
  );
}

function VoicemailDeliverySection() {
  const [emailToAgent, setEmailToAgent] = useTrackedState(true);
  const [transcribe, setTranscribe] = useTrackedState(true);
  const [autoDelete, setAutoDelete] = useTrackedState("30 days");
  const [notifyByEmail, setNotifyByEmail] = useTrackedState(true);

  return (
    <SettingsSection title="Voicemail Delivery" collapsible={false}>
      <SettingsField
        label="Email voicemail to agent"
        description="Send a copy of voicemails to the assigned agent."
      >
        <SettingsToggle enabled={emailToAgent} onChange={setEmailToAgent} />
      </SettingsField>
      <SettingsField label="Transcribe voicemail messages">
        <SettingsToggle enabled={transcribe} onChange={setTranscribe} />
      </SettingsField>
      <SettingsField label="Send email notification on new voicemail">
        <SettingsToggle
          enabled={notifyByEmail}
          onChange={setNotifyByEmail}
        />
      </SettingsField>
      <SettingsField label="Auto-delete voicemails after" noBorder>
        <Dropdown
          value={autoDelete}
          options={["7 days", "14 days", "30 days", "60 days", "90 days", "Never"]}
          onChange={setAutoDelete}
        />
      </SettingsField>
    </SettingsSection>
  );
}

export function VoicemailPage({
  onNavigateAttempt,
  sidebarCollapsed,
}: {
  onNavigateAttempt?: (cb: (href: string, label: string) => boolean) => void;
  sidebarCollapsed?: boolean;
} = {}) {
  const { isDirty, Provider, markSaved, reset } = useDirtyTracking();
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingNav, setPendingNav] = useState<{
    href: string;
    label: string;
  } | null>(null);
  const [resetKey, setResetKey] = useState(0);

  const handleSave = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      markSaved();
      setShowToast(true);
    }, 800);
  };

  const handleDiscard = () => {
    reset();
    setResetKey((k) => k + 1);
  };

  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  const checkUnsaved = useCallback(
    (href: string, label: string): boolean => {
      if (isDirtyRef.current) {
        setPendingNav({ href, label });
        setShowLeaveDialog(true);
        return false;
      }
      return true;
    },
    []
  );

  useEffect(() => {
    onNavigateAttempt?.(checkUnsaved);
  }, [onNavigateAttempt, checkUnsaved]);

  return (
    <Provider>
      <div className="flex flex-col gap-4 pb-20">
        <div key={resetKey} className="flex flex-col gap-4">
          <VoicemailSection />
          <VoicemailDeliverySection />
        </div>

        {isDirty && (
          <div
            className="fixed bottom-0 right-0 z-50 border-t border-[#e5e7eb] bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.04)]"
            style={{ left: sidebarCollapsed ? "70px" : "322px" }}
          >
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
                  disabled={saving}
                  className="h-9 rounded-lg bg-[#030712] px-4 text-sm font-medium text-white transition-colors hover:bg-[#1a1a2e] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        <Toast
          open={showToast}
          title="Changes saved successfully."
          onClose={() => setShowToast(false)}
          bottomOffset={70}
        />

        <AlertDialog
          open={showLeaveDialog}
          title="Unsaved Changes"
          description="You have unsaved changes. If you leave this page, your changes will be lost."
          confirmLabel="Discard and leave"
          cancelLabel="Stay"
          onConfirm={() => {
            setShowLeaveDialog(false);
            reset();
            if (pendingNav) {
              const nav = pendingNav;
              setPendingNav(null);
              window.dispatchEvent(
                new CustomEvent("force-navigate", { detail: nav })
              );
            }
          }}
          onCancel={() => {
            setShowLeaveDialog(false);
            setPendingNav(null);
          }}
        />
      </div>
    </Provider>
  );
}
