"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, ArrowDown, Check, X } from "lucide-react";

interface Branches {
  [key: string]: string;
}

interface ConditionalVisualizerProps {
  condition?: string;
  branches?: Branches;
}

export function ConditionalVisualizer({
  condition = "condición",
  branches = { Verdadero: "Bloque A", Falso: "Bloque B" },
}: ConditionalVisualizerProps) {
  const [valor, setValor] = useState(true);
  const entries = Object.entries(branches);
  const verdaderoLabel = entries.find(([k]) => k.toLowerCase().startsWith("v"))?.[1] ?? entries[0]?.[1];
  const falsoLabel = entries.find(([k]) => k.toLowerCase().startsWith("f") || k.toLowerCase().startsWith("falso"))?.[1] ?? entries[1]?.[1];

  return (
    <Card className="border-border bg-card/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 flex-wrap">
          <span className="mono-chip">if {condition}:</span>
          <span className="text-xs text-muted-foreground">cambia el valor y observa la rama</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-muted-foreground">Valor de la condición:</span>
          <Switch checked={valor} onCheckedChange={setValor} />
          <span className={`mono-chip ${valor ? "text-chart-3 border-chart-3/40" : "text-destructive border-destructive/40"}`}>
            {valor ? "True" : "False"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`rounded-md border p-3 transition-all ${valor ? "border-chart-3 bg-chart-3/10" : "border-border opacity-50"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              {valor ? <Check className="h-3.5 w-3.5 text-chart-3" /> : <X className="h-3.5 w-3.5 text-muted-foreground" />}
              <span className="text-xs font-semibold text-foreground">Rama Verdadera</span>
            </div>
            <p className="text-sm text-muted-foreground">{verdaderoLabel}</p>
          </div>
          <div className={`rounded-md border p-3 transition-all ${!valor ? "border-chart-5 bg-chart-5/10" : "border-border opacity-50"}`}>
            <div className="flex items-center gap-1.5 mb-1">
              {!valor ? <Check className="h-3.5 w-3.5 text-chart-5" /> : <X className="h-3.5 w-3.5 text-muted-foreground" />}
              <span className="text-xs font-semibold text-foreground">Rama Falsa (else)</span>
            </div>
            <p className="text-sm text-muted-foreground">{falsoLabel}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="mono-chip">{condition}</span>
          <ArrowRight className="h-3 w-3" />
          <span className="mono-chip">
            {valor ? verdaderoLabel : falsoLabel}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
