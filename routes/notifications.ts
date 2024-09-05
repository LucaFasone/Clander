import { Hono } from "hono";
import { getUser } from "../kinde";
import { getUserIdByEmail, userHasEvent } from "../db/Query";
import { db } from "../db";
import { Event, notification, User } from "../db/schema";
import { eq } from "drizzle-orm/expressions";

export const notifications = new Hono()
    .get('notifications', getUser, async (c) => {
        try {
            const notifications = await db.select().from(notification)
                .innerJoin(Event, eq(notification.eventId, Event.id))
                .innerJoin(User, eq(notification.userFromId, User.id))
                .where(eq(notification.userToId, c.var.user.id))
            return c.json(notifications, 200)
        } catch (e) {
            return c.json({ error: e }, 500)

        }
    })
    .post('notifications', getUser, async (c) => {
        try {
            const { Id, email, permissions } = await c.req.json()
            if (!await userHasEvent(c.var.user.id, Id)) {
                return c.json({ error: "Unauthorized" }, 401)
            }
            const userToID = await getUserIdByEmail(email)

            if (!userToID) {
                return c.json({ error: "User not found" }, 404)
            }
            const [result] = await db.insert(notification).values({ eventId: Id, userToId: userToID, userFromId: c.var.user.id, permissions: permissions })
            if (result.insertId) {
                return c.json({ message: "Notification sent",}, 200)
            }
            return c.json({ error: "DB Error" }, 500)
        } catch (e) {
            return c.json({ error: e }, 500)
        }
    }).delete('notifications', getUser, async (c) => {
        try {
            const { id } = await c.req.json()
            const [result] = await db.delete(notification).where(eq(notification.id, id))
            if (result.affectedRows) {
                return c.json({ message: "Notification deleted" }, 200)
            }
            return c.json({ error: "Notification not found" }, 404)
        } catch (e) {
            return c.json({ error: e }, 500)
        }
    })
