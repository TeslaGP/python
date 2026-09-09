"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Lightbulb, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { CodeCell } from "@/components/python/CodeCell";
import ReactMarkdown from "react-markdown";

interface ConceptCardProps {
  problema: string;
  idea: string;
  codigo: string;
  interpretacion: string;
}

export function ConceptCard({ problema, idea, codigo, interpretacion }: ConceptCardProps) {
  const [showIdea, setShowIdea] = useState(false);
  const [showInterp, setShowInterp] = useState(false);

  return (
    <Card className="border-primary/20 bg-card/30 overflow-hidden">
      <CardHeader className="pb-2 bg-primary/5 border-b border-primary/15">
        <CardTitle className="text-sm flex items-center gap-2">
          <Badge className="bg-primary/15 text-primary border-primary/30">Problema</Badge>
          <span className="text-foreground font-medium">¿Qué queremos resolver?</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2.5">
        <p className="text-sm text-foreground leading-relaxed">{problema}</p>

        <div>
          <button
            onClick={() => setShowIdea((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showIdea ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            <Lightbulb className="h-3.5 w-3.5 text-chart-4" />
            <span className="font-medium">Idea conceptual</span>
          </button>
          {showIdea && (
            <div className="mt-1.5 rounded-md border border-chart-4/30 bg-chart-4/5 p-2.5 text-sm text-muted-foreground leading-relaxed">
              {idea}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
            <Play className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">Código — ejecútalo y modifícalo</span>
          </div>
          <CodeCell code={codigo} minHeight="100px" />
        </div>

        <div>
          <button
            onClick={() => setShowInterp((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showInterp ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            <span className="font-medium">Interpretación del resultado</span>
          </button>
          {showInterp && (
            <div className="mt-1.5 rounded-md border border-border bg-muted/20 p-2.5">
              <div className="lesson-prose text-sm">
                <ReactMarkdown>{interpretacion}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
