import {
    index,
    mysqlTable,
    serial,
    varchar,
    timestamp,
    int,
    date,
    text,
    primaryKey,
    bigint,
} from "drizzle-orm/mysql-core";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {relations} from "drizzle-orm/relations";
import {number} from "zod";

export const Calendar = mysqlTable("Calendar", {
    id: bigint("id",{mode:'number', unsigned: true}).primaryKey().autoincrement().unique().notNull(),
    createBy: varchar("createdBy", {length:255}).notNull(),
    createAt: timestamp('created_at').defaultNow(),
},(Calendar) => {
    return {uid: index('uid').on(Calendar.createBy)}
});

export const Event = mysqlTable("Event", {
    id: bigint("id",{mode:'number', unsigned: true}).primaryKey().autoincrement().unique().notNull(),
    title: text("title").notNull(),
    date: date("date").notNull(),
    description: text("description"),
    createBy: varchar("createdBy", {length: 255}).notNull(),
    dateEnd: date("dateEnd"),
    createAt: timestamp('created_at').defaultNow(),
},(Event) => {
    return {uid: index('uid').on(Event.createBy)}
});

export const eventOnCalendar = mysqlTable("Calendars_Events", {
    eventId: bigint("event_id",{mode:'number', unsigned: true}).notNull().references(() => Event.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
    calendarId: bigint("calendar_id",{mode:'number', unsigned: true}).notNull().references(() => Calendar.id,{onDelete: 'cascade', onUpdate: 'cascade'}),
},(t) =>{
    return{
        pkWithCustomName: primaryKey({ name: 'id', columns: [t.eventId, t.calendarId] }),
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

