CREATE TABLE `Calendar` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`createdBy` varchar(255) NOT NULL,
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
CREATE TABLE `CalendarsEvents` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`event_id` bigint unsigned NOT NULL,
	`calendar_id` bigint unsigned NOT NULL,
	CONSTRAINT `CalendarsEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `CalendarsEvents` ADD CONSTRAINT `CalendarsEvents_event_id_Event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `CalendarsEvents` ADD CONSTRAINT `CalendarsEvents_calendar_id_Calendar_id_fk` FOREIGN KEY (`calendar_id`) REFERENCES `Calendar`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `uid` ON `Calendar` (`createdBy`);--> statement-breakpoint
CREATE INDEX `uid` ON `Event` (`createdBy`);