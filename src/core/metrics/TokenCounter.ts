import { get_encoding, type Tiktoken, type TiktokenEncoding } from 'tiktoken';
import { logger } from '../../shared/logger.js';

export class TokenCounter {
  private encoding: Tiktoken;

  constructor(encodingName: TiktokenEncoding) {
    const startTime = process.hrtime.bigint();

    // Setup encoding with the specified model
    this.encoding = get_encoding(encodingName);

    const endTime = process.hrtime.bigint();
    const initTime = Number(endTime - startTime) / 1e6; // Convert to milliseconds

    logger.debug(`TokenCounter initialization took ${initTime.toFixed(2)}ms`);
  }

  public countTokens(content: string, filePath?: string): number {
    try {
      return this.encoding.encode(content).length;
    } catch (error) {
      let message = '';
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }

      if (filePath) {
        logger.warn(`Failed to count tokens. path: ${filePath}, error: ${message}`);
      } else {
        logger.warn(`Failed to count tokens. error: ${message}`);
      }

      return 0;
    }
  }

  public free(): void {
    this.encoding.free();
  }
}
