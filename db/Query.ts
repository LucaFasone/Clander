import {db} from "./index";
import {Calendar, User} from "./schema";
import {eq} from "drizzle-orm";

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