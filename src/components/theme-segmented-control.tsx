"use client";

import { useTheme } from "fumadocs-ui/provider/base";
import { Moon, Settings, Sun } from "lucide-react";
import type { ComponentProps, MouseEvent } from "react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/cn";

const themeOptions = [
  { value: "light", label: "浅色模式", icon: Sun },
  { value: "dark", label: "深色模式", icon: Moon },
  { value: "system", label: "跟随系统", icon: Settings },
] as const;

type ThemeMode = (typeof themeOptions)[number]["value"];

export function ThemeSegmentedControl({
  className,
  ...props
}: ComponentProps<"div">) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const activeTheme: ThemeMode =
    mounted && (theme === "light" || theme === "dark" || theme === "system")
      ? theme
      : "light";

  const changeTheme = (
    nextTheme: ThemeMode,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (nextTheme === activeTheme) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!document.startViewTransition || prefersReducedMotion) {
      setTheme(nextTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(nextTheme));
    });

    void transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 560,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      })
      .catch(() => undefined);
  };

  return (
    <div
      {...props}
      data-theme-toggle=""
      data-active-theme={activeTheme}
      className={cn("theme-switcher", className)}
    >
      <span className="theme-indicator" aria-hidden="true" />
      {themeOptions.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={activeTheme === value}
          className="theme-button"
          onClick={(event) => changeTheme(value, event)}
        >
          <Icon aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
