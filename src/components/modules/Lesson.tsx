"use client";

import React, { useState } from "react";
import type {
  Lesson as LessonType,
  LessonBlock,
  Hint,
  NormalizedHint,
  CheckSpec,
} from "@/lib/types";
import { normalizeHints, PHASE_LABELS, HINT_LEVEL_LABELS } from "@/lib/types";
import { ConceptCard } from "./ConceptCard";
import { DataTable } from "./DataTable";
import { VisualizerRenderer } from "./VisualizerRenderer";
import { MiniProjectCard } from "./MiniProjectCard";
import { TeachCard } from "./TeachCard";
import { MathConnectionCard } from "./MathConnectionCard";
import { CodeCell } from "@/components/python/CodeCell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Target,
  Flag,
  Compass,
  Wrench,
  Code2,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useProgressStore } from "@/lib/progress";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface LessonProps {
  lesson: LessonType;
  moduleId: string;
  moduleTitle: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export function Lesson({ lesson, moduleId, moduleTitle, onNext, onPrev, hasNext, hasPrev }: LessonProps) {
  const markLessonComplete = useProgressStore((s) => s.markLessonComplete);
  const markExerciseComplete = useProgressStore((s) => s.markExerciseComplete);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const completedExercises = useProgressStore((s) => s.completedExercises);

  const lessonKey = `${moduleId}/${lesson.id}`;
  const isLessonDone = completedLessons.includes(lessonKey);

  const handleNext = () => {
    if (!isLessonDone) {
      markLessonComplete(moduleId, lesson.id);
      toast.success("Lección completada", { description: lesson.title });
    }
    onNext?.();
  };

  const phase = lesson.phase ? PHASE_LABELS[lesson.phase] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <motion.div
        key={lesson.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="mb-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
            {moduleTitle}
          </div>
          <h1 className="text-2xl font-bold text-foreground mt-1">{lesson.title}</h1>
          {phase && (
            <div className="mt-2 flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[10px] gap-1 bg-primary/10 text-primary border-primary/30"
                title={phase.description}
              >
                <span>{phase.emoji}</span> Fase: {phase.label}
              </Badge>
              <span className="text-[11px] text-muted-foreground">{phase.description}</span>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {lesson.blocks.map((block, i) => (
            <BlockRenderer
              key={i}
              block={block}
              moduleId={moduleId}
              lessonId={lesson.id}
              onExerciseSolved={(exId) => {
                const exKey = `${moduleId}/${lesson.id}/${exId}`;
                if (!completedExercises.includes(exKey)) {
                  markExerciseComplete(exKey);
                }
              }}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between gap-2 border-t border-border pt-4">
          <button
            disabled={!hasPrev}
            onClick={onPrev}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Lección anterior
          </button>
          <button
            onClick={handleNext}
            className="text-xs font-medium text-primary hover:underline"
          >
            {hasNext ? "Marcar como completada y continuar →" : "Marcar como completada ✓"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

interface BlockRendererProps {
  block: LessonBlock;
  moduleId: string;
  lessonId: string;
  onExerciseSolved: (exId: string) => void;
}

function BlockRenderer({ block, moduleId, lessonId, onExerciseSolved }: BlockRendererProps) {
  switch (block.kind) {
    case "text":
      return <TextBlock title={block.title} body={block.body} />;

    case "codecell":
      return (
        <CodeCell
          code={block.code}
          readOnly={block.readOnly}
          caption={block.caption}
          minHeight="140px"
        />
      );

    case "visualization":
      return <VisualizerRenderer component={block.component} props={block.props} />;

    case "concept":
      return (
        <ConceptCard
          problema={block.problema}
          idea={block.idea}
          codigo={block.codigo}
          interpretacion={block.interpretacion}
        />
      );

    case "teach":
      return (
        <TeachCard
          title={block.title}
          intuition={block.intuition}
          annotations={block.annotations}
          code={block.code}
          experiments={block.experiments}
        />
      );

    case "mathconnection":
      return (
        <MathConnectionCard
          title={block.title}
          mathConcept={block.mathConcept}
          mathNotation={block.mathNotation}
          intuition={block.intuition}
          code={block.code}
          visualization={block.visualization}
          visualizationProps={block.visualizationProps}
          interpretation={block.interpretation}
        />
      );

    case "exercise":
      return (
        <ExerciseCard
          id={block.id}
          prompt={block.prompt}
          starterCode={block.starterCode}
          hints={block.hints}
          solution={block.solution}
          check={block.check}
          level={block.level}
          applies={block.applies}
          exerciseKey={`${moduleId}/${lessonId}/${block.id}`}
          onSolved={() => onExerciseSolved(block.id)}
        />
      );

    case "challenge":
      return (
        <ChallengeCard
          context={block.context}
          data={block.data}
          objetivo={block.objetivo}
          hints={block.hints}
          solution={block.solution}
        />
      );

    case "table":
      return <DataTable headers={block.headers} rows={block.rows} caption={block.caption} />;

    case "miniproject":
      return (
        <MiniProjectCard
          id={block.id}
          title={block.title}
          context={block.context}
          objetivo={block.objetivo}
          dataset={block.dataset}
          checklist={block.checklist}
          starterCode={block.starterCode}
          hints={block.hints}
          solution={block.solution}
          moduleKey={moduleId}
        />
      );

    default:
      return null;
  }
}

function TextBlock({ title, body }: { title?: string; body: string }) {
  return (
    <Card className="border-border bg-card/30">
      <CardContent className="p-4">
        {title && (
          <div className="text-sm font-semibold text-foreground mb-2">{title}</div>
        )}
        <div className="lesson-prose text-sm text-muted-foreground">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================
// ExerciseCard — V2: niveles de andamiaje + pistas categorizadas
// ============================================================
interface ExerciseCardProps {
  id: string;
  prompt: string;
  starterCode: string;
  hints: Hint[];
  solution: string;
  check: CheckSpec;
  level?: "guiado" | "independiente" | "aplicado";
  applies?: string[];
  exerciseKey: string;
  onSolved: () => void;
}

const LEVEL_LABELS: Record<NonNullable<ExerciseCardProps["level"]>, { label: string; description: string }> = {
  guiado: {
    label: "Ejercicio guiado",
    description: "Te damos parte del código y pistas conceptuales primero.",
  },
  independiente: {
    label: "Ejercicio independiente",
    description: "Resuelve tú solo. Las pistas se revelan solo si las pides.",
  },
  aplicado: {
    label: "Problema aplicado",
    description: "Combina varios conceptos en un contexto más real.",
  },
};

function ExerciseCard(props: ExerciseCardProps) {
  const level = props.level ?? "guiado";
  const levelInfo = LEVEL_LABELS[level];
  const normalizedHints = normalizeHints(props.hints);
  const [revealedCount, setRevealedCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  // For "independiente" and "aplicado", the first hint is NOT shown until the student
  // has at least attempted the exercise. We track attempts via the CodeCell's onSolved.
  // (For "guiado", the first conceptual hint shows automatically.)
  const [attempted, setAttempted] = useState(false);

  const visibleHintCount =
    level === "guiado" ? Math.max(revealedCount, 0) : revealedCount;
  const visibleHints = normalizedHints.slice(0, visibleHintCount);
  const nextHint = normalizedHints[visibleHintCount];
  const canAskForHint =
    level !== "independiente" ||
    attempted ||
    visibleHintCount > 0;

  return (
    <Card className="border-chart-3/30 bg-card/30">
      <CardHeader className="pb-2 bg-chart-3/5 border-b border-chart-3/15">
        <CardTitle className="text-sm flex items-center gap-2 flex-wrap">
          <Target className="h-4 w-4 text-chart-3" />
          <span>{levelInfo.label}</span>
          <Badge variant="outline" className="text-[10px] ml-auto gap-1">
            <CheckCircle2 className="h-3 w-3" /> Verificable
          </Badge>
        </CardTitle>
        <p className="text-[11px] text-muted-foreground mt-1">{levelInfo.description}</p>
      </CardHeader>
      <CardContent className="p-4 space-y-2.5">
        {props.applies && props.applies.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
            <span>Aplica:</span>
            {props.applies.map((c) => (
              <span key={c} className="mono-chip text-[10px]">{c}</span>
            ))}
          </div>
        )}
        <p className="text-sm text-foreground leading-relaxed">{props.prompt}</p>

        <CodeCell
          code={props.starterCode}
          check={props.check}
          // Hints are managed here in ExerciseCard so we can categorize them.
          hints={[]}
          solution=""
          exerciseKey={props.exerciseKey}
          onSolved={() => {
            setAttempted(true);
            props.onSolved();
          }}
          showReset
          minHeight="120px"
        />

        {/* Visible hints */}
        {visibleHints.length > 0 && (
          <div className="space-y-1.5">
            {visibleHints.map((h, i) => (
              <HintChip key={i} hint={h} index={i + 1} />
            ))}
          </div>
        )}

        {/* Progressive hint buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {nextHint && (
            <button
              onClick={() => setRevealedCount((n) => n + 1)}
              disabled={!canAskForHint}
              className="text-xs px-2.5 py-1 rounded-md border border-chart-4/30 text-chart-4 hover:bg-chart-4/10 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
              title={canAskForHint ? undefined : "Intenta resolverlo primero. Las pistas se activan tras tu primer intento."}
            >
              {nextHint.level === "conceptual" && <Lightbulb className="h-3 w-3" />}
              {nextHint.level === "tecnica" && <Compass className="h-3 w-3" />}
              {nextHint.level === "codigo" && <Wrench className="h-3 w-3" />}
              {nextHint.level === "solucion_explicada" && <Code2 className="h-3 w-3" />}
              {visibleHints.length === 0
                ? `Ver ${HINT_LEVEL_LABELS[nextHint.level].label}`
                : `Ver ${HINT_LEVEL_LABELS[nextHint.level].label}`}
            </button>
          )}
          {props.solution && !nextHint && !showSolution && (
            <button
              onClick={() => setShowSolution(true)}
              className="text-xs px-2.5 py-1 rounded-md border border-border text-muted-foreground hover:bg-muted/40 transition-colors flex items-center gap-1.5"
            >
              <Code2 className="h-3 w-3" /> Ver solución completa
            </button>
          )}
        </div>

        {showSolution && props.solution && (
          <div className="rounded-md border border-border bg-muted/20 p-3">
            <div className="flex items-center gap-1.5 mb-1.5 text-xs font-medium text-foreground">
              <Code2 className="h-3.5 w-3.5 text-primary" /> Solución propuesta — léela solo después de intentar
            </div>
            <pre className="code-cell-output overflow-x-auto p-2 rounded bg-background/50 text-xs">
              {props.solution}
            </pre>
          </div>
        )}

        {/* Hint progress indicator */}
        {normalizedHints.length > 0 && (
          <div className="text-[10px] text-muted-foreground italic">
            Pistas: {visibleHints.length}/{normalizedHints.length} — empezamos por lo conceptual y terminamos con la solución.
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

// ============================================================
// ChallengeCard — reto abierto con pistas progresivas
// ============================================================
interface ChallengeCardProps {
  context: string;
  data?: string;
  objetivo: string;
  hints: Hint[];
  solution?: string;
}

function ChallengeCard({ context, data, objetivo, hints, solution }: ChallengeCardProps) {
  const normalizedHints = normalizeHints(hints);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <Card className="border-chart-5/30 bg-card/30">
      <CardHeader className="pb-2 bg-chart-5/5 border-b border-chart-5/15">
        <CardTitle className="text-sm flex items-center gap-2">
          <Flag className="h-4 w-4 text-chart-5" />
          <span>Reto — Modo "Resuélvelo tú"</span>
          <Badge variant="outline" className="text-[10px] ml-auto gap-1">
            <BookOpen className="h-3 w-3" /> Sin andamiaje
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-2.5">
        <div>
          <div className="text-xs font-semibold text-foreground/80 mb-1">Contexto</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{context}</p>
        </div>
        {data && (
          <div>
            <div className="text-xs font-semibold text-foreground/80 mb-1">Datos</div>
            <pre className="code-cell-output overflow-x-auto p-2 rounded bg-background/50 text-xs">{data}</pre>
          </div>
        )}
        <div>
          <div className="text-xs font-semibold text-foreground/80 mb-1">Objetivo</div>
          <p className="text-sm text-foreground bg-primary/5 border border-primary/20 rounded-md p-2.5">{objetivo}</p>
        </div>

        {revealedHints > 0 && (
          <div className="space-y-1.5">
            {normalizedHints.slice(0, revealedHints).map((h, i) => (
              <HintChip key={i} hint={h} index={i + 1} />
            ))}
          </div>
        )}
        <div className="flex gap-2">
          {revealedHints < normalizedHints.length && (
            <button
              onClick={() => setRevealedHints((n) => n + 1)}
              className="text-xs px-2.5 py-1 rounded-md border border-chart-4/30 text-chart-4 hover:bg-chart-4/10 transition-colors flex items-center gap-1.5"
            >
              <Lightbulb className="h-3 w-3" />
              {revealedHints === 0
                ? `Ver ${HINT_LEVEL_LABELS[normalizedHints[revealedHints].level].label}`
                : `Ver ${HINT_LEVEL_LABELS[normalizedHints[revealedHints].level].label}`}
            </button>
          )}
          {solution && revealedHints >= normalizedHints.length && !showSolution && (
            <button
              onClick={() => setShowSolution(true)}
              className="text-xs px-2.5 py-1 rounded-md border border-border text-muted-foreground hover:bg-muted/40 transition-colors flex items-center gap-1.5"
            >
              Ver solución propuesta
            </button>
          )}
        </div>
        {showSolution && solution && (
          <pre className="code-cell-output mt-2 overflow-x-auto p-2 rounded bg-background/50 text-xs">{solution}</pre>
        )}
      </CardContent>
    </Card>
  );
}
