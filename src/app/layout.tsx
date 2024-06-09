import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import TopLoader from "./top-loader";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

import "./globals.css";

import config from "@/config";
import { constructMetadata } from "@/lib/utils/seo";
import Provider from "@/util/Providers";

export const metadata = constructMetadata({
  title: `${config.appName}`,
  description: "Open Source Link In Bio Tool",
});

export default async function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className="flex flex-col">
        <SpeedInsights />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TopLoader />
          <Provider>{children}</Provider>
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && (
          <GoogleAnalytics gaId="G-3WDXTQNJ7G" />
        )}
        <Toaster />
      </body>
    </html>
  );
}
