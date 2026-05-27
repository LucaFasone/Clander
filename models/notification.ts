import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { v4 as uuid } from 'uuid'
import { Event } from "./event";
import { User } from "./User";

export const notification = table("notification", {
    id: t.text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    eventId: t.text("event_id").notNull().references(() => Event.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userFromId: t.text("user_from_id").notNull().references(() => User.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userToId: t.text("user_to_id").notNull().references(() => User.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    permissions: t.text("permissions", { length: 255 }).notNull(),
})
