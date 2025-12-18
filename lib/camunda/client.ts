/**
 * Camunda Platform 8 (Zeebe) Client
 * Handles connection and operations with Camunda Cloud
 */

import { Camunda8 } from '@camunda8/sdk';
import type {
  CamundaConfig,
  StartProcessInstanceRequest,
  ProcessInstance,
  DeployResourceRequest,
} from './types';

let camunda8: Camunda8 | null = null;

/**
 * Get or create Camunda 8 client instance (singleton)
 */
export function getZeebeClient(): Camunda8 {
  if (!camunda8) {
    const config: CamundaConfig = {
      zeebeGatewayAddress: process.env.ZEEBE_ADDRESS || 'localhost:26500',
      clientId: process.env.ZEEBE_CLIENT_ID,
      clientSecret: process.env.ZEEBE_CLIENT_SECRET,
      clusterId: process.env.ZEEBE_CLUSTER_ID,
      region: process.env.ZEEBE_REGION || 'bru-2',
      oAuthUrl: process.env.ZEEBE_AUTHORIZATION_SERVER_URL,
    };

    // For Camunda Cloud (SaaS) or local development
    camunda8 = new Camunda8({
      ...(config.clientId && config.clientSecret ? {
        CAMUNDA_OAUTH_URL: config.oAuthUrl || `https://${config.region}.operate.camunda.io/oauth2/token`,
        CAMUNDA_CLIENT_ID: config.clientId,
        CAMUNDA_CLIENT_SECRET: config.clientSecret,
        CAMUNDA_TENANT_ID: '<default>',
      } : {}),
      ZEEBE_ADDRESS: config.zeebeGatewayAddress,
    });

    console.log(
      `[Camunda] Connected to Zeebe at ${config.zeebeGatewayAddress}`
    );
  }

  return camunda8;
}

/**
 * Start a new process instance
 */
export async function startProcessInstance(
  request: StartProcessInstanceRequest
): Promise<ProcessInstance> {
  const client = getZeebeClient();
  const zeebe = client.getZeebeGrpcApiClient();

  const result = await zeebe.createProcessInstance({
    bpmnProcessId: request.bpmnProcessId,
    variables: request.variables || {},
    version: request.version,
  });

  return {
    processInstanceKey: result.processInstanceKey.toString(),
    processDefinitionKey: result.processDefinitionKey.toString(),
    bpmnProcessId: result.bpmnProcessId,
    version: result.version,
    variables: request.variables || {},
  };
}

/**
 * Deploy BPMN/DMN resources to Camunda
 */
export async function deployResources(
  request: DeployResourceRequest
): Promise<{ key: string; deployments: any[] }> {
  const client = getZeebeClient();
  const zeebe = client.getZeebeGrpcApiClient();

  const result = await zeebe.deployResource(
    request.resources.map((resource) => ({
      name: resource.name,
      content: resource.content,
    }))
  );

  return {
    key: result.key.toString(),
    deployments: result.deployments,
  };
}

/**
 * Publish a message to trigger a process or correlate to waiting process
 */
export async function publishMessage(
  messageName: string,
  correlationKey: string,
  variables?: Record<string, any>,
  timeToLive?: number
): Promise<{ key: string }> {
  const client = getZeebeClient();
  const zeebe = client.getZeebeGrpcApiClient();

  const result = await zeebe.publishMessage({
    name: messageName,
    correlationKey,
    variables: variables || {},
    timeToLive: timeToLive || 60000, // 60 seconds default
  });

  return {
    key: result.key.toString(),
  };
}

/**
 * Set variables on a process instance
 */
export async function setVariables(
  elementInstanceKey: string,
  variables: Record<string, any>
): Promise<{ key: string }> {
  const client = getZeebeClient();
  const zeebe = client.getZeebeGrpcApiClient();

  const result = await zeebe.setVariables({
    elementInstanceKey,
    variables,
  });

  return {
    key: result.key.toString(),
  };
}

/**
 * Cancel a running process instance
 */
export async function cancelProcessInstance(
  processInstanceKey: string
): Promise<void> {
  const client = getZeebeClient();
  const zeebe = client.getZeebeGrpcApiClient();

  await zeebe.cancelProcessInstance(processInstanceKey);
}

/**
 * Get Zeebe topology (cluster info)
 */
export async function getTopology(): Promise<any> {
  const client = getZeebeClient();
  const zeebe = client.getZeebeGrpcApiClient();
  return zeebe.topology();
}

/**
 * Close Zeebe client connection
 */
export async function closeClient(): Promise<void> {
  if (camunda8) {
    await camunda8.getZeebeGrpcApiClient().close();
    camunda8 = null;
    console.log('[Camunda] Client connection closed');
  }
}
