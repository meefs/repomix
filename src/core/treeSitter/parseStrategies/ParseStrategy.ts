import type { Node, Query, Tree } from 'web-tree-sitter';
import type { RepomixConfigMerged } from '../../../config/configSchema.js';
import type { SupportedLang } from '../lang2Query.js';
import { CssParseStrategy } from './CssParseStrategy.js';
import { DefaultParseStrategy } from './DefaultParseStrategy.js';
import { GoParseStrategy } from './GoParseStrategy.js';
import { PythonParseStrategy } from './PythonParseStrategy.js';
import { TypeScriptParseStrategy } from './TypeScriptParseStrategy.js';
import { VueParseStrategy } from './VueParseStrategy.js';

export interface ParseContext {
  fileContent: string;
  lines: string[];
  tree: Tree;
  query: Query;
  config: RepomixConfigMerged;
}

export interface ParseStrategy {
  parseCapture(
    capture: { node: Node; name: string },
    lines: string[],
    processedChunks: Set<string>,
    context: ParseContext,
  ): string | null;
}

export function createParseStrategy(lang: SupportedLang): ParseStrategy {
  switch (lang) {
    case 'typescript':
      return new TypeScriptParseStrategy();
    case 'python':
      return new PythonParseStrategy();
    case 'go':
      return new GoParseStrategy();
    case 'css':
      return new CssParseStrategy();
    case 'vue':
      return new VueParseStrategy();
    default:
      return new DefaultParseStrategy();
  }
}
