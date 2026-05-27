import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { Calendar, Event, User, sharedEvents } from './index'

export const insertCalendarSchema = createInsertSchema(Calendar).omit({ id: true, createdAt: true })

export const insertEventSchema = createInsertSchema(Event, {
    title: z.string().min(2),
    date: z.string(),
    dateEnd: z.string()
}).omit({ id: true, createdAt: true })

export const insertUserSchema = createInsertSchema(User).omit({ createdAt: true })

export const insertSharedEventSchema = createSelectSchema(sharedEvents).omit({ id: true })