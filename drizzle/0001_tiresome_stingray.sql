CREATE TABLE `Event_On_Calendar` (
	`calendar_id` bigint unsigned NOT NULL,
	`event_id` bigint unsigned NOT NULL
);
--> statement-breakpoint
ALTER TABLE `Event_On_Calendar` ADD CONSTRAINT `Event_On_Calendar_calendar_id_Calendar_id_fk` FOREIGN KEY (`calendar_id`) REFERENCES `Calendar`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Event_On_Calendar` ADD CONSTRAINT `Event_On_Calendar_event_id_Event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `SharedEvents` DROP COLUMN `from`;--> statement-breakpoint
ALTER TABLE `SharedEvents` DROP COLUMN `to`;