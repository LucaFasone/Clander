import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { v4 as uuid } from 'uuid'
import { Calendar } from "./Calendar";
import { Event } from "./event";

export const EventOnCalendar = table("Event_On_Calendar", {
    Id: t.text("id").primaryKey().$defaultFn(() => uuid()),
    calendarId: t.text("calendar_id").notNull().references(() => Calendar.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    eventId: t.text("event_id").notNull().references(() => Event.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
});