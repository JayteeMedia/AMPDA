export interface JobContext {
  correlationId?: string;

  workflowId?: string;

  parentJobId?: string;

  createdBy?: string;

  tags: string[];

  metadata: Record<
    string,
    unknown
  >;
}
