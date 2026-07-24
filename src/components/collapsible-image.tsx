"use client";

import defaultMdxComponents from "fumadocs-ui/mdx";
import { ChevronDown, ImageIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type CollapsibleImageProps = ComponentProps<
  (typeof defaultMdxComponents)["img"]
>;

const MdxImage = defaultMdxComponents.img;
const ImageCollapseContext = createContext(false);

export function ImageCollapseBoundary({ children }: { children: ReactNode }) {
  return (
    <ImageCollapseContext.Provider value={true}>
      {children}
    </ImageCollapseContext.Provider>
  );
}

export function CollapsibleMedia({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <span className="collapsible-image" data-expanded={expanded || undefined}>
      <button
        type="button"
        className="collapsible-image__trigger"
        aria-expanded={expanded}
        onClick={() => setExpanded((value) => !value)}
      >
        <ImageIcon aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-start">
          {expanded ? "收起图片" : "展开图片"}：{label}
        </span>
        <ChevronDown aria-hidden="true" />
      </button>
      {expanded && (
        <span className="collapsible-image__content">{children}</span>
      )}
    </span>
  );
}

export function CollapsibleImage({ alt, ...props }: CollapsibleImageProps) {
  const nestedInCollapsibleMedia = useContext(ImageCollapseContext);
  if (nestedInCollapsibleMedia) {
    return <MdxImage {...props} alt={alt} loading="lazy" />;
  }

  return (
    <CollapsibleMedia label={alt?.trim() || "文档图片"}>
      <MdxImage {...props} alt={alt} loading="lazy" />
    </CollapsibleMedia>
  );
}
