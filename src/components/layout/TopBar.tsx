"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon, FlaskConical, Loader2 } from "lucide-react";
import { useProgressStore, selectOverallProgress } from "@/lib/progress";
import { totalLessons } from "@/content/modules";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "./Sidebar";
import { usePyodide, getStageLabel } from "@/components/python/PyodideProvider";

export function TopBar() {
  const { resolvedTheme, setTheme } = useTheme();
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const reset = useProgressStore((s) => s.reset);
  const { stage, ready } = usePyodide();

  const overallPct = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-background/80 backdrop-blur px-3">
      {/* Mobile menu */}
      <div className="md:hidden">
        <Sidebar isMobile />
      </div>

      {/* Brand on mobile */}
      <div className="md:hidden flex items-center gap-1.5">
        <FlaskConical className="h-4 w-4 text-primary" />
        <span className="font-semibold text-sm">PyLab</span>
      </div>

      {/* Pyodide status badge */}
      <div className="hidden md:flex items-center gap-2">
        {!ready ? (
          <Badge variant="outline" className="gap-1.5 text-xs">
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
            {getStageLabel(stage)}
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1.5 text-xs bg-primary/10 text-primary border-primary/30">
            <FlaskConical className="h-3 w-3" />
            Python listo
          </Badge>
        )}
      </div>

      <div className="flex-1" />

      {/* Overall progress (compact) */}
      <div className="hidden sm:flex items-center gap-2 max-w-xs">
        <Progress value={overallPct} className="h-1.5 w-32" />
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {completedLessons.length}/{totalLessons}
        </span>
      </div>

      {/* Reset progress */}
      <Button
        variant="ghost"
        size="sm"
        className="hidden sm:inline-flex text-xs"
        onClick={() => {
          if (confirm("¿Reiniciar todo tu progreso? Esta acción no se puede deshacer.")) {
            reset();
          }
        }}
      >
        Reiniciar
      </Button>

      {/* Theme toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={toggleTheme}
        aria-label="Cambiar tema"
      >
        {resolvedTheme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>
    </header>
  );
}
