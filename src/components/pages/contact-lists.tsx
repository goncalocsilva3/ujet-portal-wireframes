"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Search, Pencil, Trash2, Plus, Upload, Folder, ChevronLeft, ChevronRight, ChevronDown, X, Info } from "lucide-react";
import { SettingsSection } from "@/components/settings-section";
import { SettingsField } from "@/components/settings-field";
import { SettingsToggle } from "@/components/settings-toggle";
import { Toast } from "@/components/toast";
import { AlertDialog } from "@/components/alert-dialog";
import { useDirtyTracking, useTrackedState } from "@/lib/dirty-tracking";

// Module-level cache acts as the "saved" snapshot for the toggle states. It
// survives component unmounts so a fresh mount restores the last-saved values.
// Local component state holds in-progress edits until the user clicks Save.
const contactListSettingsCache = {
  globalAccessEnabled: true,
  sipUriEnabled: false,
  personalListEnabled: true,
};

function ContactListSettingsForm({
  onSavedRef,
}: {
  onSavedRef: React.MutableRefObject<(() => void) | null>;
}) {
  const [globalAccessEnabled, setGlobalAccessEnabled] = useTrackedState(
    contactListSettingsCache.globalAccessEnabled
  );
  const [sipUriEnabled, setSipUriEnabled] = useTrackedState(
    contactListSettingsCache.sipUriEnabled
  );
  const [personalListEnabled, setPersonalListEnabled] = useTrackedState(
    contactListSettingsCache.personalListEnabled
  );

  // Expose a write-to-cache callback to the parent's save handler.
  onSavedRef.current = () => {
    contactListSettingsCache.globalAccessEnabled = globalAccessEnabled;
    contactListSettingsCache.sipUriEnabled = sipUriEnabled;
    contactListSettingsCache.personalListEnabled = personalListEnabled;
  };

  return (
    <SettingsSection title="Contact Lists" collapsible={false}>
      <SettingsField label="Access to global contact list">
        <SettingsToggle
          enabled={globalAccessEnabled}
          onChange={setGlobalAccessEnabled}
        />
      </SettingsField>
      <SettingsField label="Display SIP URI address in Agent Adapter">
        <SettingsToggle
          enabled={sipUriEnabled}
          onChange={setSipUriEnabled}
        />
      </SettingsField>
      <SettingsField label="Personal Contact List">
        <SettingsToggle
          enabled={personalListEnabled}
          onChange={setPersonalListEnabled}
        />
      </SettingsField>
    </SettingsSection>
  );
}

