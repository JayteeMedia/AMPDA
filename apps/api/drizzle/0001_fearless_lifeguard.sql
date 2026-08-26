CREATE TABLE `song_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`song_id` text NOT NULL,
	`concept` text NOT NULL,
	`structure` text DEFAULT '[]' NOT NULL,
	`bpm` integer NOT NULL,
	`key` text NOT NULL,
	`energy` integer NOT NULL,
	`vocal_style` text NOT NULL,
	`production_direction` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_song_plans_song_id` ON `song_plans` (`song_id`);--> statement-breakpoint
CREATE INDEX `idx_song_plans_created_at` ON `song_plans` (`created_at`);