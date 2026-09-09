// Core content model types for the PyLab learning platform.
//
// V2 introduces richer pedagogical block types:
//   - `teach`: structured introduction (intuition → annotated code → try-modify suggestions)
//   - `mathconnection`: math concept → notation → code → visualization → interpretation
//   - `exercise` now has a `level` (guided | independent | applied) and categorized hints
//   - `challenge` (open-ended) and `miniproject` remain

export type CheckSpec =
  | { type: "output_contains"; value: string }
  | { type: "output_equals"; value: string }
  | { type: "variable_equals"; name: string; value: unknown }
  | { type: "variable_type"; name: string; expectedType: string }
  | { type: "last_expr_equals"; value: unknown }
  | { type: "no_error" };

// Hint categories — they progress from concept → technique → code → explained solution.
// The student reveals them in order, never getting the answer immediately.
export type Hint =
  | string
  | {
      level: "conceptual" | "tecnica" | "codigo" | "solucion_explicada";
      text: string;
    };

// Pedagogical phase a lesson targets. Drives the phase indicator in the lesson header.
export type PedagogicalPhase =
  | "ensenar"
  | "mostrar"
  | "experimentar"
  | "practicar_guiado"
  | "resolver_solo"
  | "aplicar";

export type LessonBlock =
  | { kind: "text"; title?: string; body: string }
  | { kind: "codecell"; code: string; readOnly?: boolean; caption?: string }
  | {
      kind: "visualization";
      component: string;
      props?: Record<string, unknown>;
    }
  | {
      kind: "concept";
      problema: string;
      idea: string;
      codigo: string;
      interpretacion: string;
    }
  // V2: structured teaching block.
  // Intuition first, then annotated code (one explanation per line or block),
  // then "try modifying X" experiments the student can run.
  | {
      kind: "teach";
      title?: string;
      intuition: string;
      // Each annotation explains a chunk of the code with a marker like # (1)
      annotations: { marker: string; explanation: string }[];
      code: string;
      // Experiments: suggested modifications the student can try. Each is a single change
      // the student can apply to the code above. We render them as small "try this" chips.
      experiments?: { label: string; description: string }[];
    }
  // V2: math ↔ code ↔ visualization ↔ interpretation card.
  // Used heavily in the NumPy + Linear Algebra module.
  | {
      kind: "mathconnection";
      title?: string;
      mathConcept: string; // human-readable concept name, e.g. "Producto matriz-vector"
      mathNotation: string; // e.g. "Ax = y, donde A ∈ ℝ^{m×n}, x ∈ ℝ^n"
      intuition: string; // plain-language explanation of the math
      code: string; // Python code that implements the math
      visualization?: string; // optional name of a visualizer component to render
      visualizationProps?: Record<string, unknown>;
      interpretation: string; // what the result means in math and in the engineering context
    }
  | {
      kind: "exercise";
      id: string;
      prompt: string;
      starterCode: string;
      hints: Hint[];
      solution: string;
      check: CheckSpec;
      // V2: scaffolding level — drives UI label and how much guidance is shown by default.
      level?: "guiado" | "independiente" | "aplicado";
      // V2: which concept(s) this exercise applies (so we can show a tiny "aplica: X" chip).
      applies?: string[];
    }
  | {
      kind: "challenge";
      id: string;
      context: string;
      data?: string;
      objetivo: string;
      hints: Hint[];
      solution?: string;
    }
  | {
      kind: "table";
      headers: string[];
      rows: (string | number)[][];
      caption?: string;
    }
  | {
      kind: "miniproject";
      id: string;
      title: string;
      context: string;
      objetivo: string;
      dataset?: string;
      checklist: string[];
      starterCode?: string;
      hints: Hint[];
      solution?: string;
    };

export interface Lesson {
  id: string;
  title: string;
  blocks: LessonBlock[];
  // V2: optional pedagogical phase shown as a chip in the lesson header.
  phase?: PedagogicalPhase;
  // V2: optional list of concept ids taught/practiced in this lesson — for cross-reference.
  concepts?: string[];
}

export interface Module {
  id: string;
  title: string;
  level: number;
  icon: string;
  description: string;
  lessons: Lesson[];
}

// Runtime result of running a Python cell through Pyodide.
export interface PythonRunResult {
  stdout: string;
  stderr: string;
  figs: string[]; // base64 PNGs
  vars: Record<
    string,
    | { type: "dataframe"; data: Record<string, unknown>[]; columns: string[]; shape: number[] }
    | { type: "ndarray"; data: unknown; shape: number[]; dtype: string }
    | { type: string; value: string }
  >;
  error: string | null;
  last_expr?: string | null;
}

export interface VarInfo {
  name: string;
  type: string;
  value: string;
  extra?: {
    kind: "dataframe" | "ndarray" | "scalar";
    columns?: string[];
    rows?: Record<string, unknown>[];
    shape?: number[];
    data?: unknown;
    dtype?: string;
  };
}

// Normalized hint with a level, used internally by the ExerciseCard.
export interface NormalizedHint {
  level: "conceptual" | "tecnica" | "codigo" | "solucion_explicada";
  text: string;
}

export function normalizeHints(hints: Hint[] | undefined): NormalizedHint[] {
  if (!hints || hints.length === 0) return [];
  // If hints are plain strings, auto-assign levels in order: conceptual, tecnica, codigo, solucion.
  const defaultLevels: NormalizedHint["level"][] = [
    "conceptual",
    "tecnica",
    "codigo",
    "solucion_explicada",
  ];
  return hints.map((h, i) => {
    if (typeof h === "string") {
      return { level: defaultLevels[i] ?? "solucion_explicada", text: h };
    }
    return { level: h.level, text: h.text };
  });
}

export const PHASE_LABELS: Record<PedagogicalPhase, { label: string; emoji: string; description: string }> = {
  ensenar: { label: "Enseñar", emoji: "📖", description: "Se introduce un concepto nuevo con explicación intuitiva." },
  mostrar: { label: "Mostrar", emoji: "👁", description: "Se muestra código funcional y se explica cada parte." },
  experimentar: { label: "Experimentar", emoji: "🧪", description: "Modificas el código y observas qué ocurre." },
  practicar_guiado: { label: "Practicar guiado", emoji: "🧭", description: "Completas partes con andamiaje y pistas." },
  resolver_solo: { label: "Resolver solo", emoji: "🎯", description: "Resuelves un ejercicio sin pistas iniciales." },
  aplicar: { label: "Aplicar", emoji: "🚀", description: "Usas el concepto en un problema más real." },
};

export const HINT_LEVEL_LABELS: Record<NormalizedHint["level"], { label: string; tone: string }> = {
  conceptual: { label: "Pista conceptual", tone: "bg-chart-4/10 text-chart-4 border-chart-4/30" },
  tecnica: { label: "Pista técnica", tone: "bg-chart-2/10 text-chart-2 border-chart-2/30" },
  codigo: { label: "Ayuda de código", tone: "bg-chart-3/10 text-chart-3 border-chart-3/30" },
  solucion_explicada: { label: "Solución explicada", tone: "bg-primary/10 text-primary border-primary/30" },
};
