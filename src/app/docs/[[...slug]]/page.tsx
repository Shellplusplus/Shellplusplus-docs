import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import { getPageImage, source } from "@/lib/source";

function getTextContent(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(getTextContent).join("");
  }

  if (value && typeof value === "object" && "props" in value) {
    return getTextContent(
      (value as { props?: { children?: unknown } }).props?.children,
    );
  }

  return "";
}

function normalizeTitle(value: unknown): string {
  return getTextContent(value).replace(/\s+/g, " ").trim();
}

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const firstHeading = page.data.toc.find((item) => item.depth === 1);
  const titleMatchesFirstHeading =
    normalizeTitle(page.data.title) === normalizeTitle(firstHeading?.title);
  const showPageHeader = Boolean(page.data.title && !titleMatchesFirstHeading);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      {showPageHeader && <DocsTitle>{page.data.title}</DocsTitle>}
      {showPageHeader && page.data.description && (
        <DocsDescription className="mb-0">
          {page.data.description}
        </DocsDescription>
      )}
      <DocsBody>
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
