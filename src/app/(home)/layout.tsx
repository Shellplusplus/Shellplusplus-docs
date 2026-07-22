"use client";

import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ResponsiveHomeHeader } from "@/components/responsive-home-header";
import { homeNavItems } from "@/lib/home-nav";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/">) {
  const options = baseOptions();

  return (
    <HomeLayout
      {...options}
      links={[
        ...homeNavItems.map((item) => {
          const Icon = item.icon;

          return {
            text: item.label,
            url: item.href,
            icon: <Icon />,
            external: item.external,
            active: item.active,
          };
        }),
      ]}
      slots={{ ...options.slots, header: ResponsiveHomeHeader }}
    >
      {children}
    </HomeLayout>
  );
}
