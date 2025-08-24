#!/usr/bin/env node

/**
 * Memory test for runCli
 * - Fast and lightweight for CI (default)
 * - Comprehensive analysis when needed (--full flag)
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCli } from 'repomix';
import type { MemoryHistory, MemoryTestSummary, MemoryUsage, TestConfig } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  full: args.includes('--full') || args.includes('-f'),
  continuous: args.includes('--continuous'),
  saveResults: args.includes('--save') || args.includes('-s'),
  help: args.includes('--help') || args.includes('-h'),
};

// Extract numeric arguments
const numericArgs = args.filter((arg) => !arg.startsWith('-') && !Number.isNaN(Number(arg)));
const iterations = Number(numericArgs[0]) || (flags.full ? 200 : 50);
const delay = Number(numericArgs[1]) || (flags.full ? 100 : 50);

// Configuration
const MEMORY_LOG_INTERVAL = flags.full ? 10 : 5;
const FORCE_GC_INTERVAL = flags.full ? 20 : 10;
const WARNING_THRESHOLD = flags.full ? 50 : 100; // Memory growth percentage

// Test configuration
const TEST_CONFIG: TestConfig = {
  name: 'Memory Test',
  args: ['.'],
  cwd: projectRoot,
  options: {
    include: 'src/**/*.ts',
    output: path.join(__dirname, '../test-output.txt'),
    style: 'plain',
    quiet: true,
  },
};
const memoryHistory: MemoryHistory[] = [];

function showHelp(): void {
  console.log(`
🧪 Memory Test for Repomix

Usage: node memory-test.ts [iterations] [delay] [options]

Arguments:
  iterations     Number of test iterations (default: 50 for basic, 200 for --full)
  delay          Delay between iterations in ms (default: 50 for basic, 100 for --full)

Options:
  --full, -f       Enable comprehensive testing (more iterations, detailed analysis)
  --continuous     Run until stopped with Ctrl+C
  --save, -s       Save detailed results to JSON file
  --help, -h       Show this help message

Examples:
  node memory-test.ts                    # Quick CI test (50 iterations)
  node memory-test.ts --full             # Comprehensive test (200 iterations)
  node memory-test.ts 100 200            # 100 iterations, 200ms delay
  node memory-test.ts --continuous       # Run until Ctrl+C
`);
}

function getMemoryUsage(): MemoryUsage {
  const usage = process.memoryUsage();
  const heapUsed = Math.round((usage.heapUsed / 1024 / 1024) * 100) / 100;
  const heapTotal = Math.round((usage.heapTotal / 1024 / 1024) * 100) / 100;
  const external = Math.round((usage.external / 1024 / 1024) * 100) / 100;
  const rss = Math.round((usage.rss / 1024 / 1024) * 100) / 100;
  const heapUsagePercent = Math.round((usage.heapUsed / usage.heapTotal) * 100 * 100) / 100;

  return {
    heapUsed,
    heapTotal,
    external,
    rss,
    heapUsagePercent,
  };
}

function forceGC(): void {
  if (global.gc) {
    global.gc();
    if (flags.full) {
      console.log('🗑️  Forced garbage collection');
    }
  }
}

function logMemoryUsage(iteration: number, configName: string, error: Error | null = null): void {
  const usage = getMemoryUsage();
  const timestamp = new Date().toISOString();

  memoryHistory.push({
    iteration,
    configName,
    timestamp,
    ...usage,
    error: !!error,
  });

  const statusIcon = error ? '❌' : '✅';
  const errorText = error ? ` (ERROR: ${error.message})` : '';

  console.log(
    `${statusIcon} Iteration ${iteration}: ${configName} - ` +
      `Heap: ${usage.heapUsed}MB/${usage.heapTotal}MB (${usage.heapUsagePercent}%), ` +
      `RSS: ${usage.rss}MB${errorText}`,
  );
}

async function cleanupFiles(): Promise<void> {
  try {
    await fs.unlink(TEST_CONFIG.options.output);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
      console.warn(`Failed to cleanup ${TEST_CONFIG.options.output}:`, error.message);
    }
  }
}

function analyzeMemoryTrends(): void {
  if (memoryHistory.length < 10) return;

  const recent = memoryHistory.slice(-10);
  const initial = memoryHistory.slice(0, 10);

  const avgRecentHeap = recent.reduce((sum, entry) => sum + entry.heapUsed, 0) / recent.length;
  const avgInitialHeap = initial.reduce((sum, entry) => sum + entry.heapUsed, 0) / initial.length;
  const avgRecentRSS = recent.reduce((sum, entry) => sum + entry.rss, 0) / recent.length;
  const avgInitialRSS = initial.reduce((sum, entry) => sum + entry.rss, 0) / initial.length;

  const heapGrowth = ((avgRecentHeap - avgInitialHeap) / avgInitialHeap) * 100;
  const rssGrowth = ((avgRecentRSS - avgInitialRSS) / avgInitialRSS) * 100;

  console.log('\n📊 Memory Trend Analysis:');
  console.log(
    `   Heap Growth: ${heapGrowth.toFixed(2)}% (${avgInitialHeap.toFixed(2)}MB → ${avgRecentHeap.toFixed(2)}MB)`,
  );
  console.log(`   RSS Growth: ${rssGrowth.toFixed(2)}% (${avgInitialRSS.toFixed(2)}MB → ${avgRecentRSS.toFixed(2)}MB)`);

  if (heapGrowth > WARNING_THRESHOLD || rssGrowth > WARNING_THRESHOLD) {
    console.log('⚠️  WARNING: Significant memory growth detected - possible memory leak!');
  }
}

