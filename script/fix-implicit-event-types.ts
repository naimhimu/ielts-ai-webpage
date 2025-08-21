// scripts/fix-implicit-event-types.ts
// Heuristically add React event types to single-parameter handlers named e (or event)
// in common JSX props: onSubmit, onClick, onChange, onInput, onKeyDown, onKeyUp.
// Only touches parameters that are currently untyped.

import { Project, SyntaxKind, Node } from "ts-morph";
import * as path from "path";

const project = new Project({
  tsConfigFilePath: path.resolve("tsconfig.json"),
  skipFileDependencyResolution: true,
});

const reactEventMap: Record<string, string[]> = {
  onSubmit: ["React.FormEvent<HTMLFormElement>"],
  onClick: [
    "React.MouseEvent<HTMLButtonElement>",
    "React.MouseEvent<HTMLAnchorElement>",
    "React.MouseEvent<HTMLElement>",
  ],
  onChange: [
    "React.ChangeEvent<HTMLInputElement>",
    "React.ChangeEvent<HTMLTextAreaElement>",
    "React.ChangeEvent<HTMLSelectElement>",
  ],
  onInput: [
    "React.FormEvent<HTMLInputElement>",
    "React.FormEvent<HTMLTextAreaElement>",
  ],
  onKeyDown: ["React.KeyboardEvent<HTMLElement>"],
  onKeyUp: ["React.KeyboardEvent<HTMLElement>"],
};

function ensureReactImport(text: string) {
  return text.includes("from 'react'") || text.includes('from "react"');
}

function addReactTypeImport(file: import("ts-morph").SourceFile) {
  if (!ensureReactImport(file.getFullText())) {
    file.insertStatements(0, `import * as React from 'react';\n`);
  }
}

function typeForProp(propName: string, targetTagName?: string): string | null {
  const candidates = reactEventMap[propName];
  if (!candidates) return null;
  const lower = targetTagName?.toLowerCase();
  if (propName === "onClick") {
    if (lower === "button") return "React.MouseEvent<HTMLButtonElement>";
    if (lower === "a") return "React.MouseEvent<HTMLAnchorElement>";
  }
  if (propName === "onChange" || propName === "onInput") {
    const k = propName === "onChange" ? "ChangeEvent" : "FormEvent";
    if (lower === "textarea") return `React.${k}<HTMLTextAreaElement>`;
    if (lower === "select") return "React.ChangeEvent<HTMLSelectElement>";
    if (lower === "input") return `React.${k}<HTMLInputElement>`;
  }
  return candidates[candidates.length - 1] ?? null; // fallback HTMLElement
}

project.addSourceFilesAtPaths(["src/**/*.{ts,tsx}"]);

let changed = 0;

for (const sf of project.getSourceFiles()) {
  let fileChanged = false;

  sf.forEachDescendant((node) => {
    if (!Node.isJsxAttribute(node)) return;
    const propName = node.getName();
    const initializer = node.getInitializer();
    if (!initializer || !reactEventMap[propName]) return;

    if (!Node.isJsxExpression(initializer)) return;
    const expr = initializer.getExpression();
    if (!expr) return;

    // Inline: onX={(e) => ...}
    if (Node.isArrowFunction(expr) || Node.isFunctionExpression(expr)) {
      const params = expr.getParameters();
      if (params.length === 1 && !params[0].getTypeNode()) {
        const jsx =
          node.getFirstAncestorByKind(SyntaxKind.JsxOpeningElement) ??
          node.getFirstAncestorByKind(SyntaxKind.JsxSelfClosingElement);
        const tagName = jsx ? jsx.getTagNameNode().getText() : undefined;
        const typeText = typeForProp(propName, tagName) || "React.SyntheticEvent";
        params[0].setType(typeText);
        fileChanged = true;
      }
    }

    // Referenced handler: onX={sendMessage}
    if (Node.isIdentifier(expr)) {
      const decls = expr.getDefinitions().map((d) => d.getNode());
      for (const decl of decls) {
        if (
          Node.isFunctionDeclaration(decl) ||
          Node.isFunctionExpression(decl) ||
          Node.isArrowFunction(decl)
        ) {
          // @ts-ignore
          const params = decl.getParameters?.() ?? [];
          if (params.length === 1 && !params[0].getTypeNode()) {
            const jsx =
              node.getFirstAncestorByKind(SyntaxKind.JsxOpeningElement) ??
              node.getFirstAncestorByKind(SyntaxKind.JsxSelfClosingElement);
            const tagName = jsx ? jsx.getTagNameNode().getText() : undefined;
            const typeText = typeForProp(propName, tagName) || "React.SyntheticEvent";
            params[0].setType(typeText);
            fileChanged = true;
          }
        }
      }
    }
  });

  if (fileChanged) {
    addReactTypeImport(sf);
    changed++;
  }
}

if (changed > 0) {
  project.saveSync();
  console.log(`Updated ${changed} file(s).`);
} else {
  console.log("No changes needed.");
}
