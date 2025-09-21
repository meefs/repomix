import type { RepomixConfigMerged } from '../../config/configSchema.js';
import { initTaskRunner, type TaskRunner } from '../../shared/processConcurrency.js';
import type { RepomixProgressCallback } from '../../shared/types.js';
import type { ProcessedFile } from '../file/fileTypes.js';
import type { GitDiffResult } from '../git/gitDiffHandle.js';
import type { GitLogResult } from '../git/gitLogHandle.js';
import { calculateGitDiffMetrics } from './calculateGitDiffMetrics.js';
import { calculateGitLogMetrics } from './calculateGitLogMetrics.js';
import { calculateOutputMetrics } from './calculateOutputMetrics.js';
import { calculateSelectiveFileMetrics } from './calculateSelectiveFileMetrics.js';
import type { TokenCountTask } from './workers/calculateMetricsWorker.js';

export interface CalculateMetricsResult {
  totalFiles: number;
  totalCharacters: number;
  totalTokens: number;
  fileCharCounts: Record<string, number>;
  fileTokenCounts: Record<string, number>;
  gitDiffTokenCount: number;
  gitLogTokenCount: number;
}

export const calculateMetrics = async (
  processedFiles: ProcessedFile[],
  output: string,
  progressCallback: RepomixProgressCallback,
  config: RepomixConfigMerged,
  gitDiffResult: GitDiffResult | undefined,
  gitLogResult: GitLogResult | undefined,
  deps = {
    calculateSelectiveFileMetrics,
    calculateOutputMetrics,
    calculateGitDiffMetrics,
    calculateGitLogMetrics,
    taskRunner: undefined as TaskRunner<TokenCountTask, number> | undefined,
  },
): Promise<CalculateMetricsResult> => {
  progressCallback('Calculating metrics...');

  // Initialize a single task runner for all metrics calculations
  const taskRunner =
    deps.taskRunner ??
    initTaskRunner<TokenCountTask, number>({
      numOfTasks: processedFiles.length,
      workerPath: new URL('./workers/calculateMetricsWorker.js', import.meta.url).href,
      runtime: 'worker_threads',
    });

  try {
    // For top files display optimization: calculate token counts only for top files by character count
    // However, if tokenCountTree is enabled, calculate for all files to avoid double calculation
    const topFilesLength = config.output.topFilesLength;
    const shouldCalculateAllFiles = !!config.output.tokenCountTree;

    // Determine which files to calculate token counts for:
    // - If tokenCountTree is enabled: calculate for all files to avoid double calculation
    // - Otherwise: calculate only for top files by character count for optimization
    const metricsTargetPaths = shouldCalculateAllFiles
      ? processedFiles.map((file) => file.path)
      : [...processedFiles]
          .sort((a, b) => b.content.length - a.content.length)
          .slice(0, Math.min(processedFiles.length, Math.max(topFilesLength * 10, topFilesLength)))
          .map((file) => file.path);

    const [selectiveFileMetrics, totalTokens, gitDiffTokenCount, gitLogTokenCount] = await Promise.all([
      deps.calculateSelectiveFileMetrics(
        processedFiles,
        metricsTargetPaths,
        config.tokenCount.encoding,
        progressCallback,
        { taskRunner },
      ),
      deps.calculateOutputMetrics(output, config.tokenCount.encoding, config.output.filePath, { taskRunner }),
      deps.calculateGitDiffMetrics(config, gitDiffResult, { taskRunner }),
      deps.calculateGitLogMetrics(config, gitLogResult, { taskRunner }),
    ]);

    const totalFiles = processedFiles.length;
    const totalCharacters = output.length;

    // Build character counts for all files
    const fileCharCounts: Record<string, number> = {};
    for (const file of processedFiles) {
      fileCharCounts[file.path] = file.content.length;
    }

    // Build token counts only for top files
    const fileTokenCounts: Record<string, number> = {};
    for (const file of selectiveFileMetrics) {
      fileTokenCounts[file.path] = file.tokenCount;
    }

    return {
      totalFiles,
      totalCharacters,
      totalTokens,
      fileCharCounts,
      fileTokenCounts,
      gitDiffTokenCount: gitDiffTokenCount,
      gitLogTokenCount: gitLogTokenCount.gitLogTokenCount,
    };
  } finally {
    // Cleanup the task runner after all calculations are complete (only if we created it)
    if (!deps.taskRunner) {
      await taskRunner.cleanup();
    }
  }
};
