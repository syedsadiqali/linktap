import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";
import TopLoader from "./top-loader";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";

export const metadata = {
  title: "LinkTap",
  description: "Just Another Link Tree",
};

export default async function RootLayout({ children }: any) {
  
  return (
    <html lang="en">
      <body className="flex flex-col">
        <SpeedInsights/>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          >
          <TopLoader/>
          {children}
        </ThemeProvider>

        <Toaster />
      </body>
    </html>
  );
}
