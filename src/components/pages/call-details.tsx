"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Check, ChevronDown, Info } from "lucide-react";
import { SettingsSection } from "@/components/settings-section";
import { SettingsToggle } from "@/components/settings-toggle";
import { SettingsField } from "@/components/settings-field";
import { AlertDialog } from "@/components/alert-dialog";
import { Toast } from "@/components/toast";
import { useDirtyTracking, useTrackedState } from "@/lib/dirty-tracking";

function MinutesInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex h-9 w-[130px] items-center rounded-md border border-[#e5e7eb] focus-within:border-[#030712] focus-within:ring-2 focus-within:ring-[#030712]/20">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-[#030712] outline-none"
      />
      <span className="shrink-0 pr-3 text-xs text-[#9ca3af]">Minutes</span>
    </div>
  );
}

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
        <ChevronDown className={`size-3.5 text-[#6b7280] transition-transform ${open ? "rotate-180" : ""}`} />
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

function InfoIcon({ hint }: { hint?: string }) {
  return (
    <Info
      className="size-3.5 shrink-0 text-[#9ca3af]"
      aria-label={hint}
    />
  );
}

function Checkbox({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
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
      {hint && <InfoIcon hint={hint} />}
    </label>
  );
}

function Radio({
  name,
  label,
  checked,
  onChange,
  disabled,
}: {
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <label className={`flex items-center gap-2 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="size-4 border-[#e5e7eb] text-[#030712] focus:ring-[#030712]/20 disabled:cursor-not-allowed"
      />
      <span className="text-sm text-[#030712]">{label}</span>
    </label>
  );
}

function RecordBranch({
  label,
  checked,
  onChange,
  redaction,
  setRedaction,
  playMessage,
  setPlayMessage,
  playMessageLabel = "Play Call Recording Message",
  askPermission,
  setAskPermission,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  redaction: boolean;
  setRedaction: (v: boolean) => void;
  playMessage: boolean;
  setPlayMessage: (v: boolean) => void;
  playMessageLabel?: string;
  askPermission?: boolean;
  setAskPermission?: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Checkbox label={label} checked={checked} onChange={onChange} />
      {checked && (
        <div className="ml-[7px] flex flex-col gap-2 border-l border-[#e5e7eb] pl-[16px]">
          <Checkbox
            label="Enable Call Recording Redaction for agents"
            checked={redaction}
            onChange={setRedaction}
            hint="Allow agents to redact sensitive sections of the recording."
          />
          <Checkbox
            label={playMessageLabel}
            checked={playMessage}
            onChange={setPlayMessage}
            hint="Play a recording disclosure message to the caller."
          />
          {setAskPermission && playMessage && (
            <div className="ml-[7px] border-l border-[#e5e7eb] pl-[16px]">
              <Checkbox
                label="Ask User Permission To Record"
                checked={askPermission ?? false}
                onChange={setAskPermission}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CallRecordingSection() {
  const [useRecording, setUseRecording] = useTrackedState(true);

  const [recordInbound, setRecordInbound] = useTrackedState(true);
  const [inboundRedaction, setInboundRedaction] = useTrackedState(true);
  const [inboundPlayMsg, setInboundPlayMsg] = useTrackedState(true);
  const [inboundAskPermission, setInboundAskPermission] = useTrackedState(true);

  const [recordCallback, setRecordCallback] = useTrackedState(true);
  const [callbackRedaction, setCallbackRedaction] = useTrackedState(true);
  const [callbackPlayMsg, setCallbackPlayMsg] = useTrackedState(true);

  const [recordAgentInit, setRecordAgentInit] = useTrackedState(true);
  const [agentInitRedaction, setAgentInitRedaction] = useTrackedState(true);
  const [agentInitPlayMsg, setAgentInitPlayMsg] = useTrackedState(true);
  const [agentInitAskPermission, setAgentInitAskPermission] = useTrackedState(true);

  const [recordDirectInbound, setRecordDirectInbound] = useTrackedState(true);
  const [recordAgentToAgent, setRecordAgentToAgent] = useTrackedState(true);
  const [continueWhenConsumerLeaves, setContinueWhenConsumerLeaves] = useTrackedState(true);
  const [continueThirdParty, setContinueThirdParty] = useTrackedState(true);
  const [continueEmergency, setContinueEmergency] = useTrackedState(true);
  const [dualChannel, setDualChannel] = useTrackedState(true);

  const [recordingSeparation, setRecordingSeparation] = useTrackedState<"None" | "Per Segment">("Per Segment");
  const [messageSequence, setMessageSequence] = useTrackedState<"permission-first" | "recording-first">("permission-first");

  return (
    <SettingsSection
      title="Call Recording"
      description="Enable call recording for Inbound and Outbound Calls"
      collapsible={false}
      headerRight={<SettingsToggle enabled={useRecording} onChange={setUseRecording} />}
    >
      {useRecording && (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold text-[#030712]">Inbound and Outbound Calls Recording</span>
          <RecordBranch
            label="Record Inbound Calls"
            checked={recordInbound}
            onChange={setRecordInbound}
            redaction={inboundRedaction}
            setRedaction={setInboundRedaction}
            playMessage={inboundPlayMsg}
            setPlayMessage={setInboundPlayMsg}
            askPermission={inboundAskPermission}
            setAskPermission={setInboundAskPermission}
          />
          <RecordBranch
            label="Record Callback Outbound Calls"
            checked={recordCallback}
            onChange={setRecordCallback}
            redaction={callbackRedaction}
            setRedaction={setCallbackRedaction}
            playMessage={callbackPlayMsg}
            setPlayMessage={setCallbackPlayMsg}
            playMessageLabel="Play Call Recording Messages"
          />
          <RecordBranch
            label="Record Agent Initiated Outbound Calls"
            checked={recordAgentInit}
            onChange={setRecordAgentInit}
            redaction={agentInitRedaction}
            setRedaction={setAgentInitRedaction}
            playMessage={agentInitPlayMsg}
            setPlayMessage={setAgentInitPlayMsg}
            askPermission={agentInitAskPermission}
            setAskPermission={setAgentInitAskPermission}
          />
          <Checkbox label="Record Direct Inbound Calls" checked={recordDirectInbound} onChange={setRecordDirectInbound} />
          <Checkbox label="Record Agent-to-Agent Calls" checked={recordAgentToAgent} onChange={setRecordAgentToAgent} />
          <Checkbox
            label="Continue call recording when the consumer leaves the call"
            checked={continueWhenConsumerLeaves}
            onChange={setContinueWhenConsumerLeaves}
          />
          <Checkbox
            label="Continue call recording to Third Party Numbers after the agent leaves the call"
            checked={continueThirdParty}
            onChange={setContinueThirdParty}
          />
          <Checkbox
            label="Continue call recording to Emergency Numbers after the agent leaves the call"
            checked={continueEmergency}
            onChange={setContinueEmergency}
          />
          <Checkbox label="Use Dual Channel Recording" checked={dualChannel} onChange={setDualChannel} />

          <div className="mt-2 flex flex-col gap-2 border-t border-[#e5e7eb] pt-4">
            <span className="text-sm font-semibold text-[#030712]">Recording Separation</span>
            <Radio
              name="recording-separation"
              label="None"
              checked={recordingSeparation === "None"}
              onChange={() => setRecordingSeparation("None")}
            />
            <Radio
              name="recording-separation"
              label="Per Segment"
              checked={recordingSeparation === "Per Segment"}
              onChange={() => setRecordingSeparation("Per Segment")}
            />
          </div>

          <div className="mt-2 flex flex-col gap-2 border-t border-[#e5e7eb] pt-4">
            <span className="text-sm font-semibold text-[#030712]">Recording Message Sequence for Outbound Calls</span>
            <Radio
              name="message-sequence"
              label="Play Ask Permission to Record message before Call Recording message"
              checked={messageSequence === "permission-first"}
              onChange={() => setMessageSequence("permission-first")}
            />
            <Radio
              name="message-sequence"
              label="Play Call Recording message before Ask Permission to Record message"
              checked={messageSequence === "recording-first"}
              onChange={() => setMessageSequence("recording-first")}
            />
          </div>
        </div>
      )}
    </SettingsSection>
  );
}

function CallHistorySection() {
  const [enabled, setEnabled] = useTrackedState(true);
  return (
    <SettingsSection
      title="Call History"
      description="Enable agents to view previously completed calls"
      collapsible={false}
      headerRight={<SettingsToggle enabled={enabled} onChange={setEnabled} />}
    />
  );
}

function HoldTimeCounterSection() {
  const [enabled, setEnabled] = useTrackedState(true);
  return (
    <SettingsSection
      title="Hold Time Counter"
      description="Show hold time counter on adapter while the call is on hold"
      collapsible={false}
      headerRight={<SettingsToggle enabled={enabled} onChange={setEnabled} />}
    />
  );
}

function LeaveOngoingCallsSection() {
  const [agentLeave, setAgentLeave] = useTrackedState(true);
  const [consumerLeave, setConsumerLeave] = useTrackedState(true);
  return (
    <SettingsSection title="Leave Ongoing Calls with 3rd Parties" collapsible={false}>
      <SettingsField
        label="Allow an agent to leave a call after adding a 3rd party without ending the call"
        hint="Additional charges may apply"
      >
        <SettingsToggle enabled={agentLeave} onChange={setAgentLeave} />
      </SettingsField>
      <SettingsField
        label="Allow a consumer to leave a call without ending the call"
        hint="Additional charges may apply"
      >
        <SettingsToggle enabled={consumerLeave} onChange={setConsumerLeave} />
      </SettingsField>
    </SettingsSection>
  );
}

function CustomCallbackNumberSection() {
  const [enabled, setEnabled] = useTrackedState(true);
  const [retries, setRetries] = useTrackedState("3 times");
  const retryOptions = Array.from({ length: 10 }, (_, i) => `${i + 1} ${i === 0 ? "time" : "times"}`);
  return (
    <SettingsSection
      title="Custom Callback Number Option"
      description="Enable customers to leave a custom callback phone number"
      collapsible={false}
      headerRight={<SettingsToggle enabled={enabled} onChange={setEnabled} />}
    >
      {enabled && (
        <SettingsField
          label="Attempts to leave custom callback number"
          description="Number of times a customer can retry leaving a custom callback number before the call ends"
          noBorder
        >
          <Dropdown value={retries} options={retryOptions} onChange={setRetries} width={140} />
        </SettingsField>
      )}
    </SettingsSection>
  );
}

function QueueSelectionForOutboundSection() {
  const [enabled, setEnabled] = useTrackedState(true);
  const [onlyAssignedQueues, setOnlyAssignedQueues] = useTrackedState(false);
  return (
    <SettingsSection
      title="Queue Selection for Outbound Call"
      description="Enable agents to select a queue for Agent initiated outbound call"
      collapsible={false}
      headerRight={<SettingsToggle enabled={enabled} onChange={setEnabled} />}
    >
      {enabled && (
        <SettingsField
          label="Only allow queues to which the selected outbound number is assigned to"
          noBorder
        >
          <SettingsToggle enabled={onlyAssignedQueues} onChange={setOnlyAssignedQueues} />
        </SettingsField>
      )}
    </SettingsSection>
  );
}

function ConnectingMessagePlaybackSection() {
  const [enabled, setEnabled] = useTrackedState(false);
  return (
    <SettingsSection
      title="Connecting Message Playback"
      description="Skip the Connecting Message Playback"
      collapsible={false}
      headerRight={<SettingsToggle enabled={enabled} onChange={setEnabled} />}
    />
  );
}

function IVRSection() {
  const [fallbackPlays, setFallbackPlays] = useTrackedState("1 times");
  const [fallbackAction, setFallbackAction] = useTrackedState<
    "first" | "last" | "voicemail" | "end" | "specific"
  >("first");
  const [dialZeroBehavior, setDialZeroBehavior] = useTrackedState<
    "back" | "transfer" | "none"
  >("back");
  const [enableQueueLevelOverride, setEnableQueueLevelOverride] = useTrackedState(true);

  const playOptions = Array.from(
    { length: 5 },
    (_, i) => `${i + 1} ${i === 0 ? "times" : "times"}`
  );

  return (
    <SettingsSection title="IVR" collapsible={false}>
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold text-[#030712]">
          Fallback IVR Navigation
        </span>
        <SettingsField
          label="Absence of IVR menu selection"
          description="Number of times the IVR menu should play if the customer does not make a selection"
          noBorder
        >
          <Dropdown
            value={fallbackPlays}
            options={playOptions}
            onChange={setFallbackPlays}
            width={110}
          />
        </SettingsField>
        <span className="text-sm font-medium text-[#030712]">
          Following fallback action
        </span>
        <div className="mt-1 flex flex-col gap-2">
          <Radio
            name="fallback-action"
            label="Select the first available menu"
            checked={fallbackAction === "first"}
            onChange={() => setFallbackAction("first")}
          />
          <Radio
            name="fallback-action"
            label="Select the last available menu"
            checked={fallbackAction === "last"}
            onChange={() => setFallbackAction("last")}
          />
          <Radio
            name="fallback-action"
            label="Direct to voicemail"
            checked={fallbackAction === "voicemail"}
            onChange={() => setFallbackAction("voicemail")}
          />
          <Radio
            name="fallback-action"
            label="End call"
            checked={fallbackAction === "end"}
            onChange={() => setFallbackAction("end")}
          />
          <Radio
            name="fallback-action"
            label="Select a specific menu"
            checked={fallbackAction === "specific"}
            onChange={() => setFallbackAction("specific")}
          />
        </div>

        <div className="mt-2 flex flex-col gap-2 border-t border-[#e5e7eb] pt-4">
          <span className="text-sm font-semibold text-[#030712]">
            End User Dial &apos;0&apos; Behaviour
          </span>
          <div className="mt-1 flex flex-col gap-2">
            <Radio
              name="dial-zero"
              label="Dialing '0' moves user back up one level in IVR"
              checked={dialZeroBehavior === "back"}
              onChange={() => setDialZeroBehavior("back")}
            />
            <Radio
              name="dial-zero"
              label="Dialing '0' transfers user to another queue:"
              checked={dialZeroBehavior === "transfer"}
              onChange={() => setDialZeroBehavior("transfer")}
            />
            <Radio
              name="dial-zero"
              label="Dialing '0' results in no action by the IVR"
              checked={dialZeroBehavior === "none"}
              onChange={() => setDialZeroBehavior("none")}
            />
          </div>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-sm text-[#030712]">
              Enable queue level Dial &apos;0&apos; override behavior
              <InfoIcon hint="Allow individual queues to override the global Dial '0' behavior" />
            </span>
            <SettingsToggle
              enabled={enableQueueLevelOverride}
              onChange={setEnableQueueLevelOverride}
            />
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}

function UnansweredCallsSection() {
  const [expiration, setExpiration] = useTrackedState("30");
  const [transferredExpiration, setTransferredExpiration] = useTrackedState("30");

  return (
    <SettingsSection title="Unanswered Calls" collapsible={false}>
      <SettingsField
        label="Unanswered Call Expiration"
        description="Time before automatically ending the call if it is unanswered and in queue"
      >
        <MinutesInput value={expiration} onChange={setExpiration} />
      </SettingsField>
      <SettingsField
        label="Unanswered Transfered Call Expiration"
        description="Time before automatically ending a transferred call if it is unanswered and in queue"
      >
        <MinutesInput value={transferredExpiration} onChange={setTransferredExpiration} />
      </SettingsField>
    </SettingsSection>
  );
}

export function CallDetailsPage({
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
  const [pendingNav, setPendingNav] = useState<{ href: string; label: string } | null>(null);
  // Bumping this key unmounts and re-mounts the sub-sections. Used by Discard
  // to reset all nested state back to defaults.
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

  const checkUnsaved = useCallback((href: string, label: string): boolean => {
    if (isDirtyRef.current) {
      setPendingNav({ href, label });
      setShowLeaveDialog(true);
      return false;
    }
    return true;
  }, []);

  useEffect(() => {
    onNavigateAttempt?.(checkUnsaved);
  }, [onNavigateAttempt, checkUnsaved]);

  return (
    <Provider>
      <div className="flex flex-col gap-4 pb-20">
        <div key={resetKey} className="flex flex-col gap-4">
          <CallRecordingSection />
          <UnansweredCallsSection />
          <IVRSection />
          <LeaveOngoingCallsSection />
          <CallHistorySection />
          <HoldTimeCounterSection />
          <CustomCallbackNumberSection />
          <QueueSelectionForOutboundSection />
          <ConnectingMessagePlaybackSection />
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
