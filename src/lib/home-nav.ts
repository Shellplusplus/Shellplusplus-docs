import type { LucideIcon } from "lucide-react";
import { BookOpen, Globe, MessageCircle } from "lucide-react";

export type HomeNavItem = {
  label: string;
  description?: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
  active?: "url" | "nested-url";
};

export const homeNavItems: HomeNavItem[] = [
  {
    label: "使用教程",
    href: "/docs",
    icon: BookOpen,
    active: "nested-url",
  },
  {
    label: "官方网站",
    href: "https://shellpp.cxkpro.top/",
    icon: Globe,
    external: true,
  },
  {
    label: "QQ交流群",
    href: "https://qm.qq.com/q/lBGgrgYTL2",
    icon: MessageCircle,
    external: true,
  },
];
