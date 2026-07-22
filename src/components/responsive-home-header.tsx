"use client";

import {
  SidebarDrawerContent,
  SidebarDrawerOverlay,
  SidebarItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarViewport,
} from "fumadocs-ui/components/sidebar/base";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useHomeLayout } from "fumadocs-ui/layouts/home";
import { Header as FumadocsHeader } from "fumadocs-ui/layouts/home/slots/header";
import { ExternalLink, SidebarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { type HomeNavItem, homeNavItems } from "@/lib/home-nav";

export function ResponsiveHomeHeader(props: ComponentProps<"header">) {
  return (
    <>
      <div className="home-header-desktop">
        <div
          className="home-header-desktop__progressive-glass"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>
        <FumadocsHeader {...props} />
      </div>
      <div className="home-header-mobile">
        <div
          className="home-header-mobile__progressive-glass"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>
        <MobileDocsSidebarHeader {...props} />
      </div>
    </>
  );
}

const sidebarItemClass =
  "relative flex flex-row items-center gap-2 rounded-lg p-2 text-start text-fd-muted-foreground wrap-anywhere [&_svg]:size-4 [&_svg]:shrink-0 transition-colors hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80 hover:transition-none data-[active=true]:bg-fd-primary/10 data-[active=true]:text-fd-primary data-[active=true]:hover:transition-colors";

function isMobileNavItemActive(pathname: string, item: HomeNavItem) {
  if (item.external) return false;

  const href = item.href.replace(/\/$/, "") || "/";
  const current = pathname.replace(/\/$/, "") || "/";

  if (item.active === "nested-url") {
    return current === href || current.startsWith(`${href}/`);
  }

  return current === href;
}

function MobileNavItemLink({
  item,
  pathname,
}: {
  item: HomeNavItem;
  pathname: string;
}) {
  const active = isMobileNavItemActive(pathname, item);
  const Icon = item.icon;

  return (
    <SidebarItem
      href={item.href}
      active={active}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      className={sidebarItemClass}
    >
      <Icon />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5 font-medium text-fd-foreground">
          {item.label}
          {item.external && <ExternalLink className="size-3.5" />}
        </span>
        {item.description && (
          <span className="mt-1 block text-xs leading-snug text-fd-muted-foreground">
            {item.description}
          </span>
        )}
      </span>
    </SidebarItem>
  );
}

function MobileDocsSidebarHeader(props: ComponentProps<"header">) {
  const { slots } = useHomeLayout();
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <header
        id="nd-subnav"
        {...props}
        className="sticky top-0 z-40 flex h-14 items-center border-b border-transparent ps-4 pe-2.5"
      >
        {slots.navTitle && (
          <slots.navTitle className="inline-flex items-center gap-2.5 font-semibold" />
        )}
        <div className="flex-1" />
        {slots.searchTrigger && (
          <slots.searchTrigger.sm hideIfDisabled className="p-2" />
        )}
        <SidebarTrigger
          className={buttonVariants({
            color: "ghost",
            size: "icon-sm",
            className: "p-2",
          })}
        >
          <SidebarIcon />
        </SidebarTrigger>
      </header>

      <SidebarDrawerOverlay className="fixed inset-0 z-40 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out" />
      <SidebarDrawerContent className="fixed inset-y-0 inset-e-0 z-40 flex w-[85%] max-w-[380px] flex-col border-s bg-fd-background/80 text-[0.9375rem] shadow-lg backdrop-blur-lg data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out">
        <div className="flex flex-col gap-3 p-4 pb-2">
          <div className="flex items-center gap-1.5 text-fd-muted-foreground">
            <div className="flex flex-1">
              <a
                href="https://github.com/Shellplusplus/Shellplusplus-docs"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className={buttonVariants({
                  color: "ghost",
                  size: "icon-sm",
                  className: "p-2",
                })}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span className="sr-only">GitHub</span>
              </a>
            </div>
            {slots.themeSwitch && <slots.themeSwitch className="p-0" />}
            <SidebarTrigger
              className={buttonVariants({
                color: "ghost",
                size: "icon-sm",
                className: "p-2",
              })}
            >
              <SidebarIcon />
            </SidebarTrigger>
          </div>
        </div>

        <SidebarViewport>
          <div className="flex flex-col gap-0.5">
            {homeNavItems.map((item) => (
              <MobileNavItemLink
                key={item.href}
                item={item}
                pathname={pathname}
              />
            ))}
          </div>
        </SidebarViewport>
      </SidebarDrawerContent>
    </SidebarProvider>
  );
}
