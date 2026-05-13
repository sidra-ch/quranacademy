"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange storageKey="theme">
        {children}
      </NextThemesProvider>
    </SessionProvider>
  );
}
