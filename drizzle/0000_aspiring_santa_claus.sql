CREATE TABLE `Calendar` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`createdBy` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `Calendar_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Event` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`date` date NOT NULL,
	`description` text,
	`createdBy` varchar(255) NOT NULL,
	`dateEnd` date,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `Event_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `CalendarsEvents` (
	`event_id` int NOT NULL,
	`calendar_id` int NOT NULL,
	CONSTRAINT `custom_name` PRIMARY KEY(`calendar_id`,`event_id`)
);
--> statement-breakpoint
ALTER TABLE `CalendarsEvents` ADD CONSTRAINT `CalendarsEvents_event_id_Event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `CalendarsEvents` ADD CONSTRAINT `CalendarsEvents_calendar_id_Calendar_id_fk` FOREIGN KEY (`calendar_id`) REFERENCES `Calendar`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `uid` ON `Calendar` (`createdBy`);--> statement-breakpoint
CREATE INDEX `uid` ON `Event` (`createdBy`);