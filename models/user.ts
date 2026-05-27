import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { v4 as uuid } from 'uuid'

export const User = table("user", {
    id: t.text("id").primaryKey().$defaultFn(() => uuid()),
    email: t.text("email").notNull(),
    name: t.text("name").notNull(),
    surname: t.text("surname").notNull(),
    password: t.text("password").notNull(),
    createdAt: t.integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date())
})

