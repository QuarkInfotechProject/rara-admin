import "./globals.css";
import { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import React from "react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryContext from "@/lib/context/react-query-context";

export const metadata: Metadata = {
  title: "CHN Dashboard",
  robots: {
    index: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ReactQueryContext>
          <NextTopLoader
            color="hsl(var(--primary))"
            height={6}
            easing="ease-in-out"
            speed={400}
            crawl
            crawlSpeed={400}
          />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
          <Toaster />
        </ReactQueryContext>
      </body>
    </html>
  );
}
