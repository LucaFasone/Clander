import { Hono } from "hono";
import { Event, insertEventSchema, EventOnCalendar, sharedEvents, insertSharedEventSchema } from "../db/schema";
import { getUser } from "../kinde";
import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { getUserCalendarId, getUserIdByEmail, userHasEvent } from "../db/Query";


export const calendar = new Hono()
    .get("/", getUser, async (c) => {
        const calendarId = await getUserCalendarId(c.var.user.id)
        const events = await db.select().from(Event).where(sql`Event.id IN (SELECT event_id FROM event_on_calendar where calendar_id = ${calendarId})`)
        return c.json({ events });
    })
    .post("/event", getUser, async (c) => {
        try {
            const { title, date, description, dateEnd, activeReminder } = await c.req.json();
            const calendarId = await getUserCalendarId(c.var.user.id);
            const validate = insertEventSchema.parse({
                title,
                date: new Date(date),
                description,
                dateEnd: dateEnd ? new Date(dateEnd) : null,
                createBy: c.var.user.id,
                activeReminder,
            });
            const [result] = await db.insert(Event).values(validate);
            const eventId = result.insertId;
            await db.insert(EventOnCalendar).values({
                calendarId,
                eventId,
            })
            const lastEvent = await db.select().from(Event).where(eq(Event.id, eventId)).then((r) => r[0]);
            return c.json(lastEvent, 201);
        } catch (error) {
            console.error('Error inserting event:', error);
            return c.json({ error: error, success: false }, 500);
        }
    })
    .post("/sharedTo/:email", getUser, async (c) => {
        try {
            const email = c.req.param('email');
            const sharedToUserId = await getUserIdByEmail(email)
            const { eventId } = await c.req.json()
            if (await userHasEvent(c.var.user.id, Number(eventId))) {
                return c.json({ error: "Unauthorized" }, 401)
            }
            const calendarId = await getUserCalendarId(sharedToUserId)
            const validate = insertSharedEventSchema.parse({
                eventId: eventId,
                sharedToUserId: sharedToUserId,
                sharedFromUserId: c.var.user.id,
                actions: "view",
            })
            //Chain the query
            await db.insert(sharedEvents).values(validate)
            await db.insert(EventOnCalendar).values({
                calendarId: calendarId,
                eventId: eventId,
            })

            return c.json({ success: true }, 200)
        } catch (e) {
            return c.json({ error: e, success: false }, 500)
        }
    })
    .delete("/event/:id", getUser, async (c) => {
        try {
            const id = c.req.param('id')
            if (await userHasEvent(c.var.user.id, Number(id))) {
                const res = await db.delete(Event).where(eq(Event.id, Number(id))).then((r) => r[0].affectedRows == 1)
                if (res) {
                    return c.json({ success: true }, 200)
                } else {
                    return c.json({ error: "Error" }, 500)
                }
            }
            return c.json({ error: "Unauthorized" }, 401)

        } catch (e) {

        }
    })

