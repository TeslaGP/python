"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { CodeEditor } from "./CodeEditor";
import { RunButton } from "./RunButton";
import { Console } from "./Console";
import { PlotViewer } from "./PlotViewer";
import { VariableInspector } from "./VariableInspector";
import { DataFrameViewer } from "./DataFrameViewer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { runPython, resetNamespace, getPyodide } from "@/lib/pyodide";
import { usePyodide, getStageLabel } from "./PyodideProvider";
import type { PythonRunResult, CheckSpec, VarInfo } from "@/lib/types";
import { CheckCircle2, XCircle, Lightbulb, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CodeCellProps {
  code: string;
  readOnly?: boolean;
  caption?: string;
  check?: CheckSpec;
  hints?: string[];
  solution?: string;
  exerciseKey?: string;
  onSolved?: () => void;
  showReset?: boolean;
  minHeight?: string;
}

export function CodeCell({
  code: initialCode,
  readOnly = false,
  caption,
  check,
  hints = [],
  solution,
  exerciseKey,
  onSolved,
  showReset = false,
  minHeight,
}: CodeCell) {
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<PythonRunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [solved, setSolved] = useState(false);
  const [resetCounter, setResetCounter] = useState(0);
  const { ready, stage, ensureLoaded } = usePyodide();
  const toastShownRef = useRef(false);

  // Auto-trigger Pyodide load on first mount so the user doesn't have to
  // click a disabled button — the load will complete in the background.
  useEffect(() => {
    if (stage === "idle") {
      ensureLoaded();
    }
  }, [stage, ensureLoaded]);

  useEffect(() => {
    // When initial code changes (different lesson), reset.
    setCode(initialCode);
    setResult(null);
    setRevealedHints(0);
    setShowSolution(false);
    setSolved(false);
  }, [initialCode, resetCounter]);

  const runCode = useCallback(async () => {
    if (!ready) {
      await ensureLoaded();
      try {
        await getPyodide();
      } catch {
        return;
      }
    }
    setRunning(true);
    try {
      const res = await runPython(code);
      setResult(res);
      if (res.error) {
        // Don't toast on error — Console shows the friendly card.
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setResult({
        stdout: "",
        stderr: "",
        figs: [],
        vars: {},
        error: `Error de ejecución: ${msg}`,
      });
    } finally {
      setRunning(false);
    }
  }, [code, ready, ensureLoaded]);

  const handleReset = useCallback(() => {
    setCode(initialCode);
    setResult(null);
    setRevealedHints(0);
    setShowSolution(false);
    setSolved(false);
    if (showReset) setResetCounter((c) => c + 1);
  }, [initialCode, showReset]);

  const handleResetNamespace = useCallback(async () => {
    try {
      await resetNamespace();
      toast.success("Espacio de variables reiniciado", {
        description: "Las variables definidas en celdas anteriores se han borrado.",
      });
    } catch {
      toast.error("No se pudo reiniciar el espacio de variables.");
    }
  }, []);

  const verify = useCallback(async () => {
    if (!ready) {
      await ensureLoaded();
      try {
        await getPyodide();
      } catch {
        return;
      }
    }
    setRunning(true);
    try {
      const res = await runPython(code);
      setResult(res);
      if (res.error) {
        setSolved(false);
        toast.error("Hay errores en tu código", {
          description: "Revisa la consola para ver la explicación del error.",
        });
        return;
      }
      const ok = applyCheck(check, res);
      setSolved(ok);
      if (ok) {
        toast.success("¡Ejercicio completado!", {
          description: "Tu solución es correcta.",
        });
        onSolved?.();
      } else {
        toast.warning("Aún no es correcto", {
          description: "Revisa la salida y vuelve a intentarlo.",
        });
      }
    } catch (e) {
      setSolved(false);
    } finally {
      setRunning(false);
    }
  }, [code, check, ready, ensureLoaded, onSolved]);

  const pyVars: VarInfo[] = result
    ? Object.entries(result.vars).map(([name, v]) => {
        if (v.type === "DataFrame") {
          return {
            name,
            type: "DataFrame",
            value: `<DataFrame ${v.shape.join("×")}>`,
            extra: {
              kind: "dataframe" as const,
              columns: v.columns,
              rows: v.data,
              shape: v.shape,
            },
          };
        }
        if (v.type === "ndarray") {
          return {
            name,
            type: "ndarray",
            value: `<ndarray ${v.shape.join("×")} ${v.dtype}>`,
            extra: {
              kind: "ndarray" as const,
              shape: v.shape,
              data: v.data,
              dtype: v.dtype,
            },
          };
        }
        return { name, type: v.type, value: v.value };
      })
    : [];

  return (
    <Card className="overflow-hidden border-border bg-card/40">
      {caption && (
        <div className="border-b border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground flex items-center gap-2">
          <FileText className="h-3.5 w-3.5" />
          {caption}
        </div>
      )}
      <div className="p-3 space-y-3">
        <CodeEditor
          value={code}
          onChange={readOnly ? undefined : setCode}
          readOnly={readOnly}
          minHeight={minHeight ?? "140px"}
          onRun={runCode}
        />
        <div className="flex flex-wrap items-center gap-2">
          <RunButton
            onRun={check ? verify : runCode}
            onReset={readOnly ? undefined : handleReset}
            running={running}
            disabled={false}
            runLabel={check ? "Verificar" : "Ejecutar"}
          />
          {showReset && (
            <Button onClick={handleResetNamespace} variant="ghost" size="sm" className="gap-1.5">
              <RotateCcw2Icon />
              <span className="hidden sm:inline">Reiniciar variables</span>
            </Button>
          )}
          {!ready && (
            <Badge variant="secondary" className="gap-1.5">
              <Loader2 className="h-3 w-3 animate-spin" />
              {getStageLabel(stage)}
            </Badge>
          )}
          {check && solved && (
            <Badge className="gap-1 bg-chart-3/20 text-chart-3 border-chart-3/40">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Correcto
            </Badge>
          )}
          {check && !solved && result && !result.error && (
            <Badge variant="outline" className="gap-1 text-destructive border-destructive/30">
              <XCircle className="h-3.5 w-3.5" />
              Inténtalo de nuevo
            </Badge>
          )}
        </div>

        {/* Output area */}
        {result && (result.stdout || result.stderr || result.error || result.figs.length > 0 || Object.keys(result.vars).length > 0) && (
          <div className="space-y-3">
            <Console
              stdout={result.stdout}
              stderr={result.stderr}
              error={result.error}
              running={running}
            />
            {result.figs.length > 0 && <PlotViewer figs={result.figs} />}
            {pyVars.filter((v) => v.extra?.kind === "dataframe").map((v) => (
              <DataFrameViewer
                key={v.name}
                name={v.name}
                columns={v.extra!.columns!}
                rows={v.extra!.rows!}
                shape={v.extra!.shape}
              />
            ))}
            {pyVars.length > 0 && <VariableInspector vars={pyVars} />}
          </div>
        )}

        {/* Hints + solution (exercise mode) */}
        {hints.length > 0 && (
          <div className="space-y-2 pt-1">
            {revealedHints > 0 && (
              <div className="space-y-2">
                {hints.slice(0, revealedHints).map((h, i) => (
                  <div key={i} className="rounded-md border border-chart-4/30 bg-chart-4/5 p-2.5 text-xs">
                    <div className="flex items-center gap-1.5 mb-1 text-chart-4 font-medium">
                      <Lightbulb className="h-3.5 w-3.5" /> Pista {i + 1}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{h}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {revealedHints < hints.length && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRevealedHints((n) => n + 1)}
                  className="gap-1.5"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  {revealedHints === 0 ? "Ver pista" : `Ver pista ${revealedHints + 1}`}
                </Button>
              )}
              {solution && revealedHints >= hints.length && !showSolution && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSolution(true)}
                  className="gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Ver solución
                </Button>
              )}
            </div>
            {showSolution && solution && (
              <div className="rounded-md border border-border bg-muted/20 p-3">
                <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-foreground">
                  <FileText className="h-3.5 w-3.5 text-primary" /> Solución propuesta
                </div>
                <pre className="code-cell-output text-xs overflow-x-auto p-2 rounded bg-background/50">
                  {solution}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

function RotateCcw2Icon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-7.5 4" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

function applyCheck(check: CheckSpec | undefined, res: PythonRunResult): boolean {
  if (!check) return false;
  switch (check.type) {
    case "no_error":
      return !res.error;
    case "output_contains":
      return res.stdout.includes(check.value);
    case "output_equals":
      return res.stdout.trim() === check.value.trim();
    case "last_expr_equals": {
      const target = String(check.value);
      return (res.last_expr ?? "").trim() === target.trim();
    }
    case "variable_equals": {
      const v = res.vars[check.name];
      if (!v) return false;
      if (v.type === "DataFrame" || v.type === "ndarray") return false;
      // compare by stringified value
      return (v.value === String(check.value)) || (v.value === reprPyValue(check.value));
    }
    case "variable_type": {
      const v = res.vars[check.name];
      if (!v) return false;
      return v.type === check.expectedType || v.type.toLowerCase() === check.expectedType.toLowerCase();
    }
    default:
      return false;
  }
}

function reprPyValue(v: unknown): string {
  if (v === null) return "None";
  if (v === undefined) return "None";
  if (typeof v === "boolean") return v ? "True" : "False";
  if (typeof v === "number") return String(v);
  if (typeof v === "string") return `'${v}'`;
  return String(v);
}
