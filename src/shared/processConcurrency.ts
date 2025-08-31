import os from 'node:os';
import { type Options, Tinypool } from 'tinypool';
import { logger } from './logger.js';

export type WorkerRuntime = NonNullable<Options['runtime']>;

export interface WorkerOptions {
  numOfTasks: number;
  workerPath: string;
  runtime?: WorkerRuntime;
}

// Worker initialization is expensive, so we prefer fewer threads unless there are many files
const TASKS_PER_THREAD = 100;

export const getProcessConcurrency = (): number => {
  return typeof os.availableParallelism === 'function' ? os.availableParallelism() : os.cpus().length;
};

export const getWorkerThreadCount = (numOfTasks: number): { minThreads: number; maxThreads: number } => {
  const processConcurrency = getProcessConcurrency();

  const minThreads = 1;

  // Limit max threads based on number of tasks
  const maxThreads = Math.max(minThreads, Math.min(processConcurrency, Math.ceil(numOfTasks / TASKS_PER_THREAD)));

  return {
    minThreads,
    maxThreads,
  };
};

export const createWorkerPool = (options: WorkerOptions): Tinypool => {
  const { numOfTasks, workerPath, runtime = 'child_process' } = options;
  const { minThreads, maxThreads } = getWorkerThreadCount(numOfTasks);

  logger.trace(
    `Initializing worker pool with min=${minThreads}, max=${maxThreads} threads, runtime=${runtime}. Worker path: ${workerPath}`,
  );

  const startTime = process.hrtime.bigint();

  const pool = new Tinypool({
    filename: workerPath,
    runtime,
    minThreads,
    maxThreads,
    idleTimeout: 5000,
    workerData: {
      logLevel: logger.getLogLevel(),
    },
  });

  const endTime = process.hrtime.bigint();
  const initTime = Number(endTime - startTime) / 1e6; // Convert to milliseconds

  logger.debug(`Tinypool initialization took ${initTime.toFixed(2)}ms`);

  return pool;
};

export const cleanupWorkerPool = async (pool: Tinypool): Promise<void> => {
  try {
    logger.debug('Cleaning up worker pool...');

    // Check if running in Bun runtime
    const isBun = process.versions?.bun;

    if (isBun) {
      // If running in Bun, we cannot use Tinypool's destroy method
      logger.debug('Running in Bun environment, skipping Tinypool destroy method');
    } else {
      // Standard Node.js cleanup
      await pool.destroy();
    }

    logger.debug('Worker pool cleaned up successfully');
  } catch (error) {
    logger.debug('Error during worker pool cleanup:', error);
  }
};

export interface TaskRunner<T, R> {
  run: (task: T) => Promise<R>;
  cleanup: () => Promise<void>;
}

export const initTaskRunner = <T, R>(options: WorkerOptions): TaskRunner<T, R> => {
  const pool = createWorkerPool(options);
  return {
    run: (task: T) => pool.run(task),
    cleanup: () => cleanupWorkerPool(pool),
  };
};
