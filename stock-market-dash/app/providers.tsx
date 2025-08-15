"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react";
import { createEmotionCache } from "../lib/createEmotionCache";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const clientSideCache = createEmotionCache();
const theme = createTheme({
  palette: { mode: "dark" },
  // add overrides / customizations if you want
});

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider value={clientSideCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
