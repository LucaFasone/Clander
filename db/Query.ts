import {db} from "./index";
import {Calendar, User,Event} from "./schema";
import {eq, and} from "drizzle-orm";

export const getUserCalendarId = async (userId:string) =>{
    return await db.select({
        id: Calendar.id,
    }).from(Calendar).where(eq(Calendar.createBy, userId))
        .then((r) => r[0].id);
}
export const getUserIdByEmail = async (userEmail:string) =>{
    const userId = await db.select({id: User.id}).from(User).where(eq(User.email, userEmail)).then((r) => r[0].id);
    return userId

}
export const userHasEvent = async (userId:string, eventId:number) =>{
    const res =  await db.select().from(Event).where(and(eq(Event.id, eventId), eq(Event.createBy,userId))).then((r) => r.length == 1);
    return res

}