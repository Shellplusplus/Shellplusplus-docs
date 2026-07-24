import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import "./global.css";
import { Inter } from "next/font/google";
import { siteOrigin, withBasePath } from "@/lib/shared";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            options: {
              type: "static",
              api: withBasePath("/api/search"),
            },
          }}
          theme={{ defaultTheme: "system", disableTransitionOnChange: false }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
