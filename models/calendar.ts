import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'
import { User } from './User'

export const Calendar = sqliteTable('Calendar', {
    id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
    createdBy: text('createdBy').notNull().references(() => User.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
}, (Calendar) => ({
    uid: index('uid').on(Calendar.createdBy)
}))