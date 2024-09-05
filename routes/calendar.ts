import { Hono } from "hono";
import { Event, insertEventSchema, EventOnCalendar, sharedEvents, insertSharedEventSchema, notification } from "../db/schema";
import { getUser } from "../kinde";
import { db } from "../db";
import { eq, sql, asc, and } from "drizzle-orm";
import { getUserCalendarId, getUserIdByEmail, userHasEvent } from "../db/Query";

export const calendar = new Hono()
    .get("/:month", getUser, async (c) => {
        //need to add 
        const month = Number(c.req.param("month"));
        const calendarId = await getUserCalendarId(c.var.user.id)
        const events = await db.select({
            id: Event.id,
            title: Event.title,
            date: Event.date,
            description: Event.description,
            dateEnd: Event.dateEnd,
            activeReminder: Event.activeReminder,
            sharedTo: sharedEvents.sharedToUserId,
            sharedFrom: sharedEvents.sharedFromUserId,
            actions: sharedEvents.actions
        }).from(Event).leftJoin(sharedEvents, eq(Event.id, sharedEvents.eventId))
            .where(sql`Event.id IN (SELECT event_id FROM event_on_calendar where calendar_id = ${calendarId})AND MONTH(CONVERT_TZ(Event.date, '+00:00', ${c.var.timezone})) = ${month + 1}`).orderBy(asc(Event.date))
        return c.json({ events });
    })
    .post("/event", getUser, async (c) => {
        try {
            const { title, date, description, dateEnd, activeReminder } = await c.req.json();
            const calendarId = await getUserCalendarId(c.var.user.id);
            const validate = insertEventSchema.parse({
                title,
                date: new Date(date).toISOString(),
                description,
                dateEnd: dateEnd ? new Date(dateEnd).toISOString() : null,
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
    .post("/sharedTo", getUser, async (c) => {
        try {
            const { notificationId } = await c.req.json()
            const data = await db.select().from(notification).where(eq(notification.id, notificationId)).then((r) => r[0]);
            const check = await db.select().from(sharedEvents).where(and(eq(sharedEvents.eventId, data.eventId), eq(sharedEvents.sharedToUserId, data.userToId))).then((r) => r[0])
            if (check) {
                await db.delete(notification).where(eq(notification.id, data.id))
                return c.json({ error: "Already shared" }, 400)
            }
            if (data.userToId !== c.var.user.id) {
                return c.json({ error: "Unauthorized" }, 401)
            }
            const calendarId = await getUserCalendarId(c.var.user.id)
            const validate = insertSharedEventSchema.parse({
                eventId: data.eventId,
                sharedToUserId: data.userToId,
                sharedFromUserId: data.userFromId,
                actions: data.permissions,
            })
            await db.insert(sharedEvents).values(validate)
            await db.insert(EventOnCalendar).values({
                calendarId: calendarId,
                eventId: data.eventId,
            })
            await db.delete(notification).where(eq(notification.id, data.id))
            return c.json({ success: true, idEvent: data.eventId }, 200)
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
    .post("/getEvent", getUser, async (c) => {
        const {idEvent} = await c.req.json();
        const calendarId = await getUserCalendarId(c.var.user.id)        
        const event = await db.select({
            title: Event.title,
            description: Event.description,
            date: Event.date,
            dateEnd: Event.dateEnd ,
            activeReminder: Event.activeReminder,
        }).from(Event).where(sql`Event.id in (SELECT event_id FROM event_on_calendar where calendar_id = ${calendarId}) and Event.id = ${idEvent}`)
        console.log(event);
        
        if(!event){
            return c.json({ error: 'not found' },401)
        }
        return c.json({ event });
    })
    .get("/month/:monthNumber/page/:pageNumber", getUser, async (c) => {
        try {
            const { pageNumber, monthNumber } = c.req.param();
            const calendarId = await getUserCalendarId(c.var.user.id)
            const events = await db.select().from(Event).where(sql`Event.id IN (SELECT event_id FROM event_on_calendar where calendar_id = ${calendarId}) AND MONTH(Event.date) = ${monthNumber}`)
                .limit(5)
                .offset((4 * Number(pageNumber)))
                .orderBy(asc(Event.date))

            return c.json({ events })
        } catch (e) {
            return c.json({ error: e }, 500)
        }

    });

