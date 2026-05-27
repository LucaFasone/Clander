import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { User } from './User'

export const Event = sqliteTable('event', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    activeReminder: integer("activeReminder", { mode: 'boolean' }).default(false).notNull(),
    date: text("date").notNull(),
    description: text("description"),
    dateEnd: text("dateEnd"),
    createdBy: text('createdBy').notNull().references(() => User.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (event) => ({
    uid: index('uid').on(event.createdBy)
}))