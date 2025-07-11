import os from 'node:os';
import { Tinypool } from 'tinypool';
import { logger } from './logger.js';

export const getProcessConcurrency = (): number => {
  return typeof os.availableParallelism === 'function' ? os.availableParallelism() : os.cpus().length;
};

export const getWorkerThreadCount = (numOfTasks: number): { minThreads: number; maxThreads: number } => {
  const processConcurrency = getProcessConcurrency();

  const minThreads = 1;

  // Limit max threads based on number of tasks
  const maxThreads = Math.max(minThreads, Math.min(processConcurrency, Math.ceil(numOfTasks / 100)));

  return {
    minThreads,
    maxThreads,
  };
};

export const initWorker = (numOfTasks: number, workerPath: string): Tinypool => {
  const { minThreads, maxThreads } = getWorkerThreadCount(numOfTasks);

  logger.trace(
    `Initializing worker pool with min=${minThreads}, max=${maxThreads} threads. Worker path: ${workerPath}`,
  );

  return new Tinypool({
    filename: workerPath,
    minThreads,
    maxThreads,
    idleTimeout: 5000,
    env: {
      ...process.env,
      REPOMIX_LOGLEVEL: logger.getLogLevel().toString(),
    },
  });
};
