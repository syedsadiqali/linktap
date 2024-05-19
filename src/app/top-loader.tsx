"use client";

import { useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";

function TopLoader() {
  const { theme } = useTheme();

  return (
    <NextTopLoader
      // color={theme === "dark" ? "white" : "black"}
      showSpinner={false}
    />
  );
}

export default TopLoader;
