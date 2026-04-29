"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Check, ChevronDown } from "lucide-react";
import { SettingsSection } from "@/components/settings-section";
import { SettingsToggle } from "@/components/settings-toggle";
import { SettingsField } from "@/components/settings-field";
import { AlertDialog } from "@/components/alert-dialog";
import { Toast } from "@/components/toast";
import { useDirtyTracking, useTrackedState } from "@/lib/dirty-tracking";

function Dropdown({
  value,
  options,
  onChange,
  width = 160,
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

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-4 rounded border-[#e5e7eb] text-[#030712] focus:ring-[#030712]/20"
      />
      <span className="text-sm text-[#030712]">{label}</span>
    </label>
  );
}

function Radio({
  name,
  label,
  checked,
  onChange,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="size-4 border-[#e5e7eb] text-[#030712] focus:ring-[#030712]/20"
      />
      <span className="text-sm text-[#030712]">{label}</span>
    </label>
  );
}

function ExtensionsSection() {
  const [length, setLength] = useTrackedState("3 digits");
  const lengthOptions = Array.from(
    { length: 8 },
    (_, i) => `${i + 3} digits`
  );
  return (
    <SettingsSection title="Extensions" collapsible={false}>
      <SettingsField
        label="Extensions length"
        description="You can allow between 3 and 10 digits. All previous extensions are maintained when updated."
        noBorder
      >
        <Dropdown
          value={length}
          options={lengthOptions}
          onChange={setLength}
          width={130}
        />
      </SettingsField>
    </SettingsSection>
  );
}

function AgentToAgentCallsSection() {
  const [enabled, setEnabled] = useTrackedState(true);
  const [autoAnswer, setAutoAnswer] = useTrackedState(false);
  const [declineCall, setDeclineCall] = useTrackedState(false);
  const [missedThreshold, setMissedThreshold] = useTrackedState("33");
  const [unresponsiveThreshold, setUnresponsiveThreshold] = useTrackedState("33");
  const [applyInCall, setApplyInCall] = useTrackedState(false);

  return (
    <SettingsSection
      title="Agent to Agent Calls"
      description="Allow agents to call each other using extension numbers"
      collapsible={false}
      headerRight={<SettingsToggle enabled={enabled} onChange={setEnabled} />}
    >
      {enabled && (
        <div className="flex flex-col">
          <SettingsField label="Enable Auto-Answer" noBorder>
            <SettingsToggle enabled={autoAnswer} onChange={setAutoAnswer} />
          </SettingsField>
          <SettingsField label="Enable declining call" noBorder>
            <SettingsToggle enabled={declineCall} onChange={setDeclineCall} />
          </SettingsField>

          <div className="border-t border-[#e5e7eb]">
            <SettingsField
              label="Missed Call Threshold"
              description="Switch agent to 'Missed Call' status when they do not pick up for"
              noBorder
            >
              <NumberInput
                value={missedThreshold}
                onChange={setMissedThreshold}
                suffix="Calls"
              />
            </SettingsField>
          </div>

          <div className="border-t border-[#e5e7eb]">
            <SettingsField
              label="Unresponsive Threshold"
              description="Switch agent to Unresponsive when agent can't be reached for"
              noBorder
            >
              <NumberInput
                value={unresponsiveThreshold}
                onChange={setUnresponsiveThreshold}
                suffix="Count"
              />
            </SettingsField>
            <div className="pb-1">
              <Checkbox
                label="Apply unresponsive thresholds when agent is in an active call session"
                checked={applyInCall}
                onChange={setApplyInCall}
              />
            </div>
          </div>
        </div>
      )}
    </SettingsSection>
  );
}

function ConsumerToAgentCallsSection() {
  const [enabled, setEnabled] = useTrackedState(true);
  const [autoAnswer, setAutoAnswer] = useTrackedState(false);
  const [declineCall, setDeclineCall] = useTrackedState(false);
  const [extInputEnabled, setExtInputEnabled] = useTrackedState(false);
  const [waitSeconds, setWaitSeconds] = useTrackedState("10");
  const [announceMessage, setAnnounceMessage] = useTrackedState(false);
  const [messageSource, setMessageSource] = useTrackedState<"tts" | "upload">("tts");
  const [missedThreshold, setMissedThreshold] = useTrackedState("33");
  const [unresponsiveThreshold, setUnresponsiveThreshold] = useTrackedState("33");
  const [applyInCall, setApplyInCall] = useTrackedState(false);

  return (
    <SettingsSection
      title="Consumer to Agent Calls"
      description="Allow consumers to reach a specific agent using an extension number"
      collapsible={false}
      headerRight={<SettingsToggle enabled={enabled} onChange={setEnabled} />}
    >
      {enabled && (
        <div className="flex flex-col">
          <SettingsField label="Enable Auto-Answer" noBorder>
            <SettingsToggle enabled={autoAnswer} onChange={setAutoAnswer} />
          </SettingsField>
          <SettingsField label="Enable declining call" noBorder>
            <SettingsToggle enabled={declineCall} onChange={setDeclineCall} />
          </SettingsField>

          <div className="border-t border-[#e5e7eb]">
            <div className="py-3">
              <span className="text-sm font-semibold text-[#030712]">
                Extension Input Settings
              </span>
            </div>
            <SettingsField
              label="Enable extension input at the beginning of a call"
              noBorder
            >
              <SettingsToggle
                enabled={extInputEnabled}
                onChange={setExtInputEnabled}
              />
            </SettingsField>
            {extInputEnabled && (
              <div className="mb-3 ml-[7px] flex flex-col border-l border-[#e5e7eb] pl-[16px]">
                <SettingsField
                  label="Time of waiting for extension number input"
                  noBorder
                >
                  <NumberInput
                    value={waitSeconds}
                    onChange={setWaitSeconds}
                    suffix="Seconds"
                  />
                </SettingsField>
                <div className="py-3">
                  <Checkbox
                    label="Extension input announcement message"
                    checked={announceMessage}
                    onChange={setAnnounceMessage}
                  />
                  {announceMessage && (
                    <div className="ml-[7px] mt-3 flex flex-col gap-3 border-l border-[#e5e7eb] pl-[16px]">
                      <div>
                        <Radio
                          name="ext-message-source"
                          label="Text-to-speech"
                          checked={messageSource === "tts"}
                          onChange={() => setMessageSource("tts")}
                        />
                        {messageSource === "tts" && (
                          <div className="ml-6 mt-2">
                            <textarea
                              placeholder="Enter announcement message..."
                              rows={3}
                              className="w-full resize-y rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#030712] outline-none transition-colors placeholder:text-[#9ca3af] focus:border-[#030712] focus:ring-2 focus:ring-[#030712]/20"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <Radio
                          name="ext-message-source"
                          label="Upload audio recording"
                          checked={messageSource === "upload"}
                          onChange={() => setMessageSource("upload")}
                        />
                        {messageSource === "upload" && (
                          <div className="ml-6 mt-2">
                            <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[#d1d5db] bg-[#fafafa] px-4 py-6">
                              <span className="text-sm text-[#6b7280]">
                                Drag and drop audio file here
                              </span>
                              <button
                                type="button"
                                className="rounded-md border border-[#e5e7eb] bg-white px-3 py-1.5 text-sm font-medium text-[#030712] shadow-sm transition-colors hover:bg-[#fafafa]"
                              >
                                Add file
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-[#e5e7eb]">
            <SettingsField
              label="Missed Call Threshold"
              description="Switch agent to 'Missed Call' status when they do not pick up for"
              noBorder
            >
              <NumberInput
                value={missedThreshold}
                onChange={setMissedThreshold}
                suffix="Calls"
              />
            </SettingsField>
          </div>

          <div className="border-t border-[#e5e7eb]">
            <SettingsField
              label="Unresponsive Threshold"
              description="Switch agent to Unresponsive when agent can't be reached for"
              noBorder
            >
              <NumberInput
                value={unresponsiveThreshold}
                onChange={setUnresponsiveThreshold}
                suffix="Count"
              />
            </SettingsField>
            <div className="pb-1">
              <Checkbox
                label="Apply unresponsive thresholds when agent is in an active call session"
                checked={applyInCall}
                onChange={setApplyInCall}
              />
            </div>
          </div>
        </div>
      )}
    </SettingsSection>
  );
}

function AgentExtensionsContent() {
  const [extensionsEnabled, setExtensionsEnabled] = useTrackedState(true);
  const [showDisableDialog, setShowDisableDialog] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <SettingsSection
        title="Enable Agent Extensions"
        description="Allow agents to have direct-dial extension numbers"
        collapsible={false}
        headerRight={
          <SettingsToggle
            enabled={extensionsEnabled}
            onChange={(v) => {
              if (!v) {
                setShowDisableDialog(true);
              } else {
                setExtensionsEnabled(true);
              }
            }}
          />
        }
      />
      {extensionsEnabled && (
        <>
          <ExtensionsSection />
          <AgentToAgentCallsSection />
          <ConsumerToAgentCallsSection />
        </>
      )}

      <AlertDialog
        open={showDisableDialog}
        onCancel={() => setShowDisableDialog(false)}
        onConfirm={() => {
          setExtensionsEnabled(false);
          setShowDisableDialog(false);
        }}
        title="Disable Agent Extensions"
        description="Are you sure you want to disable Agent Extensions? Agents will no longer have direct-dial extension numbers, and all related settings will be hidden."
        confirmLabel="Disable"
        confirmVariant="primary"
      />
    </div>
  );
}

export function AgentExtensionsPage({
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
        <AgentExtensionsContent key={resetKey} />

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
