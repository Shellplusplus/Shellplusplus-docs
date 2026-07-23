import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { InvertImage } from "@/components/invert-image";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    InvertImage,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
