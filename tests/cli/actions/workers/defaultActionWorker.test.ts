import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import defaultActionWorker, {
  type DefaultActionTask,
  type DefaultActionWorkerResult,
  type PingTask,
  type PingResult,
} from '../../../../src/cli/actions/workers/defaultActionWorker.js';
import type { CliOptions } from '../../../../src/cli/types.js';
import type { RepomixConfigMerged } from '../../../../src/config/configSchema.js';
import { readFilePathsFromStdin } from '../../../../src/core/file/fileStdin.js';
import { pack } from '../../../../src/core/packager.js';
import { RepomixError } from '../../../../src/shared/errorHandle.js';

// Mock dependencies
vi.mock('../../../../src/core/file/fileStdin.js');
vi.mock('../../../../src/core/packager.js');
vi.mock('../../../../src/shared/logger.js', () => ({
  logger: {
    trace: vi.fn(),
  },
  setLogLevelByWorkerData: vi.fn(),
}));
vi.mock('../../../../src/cli/cliSpinner.js', () => ({
  Spinner: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    update: vi.fn(),
    succeed: vi.fn(),
    fail: vi.fn(),
  })),
}));

const mockReadFilePathsFromStdin = vi.mocked(readFilePathsFromStdin);
const mockPack = vi.mocked(pack);

