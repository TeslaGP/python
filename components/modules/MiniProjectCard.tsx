"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Target, Lightbulb, FileText, ChevronDown, ChevronRight, FolderKanban, Compass, Wrench, Code2 } from "lucide-react";
import { CodeCell } from "@/components/python/CodeCell";
import { useProgressStore } from "@/lib/progress";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { normalizeHints, type Hint, HINT_LEVEL_LABELS, type NormalizedHint } from "@/lib/types";

interface MiniProjectCardProps {
  id: string;
  title: string;
  context: string;
  objetivo: string;
  dataset?: string;
  checklist: string[];
  starterCode?: string;
  hints: Hint[];
  solution?: string;
  moduleKey: string;
}

export function MiniProjectCard(props: MiniProjectCardProps) {
  const { id, title, context, objetivo, checklist, starterCode, hints, solution, moduleKey } = props;
  const projectKey = `${moduleKey}/${id}`;
  const completed = useProgressStore((s) => s.completedProjects.includes(projectKey));
  const markProjectComplete = useProgressStore((s) => s.markProjectComplete);
  const [checked, setChecked] = useState<boolean[]>(() => checklist.map(() => false));
  const [revealedHints, setRevealedHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const normalizedHints = normalizeHints(hints);

  const allChecked = checked.every(Boolean);

  const handleToggle = (i: number, v: boolean) => {
    const next = [...checked];
    next[i] = v;
    setChecked(next);
    if (next.every(Boolean) && !completed) {
      markProjectComplete(projectKey);
      toast.success("¡Proyecto completado!", {
        description: title,
      });
    }
  };

  return (
    <Card className="border-primary/30 bg-card/30">
      <CardHeader className="pb-2 bg-primary/5 border-b border-primary/15">
        <CardTitle className="text-base flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-primary" />
          <span>{title}</span>
          <Badge variant="outline" className="ml-auto text-[10px]">Mini-Proyecto</Badge>
          {completed && (
            <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30 text-[10px]">Completado</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div>
          <div className="text-xs font-semibold text-foreground/80 mb-1">Contexto</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{context}</p>
        </div>
        <div>
          <div className="text-xs font-semibold text-foreground/80 mb-1 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-primary" /> Objetivo
          </div>
          <p className="text-sm text-foreground leading-relaxed bg-primary/5 border border-primary/20 rounded-md p-2.5">
            {objetivo}
          </p>
        </div>

        <div>
          <div className="text-xs font-semibold text-foreground/80 mb-2">Listas de comprobación</div>
          <div className="space-y-1.5">
            {checklist.map((c, i) => (
              <label
                key={i}
                className="flex items-start gap-2 rounded-md border border-border bg-muted/20 p-2 cursor-pointer hover:bg-muted/40 transition-colors"
              >
                <Checkbox
                  checked={checked[i]}
                  onCheckedChange={(v) => handleToggle(i, !!v)}
                  className="mt-0.5"
                />
                <span className="text-xs text-foreground leading-relaxed">{c}</span>
              </label>
            ))}
          </div>
        </div>

        {starterCode !== undefined && (
          <div>
            <div className="text-xs font-semibold text-foreground/80 mb-1.5">Tu código</div>
            <CodeCell
              code={starterCode}
              minHeight="180px"
              showReset
              exerciseKey={projectKey}
              onSolved={() => {
                if (!allChecked) {
                  toast.info("Marca todas las casillas de la lista cuando termines.");
                }
              }}
            />
          </div>
        )}

        {hints.length > 0 && (
          <div>
            {revealedHints > 0 && (
              <div className="space-y-1.5 mb-2">
                {normalizedHints.slice(0, revealedHints).map((h, i) => (
                  <HintChip key={i} hint={h} index={i + 1} />
                ))}
              </div>
            )}
            <div className="flex gap-2">
              {revealedHints < normalizedHints.length && (
                <Button variant="outline" size="sm" onClick={() => setRevealedHints((n) => n + 1)} className="gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5" />
                  {revealedHints === 0
                    ? `Ver ${HINT_LEVEL_LABELS[normalizedHints[revealedHints].level].label}`
                    : `Ver ${HINT_LEVEL_LABELS[normalizedHints[revealedHints].level].label}`}
                </Button>
              )}
              {solution && revealedHints >= normalizedHints.length && !showSolution && (
                <Button variant="outline" size="sm" onClick={() => setShowSolution(true)} className="gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Ver solución
                </Button>
              )}
            </div>
            {showSolution && solution && (
              <pre className="code-cell-output mt-2 overflow-x-auto p-2 rounded bg-background/50 text-xs">
                {solution}
              </pre>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function HintChip({ hint, index }: { hint: NormalizedHint; index: number }) {
  const meta = HINT_LEVEL_LABELS[hint.level];
  const Icon =
    hint.level === "conceptual"
      ? Lightbulb
      : hint.level === "tecnica"
        ? Compass
        : hint.level === "codigo"
          ? Wrench
          : Code2;
  return (
    <div className={`rounded-md border p-2.5 text-xs ${meta.tone}`}>
      <div className="flex items-center gap-1.5 mb-0.5 font-medium">
        <Icon className="h-3 w-3" />
        <span>{meta.label}</span>
        <span className="text-[10px] opacity-60">#{index}</span>
      </div>
      <p className="text-muted-foreground leading-relaxed">{hint.text}</p>
    </div>
  );
}
