import type { SyntaxNode } from 'web-tree-sitter';
import type { ParseContext, ParseStrategy } from './ParseStrategy.js';

export class DefaultParseStrategy implements ParseStrategy {
  parseCapture(
    capture: { node: SyntaxNode; name: string },
    lines: string[],
    processedChunks: Set<string>,
    _context: ParseContext,
  ): string | null {
    const { node, name } = capture;
    const startRow = node.startPosition.row;
    const endRow = node.endPosition.row;

    if (!lines[startRow]) {
      return null;
    }

    const isNameCapture = name.includes('name');
    const isCommentCapture = name.includes('comment');
    const isImportCapture = name.includes('import') || name.includes('require');
    const shouldSelect = isNameCapture || isCommentCapture || isImportCapture;

    if (!shouldSelect) {
      return null;
    }

    const selectedLines = lines.slice(startRow, endRow + 1);
    if (selectedLines.length < 1) {
      return null;
    }

    const chunk = selectedLines.join('\n');
    const normalizedChunk = chunk.trim();

    if (processedChunks.has(normalizedChunk)) {
      return null;
    }

    processedChunks.add(normalizedChunk);
    return chunk;
  }
}
