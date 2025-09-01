import type { TiktokenEncoding } from 'tiktoken';
import { logger, setLogLevelByWorkerData } from '../../../shared/logger.js';
import { freeTokenCounters, getTokenCounter } from '../tokenCounterFactory.js';

// Initialize logger configuration from workerData at module load time
// This must be called before any logging operations in the worker
setLogLevelByWorkerData();

export interface GitLogMetricsTask {
  content: string;
  encoding: TiktokenEncoding;
}

export default async ({ content, encoding }: GitLogMetricsTask): Promise<number> => {
  const processStartAt = process.hrtime.bigint();

  try {
    if (!content) {
      return 0;
    }

    const tokenCounter = getTokenCounter(encoding);
    const tokenCount = tokenCounter.countTokens(content);

    const processEndAt = process.hrtime.bigint();
    const processDuration = Number(processEndAt - processStartAt) / 1e6;
    logger.trace(`Git log token count calculated in ${processDuration.toFixed(2)}ms`);

    return tokenCount;
  } catch (error) {
    logger.error('Error calculating git log token count:', error);
    return 0;
  }
};

// Export cleanup function for Tinypool teardown
export const onWorkerTermination = () => {
  freeTokenCounters();
};
