"use client";

import { forwardRef, useRef, useEffect, useCallback, useImperativeHandle } from "react";
import { EditorView, keymap, placeholder as placeholderExt, lineNumbers, Decoration, GutterMarker, gutterLineClass } from "@codemirror/view";
import { EditorState, RangeSetBuilder, Transaction } from "@codemirror/state";
import { yaml } from "@codemirror/lang-yaml";
import { defaultKeymap, history, historyKeymap, indentWithTab, undo, redo, undoDepth, redoDepth } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, foldGutter, foldKeymap, codeFolding, foldState } from "@codemirror/language";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import {
  GITHUB_FOLD_MARKER_SIZE,
  GITHUB_FOLD_MARKER_SVG,
  GITHUB_FOLD_PLACEHOLDER_BUTTON_HEIGHT,
  GITHUB_FOLD_PLACEHOLDER_BUTTON_WIDTH,
  GITHUB_FOLD_PLACEHOLDER_ICON_SIZE,
  GITHUB_FOLD_PLACEHOLDER_SVG,
  GITHUB_LINE_NUMBER_GUTTER_MIN_WIDTH,
  GITHUB_LINE_NUMBER_GUTTER_PADDING_LEFT,
  GITHUB_LINE_NUMBER_GUTTER_PADDING_RIGHT,
} from "@/lib/constants";

