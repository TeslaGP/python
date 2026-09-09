"use client";

import React, { useState } from "react";
import { Terminal, CheckCircle2, AlertTriangle, Lightbulb, Compass, Wrench, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { explainError, type ExplainedError, type ProgressiveHint } from "@/lib/errorExplainer";
import { Button } from "@/components/ui/button";

interface ConsoleProps {
  stdout: string;
  stderr?: string;
  error?: string | null;
  running?: boolean;
}

export function Console({ stdout, stderr, error, running }: ConsoleProps) {
  const explained: ExplainedError | null = error ? explainError(error) : null;
  const empty = !stdout && !stderr && !error && !running;

  return (
    <div className="rounded-md border border-border bg-muted/30">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Terminal className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-muted-foreground">Consola</span>
        {running && (
          <span className="ml-auto text-xs text-primary animate-pulse">ejecutando…</span>
        )}
      </div>

      <div className="p-3 max-h-96 overflow-y-auto scrollbar-thin">
        {empty && (
          <div className="text-xs text-muted-foreground italic">
            La salida de tu código aparecerá aquí. Pulsa Ejecutar (o Ctrl+Enter) para ver el resultado.
          </div>
        )}

        {stdout && (
          <pre className="code-cell-output whitespace-pre-wrap break-words text-foreground">
            {stdout}
          </pre>
        )}

        {stderr && !error && (
          <pre className="code-cell-output whitespace-pre-wrap break-words text-destructive">
            {stderr}
          </pre>
        )}

        {explained && <FriendlyErrorCard err={explained} />}
      </div>
    </div>
  );
}

function FriendlyErrorCard({ err }: { err: ExplainedError }) {
  // Track the current error identity so we reset hints when the error changes.
  // We use a derived key pattern instead of useEffect+setState (which the linter
  // flags as cascading renders). The `errorKey` is captured here; when it
  // changes, React unmounts and remounts the inner component via `key`.
  const errorKey = err.rawTraceback.slice(0, 100);
  return <FriendlyErrorCardInner key={errorKey} err={err} />;
}

function FriendlyErrorCardInner({ err }: { err: ExplainedError }) {
  const [revealedHints, setRevealedHints] = useState(0);

  const hints = err.hints ?? [];
  const visibleHints = hints.slice(0, revealedHints);
  const nextHint = hints[revealedHints];

  return (
    <div className="mt-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mono-chip bg-destructive/10 text-destructive border-destructive/30">
              {err.errorType}
            </span>
            {err.location && (
              <span className="text-xs text-muted-foreground">
                en <span className="mono-chip">{err.location}</span>
              </span>
            )}
            <span className="text-[10px] text-muted-foreground italic ml-auto">
              Los errores son parte de programar — vamos a entenderlo.
            </span>
          </div>

          {/* Diagnostic — shown immediately */}
          <div className="space-y-1.5 text-sm">
            <Section label="Qué esperaba Python" value={err.expected} icon={<CheckCircle2 className="h-3.5 w-3.5" />} />
            <Section label="Qué recibió" value={err.received} icon={<AlertTriangle className="h-3.5 w-3.5" />} />
            <div>
              <div className="text-xs font-semibold text-foreground/80">Por qué ocurrió</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{err.why}</p>
            </div>
            {/* The "how to fix" line is only revealed after at least one hint, OR if there are no hints. */}
            {(revealedHints >= hints.length || hints.length === 0) && (
              <div>
                <div className="text-xs font-semibold text-foreground/80">Cómo corregirlo</div>
                <p className="text-sm text-muted-foreground leading-relaxed">{err.fix}</p>
              </div>
            )}
          </div>

          {/* Progressive hint chips */}
          {visibleHints.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {visibleHints.map((h, i) => (
                <ProgressiveHintChip key={i} hint={h} index={i + 1} />
              ))}
            </div>
          )}

          {/* Hint request button */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {nextHint && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRevealedHints((n) => n + 1)}
                className="gap-1.5 text-xs h-7"
              >
                {nextHint.level === "conceptual" && <Lightbulb className="h-3.5 w-3.5 text-chart-4" />}
                {nextHint.level === "tecnica" && <Compass className="h-3.5 w-3.5 text-chart-2" />}
                {nextHint.level === "codigo" && <Wrench className="h-3.5 w-3.5 text-chart-3" />}
                Pedir pista ({hintLabel(nextHint.level)})
                <span className="text-[10px] text-muted-foreground ml-1">
                  {revealedHints + 1}/{hints.length}
                </span>
              </Button>
            )}
            {revealedHints > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRevealedHints(0)}
                className="gap-1.5 text-xs h-7 text-muted-foreground"
              >
                <RotateCcw className="h-3 w-3" />
                Ocultar pistas
              </Button>
            )}
          </div>

          {/* Pedagogical note */}
          {hints.length > 0 && revealedHints === 0 && (
            <p className="text-[11px] text-muted-foreground italic">
              Antes de pedir una pista, intenta leer el diagnóstico de arriba y formularte una hipótesis.
              Si no la aciertas, te ayudamos paso a paso.
            </p>
          )}

          <details className="mt-2">
            <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              Ver traza completa
            </summary>
            <pre className={cn(
              "code-cell-output mt-2 overflow-x-auto rounded bg-background/50 p-2",
              "text-destructive",
            )}>
              {err.rawTraceback}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}

function ProgressiveHintChip({ hint, index }: { hint: ProgressiveHint; index: number }) {
  const meta = HINT_META[hint.level];
  const Icon =
    hint.level === "conceptual"
      ? Lightbulb
      : hint.level === "tecnica"
        ? Compass
        : Wrench;
  return (
    <div className={cn("rounded-md border p-2.5 text-xs", meta.tone)}>
      <div className="flex items-center gap-1.5 mb-0.5 font-medium">
        <Icon className="h-3 w-3" />
        <span>{meta.label}</span>
        <span className="text-[10px] opacity-60">#{index}</span>
      </div>
      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{hint.text}</p>
    </div>
  );
}

const HINT_META: Record<ProgressiveHint["level"], { label: string; tone: string }> = {
  conceptual: { label: "Pista conceptual", tone: "bg-chart-4/10 text-chart-4 border-chart-4/30" },
  tecnica: { label: "Pista técnica", tone: "bg-chart-2/10 text-chart-2 border-chart-2/30" },
  codigo: { label: "Ayuda de código", tone: "bg-chart-3/10 text-chart-3 border-chart-3/30" },
};

function hintLabel(level: ProgressiveHint["level"]): string {
  return HINT_META[level].label;
}

function Section({ label, value, icon }: { label: string; value?: string; icon?: React.ReactNode }) {
  if (!value) return null;
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80">
        {icon}
        {label}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mono-chip inline-block mt-0.5">
        {value}
      </p>
    </div>
  );
}
