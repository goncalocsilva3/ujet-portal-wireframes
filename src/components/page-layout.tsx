"use client";

import { cn } from "@/lib/utils";

export type PageLayoutType = "centered" | "full-width";

interface PageLayoutProps {
  layout?: PageLayoutType;
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({
  layout = "centered",
  children,
  className,
}: PageLayoutProps) {
  return (
    <div
      className={cn(
        "flex-1",
        layout === "centered" && "mx-auto w-full max-w-[860px] px-6 pt-6",
        layout === "full-width" && "w-full",
        className
      )}
    >
      {children}
    </div>
  );
}
