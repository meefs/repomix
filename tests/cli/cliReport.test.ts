import path from 'node:path';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { reportCompletion, reportSecurityCheck, reportSummary, reportTopFiles } from '../../src/cli/cliReport.js';
import type { SuspiciousFileResult } from '../../src/core/security/securityCheck.js';
import type { PackResult } from '../../src/index.js';
import { logger } from '../../src/shared/logger.js';
import { createMockConfig } from '../testing/testUtils.js';

vi.mock('../../src/shared/logger');
vi.mock('picocolors', () => ({
  default: {
    white: (str: string) => `WHITE:${str}`,
    dim: (str: string) => `DIM:${str}`,
    green: (str: string) => `GREEN:${str}`,
    yellow: (str: string) => `YELLOW:${str}`,
    red: (str: string) => `RED:${str}`,
    cyan: (str: string) => `CYAN:${str}`,
    underline: (str: string) => `UNDERLINE:${str}`,
  },
}));

describe('cliReport', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('reportSummary', () => {
    test('should print summary with suspicious files and security check enabled', () => {
      const config = createMockConfig({
        security: { enableSecurityCheck: true },
      });
      const suspiciousFiles: SuspiciousFileResult[] = [
        { filePath: 'suspicious.txt', messages: ['Contains sensitive data'], type: 'file' },
      ];

      const packResult: PackResult = {
        totalFiles: 10,
        totalCharacters: 1000,
        totalTokens: 200,
        fileCharCounts: { 'file1.txt': 100 },
        fileTokenCounts: { 'file1.txt': 50 },
        suspiciousFilesResults: suspiciousFiles,
        suspiciousGitDiffResults: [],
        suspiciousGitLogResults: [],
        processedFiles: [],
        safeFilePaths: [],
        gitDiffTokenCount: 0,
        gitLogTokenCount: 0,
        skippedFiles: [],
      };

      reportSummary(packResult, config);

      expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('1 suspicious file(s) detected and excluded'));
    });

    test('should print summary with security check disabled', () => {
      const config = createMockConfig({
        security: { enableSecurityCheck: false },
      });

      const packResult: PackResult = {
        totalFiles: 10,
        totalCharacters: 1000,
        totalTokens: 200,
        fileCharCounts: { 'file1.txt': 100 },
        fileTokenCounts: { 'file1.txt': 50 },
        suspiciousFilesResults: [],
        suspiciousGitDiffResults: [],
        suspiciousGitLogResults: [],
        processedFiles: [],
        safeFilePaths: [],
        gitDiffTokenCount: 0,
        gitLogTokenCount: 0,
        skippedFiles: [],
      };

      reportSummary(packResult, config);

      expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Security check disabled'));
    });
  });

  describe('reportSecurityCheck', () => {
    test('should skip printing when security check is disabled', () => {
      const config = createMockConfig({
        security: { enableSecurityCheck: false },
      });

      reportSecurityCheck('/root', [], [], [], config);
      expect(logger.log).not.toHaveBeenCalled();
    });

    test('should print message when no suspicious files found', () => {
      const config = createMockConfig({
        security: { enableSecurityCheck: true },
      });

      reportSecurityCheck('/root', [], [], [], config);

      expect(logger.log).toHaveBeenCalledWith('WHITE:🔎 Security Check:');
      expect(logger.log).toHaveBeenCalledWith('DIM:──────────────────');
      expect(logger.log).toHaveBeenCalledWith('GREEN:✔ WHITE:No suspicious files detected.');
    });

    test('should print details of suspicious files when found', () => {
      const config = createMockConfig({
        security: { enableSecurityCheck: true },
      });
      const configRelativePath = path.join('config', 'secrets.txt');
      const suspiciousFiles: SuspiciousFileResult[] = [
        {
          filePath: path.join('/root', configRelativePath),
          messages: ['Contains API key', 'Contains password'],
          type: 'file',
        },
      ];

      reportSecurityCheck('/root', suspiciousFiles, [], [], config);

      expect(logger.log).toHaveBeenCalledWith('YELLOW:1 suspicious file(s) detected and excluded from the output:');
      expect(logger.log).toHaveBeenCalledWith(`WHITE:1. WHITE:${configRelativePath}`);
      expect(logger.log).toHaveBeenCalledWith('DIM:   - 2 security issues detected');
      expect(logger.log).toHaveBeenCalledWith(
        expect.stringContaining('Please review these files for potential sensitive information.'),
      );
    });
  });

  describe('reportTopFiles', () => {
    test('should print top files sorted by character count', () => {
      const fileCharCounts = {
        'src/index.ts': 1000,
        'src/utils.ts': 500,
        'README.md': 2000,
      };
      const fileTokenCounts = {
        'src/index.ts': 200,
        'src/utils.ts': 100,
        'README.md': 400,
      };

      reportTopFiles(fileCharCounts, fileTokenCounts, 2, 60);

      expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Top 2 Files'));
      expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('README.md'));
      expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('src/index.ts'));
      expect(logger.log).not.toHaveBeenCalledWith(expect.stringContaining('src/utils.ts'));
    });

    test('should handle empty file list', () => {
      reportTopFiles({}, {}, 5, 0);

      expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Top 5 Files'));
    });
  });

  describe('reportCompletion', () => {
    test('should print completion message', () => {
      reportCompletion();

      expect(logger.log).toHaveBeenCalledWith('GREEN:🎉 All Done!');
      expect(logger.log).toHaveBeenCalledWith('WHITE:Your repository has been successfully packed.');
    });
  });
});