/** Minimal dark theme matching PlexUI dark mode */
const githubBaseTheme = EditorView.theme({
  "&": {
    fontSize: "13px",
    fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
  },
  ".cm-content": {
    padding: "8px 0",
    whiteSpace: "pre !important",
    overflowWrap: "normal",
    wordBreak: "normal",
  },
  ".cm-line": {
    whiteSpace: "pre !important",
    overflowWrap: "normal",
    wordBreak: "normal",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    color: "var(--color-text-tertiary)",
    border: "none",
  },
  ".cm-scroller": {
    overscrollBehaviorX: "contain",
    overscrollBehaviorY: "contain",
  },
  ".cm-lineNumbers .cm-gutterElement": {
    paddingLeft: `${GITHUB_LINE_NUMBER_GUTTER_PADDING_LEFT}px !important`,
    paddingRight: `${GITHUB_LINE_NUMBER_GUTTER_PADDING_RIGHT}px !important`,
    minWidth: `${GITHUB_LINE_NUMBER_GUTTER_MIN_WIDTH}px !important`,
  },
  ".cm-foldGutter .cm-gutterElement": {
    padding: "0",
    width: `${GITHUB_FOLD_MARKER_SIZE}px`,
    minWidth: `${GITHUB_FOLD_MARKER_SIZE}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "var(--color-editor-folded-icon)",
  },
  ".cm-foldGutter .cm-gutterElement:hover": {
    color: "var(--color-text)",
  },
  ".cm-foldGutterMarker": {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: `${GITHUB_FOLD_MARKER_SIZE}px`,
    height: "100%",
    color: "var(--color-editor-folded-icon)",
  },
  ".cm-foldGutterMarker svg": {
    width: `${GITHUB_FOLD_MARKER_SIZE}px`,
    height: `${GITHUB_FOLD_MARKER_SIZE}px`,
    fill: "currentColor",
  },
  ".cm-line.cm-foldedLine": {
    display: "block",
    width: "100%",
    backgroundColor: "var(--color-editor-folded-line-bg) !important",
  },
  ".cm-gutter .cm-gutterElement.cm-foldedGutterElement": {
    backgroundColor: "var(--color-editor-folded-line-bg) !important",
  },
  ".cm-lineNumbers .cm-gutterElement.cm-foldedGutterElement": {
    boxShadow: "inset 2px 0 0 var(--color-editor-folded-line-border)",
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "var(--color-editor-folded-icon)",
    margin: "0 4px",
    padding: "0",
    width: `${GITHUB_FOLD_PLACEHOLDER_BUTTON_WIDTH}px`,
    height: `${GITHUB_FOLD_PLACEHOLDER_BUTTON_HEIGHT}px`,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    verticalAlign: "middle",
    borderRadius: "6px",
    cursor: "pointer",
  },
  ".cm-foldPlaceholder svg": {
    width: `${GITHUB_FOLD_PLACEHOLDER_ICON_SIZE}px`,
    height: `${GITHUB_FOLD_PLACEHOLDER_ICON_SIZE}px`,
    fill: "currentColor",
  },
  ".cm-foldPlaceholder:hover": {
    backgroundColor: "var(--color-editor-folded-placeholder-hover-bg)",
  },
  ".cm-activeLine, .cm-activeLineGutter": {
    backgroundColor: "transparent !important",
  },
});

const getFoldedLineStarts = (state: EditorState) => {
  const foldSet = state.field(foldState, false);
  if (!foldSet) return [];
  const starts = new Set<number>();
  foldSet.between(0, state.doc.length, (from) => {
    const line = state.doc.lineAt(from > 0 ? from - 1 : from);
    starts.add(line.from);
  });
  return Array.from(starts).sort((a, b) => a - b);
};

/** Light theme for PlexUI light mode */
/** Extension to add a class to folded lines for styling the whole line */
const foldedLineHighlighter = EditorView.decorations.compute(["doc", foldState], (state) => {
  const builder = new RangeSetBuilder<Decoration>();
  const foldedLineStarts = getFoldedLineStarts(state);
  for (const lineStart of foldedLineStarts) {
    builder.add(lineStart, lineStart, Decoration.line({ class: "cm-foldedLine" }));
  }
  return builder.finish();
});

class FoldedLineGutterMarker extends GutterMarker {
  elementClass = "cm-foldedGutterElement";
}

const foldedLineGutterMarker = new FoldedLineGutterMarker();

const foldedLineGutterHighlighter = gutterLineClass.compute(["doc", foldState], (state) => {
  const builder = new RangeSetBuilder<GutterMarker>();
  const foldedLineStarts = getFoldedLineStarts(state);
  for (const lineStart of foldedLineStarts) {
    builder.add(lineStart, lineStart, foldedLineGutterMarker);
  }
  return builder.finish();
});

// YamlEditorProps defines the properties for the component

interface YamlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  scrollToStepId?: string | null;
  onHistoryStateChange?: (state: { canUndo: boolean; canRedo: boolean }) => void;
}

export interface YamlEditorHandle {
  undo: () => void;
  redo: () => void;
}

export const YamlEditor = forwardRef<YamlEditorHandle, YamlEditorProps>(function YamlEditor(
  {
    value,
    onChange,
    placeholder = "# Define your inquiry flow here...",
    readOnly = false,
    className,
    scrollToStepId,
    onHistoryStateChange,
  }: YamlEditorProps,
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onHistoryStateChangeRef = useRef(onHistoryStateChange);
  onChangeRef.current = onChange;
  onHistoryStateChangeRef.current = onHistoryStateChange;

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  const emitHistoryState = useCallback((state: EditorState) => {
    onHistoryStateChangeRef.current?.({
      canUndo: undoDepth(state) > 0,
      canRedo: redoDepth(state) > 0,
    });
  }, []);

  const createState = useCallback(
    (doc: string) => {
      return EditorState.create({
        doc,
        extensions: [
          lineNumbers(),
          codeFolding({
            placeholderDOM: (_view, onclick) => {
              const dom = document.createElement("button");
              dom.type = "button";
              dom.className = "cm-foldPlaceholder";
              dom.setAttribute("aria-label", "Expand folded section");
              dom.onclick = onclick;
              dom.innerHTML = GITHUB_FOLD_PLACEHOLDER_SVG;
              return dom;
            }
          }),
          foldGutter({
            markerDOM: (open) => {
              const dom = document.createElement("span");
              dom.className = "cm-foldGutterMarker";
              dom.innerHTML = open ? GITHUB_FOLD_MARKER_SVG.open : GITHUB_FOLD_MARKER_SVG.closed;
              return dom;
            }
          }),
          history(),
          bracketMatching(),
          highlightSelectionMatches(),
          autocompletion(),
          lintGutter(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          yaml(),
          isDark ? githubDark : githubLight,
          githubBaseTheme,
          foldedLineHighlighter,
          foldedLineGutterHighlighter,
          placeholderExt(placeholder),
          EditorView.editable.of(!readOnly),
          EditorState.readOnly.of(readOnly),
          keymap.of([...defaultKeymap, ...historyKeymap, ...foldKeymap, ...searchKeymap, ...completionKeymap, indentWithTab]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString());
            }
            if (update.docChanged || update.transactions.some((transaction) => transaction.isUserEvent("undo") || transaction.isUserEvent("redo"))) {
              emitHistoryState(update.state);
            }
          }),
        ],
      });
    },
    [emitHistoryState, isDark, placeholder, readOnly],
  );

  useEffect(() => {
    if (!containerRef.current) return;
    if (editorRef.current) return;

    const view = new EditorView({
      state: createState(value),
      parent: containerRef.current,
    });
    editorRef.current = view;
    emitHistoryState(view.state);

    return () => {
      view.destroy();
      editorRef.current = null;
      onHistoryStateChangeRef.current?.({ canUndo: false, canRedo: false });
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
        annotations: Transaction.addToHistory.of(false),
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

  useImperativeHandle(
    ref,
    () => ({
      undo: () => {
        const view = editorRef.current;
        if (!view || readOnly) return;
        if (!undo(view)) return;
        emitHistoryState(view.state);
      },
      redo: () => {
        const view = editorRef.current;
        if (!view || readOnly) return;
        if (!redo(view)) return;
        emitHistoryState(view.state);
      },
    }),
    [emitHistoryState, readOnly],
  );

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-auto [&_.cm-editor]:h-full [&_.cm-editor]:outline-none [&_.cm-scroller]:overflow-auto [&_.cm-scroller]:overscroll-x-contain [&_.cm-scroller]:overscroll-y-contain [&_.cm-content]:whitespace-pre ${className ?? ""}`}
    />
  );
});
