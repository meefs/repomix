import type { Context } from 'hono';
import { isValidRemoteValue } from 'repomix';
import { z } from 'zod';
import { processZipFile } from '../domains/pack/processZipFile.js';
import { processRemoteRepo } from '../domains/pack/remoteRepo.js';
import { FILE_SIZE_LIMITS } from '../domains/pack/utils/fileUtils.js';
import { sanitizePattern } from '../domains/pack/utils/validation.js';
import type { PackResult } from '../types.js';
import { getClientInfo } from '../utils/clientInfo.js';
import { createErrorResponse } from '../utils/http.js';
import { logError, logInfo } from '../utils/logger.js';
import { calculateMemoryDiff, getMemoryUsage } from '../utils/memory.js';
import { formatLatencyForDisplay } from '../utils/time.js';
import { validateRequest } from '../utils/validation.js';

const packRequestSchema = z
  .object({
    url: z
      .string()
      .min(1, 'Repository URL is required')
      .max(200, 'Repository URL is too long')
      .transform((val) => val.trim())
      .refine((val) => isValidRemoteValue(val), { message: 'Invalid repository URL' })
      .optional(),
    file: z
      .custom<File>()
      .refine((file) => file instanceof File, {
        message: 'Invalid file format',
      })
      .refine((file) => file.type === 'application/zip' || file.name.endsWith('.zip'), {
        message: 'Only ZIP files are allowed',
      })
      .refine((file) => file.size <= FILE_SIZE_LIMITS.MAX_ZIP_SIZE, {
        // 10MB limit
        message: 'File size must be less than 10MB',
      })
      .optional(),
    format: z.enum(['xml', 'markdown', 'plain']),
    options: z
      .object({
        removeComments: z.boolean().optional(),
        removeEmptyLines: z.boolean().optional(),
        showLineNumbers: z.boolean().optional(),
        fileSummary: z.boolean().optional(),
        directoryStructure: z.boolean().optional(),
        includePatterns: z
          .string()
          .max(100_000, 'Include patterns too long')
          .optional()
          .transform((val) => val?.trim()),
        ignorePatterns: z
          .string()
          // Regular expression to validate ignore patterns
          // Allowed characters: alphanumeric, *, ?, /, -, _, ., !, (, ), space, comma
          .regex(/^[a-zA-Z0-9*?/\-_.,!()\s]*$/, 'Invalid characters in ignore patterns')
          .max(1000, 'Ignore patterns too long')
          .optional()
          .transform((val) => val?.trim()),
        outputParsable: z.boolean().optional(),
        compress: z.boolean().optional(),
      })
      .strict(),
  })
  .strict()
  .refine((data) => data.url || data.file, {
    message: 'Either URL or file must be provided',
  })
  .refine((data) => !(data.url && data.file), {
    message: 'Cannot provide both URL and file',
  });

export const packAction = async (c: Context) => {
  try {
    const formData = await c.req.formData();
    const requestId = c.get('requestId');

    // Get client information for logging
    const clientInfo = getClientInfo(c);

    // Get form data
    const format = formData.get('format') as 'xml' | 'markdown' | 'plain';
    const optionsRaw = formData.get('options') as string | null;
    let options: unknown = {};
    try {
      options = optionsRaw ? JSON.parse(optionsRaw) : {};
    } catch {
      return c.json(createErrorResponse('Invalid JSON in options', requestId), 400);
    }
    const file = formData.get('file') as File | null;
    const url = formData.get('url') as string | null;

    // Validate and sanitize request data
    const validatedData = validateRequest(packRequestSchema, {
      url: url || undefined,
      file: file || undefined,
      format,
      options,
    });

    const sanitizedIncludePatterns = sanitizePattern(validatedData.options.includePatterns);
    const sanitizedIgnorePatterns = sanitizePattern(validatedData.options.ignorePatterns);

    // Create sanitized options
    const sanitizedOptions = {
      ...validatedData.options,
      includePatterns: sanitizedIncludePatterns,
      ignorePatterns: sanitizedIgnorePatterns,
    };

    const startTime = Date.now();
    const beforeMemory = getMemoryUsage();

    // Process file or repository
    let result: PackResult;
    if (validatedData.file) {
      result = await processZipFile(validatedData.file, validatedData.format, sanitizedOptions);
    } else {
      // Zod schema guarantees that url is present when file is not
      result = await processRemoteRepo(validatedData.url as string, validatedData.format, sanitizedOptions);
    }

    // Log operation result with memory usage
    const afterMemory = getMemoryUsage();
    const memoryDiff = calculateMemoryDiff(beforeMemory, afterMemory);

    logInfo('Pack operation completed', {
      requestId,
      format: validatedData.format,
      repository: result.metadata.repository,
      duration: formatLatencyForDisplay(startTime),
      inputType: validatedData.file ? 'file' : validatedData.url ? 'url' : 'unknown',
      clientInfo: {
        ip: clientInfo.ip,
        userAgent: clientInfo.userAgent,
      },
      memory: {
        before: beforeMemory,
        after: afterMemory,
        diff: memoryDiff,
      },
      metrics: {
        totalFiles: result.metadata.summary?.totalFiles,
        totalCharacters: result.metadata.summary?.totalCharacters,
        totalTokens: result.metadata.summary?.totalTokens,
      },
    });

    return c.json(result);
  } catch (error) {
    // Handle errors
    logError('Pack operation failed', error instanceof Error ? error : new Error('Unknown error'), {
      requestId: c.get('requestId'),
    });

    const { handlePackError } = await import('../utils/errorHandler.js');
    const appError = handlePackError(error);
    return c.json(createErrorResponse(appError.message, c.get('requestId')), appError.statusCode);
  }
};
