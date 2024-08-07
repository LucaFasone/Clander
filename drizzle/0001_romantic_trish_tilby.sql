ALTER TABLE `Calendar` DROP FOREIGN KEY `Calendar_createdBy_User_id_fk`;
--> statement-breakpoint
ALTER TABLE `Event` DROP FOREIGN KEY `Event_createdBy_User_id_fk`;
--> statement-breakpoint
ALTER TABLE `Event_On_Calendar` DROP FOREIGN KEY `Event_On_Calendar_calendar_id_Calendar_id_fk`;
--> statement-breakpoint
ALTER TABLE `Event_On_Calendar` DROP FOREIGN KEY `Event_On_Calendar_event_id_Event_id_fk`;
--> statement-breakpoint
ALTER TABLE `SharedEvents` DROP FOREIGN KEY `SharedEvents_event_id_Event_id_fk`;
--> statement-breakpoint
ALTER TABLE `SharedEvents` DROP FOREIGN KEY `SharedEvents_shared_from_user_id_User_id_fk`;
--> statement-breakpoint
ALTER TABLE `SharedEvents` DROP FOREIGN KEY `SharedEvents_shared_to_user_id_User_id_fk`;
--> statement-breakpoint
ALTER TABLE `Calendar` ADD CONSTRAINT `Calendar_createdBy_User_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Event` ADD CONSTRAINT `Event_createdBy_User_id_fk` FOREIGN KEY (`createdBy`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Event_On_Calendar` ADD CONSTRAINT `Event_On_Calendar_calendar_id_Calendar_id_fk` FOREIGN KEY (`calendar_id`) REFERENCES `Calendar`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `Event_On_Calendar` ADD CONSTRAINT `Event_On_Calendar_event_id_Event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `SharedEvents` ADD CONSTRAINT `SharedEvents_event_id_Event_id_fk` FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `SharedEvents` ADD CONSTRAINT `SharedEvents_shared_from_user_id_User_id_fk` FOREIGN KEY (`shared_from_user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `SharedEvents` ADD CONSTRAINT `SharedEvents_shared_to_user_id_User_id_fk` FOREIGN KEY (`shared_to_user_id`) REFERENCES `User`(`id`) ON DELETE cascade ON UPDATE cascade;