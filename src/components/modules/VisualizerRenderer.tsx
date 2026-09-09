"use client";

import React from "react";
import { LoopVisualizer } from "@/components/visualizations/LoopVisualizer";
import { ConditionalVisualizer } from "@/components/visualizations/ConditionalVisualizer";
import { FunctionVisualizer } from "@/components/visualizations/FunctionVisualizer";
import { ListVisualizer } from "@/components/visualizations/ListVisualizer";
import { VectorVisualizer } from "@/components/visualizations/VectorVisualizer";
import { MatrixVisualizer } from "@/components/visualizations/MatrixVisualizer";
import { SqlPlayground } from "@/components/python/SqlPlayground";
import { Card, CardContent } from "@/components/ui/card";
import { Sigma } from "lucide-react";

interface VisualizerRendererProps {
  component: string;
  props?: Record<string, unknown>;
}

export function VisualizerRenderer({ component, props = {} }: VisualizerRendererProps) {
  switch (component) {
    case "LoopVisualizer":
      return <LoopVisualizer {...(props as any)} />;
    case "ConditionalVisualizer":
      return <ConditionalVisualizer {...(props as any)} />;
    case "FunctionVisualizer":
      return <FunctionVisualizer {...(props as any)} />;
    case "ListVisualizer":
      return <ListVisualizer {...(props as any)} />;
    case "VectorVisualizer":
      return <VectorVisualizer {...(props as any)} />;
    case "MatrixVisualizer":
      return <MatrixVisualizer {...(props as any)} />;
    case "SqlQueryVisualizer":
      return <SqlPlayground {...(props as any)} />;
    case "VariableInspector":
      // Static demo card — the real inspector appears after running code.
      return (
        <Card className="border-dashed border-border bg-muted/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sigma className="h-3.5 w-3.5 text-primary" />
              Tras ejecutar una celda, las variables definidas aparecerán automáticamente en el panel
              <span className="mono-chip">Variables</span> bajo la consola.
            </div>
          </CardContent>
        </Card>
      );
    default:
      return (
        <Card className="border-dashed border-destructive/30 bg-destructive/5">
          <CardContent className="p-3 text-xs text-muted-foreground">
            Visualizador no reconocido: <code className="mono-chip">{component}</code>
          </CardContent>
        </Card>
      );
  }
}
