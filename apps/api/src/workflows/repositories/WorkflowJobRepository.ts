import { eq, and, inArray } from "drizzle-orm";

import { db } from "../../db/client.js";
import { workflowJobs } from "../../db/schema.js";

import type {
  WorkflowJob,
  WorkflowJobStatus,
  WorkflowJobType,
} from "../types.js";

export type CreateWorkflowJobInput = {
  songId: string;
  type: WorkflowJobType;
  payload?: Record<string, unknown>;
};

export type FindExistingWorkflowJobInput = {
  songId: string;
  type: WorkflowJobType;
  statuses?: WorkflowJobStatus[];
};

export class WorkflowJobRepository {
  /**
   * Create a workflow job idempotently.
   *
   * The database UNIQUE constraint on
   * (song_id, type) is the final authority.
   *
   * Application flow:
   *
   * 1. Look for an existing job.
   * 2. Return it if found.
   * 3. Attempt INSERT.
   * 4. If another worker won the race, re-read the job.
   * 5. Return the existing job.
   */
  async create(
    input: CreateWorkflowJobInput,
  ): Promise<WorkflowJob> {
    const existing = await this.findExisting({
      songId: input.songId,
      type: input.type,
    });

    if (existing) {
      return existing;
    }

    const now = new Date().toISOString();

    const job: WorkflowJob = {
      id:
        `job_${Date.now()}_` +
        Math.random()
          .toString(36)
          .slice(2, 8),

      songId: input.songId,

      type: input.type,

      status: "pending",

      payload: input.payload ?? {},

      attempts: 0,

      createdAt: now,

      updatedAt: now,
    };

    try {
      await db
        .insert(workflowJobs)
        .values({
          id: job.id,
          songId: job.songId,
          type: job.type,
          status: job.status,
          payload: JSON.stringify(job.payload),
          attempts: job.attempts,
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
        });

      return job;
    } catch (error) {
      /*
       * Concurrent idempotency race:
       *
       * Worker A -> SELECT -> nothing
       * Worker B -> SELECT -> nothing
       * Worker A -> INSERT -> succeeds
       * Worker B -> INSERT -> UNIQUE constraint failure
       *
       * The database constraint is authoritative.
       *
       * Re-read WITHOUT a status filter because the existing
       * record may be pending, running, completed, or failed.
       */
      const existingAfterConflict =
        await this.findExisting({
          songId: input.songId,
          type: input.type,
        });

      if (existingAfterConflict) {
        return existingAfterConflict;
      }

      throw error;
    }
  }

  /**
   * Find the unique workflow job for a song/type pair.
   *
   * If statuses are supplied, restrict the search to those
   * statuses. Otherwise search all statuses.
   */
  async findExisting(
    input: FindExistingWorkflowJobInput,
  ): Promise<WorkflowJob | null> {
    const conditions = [
      eq(
        workflowJobs.songId,
        input.songId,
      ),

      eq(
        workflowJobs.type,
        input.type,
      ),
    ];

    if (
      input.statuses &&
      input.statuses.length > 0
    ) {
      conditions.push(
        inArray(
          workflowJobs.status,
          input.statuses,
        ),
      );
    }

    const result = await db
      .select()
      .from(workflowJobs)
      .where(and(...conditions))
      .orderBy(
        workflowJobs.createdAt,
      )
      .limit(1);

    const row = result[0];

    return row
      ? this.mapRow(row)
      : null;
  }

  /**
   * Find a workflow job by primary key.
   */
  async findById(
    id: string,
  ): Promise<WorkflowJob | null> {
    const result = await db
      .select()
      .from(workflowJobs)
      .where(
        eq(
          workflowJobs.id,
          id,
        ),
      )
      .limit(1);

    const row = result[0];

    return row
      ? this.mapRow(row)
      : null;
  }

  /**
   * Return pending jobs in FIFO order.
   */
  async findPending(): Promise<WorkflowJob[]> {
    const result = await db
      .select()
      .from(workflowJobs)
      .where(
        eq(
          workflowJobs.status,
          "pending",
        ),
      )
      .orderBy(
        workflowJobs.createdAt,
      );

    return result.map((row) =>
      this.mapRow(row),
    );
  }

  /**
   * Attempt to claim the oldest pending job.
   *
   * The conditional UPDATE prevents two workers from
   * successfully claiming the same job.
   */
  async claimPending(): Promise<WorkflowJob | null> {
    const pending =
      await this.findPending();

    const job = pending[0];

    if (!job) {
      return null;
    }

    const now =
      new Date().toISOString();

    const result = await db
      .update(workflowJobs)
      .set({
        status: "running",

        attempts:
          job.attempts + 1,

        updatedAt: now,
      })
      .where(
        and(
          eq(
            workflowJobs.id,
            job.id,
          ),

          eq(
            workflowJobs.status,
            "pending",
          ),
        ),
      );

    if (result.changes !== 1) {
      return null;
    }

    return this.findById(
      job.id,
    );
  }

  /**
   * Mark a running job as completed.
   */
  async markCompleted(
    id: string,
  ): Promise<WorkflowJob> {
    const now =
      new Date().toISOString();

    const result = await db
      .update(workflowJobs)
      .set({
        status: "completed",
        updatedAt: now,
      })
      .where(
        and(
          eq(
            workflowJobs.id,
            id,
          ),

          eq(
            workflowJobs.status,
            "running",
          ),
        ),
      );

    if (result.changes !== 1) {
      throw new Error(
        `Workflow job is not running or does not exist: ${id}`,
      );
    }

    const job =
      await this.findById(id);

    if (!job) {
      throw new Error(
        `Workflow job not found: ${id}`,
      );
    }

    return job;
  }

  /**
   * Mark a running job as failed.
   *
   * The job remains in the database so the workflow engine
   * can inspect attempts/error state and implement retries.
   */
  async markFailed(
    id: string,
    error: unknown,
  ): Promise<WorkflowJob> {
    const now =
      new Date().toISOString();

    const message =
      error instanceof Error
        ? error.message
        : String(error);

    const existing =
      await this.findById(id);

    if (!existing) {
      throw new Error(
        `Workflow job not found: ${id}`,
      );
    }

    const result = await db
      .update(workflowJobs)
      .set({
        status: "failed",

        payload: JSON.stringify({
          ...existing.payload,
          error: message,
        }),

        updatedAt: now,
      })
      .where(
        and(
          eq(
            workflowJobs.id,
            id,
          ),

          eq(
            workflowJobs.status,
            "running",
          ),
        ),
      );

    if (result.changes !== 1) {
      throw new Error(
        `Workflow job is not running or does not exist: ${id}`,
      );
    }

    const job =
      await this.findById(id);

    if (!job) {
      throw new Error(
        `Workflow job not found: ${id}`,
      );
    }

    return job;
  }

  /**
   * Convert the SQLite row into the application domain type.
   */
  private mapRow(
    row: typeof workflowJobs.$inferSelect,
  ): WorkflowJob {
    let payload: Record<string, unknown>;

    try {
      payload =
        JSON.parse(row.payload);
    } catch {
      payload = {
        rawPayload: row.payload,
      };
    }

    return {
      id: row.id,

      songId: row.songId,

      type:
        row.type as WorkflowJobType,

      status:
        row.status as WorkflowJobStatus,

      payload,

      attempts:
        Number(row.attempts),

      createdAt:
        row.createdAt,

      updatedAt:
        row.updatedAt,
    };
  }
}
