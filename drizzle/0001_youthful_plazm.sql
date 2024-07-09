ALTER TABLE `CalendarsEvents` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `CalendarsEvents` ADD PRIMARY KEY(`event_id`,`calendar_id`);--> statement-breakpoint
ALTER TABLE `CalendarsEvents` DROP COLUMN `id`;