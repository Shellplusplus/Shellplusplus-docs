import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { CollapsibleImage } from "@/components/collapsible-image";
import { InvertImage } from "@/components/invert-image";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    img: CollapsibleImage,
    InvertImage,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
