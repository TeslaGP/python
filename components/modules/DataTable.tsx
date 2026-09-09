"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table as TableIcon } from "lucide-react";

interface DataTableProps {
  headers: string[];
  rows: (string | number)[][];
  caption?: string;
}

export function DataTable({ headers, rows, caption }: DataTableProps) {
  return (
    <Card className="border-border bg-card/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <TableIcon className="h-4 w-4 text-primary" />
          {caption ?? "Tabla de datos"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-96">
          <Table>
            <TableHeader>
              <TableRow className="sticky top-0 bg-background/95 backdrop-blur">
                {headers.map((h, i) => (
                  <TableHead key={i} className="text-xs font-mono whitespace-nowrap">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i}>
                  {row.map((cell, j) => (
                    <TableCell key={j} className="text-xs font-mono whitespace-nowrap">
                      {typeof cell === "number"
                        ? Number.isInteger(cell)
                          ? cell
                          : cell.toFixed(2)
                        : cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
