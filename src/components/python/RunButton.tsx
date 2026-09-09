"use client";

import React from "react";
import { Play, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RunButtonProps {
  onRun: () => void;
  onReset?: () => void;
  running?: boolean;
  disabled?: boolean;
  className?: string;
  runLabel?: string;
}

export function RunButton({
  onRun,
  onReset,
  running = false,
  disabled = false,
  className,
  runLabel = "Ejecutar",
}: RunButtonProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        onClick={onRun}
        disabled={disabled || running}
        size="sm"
        className="gap-1.5"
      >
        {running ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Play className="h-3.5 w-3.5" />
        )}
        {runLabel}
        <kbd className="ml-1 hidden sm:inline-flex text-[10px] rounded bg-primary-foreground/20 px-1 py-0.5 font-mono">
          Ctrl+↵
        </kbd>
      </Button>
      {onReset && (
        <Button onClick={onReset} variant="outline" size="sm" className="gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Restablecer</span>
        </Button>
      )}
    </div>
  );
}
