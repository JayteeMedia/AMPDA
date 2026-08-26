CREATE TABLE `song_writes` (
	`id` text PRIMARY KEY NOT NULL,
	`song_id` text NOT NULL,
	`lyrics` text DEFAULT '' NOT NULL,
	`structure` text DEFAULT '[]' NOT NULL,
	`vocal_direction` text NOT NULL,
	`writing_notes` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`song_id`) REFERENCES `songs`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_song_writes_song_id` ON `song_writes` (`song_id`);--> statement-breakpoint
CREATE INDEX `idx_song_writes_created_at` ON `song_writes` (`created_at`);