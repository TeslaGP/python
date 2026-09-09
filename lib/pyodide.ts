import type { PythonRunResult } from "./types";

// Pyodide is loaded via a <Script> tag in layout.tsx that injects window.loadPyodide.
declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
    pyodide?: PyodideInterface;
  }
}

export interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (names: string | string[]) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
  globals: {
    get: (name: string) => unknown;
    set: (name: string, value: unknown) => void;
  };
  version: string;
}

export type LoadStage =
  | "idle"
  | "loading-engine"
  | "loading-micropip"
  | "loading-numpy"
  | "loading-pandas"
  | "loading-matplotlib"
  | "loading-scipy"
  | "ready"
  | "error";

let pyodidePromise: Promise<PyodideInterface> | null = null;
let onStage: (stage: LoadStage) => void = () => {};

export function setStageListener(fn: (stage: LoadStage) => void) {
  onStage = fn;
}

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";

export async function getPyodide(): Promise<PyodideInterface> {
  if (window.pyodide) return window.pyodide;
  if (pyodidePromise) return pyodidePromise;

  pyodidePromise = (async () => {
    onStage("loading-engine");
    if (!window.loadPyodide) {
      // Wait for the script to be available.
      let waited = 0;
      while (!window.loadPyodide && waited < 30000) {
        await new Promise((r) => setTimeout(r, 150));
        waited += 150;
      }
      if (!window.loadPyodide) throw new Error("No se pudo cargar el motor de Pyodide desde el CDN.");
    }
    const pyodide = await window.loadPyodide({ indexURL: PYODIDE_INDEX_URL });
    window.pyodide = pyodide;

    // Capture stdout/stderr into globals so the harness can read them.
    pyodide.setStdout({ batched: (s: string) => { _stdoutBuf += s; } });
    pyodide.setStderr({ batched: (s: string) => { _stderrBuf += s; } });

    onStage("loading-micropip");
    await pyodide.loadPackage(["micropip"]);

    onStage("loading-numpy");
    await pyodide.loadPackage(["numpy"]);

    onStage("loading-pandas");
    await pyodide.loadPackage(["pandas"]);

    onStage("loading-matplotlib");
    await pyodide.loadPackage(["matplotlib"]);

    onStage("loading-scipy");
    await pyodide.loadPackage(["scipy"]);

    // Initialize persistent namespace + matplotlib Agg backend once.
    await pyodide.runPythonAsync(INIT_HARNESS);

    onStage("ready");
    return pyodide;
  })();

  return pyodidePromise;
}

// Buffers for stdout/stderr, reset before every run.
let _stdoutBuf = "";
let _stderrBuf = "";

