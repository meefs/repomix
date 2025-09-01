import { type Options, globby } from 'globby';

export interface GlobbyTask {
  patterns: string[];
  options: Options;
}

export default async ({ patterns, options }: GlobbyTask): Promise<string[]> => {
  return globby(patterns, options);
};

// Export cleanup function for Tinypool teardown (no cleanup needed for this worker)
export const onWorkerTermination = () => {
  // No cleanup needed for globby worker
};
