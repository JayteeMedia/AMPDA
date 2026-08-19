import {
  JobPriority,
  JobStatus,
  type Job,
} from "@ampda/job-engine";

export class JobFactory {

  static create<TPayload, TResult>(
    payload: TPayload,
    name: string,
  ): Job<TPayload, TResult> {

    return {
      id: crypto.randomUUID(),

      name,

      payload,

      priority: JobPriority.Normal,

      status: JobStatus.Pending,

      metadata: {},

      createdAt: new Date(),
    };

  }

}
