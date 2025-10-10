import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import pc from 'picocolors';
import { execGitShallowClone } from '../../core/git/gitCommand.js';
import { downloadGitHubArchive, isArchiveDownloadSupported } from '../../core/git/gitHubArchive.js';
import { getRemoteRefs } from '../../core/git/gitRemoteHandle.js';
import { isGitHubRepository, parseGitHubRepoInfo, parseRemoteValue } from '../../core/git/gitRemoteParse.js';
import { isGitInstalled } from '../../core/git/gitRepositoryHandle.js';
import { RepomixError } from '../../shared/errorHandle.js';
import { logger } from '../../shared/logger.js';
import { Spinner } from '../cliSpinner.js';
import type { CliOptions } from '../types.js';
import { type DefaultActionRunnerResult, runDefaultAction } from './defaultAction.js';

export const runRemoteAction = async (
  repoUrl: string,
  cliOptions: CliOptions,
  deps = {
    isGitInstalled,
    execGitShallowClone,
    getRemoteRefs,
    runDefaultAction,
    downloadGitHubArchive,
    isGitHubRepository,
    parseGitHubRepoInfo,
    isArchiveDownloadSupported,
  },
): Promise<DefaultActionRunnerResult> => {
  let tempDirPath = await createTempDirectory();
  let result: DefaultActionRunnerResult;
  let downloadMethod: 'archive' | 'git' = 'git';

  try {
    // Check if this is a GitHub repository and archive download is supported
    const githubRepoInfo = deps.parseGitHubRepoInfo(repoUrl);
    const shouldTryArchive = githubRepoInfo && deps.isArchiveDownloadSupported(githubRepoInfo);

    if (shouldTryArchive) {
      // Try GitHub archive download first
      const spinner = new Spinner('Downloading repository archive...', cliOptions);

      try {
        spinner.start();

        // Override ref with CLI option if provided
        const repoInfoWithBranch = {
          ...githubRepoInfo,
          ref: cliOptions.remoteBranch ?? githubRepoInfo.ref,
        };

        await deps.downloadGitHubArchive(
          repoInfoWithBranch,
          tempDirPath,
          {
            timeout: 60000, // 1 minute timeout for large repos
            retries: 2,
          },
          (progress) => {
            if (progress.percentage !== null) {
              spinner.update(`Downloading repository archive... (${progress.percentage}%)`);
            } else {
              // Show downloaded bytes when percentage is not available
              const downloadedMB = (progress.downloaded / 1024 / 1024).toFixed(1);
              spinner.update(`Downloading repository archive... (${downloadedMB} MB)`);
            }
          },
        );

        downloadMethod = 'archive';
        spinner.succeed('Repository archive downloaded successfully!');
        logger.log('');
      } catch (archiveError) {
        spinner.fail('Archive download failed, trying git clone...');
        logger.trace('Archive download error:', (archiveError as Error).message);

        // Clear the temp directory for git clone attempt
        await cleanupTempDirectory(tempDirPath);
        tempDirPath = await createTempDirectory();

        // Fall back to git clone
        await performGitClone(repoUrl, tempDirPath, cliOptions, deps);
        downloadMethod = 'git';
      }
    } else {
      // Use git clone directly
      await performGitClone(repoUrl, tempDirPath, cliOptions, deps);
      downloadMethod = 'git';
    }

    // Run the default action on the downloaded/cloned repository
    result = await deps.runDefaultAction([tempDirPath], tempDirPath, cliOptions);

    // Copy output file only when not in stdout mode
    // In stdout mode, output is written directly to stdout without creating a file,
    // so attempting to copy a non-existent file would cause an error and exit code 1
    if (!cliOptions.stdout) {
      await copyOutputToCurrentDirectory(tempDirPath, process.cwd(), result.config.output.filePath);
    }

    logger.trace(`Repository obtained via ${downloadMethod} method`);
  } finally {
    // Cleanup the temporary directory
    await cleanupTempDirectory(tempDirPath);
  }

  return result;
};

/**
 * Performs git clone operation with spinner and error handling
 */
const performGitClone = async (
  repoUrl: string,
  tempDirPath: string,
  cliOptions: CliOptions,
  deps: {
    isGitInstalled: typeof isGitInstalled;
    getRemoteRefs: typeof getRemoteRefs;
    execGitShallowClone: typeof execGitShallowClone;
  },
): Promise<void> => {
  // Check if git is installed only when we actually need to use git
  if (!(await deps.isGitInstalled())) {
    throw new RepomixError('Git is not installed or not in the system PATH.');
  }
  // Get remote refs
  let refs: string[] = [];
  try {
    refs = await deps.getRemoteRefs(parseRemoteValue(repoUrl).repoUrl);
    logger.trace(`Retrieved ${refs.length} refs from remote repository`);
  } catch (error) {
    logger.trace('Failed to get remote refs, proceeding without them:', (error as Error).message);
  }

  // Parse the remote URL with the refs information
  const parsedFields = parseRemoteValue(repoUrl, refs);

  const spinner = new Spinner('Cloning repository...', cliOptions);

  try {
    spinner.start();

    // Clone the repository
    await cloneRepository(parsedFields.repoUrl, tempDirPath, cliOptions.remoteBranch || parsedFields.remoteBranch, {
      execGitShallowClone: deps.execGitShallowClone,
    });

    spinner.succeed('Repository cloned successfully!');
    logger.log('');
  } catch (error) {
    spinner.fail('Error during repository cloning. cleanup...');
    throw error;
  }
};

export const createTempDirectory = async (): Promise<string> => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'repomix-'));
  logger.trace(`Created temporary directory. (path: ${pc.dim(tempDir)})`);
  return tempDir;
};

export const cloneRepository = async (
  url: string,
  directory: string,
  remoteBranch?: string,
  deps = {
    execGitShallowClone,
  },
): Promise<void> => {
  logger.log(`Clone repository: ${url} to temporary directory. ${pc.dim(`path: ${directory}`)}`);
  logger.log('');

  try {
    await deps.execGitShallowClone(url, directory, remoteBranch);
  } catch (error) {
    throw new RepomixError(`Failed to clone repository: ${(error as Error).message}`);
  }
};

export const cleanupTempDirectory = async (directory: string): Promise<void> => {
  logger.trace(`Cleaning up temporary directory: ${directory}`);
  await fs.rm(directory, { recursive: true, force: true });
};

export const copyOutputToCurrentDirectory = async (
  sourceDir: string,
  targetDir: string,
  outputFileName: string,
): Promise<void> => {
  const sourcePath = path.resolve(sourceDir, outputFileName);
  const targetPath = path.resolve(targetDir, outputFileName);

  // Skip copy if source and target are the same
  // This can happen when an absolute path is specified for the output file
  if (sourcePath === targetPath) {
    logger.trace(`Source and target are the same (${sourcePath}), skipping copy`);
    return;
  }

  try {
    logger.trace(`Copying output file from: ${sourcePath} to: ${targetPath}`);

    // Create target directory if it doesn't exist
    await fs.mkdir(path.dirname(targetPath), { recursive: true });

    await fs.copyFile(sourcePath, targetPath);
  } catch (error) {
    throw new RepomixError(`Failed to copy output file: ${(error as Error).message}`);
  }
};
