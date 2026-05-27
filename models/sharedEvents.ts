import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core'
import { User } from './User'
import { Event } from './event'

export const sharedEvents = sqliteTable("SharedEvents", {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    eventId: text("event_id").notNull().references(() => Event.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    sharedFromUserId: text("shared_from_user_id").notNull().references(() => User.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    sharedToUserId: text("shared_to_user_id").notNull().references(() => User.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    permissions: text("permissions", { length: 255 }).notNull(),
}, (t) => {
    return { uid: index('uid').on(t.id) }
});