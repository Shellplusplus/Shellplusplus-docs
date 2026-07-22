import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { ThemeSegmentedControl } from "@/components/theme-segmented-control";
import { appName, gitConfig } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
    slots: {
      themeSwitch: ThemeSegmentedControl,
    },
  };
}
