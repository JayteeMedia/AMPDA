export const workflowJobTypes = [
  "song_planning",
  "song_writing",
  "song_production",
  "song_review",
  "song_release",
] as const;

export type WorkflowJobType =
  typeof workflowJobTypes[number];

export const workflowJobStatuses = [
  "pending",
  "running",
  "completed",
  "failed",
  "cancelled",
] as const;

export type WorkflowJobStatus =
  typeof workflowJobStatuses[number];

export type WorkflowJob = {
  id: string;
  songId: string;
  type: WorkflowJobType;
  status: WorkflowJobStatus;
  payload: Record<string, unknown>;
  attempts: number;
  createdAt: string;
  updatedAt: string;
};
