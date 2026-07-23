"use client";

import { useTheme } from "fumadocs-ui/provider/base";
import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function InvertImage({
  children,
  className,
  ...props
}: ComponentProps<"figure">) {
  const { resolvedTheme } = useTheme();
  const [inverted, setInverted] = useState(false);

  useEffect(() => {
    setInverted(resolvedTheme === "dark");
  }, [resolvedTheme]);

  return (
    <figure
      {...props}
      className={cn(
        "my-6 overflow-hidden rounded-xl border bg-fd-card",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b px-4 py-2.5">
        <span className="text-sm font-medium text-fd-foreground">反色</span>
        <button
          type="button"
          role="switch"
          aria-checked={inverted}
          aria-label="切换图片反色"
          onClick={() => setInverted((value) => !value)}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full border transition-colors",
            inverted
              ? "border-fd-primary bg-fd-primary"
              : "border-fd-border bg-fd-secondary",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "absolute top-0.5 left-0.5 size-4.5 rounded-full bg-white shadow-sm transition-transform",
              inverted && "translate-x-5",
            )}
          />
        </button>
      </div>
      <div
        className={cn(
          "overflow-hidden [&_img]:m-0 [&_img]:w-full [&_img]:rounded-none [&_img]:transition-[filter]",
          inverted && "[&_img]:invert",
        )}
      >
        {children}
      </div>
    </figure>
  );
}
