"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database } from "lucide-react";

interface DataFrameViewerProps {
  name: string;
  columns: string[];
  rows: Record<string, unknown>[];
  shape?: number[];
}

export function DataFrameViewer({ name, columns, rows, shape }: DataFrameViewerProps) {
  return (
    <div className="rounded-md border border-primary/30 bg-primary/5">
      <div className="flex items-center gap-2 border-b border-primary/30 px-3 py-2">
        <Database className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium font-mono text-foreground">{name}</span>
        {shape && (
          <span className="ml-auto text-[10px] mono-chip">
            {shape.join(" × ")}
          </span>
        )}
      </div>
      <ScrollArea className="max-h-96">
        <div className="min-w-full inline-block">
          <Table>
            <TableHeader>
              <TableRow className="sticky top-0 bg-background/95 backdrop-blur">
                <TableHead className="h-8 w-10 text-xs text-muted-foreground">#</TableHead>
                {columns.map((c) => (
                  <TableHead key={c} className="h-8 text-xs font-mono text-foreground whitespace-nowrap">
                    {c}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} className="text-xs italic text-muted-foreground">
                    DataFrame vacío
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-1.5 text-[10px] text-muted-foreground font-mono">{i}</TableCell>
                    {columns.map((c) => (
                      <TableCell key={c} className="py-1.5 text-xs font-mono whitespace-nowrap max-w-[200px] truncate" title={String(r[c] ?? "")}>
                        {formatCell(r[c])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      {shape && shape[0] > rows.length && (
        <div className="border-t border-primary/20 px-3 py-1.5 text-[10px] text-muted-foreground italic">
          Mostrando {rows.length} de {shape[0]} filas
        </div>
      )}
    </div>
  );
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return "NaN";
  if (typeof v === "number") {
    if (Number.isNaN(v)) return "NaN";
    if (Number.isInteger(v)) return String(v);
    return v.toFixed(4).replace(/\.?0+$/, "") || "0";
  }
  if (typeof v === "boolean") return v ? "True" : "False";
  return String(v);
}
