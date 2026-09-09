"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowDown } from "lucide-react";

interface LoopVisualizerProps {
  items: number[];
  label?: string;
}

export function LoopVisualizer({ items, label = "iter" }: LoopVisualizerProps) {
  return (
    <Card className="border-border bg-card/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="mono-chip">for i in range({items.length})</span>
          <ArrowRight className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs text-muted-foreground">
            {items.length} iteraciones del bucle
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 items-center">
          {items.map((v, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground">
                  {label}[{i}]
                </span>
                <div className="min-w-[64px] rounded-md border border-primary/40 bg-primary/10 px-2 py-1.5 text-center">
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {typeof v === "number" ? v.toFixed(2) : v}
                  </span>
                </div>
              </div>
              {i < items.length - 1 && (
                <ArrowRight className="h-3 w-3 text-muted-foreground/60 mt-3" />
              )}
            </React.Fragment>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Cada caja representa el valor de la variable en una iteración del bucle. En un <code className="mono-chip">for</code> real, el cuerpo del bucle se ejecuta una vez por cada elemento.
        </p>
      </CardContent>
    </Card>
  );
}
