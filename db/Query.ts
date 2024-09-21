import { db } from "./index";
import { Calendar, User, Event, sharedEvents } from "./schema";
import { eq, and } from "drizzle-orm";

export const getUserCalendarId = async (userId: string) => {
    return await db.select({
        id: Calendar.id,
    }).from(Calendar).where(eq(Calendar.createBy, userId))
        .then((r) => r[0].id);
}
export const getUserIdByEmail = async (userEmail: string) => {
    const emailExists = await db.select().from(User).where(eq(User.email, userEmail)).then((r) => r.length == 1);
    if (!emailExists) {
        return null;
    }
    const userId = await db.select({ id: User.id }).from(User).where(eq(User.email, userEmail)).then((r) => r[0].id);
    return userId

}
export const userHasEvent = async (userId: string, eventId: number, action: string) => {
    let res: boolean = await db.select().from(Event).where(and(eq(Event.id, eventId), eq(Event.createBy, userId))).then((r) => r.length == 1);    
    if (!res) {
        const actions  = await db.select({ 'actions': sharedEvents.actions }).from(sharedEvents).where(and(eq(sharedEvents.eventId, eventId), eq(sharedEvents.sharedToUserId, userId))).then((r) => r[0]);
        if(!actions){
            return res
        }
        if (actions.actions === action || actions.actions == "all") {
            res = true
        }
    }
    return res

}
