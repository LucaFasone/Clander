import { Hono } from "hono";
import { getUser } from "../kinde";
import { db } from "../db";
import { EventOnCalendar, sharedEvents, User } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { getUserCalendarId, userHasEvent } from "../db/Query";
export const shared = new Hono()
    .get("/get:id", getUser, async (c) => {
    const id = Number(c.req.param('id'));
    const result = db.select().from(sharedEvents).where(eq(sharedEvents.id, id));
    return c.json({ result });
})
    .put("/update:id", getUser, async (c) => {
    const id = Number(c.req.param('id'));
    const { actions } = await c.req.json();
    const result = db.update(sharedEvents).set({ actions }).where(eq(sharedEvents.id, id));
    return c.json({ result });
})
    .delete("/delete:id", getUser, async (c) => {
    const id = Number(c.req.param('id'));
    try {
        const { eventId } = await db.select({ eventId: sharedEvents.eventId })
            .from(sharedEvents)
            .where(eq(sharedEvents.id, id))
            .then((r) => r[0]);
        await db.delete(EventOnCalendar).where(eq(EventOnCalendar.eventId, eventId));
        await db.delete(sharedEvents).where(eq(sharedEvents.eventId, id));
        return c.json({ success: true }, 200);
    }
    catch (e) {
        return c.json({ error: e, success: false }, 500);
    }
}).post('/getUsers', getUser, async (c) => {
    const { eventId } = await c.req.json();
    if (!eventId) {
        return c.json({ error: "Missing eventId" }, 400);
    }
    if (!await userHasEvent(c.var.user.id, eventId, "")) {
        return c.json({ error: "You don't have permission to view this event" }, 403);
    }
    const result = await db.select({ Email: User.email, Permission: sharedEvents.actions }).from(sharedEvents)
        .innerJoin(User, eq(sharedEvents.sharedToUserId, User.id))
        .where(eq(sharedEvents.eventId, eventId));
    return c.json({ result });
}).delete('/revokeEventsForUser', getUser, async (c) => {
    try {
        const { eventId } = await c.req.json();
        if (!eventId) {
            return c.json({ error: "Missing eventId or userId" }, 400);
        }
        if (!await userHasEvent(c.var.user.id, eventId, "view")) {
            return c.json({ error: "You don't have permission to revoke this event" }, 403);
        }
        const result = await db.delete(sharedEvents).where(and(eq(sharedEvents.eventId, eventId), eq(sharedEvents.sharedToUserId, c.var.user.id))).then((r) => r[0]);
        if (result.affectedRows === 1) {
            const deleted = await db.delete(EventOnCalendar).where(and(eq(EventOnCalendar.eventId, eventId), eq(EventOnCalendar.calendarId, await getUserCalendarId(c.var.user.id))))
                .then((r) => r[0]);
            if (deleted.affectedRows === 1) {
                return c.json({ success: true }, 200);
            }
            throw new Error("Error deleting event from calendar");
        }
        throw new Error("Error deleting event");
    }
    catch (err) {
        return c.json({ success: false, error: err }, 500);
    }
});
