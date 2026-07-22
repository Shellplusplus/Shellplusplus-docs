"use client";

import { useTheme } from "fumadocs-ui/provider/base";
import { Code2, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { appName } from "@/lib/shared";

const navigationItems = [
  { label: "Documentation", href: "/docs" },
  { label: "Blog", href: "/blog" },
  { label: "Showcase", href: "/showcase" },
  {
    label: "Sponsors",
    href: "https://fuma-nama.dev/sponsors",
    external: true,
  },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/docs") return pathname === "/docs" || pathname === "/docs/";
  return pathname === href || pathname === `${href}/`;
}

export function SiteNav() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const dark = mounted && resolvedTheme === "dark";

  return (
    <header className="site-nav">
      <div className="site-nav__progressive-glass" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <nav className="site-nav__bar" aria-label="主导航">
        <Link className="site-nav__brand" href="/">
          {appName}
        </Link>

        <ul className="site-nav__links">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="liquid-pill"
                data-active={isActive(pathname, item.href) || undefined}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="site-nav__actions">
          <a
            className="site-nav__icon-button"
            href="https://github.com/Shellplusplus/Shellplusplus-docs"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Code2 aria-hidden="true" />
          </a>
          <button
            type="button"
            className="site-nav__icon-button"
            aria-label={dark ? "切换到浅色模式" : "切换到深色模式"}
            onClick={() => setTheme(dark ? "light" : "dark")}
          >
            {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