const INIT_HARNESS = `
import sys, io, json, base64, traceback
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
plt.close('all')

# Persistent namespace shared across all code cells.
_user_ns = {'__name__': '__main__'}
# Pre-seed commonly needed imports so students can use them immediately.
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import scipy
_user_ns['np'] = np
_user_ns['pd'] = pd
_user_ns['plt'] = plt
_user_ns['scipy'] = scipy

import builtins as _builtins

class _CaptureStdout:
    """A file-like object that records writes into a string buffer we own."""
    def __init__(self):
        self.buf = ""
    def write(self, s):
        self.buf += s
        return len(s)
    def flush(self):
        pass

_cap = _CaptureStdout()
_real_stdout = sys.stdout
_real_stderr = sys.stderr

def _reset_captures():
    _cap.buf = ""

def _run_user_code(src: str) -> str:
    _reset_captures()
    sys.stdout = _cap
    sys.stderr = _cap
    figs = []
    var_info = {}
    err = None
    last_expr = None
    try:
        # Compile in 'single' mode would print expr results, but we want full exec.
        # We exec the source; if the last node is an expression, capture its value.
        import ast as _ast
        try:
            tree = _ast.parse(src)
        except SyntaxError as e:
            raise
        # If the last statement is an Expression, evaluate and print it like a REPL.
        last = tree.body[-1] if tree.body else None
        if isinstance(last, _ast.Expr):
            # Separate: exec all but last, then eval last.
            mod_exec = _ast.Module(body=tree.body[:-1], type_ignores=tree.type_ignores)
            mod_eval = _ast.Expression(body=last.value)
            code_exec = compile(mod_exec, "<cell>", "exec")
            code_eval = compile(mod_eval, "<cell>", "eval")
            exec(code_exec, _user_ns)
            last_expr = eval(code_eval, _user_ns)
            if last_expr is not None:
                _builtins_print = _user_ns.get('print', print)
                # Use repr for the captured last expression
                _cap.buf += repr(last_expr) + "\\n"
        else:
            code = compile(tree, "<cell>", "exec")
            exec(code, _user_ns)

        # Capture matplotlib figures produced.
        for f in plt.get_fignums():
            fig = plt.figure(f)
            buf = io.BytesIO()
            fig.savefig(buf, format='png', dpi=100, bbox_inches='tight')
            figs.append(base64.b64encode(buf.getvalue()).decode())
        plt.close('all')

        # Snapshot variables (skip modules / dunders / builtins).
        _skip = {'np', 'pd', 'plt', 'scipy'}
        _skip_types = {'builtin_function_or_method', 'type', 'module', 'function'}
        for k, v in list(_user_ns.items()):
            if k.startswith('__'):
                continue
            if k in _skip:
                var_info[k] = {'type': 'module', 'value': '<módulo>'}
                continue
            try:
                # Skip callables (functions, types, builtins) to keep the
                # inspector focused on actual user-defined data.
                tn = type(v).__name__
                if callable(v) and not isinstance(v, (pd.DataFrame, pd.Series, np.ndarray)):
                    continue
                if tn in _skip_types:
                    continue
                if isinstance(v, (pd.DataFrame, pd.Series)):
                    if isinstance(v, pd.Series):
                        v = v.to_frame()
                    var_info[k] = {
                        'type': 'DataFrame',
                        'data': v.head(50).to_dict('records'),
                        'columns': list(v.columns),
                        'shape': list(v.shape),
                    }
                elif isinstance(v, np.ndarray):
                    if v.size <= 400:
                        data = v.tolist()
                    else:
                        data = v.flatten()[:400].tolist()
                    var_info[k] = {
                        'type': 'ndarray',
                        'data': data,
                        'shape': list(v.shape),
                        'dtype': str(v.dtype),
                    }
                else:
                    r = repr(v)
                    if len(r) > 200:
                        r = r[:200] + "..."
                    var_info[k] = {'type': tn, 'value': r}
            except Exception:
                var_info[k] = {'type': type(v).__name__, 'value': '<no se pudo inspeccionar>'}

    except Exception as e:
        err = traceback.format_exc()
    finally:
        sys.stdout = _real_stdout
        sys.stderr = _real_stderr

    return json.dumps({
        'stdout': _cap.buf,
        'stderr': '',
        'figs': figs,
        'vars': var_info,
        'error': err,
        'last_expr': repr(last_expr) if last_expr is not None else None,
    })

def _reset_namespace():
    global _user_ns
    _user_ns = {'__name__': '__main__'}
    _user_ns['np'] = np
    _user_ns['pd'] = pd
    _user_ns['plt'] = plt
    _user_ns['scipy'] = scipy
    plt.close('all')

import builtins as _b
_user_ns['print'] = _b.print
_user_ns['len'] = _b.len
_user_ns['range'] = _b.range
_user_ns['sum'] = _b.sum
_user_ns['min'] = _b.min
_user_ns['max'] = _b.max
_user_ns['str'] = _b.str
_user_ns['int'] = _b.int
_user_ns['float'] = _b.float
_user_ns['bool'] = _b.bool
_user_ns['list'] = _b.list
_user_ns['dict'] = _b.dict
_user_ns['tuple'] = _b.tuple
_user_ns['set'] = _b.set
_user_ns['enumerate'] = _b.enumerate
_user_ns['zip'] = _b.zip
_user_ns['sorted'] = _b.sorted
_user_ns['reversed'] = _b.reversed
_user_ns['abs'] = _b.abs
_user_ns['round'] = _b.round
_user_ns['type'] = _b.type
_user_ns['isinstance'] = _b.isinstance
_user_ns['open'] = _b.open
`;

const RUN_TEMPLATE = `
import json as _json
_result_str = _run_user_code(${JSON.stringify("__USER_CODE_PLACEHOLDER__")})
`;

export async function runPython(code: string): Promise<PythonRunResult> {
  const pyodide = await getPyodide();
  // Build the harness call: pass code as a Python string literal safely.
  const codeLiteral = pythonStringLiteral(code);
  const harness = `_result_str = _run_user_code(${codeLiteral})\n`;
  _stdoutBuf = "";
  _stderrBuf = "";
  await pyodide.runPythonAsync(harness);
  const resultStr = pyodide.globals.get("_result_str") as string;
  if (!resultStr) {
    return { stdout: "", stderr: "", figs: [], vars: {}, error: "Sin respuesta del motor." };
  }
  try {
    return JSON.parse(resultStr) as PythonRunResult;
  } catch {
    return { stdout: "", stderr: "", figs: [], vars: {}, error: "Respuesta inválida del motor." };
  }
}

export async function resetNamespace(): Promise<void> {
  const pyodide = await getPyodide();
  await pyodide.runPythonAsync("_reset_namespace()");
}

// Build a safe Python string literal for given JS string.
function pythonStringLiteral(s: string): string {
  // Use double-quoted string; escape backslashes and double quotes.
  const escaped = s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r/g, "");
  return `"""${escaped.replace(/"""/g, '\\"\\"\\"')}"""`;
}
