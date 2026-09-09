"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeCell } from "@/components/python/CodeCell";
import { BookOpen, Sparkles, Lightbulb, ChevronDown, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface TeachCardProps {
  title?: string;
  intuition: string;
  annotations: { marker: string; explanation: string }[];
  code: string;
  experiments?: { label: string; description: string }[];
}

/**
 * TeachCard follows the V2 pedagogical principle:
 *   1. Intuition first (what is this, why does it exist, plain language)
 *   2. Code with line-by-line annotations explaining each part
 *   3. Editable code cell so the student can run it as-is
 *   4. "Try modifying" experiments — small, concrete suggested changes
 *
 * The student is never shown only the syntax: every line of code is annotated,
 * and the experiments push them to predict what will happen before running.
 */
export function TeachCard({ title, intuition, annotations, code, experiments }: TeachCardProps) {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [activeExperiment, setActiveExperiment] = useState<number | null>(null);

  return (
    <Card className="border-primary/30 bg-card/30">
      <CardHeader className="pb-2 bg-primary/5 border-b border-primary/15">
        <CardTitle className="text-sm flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span>{title ?? "Aprender un concepto nuevo"}</span>
          <Badge variant="outline" className="ml-auto text-[10px] gap-1">
            <BookOpen className="h-3 w-3" /> Enseñar
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* 1. Intuition */}
        <section>
          <div className="text-xs font-semibold text-foreground/80 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-chart-4" />
            La idea (antes del código)
          </div>
          <div className="lesson-prose text-sm text-muted-foreground rounded-md border border-chart-4/20 bg-chart-4/5 p-3">
            <ReactMarkdown>{intuition}</ReactMarkdown>
          </div>
        </section>

        {/* 2. Annotated code */}
        <section>
          <button
            onClick={() => setShowAnnotations((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80 mb-2 hover:text-foreground transition-colors"
          >
            {showAnnotations ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            Lectura del código — qué hace cada parte
          </button>
          {showAnnotations && (
            <div className="space-y-1.5 mb-3">
              {annotations.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-xs rounded-md border border-border bg-muted/20 p-2"
                >
                  <Badge className="bg-primary/15 text-primary border-primary/30 font-mono text-[10px] flex-shrink-0">
                    {a.marker}
                  </Badge>
                  <span className="text-muted-foreground leading-relaxed">{a.explanation}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. Runnable code cell */}
        <section>
          <div className="text-xs font-semibold text-foreground/80 mb-1.5 flex items-center gap-1.5">
            <span className="text-primary">▶</span> Código — ejecútalo tal cual
          </div>
          <CodeCell code={code} minHeight="120px" />
        </section>

        {/* 4. Try-modify experiments */}
        {experiments && experiments.length > 0 && (
          <section>
            <div className="text-xs font-semibold text-foreground/80 mb-2 flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5 text-chart-4" />
              Experiméntalo — predice y luego ejecuta
            </div>
            <div className="space-y-1.5">
              {experiments.map((e, i) => (
                <button
                  key={i}
                  onClick={() => setActiveExperiment(activeExperiment === i ? null : i)}
                  className="w-full text-left rounded-md border border-chart-4/30 bg-chart-4/5 p-2.5 hover:bg-chart-4/10 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono bg-chart-4/20 text-chart-4 rounded px-1.5 py-0.5">
                      {i + 1}
                    </span>
                    <span className="text-xs font-medium text-foreground">{e.label}</span>
                    {activeExperiment === i && <ChevronDown className="h-3 w-3 ml-auto" />}
                  </div>
                  {activeExperiment === i && (
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{e.description}</p>
                  )}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground italic">
              Edita el código de arriba según cada experimento y vuelve a ejecutar. Antes de pulsar Ejecutar, escribe
              en una frase qué crees que va a pasar.
            </p>
          </section>
        )}
      </CardContent>
    </Card>
  );
}
