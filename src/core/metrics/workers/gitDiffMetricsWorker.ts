import type { TiktokenEncoding } from 'tiktoken';
import { logger, setLogLevelByWorkerData } from '../../../shared/logger.js';
import { freeTokenCounters, getTokenCounter } from '../tokenCounterFactory.js';

// Initialize logger configuration from workerData at module load time
// This must be called before any logging operations in the worker
setLogLevelByWorkerData();

export interface GitDiffMetricsTask {
  workTreeDiffContent?: string;
  stagedDiffContent?: string;
  encoding: TiktokenEncoding;
}

export default async ({ workTreeDiffContent, stagedDiffContent, encoding }: GitDiffMetricsTask): Promise<number> => {
  const processStartAt = process.hrtime.bigint();

  const tokenCounter = getTokenCounter(encoding);

  const countPromises = [];
  if (workTreeDiffContent) {
    countPromises.push(Promise.resolve().then(() => tokenCounter.countTokens(workTreeDiffContent)));
  }
  if (stagedDiffContent) {
    countPromises.push(Promise.resolve().then(() => tokenCounter.countTokens(stagedDiffContent)));
  }

  const results = await Promise.all(countPromises);
  const totalTokens = results.reduce((sum, count) => sum + count, 0);

  const processEndAt = process.hrtime.bigint();
  logger.trace(
    `Calculated git diff metrics. Tokens: ${totalTokens}. Took: ${(Number(processEndAt - processStartAt) / 1e6).toFixed(2)}ms`,
  );

  return totalTokens;
};

// Export cleanup function for Tinypool teardown
export const onWorkerTermination = () => {
  freeTokenCounters();
};
