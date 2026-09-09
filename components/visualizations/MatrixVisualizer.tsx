"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MatrixVisualizerProps {
  matrix?: number[][];
  label?: string;
  showTranspose?: boolean;
}

export function MatrixVisualizer({
  matrix = [[1, 2, 3], [4, 5, 6]],
  label = "A",
  showTranspose = false,
}: MatrixVisualizerProps) {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const transpose = matrix[0]?.map((_, c) => matrix.map((r) => r[c])) ?? [];

  const renderMatrix = (m: number[][], name: string, dims: [number, number]) => (
    <div className="flex flex-col items-center gap-2">
      <div className="text-xs text-muted-foreground">
        <span className="mono-chip">{name}</span> shape ({dims[0]}, {dims[1]})
      </div>
      <div className="inline-block border-l-2 border-r-2 border-primary/60 px-2 py-1">
        <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${dims[1]}, minmax(48px, 1fr))` }}>
          {m.flat().map((v, i) => (
            <div
              key={i}
              className="min-w-[48px] rounded border border-border bg-background px-2 py-1.5 text-center font-mono text-sm"
            >
              {typeof v === "number" ? (Number.isInteger(v) ? v : v.toFixed(2)) : v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="border-border bg-card/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="mono-chip">{label}</span>
          <span className="text-xs text-muted-foreground">
            Matriz {rows}×{cols}, {rows * cols} elementos
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${showTranspose ? "md:grid-cols-2" : "grid-cols-1"}`}>
          {renderMatrix(matrix, label, [rows, cols])}
          {showTranspose && (
            <>
              <div className="flex items-center justify-center text-muted-foreground">
                <span className="mono-chip">.T</span>
              </div>
              {renderMatrix(transpose, `${label}.T`, [cols, rows])}
            </>
          )}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          La matriz es una tabla de números. El <strong>shape</strong> describe las dimensiones: {rows} filas × {cols} columnas. La transpuesta intercambia filas por columnas.
        </p>
      </CardContent>
    </Card>
  );
}
