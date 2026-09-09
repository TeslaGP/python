"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface FunctionVisualizerProps {
  inputs?: string[];
  process?: string;
  output?: string;
}

export function FunctionVisualizer({
  inputs = ["x"],
  process = "transformación",
  output = "f(x)",
}: FunctionVisualizerProps) {
  return (
    <Card className="border-border bg-card/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="mono-chip">def f({inputs.join(", ")}):</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {/* Inputs */}
          <div className="flex-1 rounded-md border border-primary/30 bg-primary/5 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-primary mb-2">
              Entradas (parámetros)
            </div>
            <ul className="space-y-1">
              {inputs.map((i, idx) => (
                <li key={idx} className="text-sm mono-chip inline-block mr-1">{i}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Process */}
          <div className="flex-1 rounded-md border border-chart-4/30 bg-chart-4/5 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-chart-4 mb-2">
              Proceso (cuerpo de la función)
            </div>
            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">{process}</pre>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Output */}
          <div className="flex-1 rounded-md border border-chart-3/30 bg-chart-3/5 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-chart-3 mb-2">
              Salida (return)
            </div>
            <p className="text-sm mono-chip inline-block">{output}</p>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Una función es una caja negra: recibe entradas, ejecuta un proceso y devuelve una salida. La persona que llama no necesita saber cómo se calcula, solo qué devuelve.
        </p>
      </CardContent>
    </Card>
  );
}
