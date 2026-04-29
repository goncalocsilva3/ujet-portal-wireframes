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

function AgentNotificationsSection() {
  const [notifyNewCall, setNotifyNewCall] = useTrackedState(true);
  const [playSound, setPlaySound] = useTrackedState(true);
  const [sound, setSound] = useTrackedState("Default ringtone");
  const [desktopNotifications, setDesktopNotifications] = useTrackedState(true);

  return (
    <SettingsSection title="Agent Notifications" collapsible={false}>
      <SettingsField
        label="Notify agent of new call"
        description="Show a notification when a new call is assigned."
      >
        <SettingsToggle
          enabled={notifyNewCall}
          onChange={setNotifyNewCall}
        />
      </SettingsField>
      <SettingsField label="Play notification sound">
        <SettingsToggle enabled={playSound} onChange={setPlaySound} />
      </SettingsField>
      <SettingsField label="Notification sound">
        <Dropdown
          value={sound}
          options={[
            "Default ringtone",
            "Subtle chime",
            "Classic phone",
            "Soft ping",
            "None",
          ]}
          onChange={setSound}
        />
      </SettingsField>
      <SettingsField label="Show desktop notifications" noBorder>
        <SettingsToggle
          enabled={desktopNotifications}
          onChange={setDesktopNotifications}
        />
      </SettingsField>
    </SettingsSection>
  );
}

function AgentMessagesSection() {
  const [showPreCall, setShowPreCall] = useTrackedState(true);
  const [showInCallReminders, setShowInCallReminders] = useTrackedState(false);
  const [reminderInterval, setReminderInterval] = useTrackedState("5");
  const [showWrapUpReminder, setShowWrapUpReminder] = useTrackedState(true);

  return (
    <SettingsSection title="Agent Messages" collapsible={false}>
      <SettingsField
        label="Show pre-call message"
        description="Display a message to the agent before connecting the call."
      >
        <SettingsToggle enabled={showPreCall} onChange={setShowPreCall} />
      </SettingsField>
      <SettingsField label="Show in-call reminders">
        <SettingsToggle
          enabled={showInCallReminders}
          onChange={setShowInCallReminders}
        />
      </SettingsField>
      <SettingsField
        label="Reminder interval"
        description="How often to remind agents during a call."
      >
        <NumberInput
          value={reminderInterval}
          onChange={setReminderInterval}
          suffix="Minutes"
        />
      </SettingsField>
      <SettingsField label="Show wrap-up reminder" noBorder>
        <SettingsToggle
          enabled={showWrapUpReminder}
          onChange={setShowWrapUpReminder}
        />
      </SettingsField>
    </SettingsSection>
  );
}

export function AgentCallMessagesPage({
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
          <AgentNotificationsSection />
          <AgentMessagesSection />
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
