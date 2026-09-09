"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { getPyodide, setStageListener, type LoadStage, type PyodideInterface } from "@/lib/pyodide";

interface PyodideContextValue {
  stage: LoadStage;
  ready: boolean;
  error: string | null;
  pyodide: PyodideInterface | null;
  ensureLoaded: () => Promise<void>;
}

const PyodideContext = createContext<PyodideContextValue>({
  stage: "idle",
  ready: false,
  error: null,
  pyodide: null,
  ensureLoaded: async () => {},
});

export function usePyodide(): PyodideContextValue {
  return useContext(PyodideContext);
}

const STAGE_LABELS: Record<LoadStage, string> = {
  idle: "Inicializando…",
  "loading-engine": "Cargando Python…",
  "loading-micropip": "Cargando micropip…",
  "loading-numpy": "Cargando NumPy…",
  "loading-pandas": "Cargando Pandas…",
  "loading-matplotlib": "Cargando Matplotlib…",
  "loading-scipy": "Cargando SciPy…",
  ready: "Listo",
  error: "Error",
};

export function getStageLabel(stage: LoadStage): string {
  return STAGE_LABELS[stage];
}

export function PyodideProvider({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<LoadStage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const loadStartedRef = useRef(false);

  useEffect(() => {
    setStageListener((s) => setStage(s));
  }, []);

  const ensureLoaded = useCallback(async () => {
    if (loadStartedRef.current) return;
    loadStartedRef.current = true;
    try {
      const py = await getPyodide();
      setPyodide(py);
      setStage("ready");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setStage("error");
    }
  }, []);

  const ready = stage === "ready" && pyodide !== null;

  return (
    <PyodideContext.Provider value={{ stage, ready, error, pyodide, ensureLoaded }}>
      {children}
    </PyodideContext.Provider>
  );
}
