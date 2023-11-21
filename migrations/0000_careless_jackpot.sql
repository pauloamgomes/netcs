CREATE TABLE `articleviews` (
	`id` integer PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`ip_address` text NOT NULL,
	`referer` text NOT NULL,
	`country` text NOT NULL,
	`device` text NOT NULL,
	`browser` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE TABLE `newslettersignups` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`country` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
