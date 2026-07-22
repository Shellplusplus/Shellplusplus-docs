"use client";

import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useDocsLayout } from "fumadocs-ui/layouts/docs";
import { SidebarIcon } from "lucide-react";
import type { ComponentProps } from "react";

export function ResponsiveDocsHeader(props: ComponentProps<"header">) {
  const {
    props: { nav },
    slots,
  } = useDocsLayout();
  const { className, ...headerProps } = props;

  return (
    <div className="[grid-area:header] sticky top-(--fd-docs-row-1) z-30 h-(--fd-header-height) md:hidden max-md:layout:[--fd-header-height:--spacing(14)] docs-header-mobile">
      <div className="docs-header-mobile__progressive-glass" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <header
        id="nd-subnav"
        {...headerProps}
        className={["docs-header-mobile__bar", className]
          .filter(Boolean)
          .join(" ")}
      >
        {slots.navTitle && (
          <slots.navTitle className="inline-flex items-center gap-2.5 font-semibold" />
        )}
        <div className="flex-1">{nav?.children}</div>
        {slots.searchTrigger && (
          <slots.searchTrigger.sm hideIfDisabled className="p-2" />
        )}
        {slots.sidebar && (
          <slots.sidebar.trigger
            className={buttonVariants({
              color: "ghost",
              size: "icon-sm",
              className: "p-2",
            })}
          >
            <SidebarIcon />
          </slots.sidebar.trigger>
        )}
      </header>
    </div>
  );
}
