/**
 * Camunda Workers Startup Script
 * Run this to start all external task workers
 * Usage: ts-node scripts/start-camunda-workers.ts
 */

import { startAllWorkers, stopAllWorkers } from '@/lib/camunda/workers';
import { closeClient } from '@/lib/camunda';

async function main() {
  console.log('='.repeat(60));
  console.log('Camunda External Task Workers');
  console.log('='.repeat(60));

  // Start all workers
  const workers = startAllWorkers();

  console.log(`\nRunning ${workers.length} workers...`);
  console.log('Press Ctrl+C to stop\n');

  // Graceful shutdown
  const shutdown = async () => {
    console.log('\n\nShutting down workers...');
    await stopAllWorkers();
    await closeClient();
    console.log('Workers stopped. Exiting.');
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Keep process alive
  await new Promise(() => {});
}

main().catch((error) => {
  console.error('Fatal error starting workers:', error);
  process.exit(1);
});
