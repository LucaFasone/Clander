import { Hono } from "hono";
import { getUser } from "../kinde";
import { userHaveAccessToEvent } from "../common/middleware"; // implement as middleware ???
import { userHasEvent } from "../db/Query";
import { db } from "../db";
import { Event, insertEventSchema } from "../db/schema";
import { eq } from "drizzle-orm";

export const modify = new Hono()
    .put("/", getUser, async (c) => {
        const { eventId, date, dateEnd, title, description, activeReminder } = await c.req.json();
        console.log(eventId, date, dateEnd, title, description);

        if (!(await userHasEvent(c.var.user.id, eventId))) {
            return c.json({ error: "Unauthorized" }, 401)
        }
        const validate = insertEventSchema.parse({
            title,
            date: new Date(date).toISOString(),
            description,
            dateEnd: dateEnd ? new Date(dateEnd).toISOString() : null,
            createBy: c.var.user.id,
            activeReminder,
        });
        const result = await db.update(Event).set(validate).where(eq(Event.id, eventId)).then((r) => r[0]);
        const modifiedEvent = await db.select().from(Event).where(eq(Event.id, result.insertId)).then((r) => r[0]);
        return c.json({modifiedEvent})
    })