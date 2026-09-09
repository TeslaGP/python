// sql.js loader + query runner.
// Loads the wasm from CDN (cdnjs) and exposes a small helper to run SQL queries
// on an in-memory SQLite database that we pre-populate with industrial tables.

declare global {
  interface Window {
    initSqlJs?: (opts: { locateFile: (file: string) => string }) => Promise<SqlJsDatabase>;
    _sqlJsPromise?: Promise<SqlJsDatabase>;
  }
}

export interface SqlJsDatabase {
  Database: new (data?: Uint8Array) => SqlJsDbInstance;
}
export interface SqlJsDbInstance {
  exec: (sql: string) => SqlJsResult[];
  run: (sql: string, params?: unknown[]) => void;
  prepare: (sql: string) => SqlJsStatement;
  close: () => void;
}
export interface SqlJsResult {
  columns: string[];
  values: unknown[][];
}
export interface SqlJsStatement {
  bind: (params?: unknown[]) => void;
  step: () => boolean;
  getAsObject: () => Record<string, unknown>;
  free: () => void;
}

const SQL_WASM_URL = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.wasm";
const SQL_JS_SCRIPT = "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";

let dbPromise: Promise<SqlJsDatabase> | null = null;

export function loadSqlJs(): Promise<SqlJsDatabase> {
  if (window._sqlJsPromise) return window._sqlJsPromise;
  dbPromise = (async () => {
    if (!window.initSqlJs) {
      await injectScript(SQL_JS_SCRIPT);
      let waited = 0;
      while (!window.initSqlJs && waited < 20000) {
        await new Promise((r) => setTimeout(r, 100));
        waited += 100;
      }
      if (!window.initSqlJs) throw new Error("No se pudo cargar sql.js desde el CDN.");
    }
    const SQL = await window.initSqlJs({
      locateFile: () => SQL_WASM_URL,
    });
    return SQL;
  })();
  window._sqlJsPromise = dbPromise;
  return dbPromise;
}

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Falló la carga del script sql.js."));
    document.head.appendChild(s);
  });
}

export interface SqlRunResult {
  columns: string[];
  rows: unknown[][];
  error?: string;
  affectedRows?: number;
  message?: string;
}

export async function createDatabase(seedSql: string): Promise<{
  run: (sql: string) => SqlRunResult;
  close: () => void;
}> {
  const SQL = await loadSqlJs();
  const db = new SQL.Database();
  try {
    db.exec(seedSql);
  } catch (e) {
    // ignore seed errors silently
  }
  return {
    run(sql: string): SqlRunResult {
      try {
        const trimmed = sql.trim();
        // For SELECT statements, return columns + rows.
        const results = db.exec(sql);
        if (results.length === 0) {
          // Probably an INSERT/UPDATE/DELETE/CREATE.
          return { columns: [], rows: [], message: "Consulta ejecutada (sin filas devueltas)." };
        }
        const r = results[results.length - 1];
        return {
          columns: r.columns,
          rows: r.values,
        };
      } catch (e) {
        const err = e as Error;
        return { columns: [], rows: [], error: err.message || String(e) };
      }
    },
    close() {
      db.close();
    },
  };
}
