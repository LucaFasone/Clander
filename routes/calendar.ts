import { Hono } from "hono";
import {Event, insertEventSchema, Calendar, EventOnCalendar, sharedEvents, insertSharedEventSchema} from "../db/schema";
import {getUser} from "../kinde";
import { zValidator } from "@hono/zod-validator";
import {db} from "../db";
import {and, eq} from "drizzle-orm";
import {getUserCalendarId, getUserIdByEmail} from "../db/Query";


export const calendar = new Hono()
    .get("/", getUser,  async(c) => {
        const calendarId = await getUserCalendarId(c.var.user.id)
        const events = await db.select({
            id: Event.id,
            title: Event.title,
            date: Event.date,
            description: Event.description,
            dateEnd: Event.dateEnd,
            createdBy: Event.createBy,
        }).from(Event).innerJoin(EventOnCalendar, eq(EventOnCalendar.calendarId, calendarId)).then((r) => r);
       return c.json({events});
    })
    .post("/event",getUser, async (c) => {
        const {title,date,description,dateEnd} = await c.req.json()
        const dateParsed = new Date(date)
        const calendarId = await getUserCalendarId(c.var.user.id)
        try {
            const validate = insertEventSchema.parse({
                title:title,
                date:dateParsed,
                description:description,
                dateEnd: dateEnd,
                createBy: c.var.user.id,
            });
            const id = await db.insert(Event).values(validate)
            const eventId = id[0].insertId;
            await db.insert(EventOnCalendar).values({
                calendarId: calendarId,
                eventId: eventId,
            })
            return c.json({success:true},200);
        }catch (e) {
            return c.json({error:e, success:false},500)
        }
    })
    .post("/sharedTo/:email",getUser, async (c) => {
        try {
            const email = c.req.param('email');
            const {eventId} = await c.req.json()
            const isEventOwnByCurrentUser = await db.select().from(Event).where(and(eq(Event.id, eventId), eq(Event.createBy, c.var.user.id)))
            if(isEventOwnByCurrentUser.length === 0){
                return c.json({error: "Unauthorized"},401)
            }
            const calendarId = await getUserCalendarId(await getUserIdByEmail(email))
            const validate = insertSharedEventSchema.parse({
                eventId: eventId,
                sharedToUserId: await getUserIdByEmail(email),
                sharedFromUserId: c.var.user.id,
                actions: "view",
            })
            await db.insert(sharedEvents).values(validate)
            await db.insert(EventOnCalendar).values({
                calendarId: calendarId,
                eventId: eventId,
            })

            return c.json({success:true},200)
        }catch (e){
            return c.json({error:e, success:false},500)
        }
    })

