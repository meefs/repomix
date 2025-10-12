import path from 'node:path';
import { describe, expect, test } from 'vitest';
import { loadFileConfig } from '../../src/config/configLoad.js';

describe('configLoad Integration Tests', () => {
  const jsFixturesDir = path.join(process.cwd(), 'tests/fixtures/config-js');
  const tsFixturesDir = path.join(process.cwd(), 'tests/fixtures/config-ts');

  describe('TypeScript Config Files', () => {
    test('should load .ts config with ESM default export', async () => {
      const config = await loadFileConfig(tsFixturesDir, 'repomix.config.ts');

      expect(config).toEqual({
        output: {
          filePath: 'ts-output.xml',
          style: 'xml',
          removeComments: true,
        },
        ignore: {
          customPatterns: ['**/node_modules/**', '**/dist/**'],
        },
      });
    });

    test('should load .mts config', async () => {
      const config = await loadFileConfig(tsFixturesDir, 'repomix.config.mts');

      expect(config).toEqual({
        output: {
          filePath: 'mts-output.xml',
          style: 'xml',
        },
        ignore: {
          customPatterns: ['**/test/**'],
        },
      });
    });

    test('should load .cts config', async () => {
      const config = await loadFileConfig(tsFixturesDir, 'repomix.config.cts');

      expect(config).toEqual({
        output: {
          filePath: 'cts-output.xml',
          style: 'plain',
        },
        ignore: {
          customPatterns: ['**/build/**'],
        },
      });
    });

    test('should handle dynamic values in TypeScript config', async () => {
      const config = await loadFileConfig(tsFixturesDir, 'repomix-dynamic.config.ts');

      // Vitest runs with NODE_ENV=test, so we need to include 'test' in the pattern
      expect(config.output?.filePath).toMatch(
        /^output-(test|development|production)-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.xml$/,
      );
      expect(config.output?.style).toBe('xml');
      expect(config.ignore?.customPatterns).toEqual(['**/node_modules/**']);
    });
  });

  describe('JavaScript Config Files', () => {
    test('should load .js config with ESM default export', async () => {
      const config = await loadFileConfig(jsFixturesDir, 'repomix.config.js');

      expect(config).toEqual({
        output: {
          filePath: 'esm-output.xml',
          style: 'xml',
          removeComments: true,
        },
        ignore: {
          customPatterns: ['**/node_modules/**', '**/dist/**'],
        },
      });
    });

    test('should load .mjs config', async () => {
      const config = await loadFileConfig(jsFixturesDir, 'repomix.config.mjs');

      expect(config).toEqual({
        output: {
          filePath: 'mjs-output.xml',
          style: 'xml',
        },
        ignore: {
          customPatterns: ['**/test/**'],
        },
      });
    });

    test('should load .cjs config with module.exports', async () => {
      const config = await loadFileConfig(jsFixturesDir, 'repomix.config.cjs');

      expect(config).toEqual({
        output: {
          filePath: 'cjs-output.xml',
          style: 'plain',
        },
        ignore: {
          customPatterns: ['**/build/**'],
        },
      });
    });

    test('should handle dynamic values in JS config', async () => {
      const config = await loadFileConfig(jsFixturesDir, 'repomix-dynamic.config.js');

      expect(config.output?.filePath).toMatch(/^output-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.xml$/);
      expect(config.output?.style).toBe('xml');
      expect(config.ignore?.customPatterns).toEqual(['**/node_modules/**']);
    });
  });
});
