"use client";

import { HomeLayout } from "fumadocs-ui/layouts/home";
import { ResponsiveHomeHeader } from "@/components/responsive-home-header";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/">) {
  const options = baseOptions();

  return (
    <HomeLayout
      {...options}
      slots={{ ...options.slots, header: ResponsiveHomeHeader }}
    >
      {children}
    </HomeLayout>
  );
}
