"use client";

interface SettingsFieldProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  noBorder?: boolean;
  required?: boolean;
}

export function SettingsField({
  label,
  description,
  children,
  noBorder,
  required,
}: SettingsFieldProps) {
  return (
    <div className={`flex items-center justify-between gap-8 py-3 ${noBorder ? "" : "[&:not(:last-child)]:border-b [&:not(:last-child)]:border-[#f3f4f6]"}`}>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-[#030712]">
          {label}{required && <span className="text-red-500"> *</span>}
        </span>
        {description && (
          <span className="text-xs text-[#6b7280]">{description}</span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
