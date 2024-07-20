CREATE TABLE `Calendar` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`createdBy` varchar(255) NOT NULL,
	`title` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `Calendar_id` PRIMARY KEY(`id`),
	CONSTRAINT `Calendar_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `Event` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`date` date NOT NULL,
	`description` text,
	`createdBy` varchar(255) NOT NULL,
	`dateEnd` date,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `Event_id` PRIMARY KEY(`id`),
	CONSTRAINT `Event_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `SharedEvents` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`event_id` bigint unsigned NOT NULL,
	`shared_to_user_id` varchar(255) NOT NULL,
	`from` date NOT NULL,
	`to` date,
	CONSTRAINT `SharedEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `Calendar` ADD CONSTRAINT `Calendar_createdBy_User_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Event` ADD CONSTRAINT `Event_createdBy_User_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `SharedEvents` ADD CONSTRAINT `SharedEvents_event_id_Event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `SharedEvents` ADD CONSTRAINT `SharedEvents_shared_to_user_id_User_id_fk` FOREIGN KEY (`shared_to_user_id`) REFERENCES `User`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `uid` ON `Calendar` (`createdBy`);--> statement-breakpoint
CREATE INDEX `uid` ON `Event` (`createdBy`);--> statement-breakpoint
CREATE INDEX `uid` ON `SharedEvents` (`id`);