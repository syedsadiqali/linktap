import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata = {
  title: "LinkTap",
  description: "Just Another Link Tree",
};

export default async function RootLayout({ children, theme }: any) {
  console.log(theme)
  return (
    <html lang="en">
      <body className="flex flex-col">
        <NextTopLoader color={"black"} showSpinner={false} />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        <Toaster />
      </body>
    </html>
  );
}
