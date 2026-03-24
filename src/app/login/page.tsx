"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/");
        router.refresh();
      } else {
        setError("Incorrect password");
        setPassword("");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f7]">
      <div className="w-full max-w-[360px] rounded-xl border border-[#e5e7eb] bg-white p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-[#030712] text-white text-sm font-bold">
            U
          </div>
          <h1 className="text-lg font-semibold text-[#030712]">Settings Portal</h1>
          <p className="text-xs text-[#6b7280]">Enter the password to access this prototype</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="h-10 w-full rounded-lg border border-[#e5e7eb] px-3 text-sm text-[#030712] placeholder:text-[#9ca3af] focus:border-[#030712] focus:outline-none focus:ring-2 focus:ring-[#030712]/20"
          />

          {error && (
            <span className="text-xs text-red-600">{error}</span>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="h-10 w-full rounded-lg bg-[#030712] text-sm font-medium text-white transition-colors hover:bg-[#1a1a2e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