async function saveMemoryHistory(): Promise<void> {
  if (!flags.saveResults && !flags.full) return;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(__dirname, '..', `memory-test-results-${timestamp}.json`);

  const summary: MemoryTestSummary = {
    testInfo: {
      iterations: memoryHistory.length,
      startTime: memoryHistory[0]?.timestamp || '',
      endTime: memoryHistory[memoryHistory.length - 1]?.timestamp || '',
    },
    memoryHistory,
    analysis: {
      peakHeapUsage: Math.max(...memoryHistory.map((h) => h.heapUsed)),
      peakRSSUsage: Math.max(...memoryHistory.map((h) => h.rss)),
      errorCount: memoryHistory.filter((h) => h.error).length,
      averageHeapUsage: memoryHistory.reduce((sum, h) => sum + h.heapUsed, 0) / memoryHistory.length,
      averageRSSUsage: memoryHistory.reduce((sum, h) => sum + h.rss, 0) / memoryHistory.length,
    },
  };

  try {
    await fs.writeFile(filename, JSON.stringify(summary, null, 2));
    console.log(`\n💾 Memory test results saved to: ${filename}`);
  } catch (error) {
    console.error('Failed to save memory history:', error instanceof Error ? error.message : String(error));
  }
}

async function runMemoryTest(): Promise<void> {
  const totalIterations = flags.continuous ? Number.POSITIVE_INFINITY : iterations;

  // Log initial memory usage
  console.log('📊 Initial Memory Usage:');
  logMemoryUsage(0, 'Initial', null);

  console.log(`\n🚀 Starting ${flags.continuous ? 'continuous' : totalIterations} test iterations...`);
  console.log(`🎯 Delay: ${delay}ms\n`);

  const startTime = Date.now();

  for (let i = 1; i <= totalIterations; i++) {
    let error: Error | null = null;

    try {
      // Run the CLI with test configuration
      await runCli(TEST_CONFIG.args, TEST_CONFIG.cwd, TEST_CONFIG.options);

      // Clean up output files after each run
      await cleanupFiles();
    } catch (err) {
      error = err instanceof Error ? err : new Error(String(err));
    }

    // Log memory usage at specified intervals or on error
    if (i % MEMORY_LOG_INTERVAL === 0 || error) {
      logMemoryUsage(i, TEST_CONFIG.name, error);
    }

    // Force garbage collection at specified intervals
    if (i % FORCE_GC_INTERVAL === 0) {
      forceGC();
    }

    // Analyze trends periodically (only in full mode)
    if (flags.full && i % (MEMORY_LOG_INTERVAL * 2) === 0 && i > 20) {
      analyzeMemoryTrends();
    }

    // Add delay between iterations
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Safety exit for continuous mode during CI
    if (flags.continuous && !flags.full && Date.now() - startTime > 60000) {
      // 1 minute limit for CI
      console.log('\n⏱️  CI time limit reached, stopping continuous test');
      break;
    }
  }

  console.log('\n✅ Memory test completed!');

  // Final analysis
  const finalUsage = getMemoryUsage();
  const initialUsage = memoryHistory[0];

  if (initialUsage) {
    const heapGrowth =
      initialUsage.heapUsed > 0 ? ((finalUsage.heapUsed - initialUsage.heapUsed) / initialUsage.heapUsed) * 100 : 0;
    const rssGrowth = initialUsage.rss > 0 ? ((finalUsage.rss - initialUsage.rss) / initialUsage.rss) * 100 : 0;

    console.log('\n📊 Final Memory Analysis:');
    console.log(`Initial: Heap ${initialUsage.heapUsed}MB, RSS ${initialUsage.rss}MB`);
    console.log(`Final:   Heap ${finalUsage.heapUsed}MB, RSS ${finalUsage.rss}MB`);
    console.log(`Growth:  Heap ${heapGrowth.toFixed(2)}%, RSS ${rssGrowth.toFixed(2)}%`);

    // Exit with error code if memory growth exceeds threshold
    if (heapGrowth > WARNING_THRESHOLD || rssGrowth > WARNING_THRESHOLD) {
      console.log('⚠️  WARNING: Significant memory growth detected!');
      process.exitCode = 1;
    } else {
      console.log('✅ Memory usage appears stable');
    }
  }

  // Save results if requested
  await saveMemoryHistory();

  // Final cleanup
  await cleanupFiles();
}

// Handle process termination
process.on('SIGINT', async () => {
  console.log('\n\n⚠️  Test interrupted by user');
  await saveMemoryHistory();
  await cleanupFiles();
  process.exit(0);
});

process.on('uncaughtException', async (error) => {
  console.error('\n❌ Uncaught exception:', error);
  await saveMemoryHistory();
  await cleanupFiles();
  process.exit(1);
});

// Show help and exit
if (flags.help) {
  showHelp();
  process.exit(0);
}

// Validate arguments
if (Number.isNaN(iterations) || iterations <= 0) {
  console.error('❌ Invalid iterations count. Must be a positive number.');
  process.exit(1);
}

if (Number.isNaN(delay) || delay < 0) {
  console.error('❌ Invalid delay. Must be a non-negative number.');
  process.exit(1);
}

// Display configuration
console.log('🧪 Memory Test');
console.log(`📋 Mode: ${flags.full ? 'Comprehensive' : 'Basic'} (${iterations} iterations, ${delay}ms delay)`);
console.log(
  `⚡ Features: ${
    [flags.continuous && 'Continuous Mode', flags.saveResults && 'Save Results', flags.full && 'Full Analysis']
      .filter(Boolean)
      .join(', ') || 'Basic Test'
  }`,
);
console.log('🛑 Press Ctrl+C to stop\n');

// Run the test
runMemoryTest().catch(async (error) => {
  console.error('\n❌ Test failed:', error);
  await saveMemoryHistory();
  await cleanupFiles();
  process.exit(1);
});
