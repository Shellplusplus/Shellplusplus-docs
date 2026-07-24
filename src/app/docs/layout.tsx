import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { DocsMotionCoordinator } from "@/components/docs-motion-coordinator";
import { ResponsiveDocsHeader } from "@/components/responsive-docs-header";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions()}
      slots={{ header: ResponsiveDocsHeader }}
    >
      <DocsMotionCoordinator />
      {children}
    </DocsLayout>
  );
}
