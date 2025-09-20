import path from 'node:path';
import type { RepomixConfigMerged } from '../../../config/configSchema.js';
import { readFilePathsFromStdin } from '../../../core/file/fileStdin.js';
import { type PackResult, pack } from '../../../core/packager.js';
import { RepomixError } from '../../../shared/errorHandle.js';
import { logger, setLogLevelByWorkerData } from '../../../shared/logger.js';
import { Spinner } from '../../cliSpinner.js';
import type { CliOptions } from '../../types.js';

// Initialize logger configuration from workerData at module load time
// This must be called before any logging operations in the worker
setLogLevelByWorkerData();

export interface DefaultActionTask {
  directories: string[];
  cwd: string;
  config: RepomixConfigMerged;
  cliOptions: CliOptions;
  isStdin: boolean;
}

export interface PingTask {
  ping: true;
}

export interface DefaultActionWorkerResult {
  packResult: PackResult;
  config: RepomixConfigMerged;
}

export interface PingResult {
  ping: true;
}

// Function overloads for better type inference
function defaultActionWorker(task: DefaultActionTask): Promise<DefaultActionWorkerResult>;
function defaultActionWorker(task: PingTask): Promise<PingResult>;
async function defaultActionWorker(
  task: DefaultActionTask | PingTask,
): Promise<DefaultActionWorkerResult | PingResult> {
  // Handle ping requests for Bun compatibility check
  if ('ping' in task) {
    return {
      ping: true,
    };
  }

  // At this point, task is guaranteed to be DefaultActionTask
  const { directories, cwd, config, cliOptions, isStdin } = task;

  logger.trace('Worker: Using pre-loaded config:', config);

  // Initialize spinner in worker
  const spinner = new Spinner('Initializing...', cliOptions);
  spinner.start();

  let packResult: PackResult;

  try {
    if (isStdin) {
      // Handle stdin processing
      // Validate directory arguments for stdin mode
      const firstDir = directories[0] ?? '.';
      if (directories.length > 1 || firstDir !== '.') {
        throw new RepomixError(
          'When using --stdin, do not specify directory arguments. File paths will be read from stdin.',
        );
      }

      const stdinResult = await readFilePathsFromStdin(cwd);

      // Use pack with predefined files from stdin
      packResult = await pack(
        [cwd],
        config,
        (message) => {
          spinner.update(message);
        },
        {},
        stdinResult.filePaths,
      );
    } else {
      // Handle directory processing
      const targetPaths = directories.map((directory) => path.resolve(cwd, directory));

      packResult = await pack(targetPaths, config, (message) => {
        spinner.update(message);
      });
    }

    spinner.succeed('Packing completed successfully!');

    return {
      packResult,
      config,
    };
  } catch (error) {
    spinner.fail('Error during packing');
    throw error;
  }
}

export default defaultActionWorker;

// Export cleanup function for Tinypool teardown
export const onWorkerTermination = async () => {
  // Any cleanup needed when worker terminates
  // Currently no specific cleanup required for defaultAction worker
};
