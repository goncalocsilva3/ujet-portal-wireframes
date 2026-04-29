"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
    <label className="flex cursor-pointer items-center gap-2">
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

function DirectInboundCallsSection() {
  const [declineEnabled, setDeclineEnabled] = useTrackedState(true);
  const [autoAnswerEnabled, setAutoAnswerEnabled] = useTrackedState(false);

  return (
    <SettingsSection title="Direct Inbound Calls" collapsible={false}>
      <SettingsField
        label="Enable declining call for direct inbound calls"
        hint="Overcapacity deflections for agents must be configured at the global, team, or agent level to make the Decline button available in the Agent Adapter."
        noBorder
      >
        <SettingsToggle
          enabled={declineEnabled}
          onChange={setDeclineEnabled}
        />
      </SettingsField>
      <div className="border-t border-[#e5e7eb]">
        <SettingsField
          label="Enable Auto-Answer for direct inbound calls to agents"
          noBorder
        >
          <SettingsToggle
            enabled={autoAnswerEnabled}
            onChange={setAutoAnswerEnabled}
          />
        </SettingsField>
      </div>
    </SettingsSection>
  );
}

function DirectInboundThresholdsSection() {
  const [missedThreshold, setMissedThreshold] = useTrackedState("1");
  const [unresponsiveCount, setUnresponsiveCount] = useTrackedState("3");
  const [applyDuringActiveCall, setApplyDuringActiveCall] = useTrackedState(false);

  return (
    <SettingsSection title="Direct Inbound Thresholds" collapsible={false}>
      <SettingsField
        label="Missed Call Threshold"
        description="Switch agent to ‘Missed Call’ status when they do not pick up for"
      >
        <NumberInput
          value={missedThreshold}
          onChange={setMissedThreshold}
          suffix="Calls"
        />
      </SettingsField>
      <SettingsField
        label="Unresponsive Threshold"
        description="Switch agent to Unresponsive when agent can’t be reached for"
        noBorder
      >
        <NumberInput
          value={unresponsiveCount}
          onChange={setUnresponsiveCount}
          suffix="Count"
        />
      </SettingsField>
      <div className="pb-1">
        <Checkbox
          label="Apply unresponsive thresholds when agent is in an active call session"
          checked={applyDuringActiveCall}
          onChange={setApplyDuringActiveCall}
        />
      </div>
    </SettingsSection>
  );
}

export function DirectInboundPage({
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
          <DirectInboundCallsSection />
          <DirectInboundThresholdsSection />
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
