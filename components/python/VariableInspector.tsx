"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Database, Hash, Sigma } from "lucide-react";
import type { VarInfo } from "@/lib/types";

interface VariableInspectorProps {
  vars: VarInfo[];
}

export function VariableInspector({ vars }: VariableInspectorProps) {
  if (!vars || vars.length === 0) {
    return (
      <div className="rounded-md border border-border bg-muted/30 p-3">
        <div className="flex items-center gap-2 mb-1">
          <Sigma className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Variables</span>
        </div>
        <p className="text-xs text-muted-foreground italic">
          Las variables que definas aparecerán aquí tras ejecutar tu código.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-muted/30">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Sigma className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">
          Variables definidas ({vars.length})
        </span>
      </div>
      <ScrollArea className="max-h-72">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-8 text-xs">Nombre</TableHead>
              <TableHead className="h-8 text-xs">Valor</TableHead>
              <TableHead className="h-8 text-xs">Tipo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vars.map((v) => (
              <TableRow key={v.name}>
                <TableCell className="py-1.5 text-xs font-mono text-foreground">{v.name}</TableCell>
                <TableCell className="py-1.5 text-xs font-mono text-muted-foreground max-w-[280px] truncate" title={v.value}>
                  {v.type === "module" ? <span className="italic text-muted-foreground/60">&lt;módulo&gt;</span> : v.value}
                </TableCell>
                <TableCell className="py-1.5">
                  <TypeBadge type={v.type} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  let icon = <Hash className="h-3 w-3" />;
  let tone = "bg-muted text-muted-foreground border-border";
  if (type === "DataFrame" || type === "DataFrame".toLowerCase()) {
    icon = <Database className="h-3 w-3" />;
    tone = "bg-primary/10 text-primary border-primary/30";
  } else if (type === "ndarray" || type === "ndarray") {
    icon = <Hash className="h-3 w-3" />;
    tone = "bg-chart-2/15 text-chart-2 border-chart-2/30";
  } else if (type === "list" || type === "tuple" || type === "set" || type === "dict") {
    tone = "bg-chart-4/15 text-chart-4 border-chart-4/30";
  } else if (type === "str") {
    tone = "bg-chart-5/15 text-chart-5 border-chart-5/30";
  } else if (type === "int" || type === "float" || type === "bool") {
    tone = "bg-chart-3/15 text-chart-3 border-chart-3/30";
  } else if (type === "module") {
    tone = "bg-muted text-muted-foreground/60 border-border";
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium ${tone}`}>
      {icon}
      {type}
    </span>
  );
}
