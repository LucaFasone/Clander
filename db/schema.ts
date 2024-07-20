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
    bigint, boolean,
} from "drizzle-orm/mysql-core";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {relations} from "drizzle-orm/relations";
import {number} from "zod";

export const User = mysqlTable("User", {
    id: varchar("id",{length:255}).primaryKey().unique().notNull(),
    email: varchar("email", {length: 255}).notNull(),
    name: varchar("name", {length: 255}).notNull(),
    surname: varchar("surname", {length: 255}),
    createAt: timestamp('created_at').defaultNow(),
})
export const Calendar = mysqlTable("Calendar", {
    id: bigint("id",{mode:'number', unsigned: true}).primaryKey().autoincrement().unique().notNull(),
    createBy: varchar("createdBy", {length:255}).notNull().references(() => User.id, {onDelete: 'no action', onUpdate: 'no action'}),
    createAt: timestamp('created_at').defaultNow(),
},(Calendar) => {
    return {uid: index('uid').on(Calendar.createBy)}
});

export const Event = mysqlTable("Event", {
    id: bigint("id",{mode:'number', unsigned: true}).primaryKey().autoincrement().unique().notNull(),
    title: text("title").notNull(),
    date: date("date").notNull(),
    description: text("description"),
    createBy: varchar("createdBy", {length: 255}).notNull().references(() => User.id, {onDelete: 'no action', onUpdate: 'no action'}),
    dateEnd: date("dateEnd"),
    createAt: timestamp('created_at').defaultNow(),
},(Event) => {
    return {uid: index('uid').on(Event.createBy)}
});

export const sharedEvents = mysqlTable("SharedEvents", {
    id:serial('id').primaryKey(),
    eventId: bigint("event_id",{mode:'number', unsigned: true}).notNull().references(() => Event.id, {onDelete: 'no action', onUpdate: 'no action'}),
    sharedFromUserId: varchar("shared_from_user_id",{length:255}).notNull().references(() => User.id, {onDelete: 'no action', onUpdate: 'no action'}),
    sharedToUserId: varchar("shared_to_user_id",{length:255}).notNull().references(() => User.id, {onDelete: 'no action', onUpdate: 'no action'}),
    actions: varchar("actions",{length:255}).notNull(),
},(t) => {
    return {uid: index('uid').on(t.id)}
});

export const EventOnCalendar = mysqlTable("Event_On_Calendar", {
    calendarId: bigint("calendar_id",{mode:'number', unsigned: true}).notNull().references(() => Calendar.id, {onDelete: 'no action', onUpdate: 'no action'}),
    eventId: bigint("event_id",{mode:'number', unsigned: true}).notNull().references(() => Event.id, {onDelete: 'no action', onUpdate: 'no action'}),
});

export const userRelation = relations(User, ({one,many})=>({
    calendars: one(Calendar),
    createdEvent: many(Event),

}));

export  const calendarRelation = relations(Calendar, ({one,many})=>({
    EventInCalendar: many(EventOnCalendar),

}));

export const eventRelation = relations(Event, ({one,many})=>({
    createdEventBy: one(User,{
        fields:[Event.createBy],
        references:[User.id]
    }),
    sharedEvent: many(sharedEvents),
    EventInCalendar: many(EventOnCalendar),

}));

export const sharedEventsRelation = relations(sharedEvents, ({one,many})=>({
    event: one(Event,{
        fields:[sharedEvents.eventId],
        references:[Event.id]
    }),
    sharedToUser: one(User,{
        fields:[sharedEvents.sharedToUserId],
        references:[User.id]
    }),

}));

export const eventOnCalendarRelation = relations(EventOnCalendar, ({one,many})=>({
    event: one(Event,{
        fields:[EventOnCalendar.eventId],
        references:[Event.id]
    }),
    calendar: one(Calendar,{
        fields:[EventOnCalendar.calendarId],
        references:[Calendar.id]
    }),
}));




export const insertCalendarSchema = createInsertSchema(Calendar).omit({id: true, createAt: true})

export const insertEventSchema = createInsertSchema(Event).omit({id: true, createAt: true})

export const inserUserSchema = createInsertSchema(User).omit({createAt: true})

export const insertSharedEventSchema = createSelectSchema(sharedEvents).omit({id: true})


