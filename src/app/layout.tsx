import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import TopLoader from "./top-loader";

export const metadata = {
  title: "LinkTap",
  description: "Just Another Link Tree",
};

export default async function RootLayout({ children }: any) {
  
  return (
    <html lang="en">
      <body className="flex flex-col">
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
