import path from 'node:path';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { reportSkippedFiles } from '../../src/cli/cliReport.js';
import type { SkippedFileInfo } from '../../src/core/file/fileCollect.js';
import { logger } from '../../src/shared/logger.js';

vi.mock('../../src/shared/logger');

describe('reportSkippedFiles', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('should not report anything when there are no binary-content files', () => {
    const skippedFiles: SkippedFileInfo[] = [
      { path: 'large.txt', reason: 'size-limit' },
      { path: 'binary.bin', reason: 'binary-extension' },
      { path: 'error.txt', reason: 'encoding-error' },
    ];

    reportSkippedFiles('/root', skippedFiles);

    expect(logger.log).not.toHaveBeenCalled();
  });

  test('should report single binary-content file', () => {
    const skippedFiles: SkippedFileInfo[] = [{ path: '/root/dir/malformed.txt', reason: 'binary-content' }];

    reportSkippedFiles('/root', skippedFiles);

    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('📄 Binary Files Detected:'));
    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('1 file detected as binary'));
    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining(path.join('dir', 'malformed.txt')));
  });

  test('should report multiple binary-content files', () => {
    const skippedFiles: SkippedFileInfo[] = [
      { path: '/root/file1.txt', reason: 'binary-content' },
      { path: '/root/dir/file2.md', reason: 'binary-content' },
      { path: '/root/normal.bin', reason: 'binary-extension' }, // Should be ignored
    ];

    reportSkippedFiles('/root', skippedFiles);

    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('📄 Binary Files Detected:'));
    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('2 files detected as binary'));
    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('file1.txt'));
    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining(path.join('dir', 'file2.md')));
  });

  test('should show relative paths correctly', () => {
    const skippedFiles: SkippedFileInfo[] = [{ path: '/root/src/components/app.tsx', reason: 'binary-content' }];

    reportSkippedFiles('/root', skippedFiles);

    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining(path.join('src', 'components', 'app.tsx')));
  });

  test('should show warning messages about excluded files', () => {
    const skippedFiles: SkippedFileInfo[] = [{ path: '/root/file.txt', reason: 'binary-content' }];

    reportSkippedFiles('/root', skippedFiles);

    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('These files have been excluded'));
    expect(logger.log).toHaveBeenCalledWith(expect.stringContaining('Please review these files if you expected'));
  });
});
