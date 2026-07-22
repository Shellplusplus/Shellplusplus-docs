import { Header as FumadocsHeader } from "fumadocs-ui/layouts/home/slots/header";
import type { ComponentProps } from "react";
import { SiteNav } from "@/components/site-nav";

export function ResponsiveHomeHeader(props: ComponentProps<"header">) {
  return (
    <>
      <div className="home-header-desktop">
        <SiteNav />
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
        <FumadocsHeader {...props} />
      </div>
    </>
  );
}
