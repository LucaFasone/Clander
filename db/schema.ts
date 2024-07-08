import {index, mysqlTable, serial, varchar, timestamp, int, date, text,primaryKey} from "drizzle-orm/mysql-core";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {relations} from "drizzle-orm/relations";

export const Calendar = mysqlTable("Calendar", {
    id: serial("id").primaryKey(),
    createBy: varchar("createdBy", {length:255}).notNull(),
    createAt: timestamp('created_at').defaultNow(),
},(Calendar) => {
    return {uid: index('uid').on(Calendar.createBy)}
});

export const Event = mysqlTable("Event", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    date: date("date").notNull(),
    description: text("description"),
    createBy: varchar("createdBy", {length: 255}).notNull(),
    dateEnd: date("dateEnd"),
    createAt: timestamp('created_at').defaultNow(),
},(Event) => {
    return {uid: index('uid').on(Event.createBy)}
});

export const eventOnCalendar = mysqlTable("CalendarsEvents", {
    eventId: int("event_id").notNull().references(() => Event.id),
    calendarId: int("calendar_id").notNull().references(() => Calendar.id),
},(t)=>
{
    return{
        pk: primaryKey({ columns: [t.calendarId, t.eventId] }),

    }
})

export  const calendarRelation = relations(Calendar, ({many})=>({
    Event: many(eventOnCalendar)

}));
export const eventRelation = relations(Event, ({many})=>({
    Calendar: many(eventOnCalendar)

}));

export const eventOnCalendarRelation = relations(eventOnCalendar, ({one})=>({
    Event: one(Event,{
        fields:[eventOnCalendar.eventId],
        references: [Event.id]
    }),
    Calendar: one(Calendar,{
        fields:[eventOnCalendar.calendarId],
        references: [Calendar.id]
    })
}));

export const insertCalendarSchema = createInsertSchema(Calendar)

export const insertEventSchema = createInsertSchema(Event)

export const selectEventsSchema = createSelectSchema(Event);

