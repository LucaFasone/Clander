import { relations } from 'drizzle-orm'
import { User } from './User'
import { Calendar } from './Calendar'
import { Event } from './event'
import { EventOnCalendar } from './EventOnCalendar'
import { sharedEvents } from './sharedEvents'
import { notification } from './notification'

export const userRelations = relations(User, ({ one, many }) => ({
    calendars: one(Calendar),
    createdEvent: many(Event),
    notifications: many(notification)
}))

export const calendarRelations = relations(Calendar, ({ one, many }) => ({
    EventInCalendar: many(EventOnCalendar),
}))

export const eventRelations = relations(Event, ({ one, many }) => ({
    createdEventBy: one(User, {
        fields: [Event.createdBy],
        references: [User.id]
    }),
    sharedEvent: many(sharedEvents),
    EventInCalendar: many(EventOnCalendar),
    notification: many(notification),
}))

export const eventOnCalendarRelations = relations(EventOnCalendar, ({ one }) => ({
    calendar: one(Calendar, {
        fields: [EventOnCalendar.calendarId],
        references: [Calendar.id],
    }),
    event: one(Event, {
        fields: [EventOnCalendar.eventId],
        references: [Event.id],
    }),
}))

export const sharedEventsRelation = relations(sharedEvents, ({ one }) => ({
    event: one(Event, {
        fields: [sharedEvents.eventId],
        references: [Event.id]
    }),
    sharedToUser: one(User, {
        fields: [sharedEvents.sharedToUserId],
        references: [User.id]
    }),
    sharedFromUser: one(User, {
        fields: [sharedEvents.sharedFromUserId],
        references: [User.id]
    }),
}));

export const notificationRelation = relations(notification, ({ one }) => ({
    event: one(Event, {
        fields: [notification.eventId],
        references: [Event.id]
    }),
    userFrom: one(User, {
        fields: [notification.userFromId],
        references: [User.id]
    }),
    userTo: one(User, {
        fields: [notification.userToId],
        references: [User.id]
    }),
}))