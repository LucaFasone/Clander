import {Hono} from "hono";
import {getUser} from "../kinde";
import {db} from "../db";
import {EventOnCalendar, sharedEvents} from "../db/schema";
import {eq} from "drizzle-orm";

export const shared = new Hono()
    .get("/see:id", getUser,async (c) => {
        const id = Number(c.req.param('id'));
        const result = db.select().from(sharedEvents).where(eq(sharedEvents.id, id));
        return c.json({result});
    })
    .put("/update:id", getUser, async (c) => {
        const id = Number(c.req.param('id'));
        const {actions} = await c.req.json();
        const result = db.update(sharedEvents).set({actions}).where(eq(sharedEvents.id, id));
        return c.json({result});
    })
    .delete("/delete:id", getUser, async (c) => {
        const id = Number(c.req.param('id'));
        try{
            const {eventId} = await db.select({eventId:sharedEvents.eventId})
                .from(sharedEvents)
                .where(eq(sharedEvents.id, id))
                .then((r) => r[0]);
            await db.delete(EventOnCalendar).where(eq(EventOnCalendar.eventId, eventId));
            await db.delete(sharedEvents).where(eq(sharedEvents.id, id));
            return c.json({success:true},200);
        }catch (e){
            return c.json({error:e,success:false},500);

        }


    })