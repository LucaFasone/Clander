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
	`activeReminder` boolean DEFAULT false,
	`date` text NOT NULL,
	`description` text,
	`createdBy` varchar(255) NOT NULL,
	`dateEnd` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `Event_id` PRIMARY KEY(`id`),
	CONSTRAINT `Event_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `Event_On_Calendar` (
	`calendar_id` bigint unsigned NOT NULL,
	`event_id` bigint unsigned NOT NULL
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`surname` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `User_id` PRIMARY KEY(`id`),
	CONSTRAINT `User_id_unique` UNIQUE(`id`)
);
--> statement-breakpoint
CREATE TABLE `notification` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`event_id` bigint unsigned NOT NULL,
	`user_from_id` varchar(255) NOT NULL,
	`user_to_id` varchar(255) NOT NULL,
	CONSTRAINT `notification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `SharedEvents` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`event_id` bigint unsigned NOT NULL,
	`shared_from_user_id` varchar(255) NOT NULL,
	`shared_to_user_id` varchar(255) NOT NULL,
	`actions` varchar(255) NOT NULL,
	CONSTRAINT `SharedEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `Calendar` ADD CONSTRAINT `Calendar_createdBy_User_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Event` ADD CONSTRAINT `Event_createdBy_User_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Event_On_Calendar` ADD CONSTRAINT `Event_On_Calendar_calendar_id_Calendar_id_fk` FOREIGN KEY (`calendar_id`) REFERENCES `Calendar`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Event_On_Calendar` ADD CONSTRAINT `Event_On_Calendar_event_id_Event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_event_id_Event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_user_from_id_User_id_fk` FOREIGN KEY (`user_from_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `notification` ADD CONSTRAINT `notification_user_to_id_User_id_fk` FOREIGN KEY (`user_to_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `SharedEvents` ADD CONSTRAINT `SharedEvents_event_id_Event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `SharedEvents` ADD CONSTRAINT `SharedEvents_shared_from_user_id_User_id_fk` FOREIGN KEY (`shared_from_user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `SharedEvents` ADD CONSTRAINT `SharedEvents_shared_to_user_id_User_id_fk` FOREIGN KEY (`shared_to_user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `uid` ON `Calendar` (`createdBy`);--> statement-breakpoint
CREATE INDEX `uid` ON `Event` (`createdBy`);--> statement-breakpoint
CREATE INDEX `uid` ON `SharedEvents` (`id`);