describe('defaultActionWorker', () => {
  const mockConfig: RepomixConfigMerged = {
    input: {
      maxFileSize: 50 * 1024 * 1024,
    },
    output: {
      filePath: 'test-output.txt',
      style: 'xml',
      parsableStyle: false,
      headerText: '',
      instructionFilePath: '',
      fileSummary: true,
      directoryStructure: true,
      files: true,
      removeComments: false,
      removeEmptyLines: false,
      compress: false,
      topFilesLength: 10,
      showLineNumbers: false,
      truncateBase64: false,
      copyToClipboard: false,
      includeEmptyDirectories: false,
      tokenCountTree: false,
      git: {
        sortByChanges: true,
        sortByChangesMaxCommits: 100,
        includeDiffs: false,
        includeLogs: false,
        includeLogsCount: 50,
      },
    },
    include: ['**/*'],
    ignore: {
      useGitignore: true,
      useDefaultPatterns: true,
      customPatterns: [],
    },
    security: {
      enableSecurityCheck: true,
    },
    tokenCount: {
      encoding: 'o200k_base' as const,
    },
    cwd: '/test/project',
  };

  const mockCliOptions: CliOptions = {
    verbose: false,
    output: 'test-output.txt',
    include: undefined,
    ignore: undefined,
    'ignore-file': undefined,
    config: undefined,
    style: 'xml',
    'output-show-line-numbers': false,
    'remove-comments': false,
    'remove-empty-lines': false,
    'copy-to-clipboard': false,
    'include-empty-directories': false,
    'git-log-output': false,
    'git-log-author': undefined,
    'git-log-after': undefined,
    'git-log-before': undefined,
    'git-log-max-count': undefined,
    'git-diff': false,
    stdin: false,
    'top-files-length': 10,
    version: false,
    init: false,
    remote: undefined,
    'process-concurrency': 8,
    'token-count-tree': false,
    'no-progress': false,
  };

  const mockPackResult = {
    totalFiles: 1,
    totalCharacters: 12,
    totalTokens: 3,
    fileCharCounts: { 'test.txt': 12 },
    fileTokenCounts: { 'test.txt': 3 },
    gitDiffTokenCount: 0,
    gitLogTokenCount: 0,
    suspiciousFilesResults: [],
    suspiciousGitDiffResults: [],
    suspiciousGitLogResults: [],
    processedFiles: [{ path: 'test.txt', content: 'test content' }],
    safeFilePaths: ['test.txt'],
    skippedFiles: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ping functionality', () => {
    it('should handle ping requests correctly', async () => {
      const pingTask: PingTask = {
        ping: true,
      };

      const result = (await defaultActionWorker(pingTask)) as PingResult;

      expect(result).toEqual({
        ping: true,
      });
    });
  });

  describe('directory processing', () => {
    it('should process directories successfully', async () => {
      const task: DefaultActionTask = {
        directories: ['src', 'tests'],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: false,
      };

      mockPack.mockResolvedValueOnce(mockPackResult);

      const result = (await defaultActionWorker(task)) as DefaultActionWorkerResult;

      expect(mockPack).toHaveBeenCalledWith(
        [path.resolve('/test/project', 'src'), path.resolve('/test/project', 'tests')],
        mockConfig,
        expect.any(Function),
      );
      expect(result).toEqual({
        packResult: mockPackResult,
        config: mockConfig,
      });
    });

    it('should handle single directory', async () => {
      const task: DefaultActionTask = {
        directories: ['.'],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: false,
      };

      mockPack.mockResolvedValueOnce(mockPackResult);

      const result = (await defaultActionWorker(task)) as DefaultActionWorkerResult;

      expect(mockPack).toHaveBeenCalledWith([path.resolve('/test/project', '.')], mockConfig, expect.any(Function));
      expect(result).toEqual({
        packResult: mockPackResult,
        config: mockConfig,
      });
    });

    it('should handle empty directories array', async () => {
      const task: DefaultActionTask = {
        directories: [],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: false,
      };

      mockPack.mockResolvedValueOnce(mockPackResult);

      await defaultActionWorker(task);

      expect(mockPack).toHaveBeenCalledWith([], mockConfig, expect.any(Function));
    });
  });

  describe('stdin processing', () => {
    it('should process stdin successfully with current directory', async () => {
      const task: DefaultActionTask = {
        directories: ['.'],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: true,
      };

      const stdinResult = {
        filePaths: ['file1.txt', 'file2.txt'],
        emptyDirPaths: [],
      };
      mockReadFilePathsFromStdin.mockResolvedValueOnce(stdinResult);
      mockPack.mockResolvedValueOnce(mockPackResult);

      const result = (await defaultActionWorker(task)) as DefaultActionWorkerResult;

      expect(mockReadFilePathsFromStdin).toHaveBeenCalledWith('/test/project');
      expect(mockPack).toHaveBeenCalledWith(['/test/project'], mockConfig, expect.any(Function), {}, [
        'file1.txt',
        'file2.txt',
      ]);
      expect(result).toEqual({
        packResult: mockPackResult,
        config: mockConfig,
      });
    });

    it('should handle empty directories for stdin', async () => {
      const task: DefaultActionTask = {
        directories: [],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: true,
      };

      const stdinResult = {
        filePaths: ['file1.txt'],
        emptyDirPaths: [],
      };
      mockReadFilePathsFromStdin.mockResolvedValueOnce(stdinResult);
      mockPack.mockResolvedValueOnce(mockPackResult);

      await defaultActionWorker(task);

      expect(mockReadFilePathsFromStdin).toHaveBeenCalledWith('/test/project');
      expect(mockPack).toHaveBeenCalledWith(['/test/project'], mockConfig, expect.any(Function), {}, ['file1.txt']);
    });

    it('should throw error when multiple directories are specified with stdin', async () => {
      const task: DefaultActionTask = {
        directories: ['src', 'tests'],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: true,
      };

      await expect(defaultActionWorker(task)).rejects.toThrow(RepomixError);
      await expect(defaultActionWorker(task)).rejects.toThrow(
        'When using --stdin, do not specify directory arguments. File paths will be read from stdin.',
      );
    });

    it('should throw error when non-current directory is specified with stdin', async () => {
      const task: DefaultActionTask = {
        directories: ['src'],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: true,
      };

      await expect(defaultActionWorker(task)).rejects.toThrow(RepomixError);
      await expect(defaultActionWorker(task)).rejects.toThrow(
        'When using --stdin, do not specify directory arguments. File paths will be read from stdin.',
      );
    });
  });

  describe('error handling', () => {
    it('should handle pack errors for directory processing', async () => {
      const task: DefaultActionTask = {
        directories: ['src'],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: false,
      };

      const packError = new Error('Pack failed');
      mockPack.mockRejectedValueOnce(packError);

      await expect(defaultActionWorker(task)).rejects.toThrow('Pack failed');
    });

    it('should handle stdin read errors', async () => {
      const task: DefaultActionTask = {
        directories: ['.'],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: true,
      };

      const stdinError = new Error('Stdin read failed');
      mockReadFilePathsFromStdin.mockRejectedValueOnce(stdinError);

      await expect(defaultActionWorker(task)).rejects.toThrow('Stdin read failed');
    });

    it('should handle pack errors during stdin processing', async () => {
      const task: DefaultActionTask = {
        directories: ['.'],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: true,
      };

      const stdinResult = {
        filePaths: ['file1.txt'],
        emptyDirPaths: [],
      };
      mockReadFilePathsFromStdin.mockResolvedValueOnce(stdinResult);

      const packError = new Error('Pack failed during stdin');
      mockPack.mockRejectedValueOnce(packError);

      await expect(defaultActionWorker(task)).rejects.toThrow('Pack failed during stdin');
    });
  });

  describe('spinner integration', () => {
    it('should update spinner with progress messages', async () => {
      const task: DefaultActionTask = {
        directories: ['src'],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: false,
      };

      mockPack.mockImplementationOnce(async (_paths, _config, progressCallback) => {
        if (progressCallback) {
          progressCallback('Processing files...');
          progressCallback('Calculating metrics...');
        }
        return mockPackResult;
      });

      await defaultActionWorker(task);

      // The spinner mock should be imported and we can verify the calls
      const { Spinner } = await import('../../../../src/cli/cliSpinner.js');
      const mockSpinner = vi.mocked(Spinner).mock.results[0]?.value;

      expect(mockSpinner.start).toHaveBeenCalled();
      expect(mockSpinner.update).toHaveBeenCalledWith('Processing files...');
      expect(mockSpinner.update).toHaveBeenCalledWith('Calculating metrics...');
      expect(mockSpinner.succeed).toHaveBeenCalledWith('Packing completed successfully!');
    });

    it('should fail spinner on error', async () => {
      const task: DefaultActionTask = {
        directories: ['src'],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: false,
      };

      mockPack.mockRejectedValueOnce(new Error('Pack failed'));

      await expect(defaultActionWorker(task)).rejects.toThrow('Pack failed');

      const { Spinner } = await import('../../../../src/cli/cliSpinner.js');
      const mockSpinner = vi.mocked(Spinner).mock.results[0]?.value;

      expect(mockSpinner.fail).toHaveBeenCalledWith('Error during packing');
    });
  });

  describe('path resolution', () => {
    it('should resolve relative paths correctly', async () => {
      const task: DefaultActionTask = {
        directories: ['../parent', './current', 'child'],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: false,
      };

      mockPack.mockResolvedValueOnce(mockPackResult);

      await defaultActionWorker(task);

      expect(mockPack).toHaveBeenCalledWith(
        [
          path.resolve('/test/project', '../parent'),
          path.resolve('/test/project', './current'),
          path.resolve('/test/project', 'child'),
        ],
        mockConfig,
        expect.any(Function),
      );
    });

    it('should handle absolute paths', async () => {
      const task: DefaultActionTask = {
        directories: ['/absolute/path1', '/absolute/path2'],
        cwd: '/test/project',
        config: mockConfig,
        cliOptions: mockCliOptions,
        isStdin: false,
      };

      mockPack.mockResolvedValueOnce(mockPackResult);

      await defaultActionWorker(task);

      expect(mockPack).toHaveBeenCalledWith(
        [path.resolve('/test/project', '/absolute/path1'), path.resolve('/test/project', '/absolute/path2')],
        mockConfig,
        expect.any(Function),
      );
    });
  });
});
