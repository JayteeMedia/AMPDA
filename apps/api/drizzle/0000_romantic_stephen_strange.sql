CREATE TABLE `song_status_history` (
	`id` text PRIMARY KEY NOT NULL,
	`song_id` text NOT NULL,
	`from_status` text,
	`to_status` text NOT NULL,
	`reason` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_song_status_history_song_id` ON `song_status_history` (`song_id`);--> statement-breakpoint
CREATE INDEX `idx_song_status_history_created_at` ON `song_status_history` (`created_at`);--> statement-breakpoint
CREATE TABLE `songs` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`genre` text NOT NULL,
	`mood` text NOT NULL,
	`theme` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'queued' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workflow_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`song_id` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payload` text DEFAULT '{}' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_workflow_jobs_song_id` ON `workflow_jobs` (`song_id`);--> statement-breakpoint
CREATE INDEX `idx_workflow_jobs_status` ON `workflow_jobs` (`status`);--> statement-breakpoint
CREATE INDEX `idx_workflow_jobs_created_at` ON `workflow_jobs` (`created_at`);