export function ContactListSettingsTab({
  onNavigateAttempt,
  onTabSwitchAttempt,
  sidebarCollapsed,
}: {
  onNavigateAttempt?: (cb: (href: string, label: string) => boolean) => void;
  onTabSwitchAttempt?: (cb: () => boolean) => void;
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
  const onSavedRef = useRef<(() => void) | null>(null);

  const handleSave = () => {
    setSaving(true);
    window.setTimeout(() => {
      onSavedRef.current?.();
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

  // Tab switch within the page: if dirty, block the switch and prompt the
  // user (same convention as page navigation).
  const checkTabSwitch = useCallback((): boolean => {
    if (isDirtyRef.current) {
      setShowLeaveDialog(true);
      return false;
    }
    return true;
  }, []);

  useEffect(() => {
    onNavigateAttempt?.(checkUnsaved);
    onTabSwitchAttempt?.(checkTabSwitch);
  }, [onNavigateAttempt, onTabSwitchAttempt, checkUnsaved, checkTabSwitch]);

  return (
    <Provider>
      <div className="flex flex-col gap-6 pb-20">
        <ContactListSettingsForm key={resetKey} onSavedRef={onSavedRef} />

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

interface ContactList {
  id: string;
  name: string;
  contacts: number;
}

const contactLists: ContactList[] = [
  { id: "1", name: "Global Contact List", contacts: 500 },
  { id: "2", name: "Contact List 2", contacts: 87 },
  { id: "3", name: "Contact List 3", contacts: 342 },
  { id: "4", name: "Contact List 4", contacts: 128 },
  { id: "5", name: "Contact List 5", contacts: 264 },
  { id: "6", name: "Contact List 6", contacts: 156 },
  { id: "7", name: "Contact List 7", contacts: 62 },
  { id: "8", name: "Contact List 8", contacts: 417 },
  { id: "9", name: "Contact List 9", contacts: 193 },
  { id: "10", name: "Contact List 10", contacts: 78 },
  { id: "11", name: "Contact List 11", contacts: 376 },
  { id: "12", name: "Contact List 12", contacts: 41 },
  { id: "13", name: "Contact List 13", contacts: 209 },
  { id: "14", name: "Contact List 14", contacts: 285 },
  { id: "15", name: "Contact List 15", contacts: 112 },
  { id: "16", name: "Contact List 16", contacts: 461 },
  { id: "17", name: "Contact List 17", contacts: 92 },
  { id: "18", name: "Contact List 18", contacts: 223 },
  { id: "19", name: "Contact List 19", contacts: 134 },
  { id: "20", name: "Contact List 20", contacts: 398 },
  { id: "21", name: "Contact List 21", contacts: 176 },
  { id: "22", name: "Contact List 22", contacts: 309 },
  { id: "23", name: "Contact List 23", contacts: 54 },
  { id: "24", name: "Contact List 24", contacts: 247 },
  { id: "25", name: "Contact List 25", contacts: 358 },
];

const PAGE_SIZE = 10;

// Module-level caches so add/edit/delete operations on the Contact Lists table
// (and on destinations within a list) survive component remounts — e.g. when
// the user switches tabs or navigates away and comes back.
let listsCache: ContactList[] | null = null;
type DestEdits = {
  added: { id: string; data: NewDestination }[];
  edited: Record<string, NewDestination>;
  deleted: Set<string>;
};
const destEditsByList = new Map<string, DestEdits>();
function getDestEdits(listId: string): DestEdits {
  return (
    destEditsByList.get(listId) ?? { added: [], edited: {}, deleted: new Set() }
  );
}
function setDestEdits(listId: string, partial: Partial<DestEdits>) {
  const cur = getDestEdits(listId);
  destEditsByList.set(listId, { ...cur, ...partial });
}

interface Destination {
  id: string;
  name: string;
  destination: string;
}

const FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Avery", "Quinn", "Drew", "Hayden", "Parker", "Reese", "Sawyer", "Skyler", "Emerson", "Finley", "Harper", "Jules", "Kai", "Nova"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

function generateDestinations(listId: string, count: number): Destination[] {
  const capped = Math.min(count, 120);
  const seed = Number(listId) || 1;
  const rows: Destination[] = [];
  for (let i = 0; i < capped; i++) {
    const firstIdx = (seed * 7 + i * 3) % FIRST_NAMES.length;
    const lastIdx = (seed * 11 + i * 5) % LAST_NAMES.length;
    const first = FIRST_NAMES[firstIdx];
    const last = LAST_NAMES[lastIdx];
    const isPhone = (seed + i) % 2 === 0;
    const phoneDigits = String(2000000000 + ((seed * 31 + i * 97) % 7999999999)).padStart(10, "0");
    const destination = isPhone
      ? `+1 (${phoneDigits.slice(0, 3)}) ${phoneDigits.slice(3, 6)}-${phoneDigits.slice(6, 10)}`
      : `${first}.${last}${i + 1}@example.com`.toLowerCase();
    rows.push({
      id: `${listId}-${i + 1}`,
      name: `${first} ${last}`,
      destination,
    });
  }
  return rows;
}

function ContactListFormModal({
  open,
  mode,
  initialName = "",
  onCancel,
  onSave,
}: {
  open: boolean;
  mode: "create" | "edit";
  initialName?: string;
  onCancel: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const [createCrmRecords, setCreateCrmRecords] = useState(true);
  // Error trigger: user must have typed something, deleted it, AND left the
  // field empty. So we track "had input at some point" + "has been blurred".
  const [nameHadInput, setNameHadInput] = useState(false);
  const [nameBlurred, setNameBlurred] = useState(false);
  // Snapshot of values when the modal opens, used in "edit" mode to detect
  // whether anything changed (and therefore whether Save should be enabled).
  const initialCrmRef = true;

  useEffect(() => {
    if (open) {
      setName(initialName);
      setCreateCrmRecords(true);
      // In edit mode the field starts pre-filled, so it has "had input".
      setNameHadInput(initialName.length > 0);
      setNameBlurred(false);
    }
  }, [open, initialName]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  const trimmed = name.trim();
  const nameError = nameHadInput && nameBlurred && trimmed.length === 0;
  const nameChanged = trimmed !== initialName.trim();
  const crmChanged = createCrmRecords !== initialCrmRef;
  const canSave =
    trimmed.length > 0 &&
    (mode === "create" || nameChanged || crmChanged);
  const title = mode === "create" ? "New Contact List" : "Edit Contact List";
  const saveLabel =
    mode === "create" ? "Create Contact List" : "Save Changes";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onCancel}
    >
      <div
        className="flex w-full max-w-xl flex-col rounded-lg bg-white shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative border-b border-[#e5e7eb] px-6 py-5">
          <h2 className="pr-10 text-xl font-semibold text-[#030712]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#030712] transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="new-list-name"
              className="text-sm font-medium text-[#030712]"
            >
              Name <span className="text-[#e7000b]">*</span>
            </label>
            <input
              id="new-list-name"
              type="text"
              value={name}
              onChange={(e) => {
                const v = e.target.value;
                setName(v);
                if (v.length > 0) setNameHadInput(true);
              }}
              onBlur={() => setNameBlurred(true)}
              placeholder="Enter list name"
              autoFocus
              aria-invalid={nameError}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canSave) onSave(trimmed);
              }}
              className={`h-11 rounded-md border bg-white px-3 text-sm text-[#030712] shadow-sm placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 ${
                nameError
                  ? "border-[#e7000b] focus:border-[#e7000b] focus:ring-[#e7000b]/20"
                  : "border-[#e5e7eb] focus:border-[#030712] focus:ring-[#030712]/20"
              }`}
            />
            {nameError ? (
              <span className="text-xs text-[#e7000b]">
                This field is mandatory
              </span>
            ) : (
              <span className="text-xs text-[#6b7280]">
                A unique name to identify this list.
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-[#030712]">
              List configuration
            </span>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={createCrmRecords}
                onChange={(e) => setCreateCrmRecords(e.target.checked)}
                className="size-4 rounded border-[#e5e7eb] text-[#030712] focus:ring-[#030712]/20"
              />
              <span className="text-sm text-[#030712]">
                Create CRM records for outbound calls
              </span>
              <Info
                className="size-3.5 shrink-0 text-[#9ca3af]"
                aria-label="Changes to this setting will apply only to new contacts. Existing contacts won't be affected."
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#e5e7eb] px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center rounded-lg border border-[#e5e7eb] bg-white px-4 text-sm font-medium text-[#030712] shadow-sm hover:bg-[#f9fafb] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave(trimmed)}
            className="inline-flex h-10 items-center rounded-lg bg-[#030712] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#1a1a2e] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

interface DataParameter {
  id: string;
  field: string;
  value: string;
  type: "fixed" | "dynamic";
}

interface NewDestination {
  name: string;
  method: "sip" | "phone";
  sipUri?: string;
  useSipRefer?: boolean;
  passDataParams?: boolean;
  phoneNumber?: string;
  countryCode?: string;
  createCrmRecords: boolean;
}

const COUNTRY_CODES: { code: string; flag: string; dial: string; name: string }[] = [
  { code: "US", flag: "🇺🇸", dial: "+1", name: "United States" },
  { code: "CA", flag: "🇨🇦", dial: "+1", name: "Canada" },
  { code: "GB", flag: "🇬🇧", dial: "+44", name: "United Kingdom" },
  { code: "DE", flag: "🇩🇪", dial: "+49", name: "Germany" },
  { code: "FR", flag: "🇫🇷", dial: "+33", name: "France" },
  { code: "ES", flag: "🇪🇸", dial: "+34", name: "Spain" },
  { code: "IT", flag: "🇮🇹", dial: "+39", name: "Italy" },
  { code: "PT", flag: "🇵🇹", dial: "+351", name: "Portugal" },
  { code: "NL", flag: "🇳🇱", dial: "+31", name: "Netherlands" },
  { code: "IE", flag: "🇮🇪", dial: "+353", name: "Ireland" },
  { code: "SE", flag: "🇸🇪", dial: "+46", name: "Sweden" },
  { code: "BR", flag: "🇧🇷", dial: "+55", name: "Brazil" },
  { code: "MX", flag: "🇲🇽", dial: "+52", name: "Mexico" },
  { code: "AR", flag: "🇦🇷", dial: "+54", name: "Argentina" },
  { code: "JP", flag: "🇯🇵", dial: "+81", name: "Japan" },
  { code: "CN", flag: "🇨🇳", dial: "+86", name: "China" },
  { code: "IN", flag: "🇮🇳", dial: "+91", name: "India" },
  { code: "AU", flag: "🇦🇺", dial: "+61", name: "Australia" },
];

function CountryCodePicker({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (code: string) => void;
  error?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selected = COUNTRY_CODES.find((c) => c.code === value) ?? COUNTRY_CODES[0];

  useEffect(() => {
    if (!open) return;
    const updatePos = () => {
      const r = triggerRef.current?.getBoundingClientRect();
      if (r) setPos({ top: r.bottom + 4, left: r.left });
    };
    updatePos();
    const handler = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        triggerRef.current?.contains(t) ||
        dropdownRef.current?.contains(t)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex h-11 shrink-0 items-center gap-1.5 rounded-l-md border border-r-0 bg-white px-3 text-sm text-[#030712] shadow-sm transition-colors hover:bg-[#fafafa] ${
          error ? "border-[#e7000b]" : "border-[#e5e7eb]"
        }`}
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span>{selected.dial}</span>
        <ChevronDown
          className={`size-3.5 text-[#6b7280] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && pos && (
        <div
          ref={dropdownRef}
          style={{ position: "fixed", top: pos.top, left: pos.left }}
          className="z-50 max-h-60 w-72 overflow-y-auto rounded-md border border-[#e5e7eb] bg-white py-1 shadow-lg"
        >
          {COUNTRY_CODES.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                onChange(c.code);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-[#f3f4f6] ${
                c.code === value ? "bg-[#f9fafb]" : ""
              }`}
            >
              <span className="text-base leading-none">{c.flag}</span>
              <span className="flex-1 truncate text-[#030712]">{c.name}</span>
              <span className="text-[#6b7280]">{c.dial}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function DestinationFormModal({
  open,
  mode,
  initialData,
  onCancel,
  onSave,
}: {
  open: boolean;
  mode: "create" | "edit";
  initialData?: NewDestination;
  onCancel: () => void;
  onSave: (data: NewDestination) => void;
}) {
  const [name, setName] = useState("");
  const [callMethod, setCallMethod] = useState<"sip" | "phone">("sip");
  const [sipUri, setSipUri] = useState("");
  const [useSipRefer, setUseSipRefer] = useState(false);
  const [passDataParams, setPassDataParams] = useState(false);
  const [dataParams, setDataParams] = useState<DataParameter[]>([]);
  const [includeInMetadata, setIncludeInMetadata] = useState(false);
  const [includeInCrm, setIncludeInCrm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [createCrmRecords, setCreateCrmRecords] = useState(true);
  // Error triggers: user must have typed something, deleted it, AND left the
  // field empty. So we track "had input at some point" + "has been blurred".
  const [nameHadInput, setNameHadInput] = useState(false);
  const [nameBlurred, setNameBlurred] = useState(false);
  const [sipUriHadInput, setSipUriHadInput] = useState(false);
  const [sipUriBlurred, setSipUriBlurred] = useState(false);
  const [phoneHadInput, setPhoneHadInput] = useState(false);
  const [phoneBlurred, setPhoneBlurred] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setCallMethod(initialData.method);
        setSipUri(initialData.sipUri ?? "");
        setUseSipRefer(initialData.useSipRefer ?? false);
        setPassDataParams(initialData.passDataParams ?? false);
        setPhoneNumber(initialData.phoneNumber ?? "");
        setCountryCode(initialData.countryCode ?? "US");
        setCreateCrmRecords(initialData.createCrmRecords);
        // In edit mode prefilled fields count as "had input".
        setNameHadInput(initialData.name.length > 0);
        setSipUriHadInput((initialData.sipUri ?? "").length > 0);
        setPhoneHadInput((initialData.phoneNumber ?? "").length > 0);
      } else {
        setName("");
        setCallMethod("sip");
        setSipUri("");
        setUseSipRefer(false);
        setPassDataParams(false);
        setPhoneNumber("");
        setCountryCode("US");
        setCreateCrmRecords(true);
        setNameHadInput(false);
        setSipUriHadInput(false);
        setPhoneHadInput(false);
      }
      setDataParams([]);
      setIncludeInMetadata(false);
      setIncludeInCrm(false);
      setNameBlurred(false);
      setSipUriBlurred(false);
      setPhoneBlurred(false);
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  const trimmedName = name.trim();
  const trimmedSipUri = sipUri.trim();
  const trimmedPhone = phoneNumber.trim();
  const nameError = nameHadInput && nameBlurred && trimmedName.length === 0;
  const sipUriError =
    callMethod === "sip" &&
    sipUriHadInput &&
    sipUriBlurred &&
    trimmedSipUri.length === 0;
  const phoneError =
    callMethod === "phone" &&
    phoneHadInput &&
    phoneBlurred &&
    trimmedPhone.length === 0;
  const methodValueFilled =
    callMethod === "sip" ? trimmedSipUri.length > 0 : trimmedPhone.length > 0;
  const canSave = trimmedName.length > 0 && methodValueFilled;

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      name: trimmedName,
      method: callMethod,
      sipUri: callMethod === "sip" ? sipUri.trim() : undefined,
      useSipRefer: callMethod === "sip" ? useSipRefer : undefined,
      passDataParams: callMethod === "sip" ? passDataParams : undefined,
      phoneNumber: callMethod === "phone" ? phoneNumber.trim() : undefined,
      countryCode: callMethod === "phone" ? countryCode : undefined,
      createCrmRecords,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={onCancel}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative shrink-0 border-b border-[#e5e7eb] px-6 py-5">
          <h2 className="pr-10 text-xl font-semibold text-[#030712]">
            {mode === "create" ? "Add Destination" : "Edit Destination"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#030712] transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-8 overflow-y-auto px-6 py-6">
          {/* Destination Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="destination-name"
              className="text-sm font-medium text-[#030712]"
            >
              Destination Name <span className="text-[#e7000b]">*</span>
            </label>
            <input
              id="destination-name"
              type="text"
              value={name}
              onChange={(e) => {
                const v = e.target.value;
                setName(v);
                if (v.length > 0) setNameHadInput(true);
              }}
              onBlur={() => setNameBlurred(true)}
              placeholder="Enter the destination name"
              autoFocus
              aria-invalid={nameError}
              className={`h-11 rounded-md border bg-white px-3 text-sm text-[#030712] shadow-sm placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 ${
                nameError
                  ? "border-[#e7000b] focus:border-[#e7000b] focus:ring-[#e7000b]/20"
                  : "border-[#e5e7eb] focus:border-[#030712] focus:ring-[#030712]/20"
              }`}
            />
            {nameError && (
              <span className="text-xs text-[#e7000b]">
                This field is mandatory
              </span>
            )}
          </div>

          {/* Call Method */}
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-[#030712]">
              Call Method
            </span>

            {/* SIP URI Address */}
            <div className="flex flex-col gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="call-method"
                  checked={callMethod === "sip"}
                  onChange={() => setCallMethod("sip")}
                  className="size-4 border-[#e5e7eb] text-[#030712] focus:ring-[#030712]/20"
                />
                <span className="text-sm text-[#030712]">SIP URI Address</span>
              </label>
              {callMethod === "sip" && (
                <div className="ml-[7px] flex flex-col gap-4 border-l border-[#e5e7eb] pl-[16px]">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="sip-destination-uri"
                      className="text-sm font-medium text-[#030712]"
                    >
                      SIP Destination URI <span className="text-[#e7000b]">*</span>
                    </label>
                    <input
                      id="sip-destination-uri"
                      type="text"
                      value={sipUri}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSipUri(v);
                        if (v.length > 0) setSipUriHadInput(true);
                      }}
                      onBlur={() => setSipUriBlurred(true)}
                      placeholder="Enter a SIP URI address"
                      aria-invalid={sipUriError}
                      className={`h-11 rounded-md border bg-white px-3 text-sm text-[#030712] shadow-sm placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 ${
                        sipUriError
                          ? "border-[#e7000b] focus:border-[#e7000b] focus:ring-[#e7000b]/20"
                          : "border-[#e5e7eb] focus:border-[#030712] focus:ring-[#030712]/20"
                      }`}
                    />
                    {sipUriError && (
                      <span className="text-xs text-[#e7000b]">
                        This field is mandatory
                      </span>
                    )}
                  </div>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={useSipRefer}
                      onChange={(e) => setUseSipRefer(e.target.checked)}
                      className="size-4 rounded border-[#e5e7eb] text-[#030712] focus:ring-[#030712]/20"
                    />
                    <span className="text-sm text-[#030712]">
                      Use SIP REFER when available
                    </span>
                    <Info
                      className="size-3.5 shrink-0 text-[#9ca3af]"
                      aria-label="Use SIP REFER for call transfer when supported by the destination."
                    />
                  </label>
                  <div className="flex items-center justify-between gap-4 border-t border-[#e5e7eb] pt-4">
                    <span className="text-sm font-medium text-[#030712]">
                      Pass Data Parameters
                    </span>
                    <SettingsToggle
                      enabled={passDataParams}
                      onChange={setPassDataParams}
                    />
                  </div>
                  {passDataParams && (
                    <div className="flex flex-col gap-6">
                      {/* Data parameters */}
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-[#030712]">
                          Data parameters
                        </span>
                        <div className="overflow-hidden rounded-lg border border-[#e5e7eb]">
                          <table className="w-full">
                            <thead className="bg-[#f9fafb]">
                              <tr>
                                <th className="border-b border-[#e5e7eb] px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                                  Destination Field
                                </th>
                                <th className="border-b border-[#e5e7eb] px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                                  Value
                                </th>
                                <th className="border-b border-[#e5e7eb] px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                                  Type
                                </th>
                                <th className="w-[100px] border-b border-[#e5e7eb] px-3 py-2 text-right text-xs font-medium uppercase tracking-wider text-[#6b7280]">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {dataParams.length === 0 ? (
                                <tr>
                                  <td
                                    colSpan={4}
                                    className="px-3 py-4 text-center text-sm text-[#6b7280]"
                                  >
                                    No destination field added
                                  </td>
                                </tr>
                              ) : (
                                dataParams.map((p) => (
                                  <tr
                                    key={p.id}
                                    className="border-b border-[#e5e7eb] last:border-b-0 hover:bg-[#f9fafb] transition-colors"
                                  >
                                    <td className="px-3 py-2.5 text-sm text-[#030712]">
                                      {p.field}
                                    </td>
                                    <td className="px-3 py-2.5 text-sm text-[#030712]">
                                      {p.value}
                                    </td>
                                    <td className="px-3 py-2.5 text-sm text-[#030712]">
                                      {p.type}
                                    </td>
                                    <td className="px-3 py-2.5">
                                      <div className="flex items-center justify-end gap-1">
                                        <button
                                          type="button"
                                          title="Edit"
                                          className="flex size-7 items-center justify-center rounded-md text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#030712] transition-colors"
                                        >
                                          <Pencil className="size-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          title="Delete"
                                          onClick={() =>
                                            setDataParams((prev) =>
                                              prev.filter((x) => x.id !== p.id)
                                            )
                                          }
                                          className="flex size-7 items-center justify-center rounded-md text-[#6b7280] hover:bg-red-50 hover:text-red-600 transition-colors"
                                        >
                                          <Trash2 className="size-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                          <div className="flex items-center justify-center border-t border-[#e5e7eb] bg-[#f9fafb] py-2">
                            <button
                              type="button"
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#006ee3] hover:text-[#0058b8] transition-colors"
                            >
                              <Plus className="size-4" />
                              Add parameter
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Data Records */}
                      <div className="flex flex-col gap-3">
                        <span className="text-sm font-semibold text-[#030712]">
                          Data Records
                        </span>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={includeInMetadata}
                            onChange={(e) =>
                              setIncludeInMetadata(e.target.checked)
                            }
                            className="size-4 rounded border-[#e5e7eb] text-[#030712] focus:ring-[#030712]/20"
                          />
                          <span className="text-sm text-[#030712]">
                            Include data parameters passed to outbound SIP in
                            metadata files
                          </span>
                        </label>
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={includeInCrm}
                            onChange={(e) => setIncludeInCrm(e.target.checked)}
                            className="size-4 rounded border-[#e5e7eb] text-[#030712] focus:ring-[#030712]/20"
                          />
                          <span className="text-sm text-[#030712]">
                            Include data parameters passed to outbound SIP in
                            CRM records
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Phone number */}
            <div className="flex flex-col gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="call-method"
                  checked={callMethod === "phone"}
                  onChange={() => setCallMethod("phone")}
                  className="size-4 border-[#e5e7eb] text-[#030712] focus:ring-[#030712]/20"
                />
                <span className="text-sm text-[#030712]">Phone number</span>
                <Info
                  className="size-3.5 shrink-0 text-[#9ca3af]"
                  aria-label="Use a PSTN phone number as the destination."
                />
              </label>
              {callMethod === "phone" && (
                <div className="ml-[7px] flex flex-col gap-2 border-l border-[#e5e7eb] pl-[16px]">
                  <label
                    htmlFor="destination-phone"
                    className="text-sm font-medium text-[#030712]"
                  >
                    Destination Phone Number <span className="text-[#e7000b]">*</span>
                  </label>
                  <div className="flex">
                    <CountryCodePicker
                      value={countryCode}
                      onChange={setCountryCode}
                      error={phoneError}
                    />
                    <input
                      id="destination-phone"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        const v = e.target.value;
                        setPhoneNumber(v);
                        if (v.length > 0) setPhoneHadInput(true);
                      }}
                      onBlur={() => setPhoneBlurred(true)}
                      placeholder="Enter a phone number"
                      aria-invalid={phoneError}
                      className={`h-11 min-w-0 flex-1 rounded-l-none rounded-r-md border bg-white px-3 text-sm text-[#030712] shadow-sm placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 ${
                        phoneError
                          ? "border-[#e7000b] focus:border-[#e7000b] focus:ring-[#e7000b]/20"
                          : "border-[#e5e7eb] focus:border-[#030712] focus:ring-[#030712]/20"
                      }`}
                    />
                  </div>
                  {phoneError && (
                    <span className="text-xs text-[#e7000b]">
                      This field is mandatory
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CRM record */}
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-[#030712]">
              CRM record
            </span>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={createCrmRecords}
                onChange={(e) => setCreateCrmRecords(e.target.checked)}
                className="size-4 rounded border-[#e5e7eb] text-[#030712] focus:ring-[#030712]/20"
              />
              <span className="text-sm text-[#030712]">
                Create CRM records for outbound calls to this contact
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[#e5e7eb] px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center rounded-lg border border-[#e5e7eb] bg-white px-4 text-sm font-medium text-[#030712] shadow-sm hover:bg-[#f9fafb] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={handleSave}
            className="inline-flex h-10 items-center rounded-lg bg-[#030712] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#1a1a2e] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mode === "create" ? "Add Destination" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function inferDestinationFormData(d: Destination): NewDestination {
  const isPhone = d.destination.trim().startsWith("+");
  if (isPhone) {
    const country =
      [...COUNTRY_CODES]
        // longest dial codes first so "+351" matches before "+3"
        .sort((a, b) => b.dial.length - a.dial.length)
        .find((c) => d.destination.trim().startsWith(c.dial)) ??
      COUNTRY_CODES[0];
    const number = d.destination.trim().slice(country.dial.length).trim();
    return {
      name: d.name,
      method: "phone",
      phoneNumber: number,
      countryCode: country.code,
      createCrmRecords: true,
    };
  }
  return {
    name: d.name,
    method: "sip",
    sipUri: d.destination,
    useSipRefer: false,
    passDataParams: false,
    createCrmRecords: true,
  };
}

function formatDestinationString(data: NewDestination): string {
  if (data.method === "sip") return data.sipUri ?? "";
  const dial =
    COUNTRY_CODES.find((c) => c.code === data.countryCode)?.dial ?? "+1";
  return `${dial} ${data.phoneNumber ?? ""}`.trim();
}

function ContactListDetailView({ list, onBack }: { list: ContactList; onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showAddDestination, setShowAddDestination] = useState(false);
  // Hydrate destination edits from the module-level cache so add/edit/delete
  // operations on this list's destinations survive remounts.
  const [addedDestinations, setAddedDestinationsState] = useState<
    { id: string; data: NewDestination }[]
  >(() => getDestEdits(list.id).added);
  const [editedGenerated, setEditedGeneratedState] = useState<
    Record<string, NewDestination>
  >(() => getDestEdits(list.id).edited);
  const [deletedIds, setDeletedIdsState] = useState<Set<string>>(
    () => getDestEdits(list.id).deleted
  );

  // Wrappers that mirror state into the per-list cache.
  const setAddedDestinations: typeof setAddedDestinationsState = (updater) => {
    setAddedDestinationsState((prev) => {
      const next =
        typeof updater === "function"
          ? (updater as (
              p: { id: string; data: NewDestination }[]
            ) => { id: string; data: NewDestination }[])(prev)
          : updater;
      setDestEdits(list.id, { added: next });
      return next;
    });
  };
  const setEditedGenerated: typeof setEditedGeneratedState = (updater) => {
    setEditedGeneratedState((prev) => {
      const next =
        typeof updater === "function"
          ? (updater as (
              p: Record<string, NewDestination>
            ) => Record<string, NewDestination>)(prev)
          : updater;
      setDestEdits(list.id, { edited: next });
      return next;
    });
  };
  const setDeletedIds: typeof setDeletedIdsState = (updater) => {
    setDeletedIdsState((prev) => {
      const next =
        typeof updater === "function"
          ? (updater as (p: Set<string>) => Set<string>)(prev)
          : updater;
      setDestEdits(list.id, { deleted: next });
      return next;
    });
  };

  const [editingDestination, setEditingDestination] = useState<{
    id: string;
    data: NewDestination;
    source: "added" | "generated";
  } | null>(null);
  const [deletingDestination, setDeletingDestination] =
    useState<Destination | null>(null);
  const [toast, setToast] = useState<{ open: boolean; title: string }>({
    open: false,
    title: "",
  });

  // When the user switches between lists in the same mounted view, reload
  // this list's edits from the cache rather than reset them.
  useEffect(() => {
    const cached = getDestEdits(list.id);
    setAddedDestinationsState(cached.added);
    setEditedGeneratedState(cached.edited);
    setDeletedIdsState(cached.deleted);
    setPage(1);
  }, [list.id]);

  const generated = generateDestinations(list.id, list.contacts);
  const addedRows: Destination[] = addedDestinations.map((d) => ({
    id: d.id,
    name: d.data.name,
    destination: formatDestinationString(d.data),
  }));
  const generatedRows: Destination[] = generated.map((g) => {
    const override = editedGenerated[g.id];
    if (override) {
      return {
        id: g.id,
        name: override.name,
        destination: formatDestinationString(override),
      };
    }
    return g;
  });
  const allDestinations = [...addedRows, ...generatedRows].filter(
    (d) => !deletedIds.has(d.id)
  );
  const filtered = allDestinations.filter((c) => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.destination.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : start + 1;
  const rangeEnd = start + pageRows.length;

  return (
    <div className="flex h-full flex-col gap-4 px-6 py-6">
      {/* Breadcrumb + current list title */}
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-[#6b7280] hover:text-[#030712] transition-colors"
        >
          Contact Lists
        </button>
        <ChevronRight className="size-4 shrink-0 text-[#d1d5db]" />
        <div className="flex items-center gap-2">
          <Folder className="size-4 text-[#030712]" />
          <h3 className="text-sm font-semibold text-[#030712]">
            {list.name}
          </h3>
        </div>
      </div>

      {/* Search (left) | Import / Add (right) */}
      <div className="flex shrink-0 items-center justify-between gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations..."
            className="h-9 w-full overflow-hidden text-ellipsis rounded-lg border border-[#e5e7eb] bg-white pl-9 pr-3 text-sm text-[#030712] shadow-sm placeholder:text-ellipsis placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-white px-3 text-sm font-medium text-[#030712] shadow-sm hover:bg-[#f9fafb] transition-colors"
          >
            <Upload className="size-4" />
            Import Destination
          </button>
          <button
            type="button"
            onClick={() => setShowAddDestination(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#030712] px-3 text-sm font-medium text-white shadow-sm hover:bg-[#1a1a2e] transition-colors"
          >
            <Plus className="size-4" />
            Add Destination
          </button>
        </div>
      </div>

      {/* Table or empty state */}
      {allDestinations.length === 0 ? (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center rounded-lg border border-[#e5e7eb] bg-white px-6 py-12">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#f3f4f6]">
            <Folder className="size-6 text-[#6b7280]" />
          </div>
          <span className="text-sm font-semibold text-[#030712]">
            No destinations yet
          </span>
          <span className="mt-1 max-w-xs text-center text-xs text-[#6b7280]">
            Add destinations to this contact list to get started.
          </span>
          <button
            type="button"
            onClick={() => setShowAddDestination(true)}
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#030712] px-3 text-sm font-medium text-white shadow-sm hover:bg-[#1a1a2e] transition-colors"
          >
            <Plus className="size-4" />
            Add Destination
          </button>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#e5e7eb]">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-[#f9fafb]">
                <tr>
                  <th className="border-b border-[#e5e7eb] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280]">Destination Name</th>
                  <th className="border-b border-[#e5e7eb] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280]">Destination</th>
                  <th className="w-[120px] border-b border-[#e5e7eb] px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <div className="flex flex-col items-center justify-center py-12">
                        <Search className="mb-2 size-8 text-[#d1d5db]" />
                        <span className="text-sm font-medium text-[#6b7280]">No destinations found</span>
                        <span className="mt-1 text-xs text-[#9ca3af]">Try modifying your search</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row) => (
                    <tr key={row.id} className="border-b border-[#e5e7eb] last:border-b-0 hover:bg-[#f9fafb] transition-colors">
                      <td className="px-4 py-3.5 text-sm font-medium text-[#030712]">{row.name}</td>
                      <td className="px-4 py-3.5 text-sm text-[#030712]">{row.destination}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            title="Edit"
                            onClick={() => {
                              const added = addedDestinations.find(
                                (a) => a.id === row.id
                              );
                              if (added) {
                                setEditingDestination({
                                  id: row.id,
                                  data: added.data,
                                  source: "added",
                                });
                                return;
                              }
                              const override = editedGenerated[row.id];
                              setEditingDestination({
                                id: row.id,
                                data: override ?? inferDestinationFormData(row),
                                source: "generated",
                              });
                            }}
                            className="flex size-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#030712] transition-colors"
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            type="button"
                            title="Delete"
                            onClick={() => setDeletingDestination(row)}
                            className="flex size-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex shrink-0 items-center justify-between border-t border-[#e5e7eb] bg-[#f9fafb] px-4 py-2.5">
            <span className="text-xs text-[#6b7280]">
              Showing <span className="font-medium text-[#030712]">{rangeStart}-{rangeEnd}</span> of {filtered.length} items
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex size-7 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#030712] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex size-7 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#030712] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <DestinationFormModal
        open={showAddDestination}
        mode="create"
        onCancel={() => setShowAddDestination(false)}
        onSave={(data) => {
          const newId = `${list.id}-custom-${Date.now()}`;
          setAddedDestinations((prev) => [{ id: newId, data }, ...prev]);
          setShowAddDestination(false);
          setPage(1);
          setToast({
            open: true,
            title: "Destination was added successfully",
          });
        }}
      />

      <DestinationFormModal
        open={editingDestination !== null}
        mode="edit"
        initialData={editingDestination?.data}
        onCancel={() => setEditingDestination(null)}
        onSave={(data) => {
          if (!editingDestination) return;
          if (editingDestination.source === "added") {
            setAddedDestinations((prev) =>
              prev.map((a) =>
                a.id === editingDestination.id ? { id: a.id, data } : a
              )
            );
          } else {
            setEditedGenerated((prev) => ({
              ...prev,
              [editingDestination.id]: data,
            }));
          }
          setEditingDestination(null);
          setToast({
            open: true,
            title: "Destination was updated successfully",
          });
        }}
      />

      <AlertDialog
        open={deletingDestination !== null}
        title="Delete Destination"
        description={
          deletingDestination
            ? `Are you sure you want to delete "${deletingDestination.name}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onCancel={() => setDeletingDestination(null)}
        onConfirm={() => {
          if (!deletingDestination) return;
          const id = deletingDestination.id;
          setDeletedIds((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
          });
          setAddedDestinations((prev) => prev.filter((a) => a.id !== id));
          setEditedGenerated((prev) => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
          setDeletingDestination(null);
          setToast({
            open: true,
            title: "Destination was deleted successfully",
          });
        }}
      />

      <Toast
        open={toast.open}
        title={toast.title}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </div>
  );
}

export function ContactListManagementTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedList, setSelectedList] = useState<ContactList | null>(null);
  // Hydrate from the module-level cache so add/edit/delete persist across
  // remounts (tab switches, navigating away and back).
  const [lists, setListsState] = useState<ContactList[]>(
    () => listsCache ?? contactLists
  );
  const setLists: typeof setListsState = (updater) => {
    setListsState((prev) => {
      const next =
        typeof updater === "function"
          ? (updater as (p: ContactList[]) => ContactList[])(prev)
          : updater;
      listsCache = next;
      return next;
    });
  };
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingList, setEditingList] = useState<ContactList | null>(null);
  const [deletingList, setDeletingList] = useState<ContactList | null>(null);
  const [toast, setToast] = useState<{ open: boolean; title: string }>({
    open: false,
    title: "",
  });

  const handleCreateList = (name: string) => {
    const newList: ContactList = {
      id: `custom-${Date.now()}`,
      name,
      contacts: 0,
    };
    setLists((prev) => [newList, ...prev]);
    setShowNewModal(false);
    setSelectedList(newList);
    setToast({ open: true, title: `${name} Contact List created successfully` });
  };

  const handleRenameList = (name: string) => {
    if (!editingList) return;
    setLists((prev) =>
      prev.map((l) => (l.id === editingList.id ? { ...l, name } : l))
    );
    setEditingList(null);
    setToast({ open: true, title: `Contact list renamed to "${name}".` });
  };

  if (selectedList) {
    return (
      <>
        <ContactListDetailView list={selectedList} onBack={() => setSelectedList(null)} />
        <Toast
          open={toast.open}
          title={toast.title}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
        />
      </>
    );
  }

  const filtered = lists.filter((l) => {
    const q = search.toLowerCase();
    return !q || l.name.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : start + 1;
  const rangeEnd = start + pageRows.length;

  return (
    <div className="flex h-full flex-col gap-4 px-6 py-6">
      {/* Top bar (fixed) */}
      <div className="flex shrink-0 items-center justify-between">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contact lists..."
            className="h-9 w-full overflow-hidden text-ellipsis rounded-lg border border-[#e5e7eb] bg-white pl-9 pr-3 text-sm text-[#030712] shadow-sm placeholder:text-ellipsis placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#030712] px-3 text-sm font-medium text-white shadow-sm hover:bg-[#1a1a2e] transition-colors"
          >
            <Plus className="size-4" />
            New Contact List
          </button>
        </div>
      </div>

      {/* Table (fills remaining space; body scrolls, header + footer fixed) */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-[#e5e7eb]">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-[#f9fafb]">
              <tr>
                <th className="border-b border-[#e5e7eb] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280]">Name</th>
                <th className="border-b border-[#e5e7eb] px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280]">Number of Contacts</th>
                <th className="w-[120px] border-b border-[#e5e7eb] px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#6b7280]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={3}>
                    <div className="flex flex-col items-center justify-center py-12">
                      <Search className="mb-2 size-8 text-[#d1d5db]" />
                      <span className="text-sm font-medium text-[#6b7280]">No contact lists found</span>
                      <span className="mt-1 text-xs text-[#9ca3af]">
                        Try modifying your search or filters
                      </span>
                    </div>
                  </td>
                </tr>
              )}
              {pageRows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => setSelectedList(row)}
                  className="cursor-pointer border-b border-[#e5e7eb] last:border-b-0 hover:bg-[#f9fafb] transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Folder className="size-4 shrink-0 text-[#6b7280]" />
                      <span className="text-sm font-medium text-[#030712]">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-[#030712]">{row.contacts.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingList(row);
                        }}
                        className="flex size-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#030712] transition-colors"
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingList(row);
                        }}
                        className="flex size-8 items-center justify-center rounded-md text-[#6b7280] hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer with pagination (fixed at bottom of table card) */}
        <div className="flex shrink-0 items-center justify-between border-t border-[#e5e7eb] bg-[#f9fafb] px-4 py-2.5">
          <span className="text-xs text-[#6b7280]">
            Showing <span className="font-medium text-[#030712]">{rangeStart}-{rangeEnd}</span> of {filtered.length} items
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex size-7 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#030712] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex size-7 items-center justify-center rounded-md border border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#030712] transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <ContactListFormModal
        open={showNewModal}
        mode="create"
        onCancel={() => setShowNewModal(false)}
        onSave={handleCreateList}
      />

      <ContactListFormModal
        open={editingList !== null}
        mode="edit"
        initialName={editingList?.name ?? ""}
        onCancel={() => setEditingList(null)}
        onSave={handleRenameList}
      />

      <AlertDialog
        open={deletingList !== null}
        title="Delete Contact List"
        description={
          deletingList
            ? `Are you sure you want to delete "${deletingList.name}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        onCancel={() => setDeletingList(null)}
        onConfirm={() => {
          if (!deletingList) return;
          const id = deletingList.id;
          const name = deletingList.name;
          setLists((prev) => prev.filter((l) => l.id !== id));
          setDeletingList(null);
          setToast({
            open: true,
            title: `${name} Contact List was deleted successfully`,
          });
        }}
      />

      <Toast
        open={toast.open}
        title={toast.title}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />
    </div>
  );
}
