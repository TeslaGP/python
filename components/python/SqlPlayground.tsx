"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Play, Loader2, Table2, AlertTriangle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createDatabase, type SqlRunResult } from "@/lib/sql";
import { sqlSeedSql } from "@/content/datasets";
import CodeMirror from "@uiw/react-codemirror";
import { sql as sqlLang } from "@codemirror/lang-sql";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { useTheme } from "next-themes";

interface SqlPlaygroundProps {
  initialQuery?: string;
  minHeight?: string;
}

let dbSingleton: Promise<{ run: (sql: string) => SqlRunResult; close: () => void }> | null = null;

async function getDb() {
  if (!dbSingleton) {
    dbSingleton = createDatabase(sqlSeedSql());
  }
  return dbSingleton;
}

export function SqlPlayground({
  initialQuery = "SELECT * FROM productos LIMIT 10;",
  minHeight = "100px",
}: SqlPlaygroundProps) {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<SqlRunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    let cancelled = false;
    getDb()
      .then(() => { if (!cancelled) setDbReady(true); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Run the initial query once the DB is ready.
  const runQuery = useCallback(async () => {
    if (!dbReady) return;
    setRunning(true);
    try {
      const db = await getDb();
      // Use setTimeout to allow the spinner to render before sync work.
      await new Promise((r) => setTimeout(r, 10));
      const res = db.run(query);
      setResult(res);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setResult({ columns: [], rows: [], error: msg });
    } finally {
      setRunning(false);
    }
  }, [query, dbReady]);

  useEffect(() => {
    if (dbReady) runQuery();
  }, [dbReady, runQuery]);

  const extensions = [
    sqlLang(),
    EditorView.lineWrapping,
    EditorView.theme({
      "&": { fontSize: "0.8125rem", backgroundColor: "transparent" },
      ".cm-content": {
        fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
        padding: "0.5rem 0",
      },
    }),
    EditorView.domEventHandlers({
      keydown: (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
          e.preventDefault();
          runQuery();
          return true;
        }
        return false;
      },
    }),
  ];

  return (
    <Card className="border-primary/30 bg-card/30 overflow-hidden">
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <Database className="h-4 w-4 text-primary" />
          <span className="font-medium">Base de datos SQLite (en memoria)</span>
          <span className="text-muted-foreground">— Tablas:</span>
          <Badge variant="outline" className="text-[10px] font-mono">empleados (30)</Badge>
          <Badge variant="outline" className="text-[10px] font-mono">productos (40)</Badge>
          <Badge variant="outline" className="text-[10px] font-mono">ventas (200)</Badge>
        </div>

        <div className="overflow-hidden rounded-md border border-border bg-background" style={{ minHeight }}>
          <CodeMirror
            value={query}
            height="auto"
            minHeight={minHeight}
            theme={isDark ? oneDark : "light"}
            extensions={extensions}
            basicSetup={{
              lineNumbers: true,
              foldGutter: false,
              highlightActiveLine: true,
              autocompletion: true,
              bracketMatching: true,
              tabSize: 2,
            }}
            onChange={(v) => setQuery(v)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={runQuery} disabled={!dbReady || running} size="sm" className="gap-1.5">
            {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
            Ejecutar SQL
            <kbd className="ml-1 text-[10px] rounded bg-primary-foreground/20 px-1 py-0.5 font-mono">Ctrl+↵</kbd>
          </Button>
          {!dbReady && (
            <Badge variant="outline" className="gap-1.5 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              Cargando SQLite…
            </Badge>
          )}
        </div>

        {result?.error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <div className="font-medium text-destructive mb-0.5">Error de SQL</div>
              <pre className="text-muted-foreground whitespace-pre-wrap">{result.error}</pre>
            </div>
          </div>
        )}

        {result && !result.error && result.columns.length > 0 && (
          <div className="rounded-md border border-border">
            <div className="flex items-center gap-2 border-b border-border px-3 py-2">
              <Table2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                Resultado ({result.rows.length} filas)
              </span>
            </div>
            <ScrollArea className="max-h-80">
              <Table>
                <TableHeader>
                  <TableRow className="sticky top-0 bg-background/95 backdrop-blur">
                    {result.columns.map((c) => (
                      <TableHead key={c} className="text-xs font-mono whitespace-nowrap">{c}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={result.columns.length} className="text-xs italic text-muted-foreground">
                        Sin resultados
                      </TableCell>
                    </TableRow>
                  ) : (
                    result.rows.map((row, i) => (
                      <TableRow key={i}>
                        {row.map((cell, j) => (
                          <TableCell key={j} className="text-xs font-mono whitespace-nowrap">
                            {String(cell ?? "NULL")}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        {result && !result.error && result.columns.length === 0 && result.message && (
          <div className="rounded-md border border-border bg-muted/30 p-2.5 text-xs text-muted-foreground">
            ✓ {result.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
