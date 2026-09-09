"use client";

import React from "react";
import { ImageIcon } from "lucide-react";

interface PlotViewerProps {
  figs: string[]; // base64 PNGs
}

export function PlotViewer({ figs }: PlotViewerProps) {
  if (!figs || figs.length === 0) return null;
  return (
    <div className="space-y-3">
      {figs.map((fig, i) => (
        <div key={i} className="rounded-md border border-border bg-background p-2">
          <div className="flex items-center gap-2 mb-2 px-1">
            <ImageIcon className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-medium text-muted-foreground">
              Figura {i + 1} de {figs.length}
            </span>
          </div>
          <div className="flex justify-center bg-white rounded">
            <img
              src={`data:image/png;base64,${fig}`}
              alt={`Figura matplotlib ${i + 1}`}
              className="max-w-full h-auto"
              style={{ maxHeight: "480px" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
