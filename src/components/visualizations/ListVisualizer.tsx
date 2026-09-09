"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface ListVisualizerProps {
  items?: string[];
  highlightIndex?: number;
}

export function ListVisualizer({
  items: initialItems = ["Tornillo", "Martillo", "Pintura", "Cable", "Foco"],
  highlightIndex,
}: ListVisualizerProps) {
  const [items, setItems] = useState<string[]>(initialItems);
  const [highlight, setHighlight] = useState<number | null>(highlightIndex ?? null);

  const remove = (i: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
    if (highlight === i) setHighlight(null);
  };
  const add = () => {
    setItems((prev) => [...prev, `Item ${prev.length + 1}`]);
  };
  const move = (i: number, dir: -1 | 1) => {
    setItems((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  return (
    <Card className="border-border bg-card/40">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center gap-2">
          <span className="mono-chip">lista = [{items.length}]</span>
          <span className="text-xs text-muted-foreground">haz clic en una caja para resaltarla</span>
        </CardTitle>
        <Button onClick={add} size="sm" variant="outline" className="gap-1">
          <Plus className="h-3.5 w-3.5" /> append
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {items.length === 0 ? (
            <div className="text-xs italic text-muted-foreground py-3">Lista vacía</div>
          ) : (
            items.map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] text-muted-foreground font-mono">[{i}]</span>
                <button
                  onClick={() => setHighlight(highlight === i ? null : i)}
                  className={`group relative rounded-md border px-3 py-2 text-sm font-medium transition-all ${
                    highlight === i
                      ? "border-primary bg-primary/15 text-foreground scale-105 shadow-md"
                      : "border-border bg-background hover:border-primary/50"
                  }`}
                >
                  {item}
                </button>
                <div className="flex gap-0.5">
                  <button onClick={() => move(i, -1)} className="text-muted-foreground hover:text-foreground" aria-label="subir">
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button onClick={() => move(i, 1)} className="text-muted-foreground hover:text-foreground" aria-label="bajar">
                    <ArrowDown className="h-3 w-3" />
                  </button>
                  <button onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive" aria-label="eliminar">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-3 text-xs text-muted-foreground space-y-1">
          <div>
            <span className="mono-chip">lista[0]</span> accede al primer elemento.{" "}
            <span className="mono-chip">lista[-1]</span> al último.
          </div>
          <div>
            <span className="mono-chip">len(lista)</span> = <span className="mono-chip">{items.length}</span>
          </div>
          <div>
            {highlight !== null && items[highlight] && (
              <>
                Elemento seleccionado: <span className="mono-chip">lista[{highlight}]</span> = <span className="mono-chip">{items[highlight]}</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
