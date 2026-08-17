export interface JobContext {
  correlationId?: string;

  userId?: string;

  workflowId?: string;

  agentId?: string;

  metadata: Record<string, unknown>;
}
