"use client";

import { useState } from "react";
import { Search, Pencil, RefreshCw, Plus, Code } from "lucide-react";
import { SettingsToggle } from "@/components/settings-toggle";
import { AlertDialog } from "@/components/alert-dialog";
import { Toast } from "@/components/toast";

type CredentialStatus = "Active" | "Inactive";

interface ApiCredential {
  id: string;
  name: string;
  status: CredentialStatus;
}

const initialCredentials: ApiCredential[] = [
  { id: "1", name: "Production API Key",          status: "Active"   },
  { id: "2", name: "Salesforce CRM Integration",  status: "Active"   },
  { id: "3", name: "Analytics Data Pipeline",     status: "Inactive" },
  { id: "4", name: "Webhook Receiver",            status: "Active"   },
  { id: "5", name: "Mobile SDK",                  status: "Inactive" },
  { id: "6", name: "Staging Environment",         status: "Inactive" },
];

const statusStyles: Record<CredentialStatus, string> = {
  Active:   "bg-[#f0fdf4] border border-[#b9f8cf] text-[#008236]",
  Inactive: "bg-[#f3f4f6] border border-[#e5e7eb] text-[#6b7280]",
};

export function ApiCredentialsPage() {
  const [credentials, setCredentials] = useState(initialCredentials);
  const [search, setSearch] = useState("");
  const [pendingDisableId, setPendingDisableId] = useState<string | null>(null);
  const [pendingRegenerateId, setPendingRegenerateId] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastToken, setToastToken] = useState("");

  const filtered = credentials.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (id: string) => {
    const credential = credentials.find((c) => c.id === id);
    if (!credential) return;

    if (credential.status === "Active") {
      // Show confirmation dialog before disabling
      setPendingDisableId(id);
    } else {
      // Re-enabling doesn't need confirmation
      setCredentials((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "Active" } : c))
      );
    }
  };

  const handleConfirmDisable = () => {
    if (pendingDisableId) {
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === pendingDisableId ? { ...c, status: "Inactive" } : c
        )
      );
    }
    setPendingDisableId(null);
  };

  const handleCancelDisable = () => {
    setPendingDisableId(null);
  };

  const pendingCredential = credentials.find((c) => c.id === pendingDisableId);

  const handleRegenerateClick = (id: string) => {
    setPendingRegenerateId(id);
  };

  const handleConfirmRegenerate = () => {
    setPendingRegenerateId(null);
    setToastToken("bgmdtLUarQFBx-wjhHUJtBpOEJEh2jR9gaC1WqE60Xo");
    setToastOpen(true);
  };

  const handleCancelRegenerate = () => {
    setPendingRegenerateId(null);
  };

  const pendingRegenerateCredential = credentials.find((c) => c.id === pendingRegenerateId);

  return (
    <>
    <AlertDialog
      open={pendingDisableId !== null}
      title="Disable API Credential"
      description={`Are you sure you want to disable ${pendingCredential?.name ?? "this API credential"}? You will suspend the token to be used to authenticate API requests.`}
      confirmLabel="Disable"
      cancelLabel="Cancel"
      onConfirm={handleConfirmDisable}
      onCancel={handleCancelDisable}
    />
    <AlertDialog
      open={pendingRegenerateId !== null}
      title="Regenerate API Token"
      description={`Regenerating a new token will immediately invalidate the previous one. Anything using the previous token will generate authentication errors. Are you sure you want to proceed?`}
      confirmLabel="Regenerate token"
      cancelLabel="Cancel"
      onConfirm={handleConfirmRegenerate}
      onCancel={handleCancelRegenerate}
    />
    <Toast
      open={toastOpen}
      title="New token generated successfully."
      description={`Copy the new token below and store in a secure place — ${toastToken}`}
      onClose={() => setToastOpen(false)}
    />
    <div className="flex flex-col gap-4 px-6 py-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search API Credentials..."
            className="h-9 w-full overflow-hidden text-ellipsis rounded-lg border border-[#e5e7eb] bg-white pl-9 pr-3 text-sm text-[#030712] shadow-sm placeholder:text-ellipsis placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]"
          />
        </div>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#030712] px-3 text-sm font-medium text-white shadow-sm hover:bg-[#1a1a2e] transition-colors"
        >
          <Plus className="size-4" />
          Add API Credential
        </button>
      </div>

      {/* List */}
      <div className="rounded-lg border border-[#e5e7eb] bg-white">
        {filtered.map((item, idx) => (
          <div
            key={item.id}
            className={`flex h-[74px] items-center gap-4 px-5 ${
              idx !== filtered.length - 1 ? "border-b border-[#e5e7eb]" : ""
            }`}
          >
            {/* Icon */}
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6]">
              <Code className="size-5 text-[#6b7280]" />
            </div>

            {/* Name + status below */}
            <div className="flex flex-1 flex-col">
              <span className="text-sm font-medium text-[#030712]">{item.name}</span>
              <div className="flex items-center gap-1.5">
                <span className={`inline-block size-2 rounded-full ${item.status === "Active" ? "bg-[#15803d]" : "bg-[#9ca3af]"}`} />
                <span className={`text-sm ${item.status === "Active" ? "text-[#15803d]" : "text-[#9ca3af]"}`}>
                  {item.status === "Active" ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Actions: toggle | divider | Edit + Generate */}
            <div className="flex items-center gap-2">
              <SettingsToggle
                enabled={item.status === "Active"}
                onChange={() => handleToggle(item.id)}
              />
              <div className="mx-1 h-5 w-px bg-[#e5e7eb]" />
              <button
                type="button"
                title="Edit"
                className="flex size-8 items-center justify-center rounded-md border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#030712] transition-colors"
              >
                <Pencil className="size-4" />
              </button>
              <button
                type="button"
                title="Regenerate"
                onClick={() => handleRegenerateClick(item.id)}
                className="flex size-8 items-center justify-center rounded-md border border-[#e5e7eb] text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#030712] transition-colors"
              >
                <RefreshCw className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
