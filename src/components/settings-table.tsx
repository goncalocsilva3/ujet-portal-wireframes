"use client";

import { Search } from "lucide-react";

interface Column {
  label: string;
  key: string;
  width?: string;
}

interface SettingsTableProps {
  columns: Column[];
  rows: Record<string, string>[];
  searchPlaceholder?: string;
}

export function SettingsTable({
  columns,
  rows,
  searchPlaceholder = "Search...",
}: SettingsTableProps) {
  return (
    <div className="flex flex-col gap-5 px-6 py-6">
      {/* Search bar */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="h-9 w-full rounded-lg border border-[#e5e7eb] bg-white pl-9 pr-3 text-sm text-[#030712] shadow-sm placeholder:text-[#6b7280] placeholder:overflow-hidden placeholder:text-ellipsis focus:outline-none focus:ring-2 focus:ring-[#030712]/20 focus:border-[#030712]"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6b7280]"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-[#e5e7eb] last:border-b-0 hover:bg-[#f9fafb] transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-sm text-[#030712]"
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
