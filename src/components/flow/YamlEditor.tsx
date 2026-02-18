"use client";

import { useRef, useEffect, useCallback } from "react";
import { EditorView, keymap, placeholder as placeholderExt, lineNumbers, highlightActiveLine, highlightActiveLineGutter } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { yaml } from "@codemirror/lang-yaml";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, foldKeymap } from "@codemirror/language";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";

/** Minimal dark theme matching PlexUI dark mode */
const darkTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
      fontSize: "13px",
      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
    },
    ".cm-content": {
      caretColor: "var(--color-text)",
      padding: "8px 0",
    },
    ".cm-cursor": {
      borderLeftColor: "var(--color-text)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(128, 128, 128, 0.08)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(128, 128, 128, 0.08)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text-tertiary)",
      border: "none",
      paddingRight: "4px",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 8px",
      minWidth: "32px",
    },
    ".cm-foldGutter .cm-gutterElement": {
      padding: "0 4px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground": {
      backgroundColor: "rgba(128, 128, 255, 0.15)",
    },
    ".cm-selectionMatch": {
      backgroundColor: "rgba(128, 128, 255, 0.1)",
    },
    ".cm-matchingBracket": {
      backgroundColor: "rgba(128, 128, 255, 0.2)",
      outline: "none",
    },
    ".cm-searchMatch": {
      backgroundColor: "rgba(255, 200, 0, 0.2)",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "rgba(255, 200, 0, 0.4)",
    },
    ".cm-tooltip": {
      backgroundColor: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: "6px",
    },
    ".cm-tooltip-autocomplete": {
      "& > ul > li": {
        padding: "2px 8px",
      },
      "& > ul > li[aria-selected]": {
        backgroundColor: "rgba(128, 128, 255, 0.15)",
      },
    },
    ".cm-panels": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
    },
    ".cm-panel.cm-search": {
      padding: "4px 8px",
    },
  },
  { dark: true },
);

/** Light theme for PlexUI light mode */
const lightTheme = EditorView.theme(
  {
    "&": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text)",
      fontSize: "13px",
      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
    },
    ".cm-content": {
      caretColor: "var(--color-text)",
      padding: "8px 0",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text-tertiary)",
      border: "none",
      paddingRight: "4px",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      padding: "0 8px",
      minWidth: "32px",
    },
  },
  { dark: false },
);

interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  scrollToStepId?: string | null;
}

export function YamlEditor({ value, onChange, placeholder = "# Define your inquiry flow here...", readOnly = false, className, scrollToStepId }: YamlEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  const createState = useCallback(
    (doc: string) => {
      return EditorState.create({
        doc,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          foldGutter(),
          history(),
          bracketMatching(),
          highlightSelectionMatches(),
          autocompletion(),
          lintGutter(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          yaml(),
          isDark ? darkTheme : lightTheme,
          placeholderExt(placeholder),
          EditorView.editable.of(!readOnly),
          EditorState.readOnly.of(readOnly),
          keymap.of([...defaultKeymap, ...historyKeymap, ...foldKeymap, ...searchKeymap, ...completionKeymap, indentWithTab]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
          }),
          EditorView.lineWrapping,
        ],
      });
    },
    [isDark, placeholder, readOnly],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    if (editorRef.current) return;

    const view = new EditorView({
      state: createState(value),
      parent: containerRef.current,
    });
    editorRef.current = view;

    return () => {
      view.destroy();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const view = editorRef.current;
    if (!view) return;
    const currentValue = view.state.doc.toString();
    if (currentValue !== value) {
      view.dispatch({
        changes: { from: 0, to: currentValue.length, insert: value },
      });
    }
  }, [value]);

  useEffect(() => {
    if (!scrollToStepId) return;
    const view = editorRef.current;
    if (!view) return;

    const stepId = scrollToStepId.split("|")[0];
    const text = view.state.doc.toString();
    const needle = stepId === "__start__" ? "start:" : `  ${stepId}:`;
    const pos = text.indexOf(needle);
    if (pos < 0) return;

    const line = view.state.doc.lineAt(pos);
    view.dispatch({
      selection: { anchor: line.from, head: line.to },
      effects: EditorView.scrollIntoView(line.from, { y: "center" }),
    });
    view.focus();
  }, [scrollToStepId]);

  return (
    <div ref={containerRef} className={`h-full overflow-auto [&_.cm-editor]:h-full [&_.cm-editor]:outline-none [&_.cm-scroller]:overflow-auto ${className ?? ""}`} />
  );
}
