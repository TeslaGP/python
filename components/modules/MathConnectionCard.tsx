"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeCell } from "@/components/python/CodeCell";
import { VisualizerRenderer } from "./VisualizerRenderer";
import { Sigma, ArrowRight, ArrowDown, Lightbulb, ChevronDown, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface MathConnectionCardProps {
  title?: string;
  mathConcept: string;
  mathNotation: string;
  intuition: string;
  code: string;
  visualization?: string;
  visualizationProps?: Record<string, unknown>;
  interpretation: string;
}

/**
 * MathConnectionCard binds three worlds the student is studying simultaneously:
 *   - Mathematics (the concept, the notation)
 *   - Python / NumPy (how we express it in code)
 *   - Visualization (what the operation *does* geometrically or structurally)
 *
 * Layout: 4 vertical phases connected by downward arrows:
 *   1. Math concept + notation
 *   2. Code implementing it
 *   3. (optional) Visualization
 *   4. Interpretation: what the result means in math AND in the engineering context
 */
export function MathConnectionCard({
  title,
  mathConcept,
  mathNotation,
  intuition,
  code,
  visualization,
  visualizationProps,
  interpretation,
}: MathConnectionCardProps) {
  const [showInterpretation, setShowInterpretation] = useState(false);

  return (
    <Card className="border-chart-2/30 bg-card/30">
      <CardHeader className="pb-2 bg-chart-2/5 border-b border-chart-2/15">
        <CardTitle className="text-sm flex items-center gap-2">
          <Sigma className="h-4 w-4 text-chart-2" />
          <span>{title ?? mathConcept}</span>
          <Badge variant="outline" className="ml-auto text-[10px] gap-1 border-chart-2/30 text-chart-2">
            <Sigma className="h-3 w-3" /> Matemáticas ↔ Código
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {/* Phase 1: Math concept */}
        <div className="rounded-md border border-chart-2/30 bg-chart-2/5 p-3">
          <div className="text-xs font-semibold text-chart-2 mb-1">
            1. Concepto matemático
          </div>
          <div className="text-sm text-foreground font-medium mb-1">{mathConcept}</div>
          <div className="rounded bg-background/60 p-2 my-1.5">
            <code className="font-mono text-sm text-chart-2">{mathNotation}</code>
          </div>
          <div className="lesson-prose text-xs text-muted-foreground mt-1.5">
            <ReactMarkdown>{intuition}</ReactMarkdown>
          </div>
        </div>

        <PhaseConnector />

        {/* Phase 2: Code */}
        <div>
          <div className="text-xs font-semibold text-foreground/80 mb-1.5">
            2. Cómo se expresa en Python / NumPy
          </div>
          <CodeCell code={code} minHeight="120px" />
        </div>

        {/* Phase 3: Visualization */}
        {visualization && (
          <>
            <PhaseConnector />
            <div>
              <div className="text-xs font-semibold text-foreground/80 mb-1.5">
                3. Qué hace geométricamente o estructuralmente
              </div>
              <VisualizerRenderer component={visualization} props={visualizationProps} />
            </div>
          </>
        )}

        {/* Phase 4: Interpretation */}
        <PhaseConnector />
        <div>
          <button
            onClick={() => setShowInterpretation((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors mb-1"
          >
            {showInterpretation ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            <Lightbulb className="h-3.5 w-3.5 text-chart-4" />
            4. Interpretación — ¿qué significa el resultado?
          </button>
          {showInterpretation && (
            <div className="rounded-md border border-chart-4/30 bg-chart-4/5 p-3">
              <div className="lesson-prose text-sm text-muted-foreground">
                <ReactMarkdown>{interpretation}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function PhaseConnector() {
  return (
    <div className="flex justify-center">
      <ArrowDown className="h-4 w-4 text-muted-foreground/60" />
    </div>
  );
}
