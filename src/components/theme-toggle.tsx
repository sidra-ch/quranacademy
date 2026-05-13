"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="sm"
        aria-label="Toggle color mode"
        className="h-9 w-9 rounded-full border-[#0F766E]/40 bg-white/20 p-0"
      >
        <Moon className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      aria-label="Toggle color mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-9 w-9 rounded-full border-[#0F766E]/40 bg-white/20 p-0"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
