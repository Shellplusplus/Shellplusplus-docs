"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { docsRoute, siteBasePath, withBasePath } from "@/lib/shared";

type PendingRoute = {
  from: string;
  resolve: () => void;
  timeout: ReturnType<typeof setTimeout>;
};

export function DocsMotionCoordinator() {
  const pathname = usePathname();
  const router = useRouter();
  const pendingRoute = useRef<PendingRoute | null>(null);
  const activeTransition = useRef<ViewTransition | null>(null);

  useEffect(() => {
    if (typeof document.startViewTransition === "function") {
      document.documentElement.dataset.docsViewTransitions = "true";
    }

    return () => {
      delete document.documentElement.dataset.docsViewTransitions;
    };
  }, []);

  useEffect(() => {
    const pending = pendingRoute.current;
    if (!pending || pathname === pending.from) return;
    clearTimeout(pending.timeout);
    pending.resolve();
    pendingRoute.current = null;
  }, [pathname]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const docsBase = withBasePath(docsRoute);

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        reducedMotion.matches ||
        !document.startViewTransition
      ) {
        return;
      }

      const element = event.target instanceof Element ? event.target : null;
      const anchor = element?.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        anchor.target ||
        anchor.hasAttribute("download") ||
        anchor.origin !== window.location.origin
      ) {
        return;
      }

      const destination = new URL(anchor.href);
      const isDocsPage =
        destination.pathname === docsBase ||
        destination.pathname.startsWith(`${docsBase}/`);
      const isSameDocument =
        destination.pathname === window.location.pathname &&
        destination.search === window.location.search;
      if (!isDocsPage || isSameDocument) return;

      event.preventDefault();
      const routePath =
        siteBasePath && destination.pathname.startsWith(siteBasePath)
          ? destination.pathname.slice(siteBasePath.length) || "/"
          : destination.pathname;
      const routeHref = `${routePath}${destination.search}${destination.hash}`;

      if (activeTransition.current) {
        activeTransition.current.skipTransition();
        activeTransition.current = null;
        router.push(routeHref);
        return;
      }

      document.documentElement.dataset.docsTransition = "true";
      const transition = document.startViewTransition(async () => {
        const routeReady = new Promise<void>((resolve) => {
          let settled = false;
          const complete = () => {
            if (settled) return;
            settled = true;
            clearTimeout(timeout);
            if (pendingRoute.current?.resolve === complete) {
              pendingRoute.current = null;
            }
            resolve();
          };
          const timeout = setTimeout(complete, 1600);
          pendingRoute.current = {
            from: pathname,
            resolve: complete,
            timeout,
          };
        });

        router.push(routeHref);
        await routeReady;
      });

      activeTransition.current = transition;
      void transition.finished
        .catch(() => undefined)
        .finally(() => {
          activeTransition.current = null;
          delete document.documentElement.dataset.docsTransition;
        });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname, router]);

  useEffect(
    () => () => {
      const pending = pendingRoute.current;
      if (pending) {
        clearTimeout(pending.timeout);
        pending.resolve();
      }
      activeTransition.current?.skipTransition();
      delete document.documentElement.dataset.docsTransition;
      delete document.documentElement.dataset.docsViewTransitions;
    },
    [],
  );

  return <div className="docs-reading-progress" aria-hidden="true" />;
}
