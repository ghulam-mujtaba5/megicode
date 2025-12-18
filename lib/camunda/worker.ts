/**
 * Camunda External Task Worker Manager
 * Manages workers that poll and complete external tasks
 */

import type { Camunda8, ZeebeJob } from '@camunda8/sdk';
import { getZeebeClient } from './client';
import type { WorkerConfig, Task } from './types';

const activeWorkers: any[] = [];

/**
 * Create and start an external task worker
 */
export function createWorker(config: WorkerConfig): any {
  const client = getZeebeClient();
  const zeebe = client.getZeebeGrpcApiClient();

  const worker = zeebe.createWorker({
    taskType: config.taskType,
    taskHandler: async (job) => {
      console.log(`[Worker] Processing task: ${config.taskType}`, {
        jobKey: job.key,
        processInstanceKey: job.processInstanceKey,
        elementId: job.elementId,
      });

      try {
        await config.handler(job as Task);

        // Complete the job
        return job.complete();
      } catch (error: any) {
        console.error(
          `[Worker] Error processing ${config.taskType}:`,
          error.message
        );

        // Fail the job with retries
        return job.fail({
          errorMessage: error.message,
          retries: config.requestTimeout ? 3 : 0,
          retryBackoff: 5000, // 5 seconds
        });
      }
    },
    maxJobsToActivate: config.maxJobsToActivate || 10,
    timeout: config.timeout || 30000, // 30 seconds
    pollInterval: config.pollInterval || 1000, // 1 second
    requestTimeout: config.requestTimeout || 60000, // 60 seconds
  });

  activeWorkers.push(worker);

  console.log(`[Worker] Started worker for task type: ${config.taskType}`);

  return worker;
}

/**
 * Stop all active workers
 */
export async function stopAllWorkers(): Promise<void> {
  console.log(`[Worker] Stopping ${activeWorkers.length} active workers...`);

  await Promise.all(
    activeWorkers.map(async (worker) => {
      try {
        await worker.close();
      } catch (error: any) {
        console.error('[Worker] Error closing worker:', error.message);
      }
    })
  );

  activeWorkers.length = 0;
  console.log('[Worker] All workers stopped');
}

/**
 * Create a simple task completion helper
 */
export function completeTask(
  job: any,
  variables?: Record<string, any>
): Promise<void> {
  return job.complete(variables);
}

/**
 * Create a simple task failure helper
 */
export function failTask(
  job: any,
  errorMessage: string,
  retries: number = 3
): Promise<void> {
  return job.fail({
    errorMessage,
    retries,
    retryBackoff: 5000,
  });
}
