"use client";

import React, { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  minHeight?: string;
  onRun?: () => void;
  autofocus?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  minHeight = "180px",
  onRun,
  autofocus = false,
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const extensions = useMemo(
    () => [
      python(),
      EditorView.lineWrapping,
      EditorView.theme({
        "&": {
          fontSize: "0.8125rem",
          backgroundColor: "transparent",
        },
        ".cm-content": {
          fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
          padding: "0.5rem 0",
        },
        ".cm-gutters": {
          backgroundColor: "transparent",
          borderRight: "1px solid var(--border)",
          color: "var(--muted-foreground)",
        },
      }),
      // Custom keymap: Ctrl/Cmd+Enter triggers run
      EditorView.domEventHandlers({
        keydown: (e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            onRun?.();
            return true;
          }
          return false;
        },
      }),
    ],
    [onRun],
  );

  return (
    <div className="overflow-hidden rounded-md border border-border bg-background" style={{ minHeight }}>
      <CodeMirror
        value={value}
        height="auto"
        minHeight={minHeight}
        theme={isDark ? oneDark : "light"}
        extensions={extensions}
        readOnly={readOnly}
        autoFocus={autofocus}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: !readOnly,
          highlightActiveLineGutter: !readOnly,
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
          indentOnInput: true,
          tabSize: 4,
        }}
        onChange={(val) => onChange?.(val)}
      />
    </div>
  );
}
