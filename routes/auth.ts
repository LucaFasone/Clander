import { Hono } from "hono";
import { getUser, kindeClient, sessionManager } from "../kinde";
import { db } from "../db";
import { Calendar, insertCalendarSchema, inserUserSchema, User } from "../db/schema";
import { eq } from "drizzle-orm";

export const authRoute = new Hono()
    .get("/login", async (c) => {
        const loginUrl = await kindeClient.login(sessionManager(c))
        return c.redirect(loginUrl.toString());
    }).get("/register", async (c) => {
        const registerUrl = await kindeClient.register(sessionManager(c))
        return c.redirect(registerUrl.toString());
    }).get("/callback", async (c) => {
        try {
            const url = new URL(c.req.url)
            await kindeClient.handleRedirectToApp(sessionManager(c), url);
            return c.redirect("/api/createCalendar");
        } catch (e) {
            console.log(e)
        }

    }).get("/logout", async (c) => {
        await kindeClient.logout(sessionManager(c))
        return c.redirect("https://clander.netlify.app");
    }).get("/me", getUser, async (c) => {
        console.log('user');
        
        const user = c.var.user;
        return c.json({ user })
    })
    .get("/createCalendar", getUser, async (c) => {
        const user = c.var.user;
        if (user === undefined) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        const checkIfUser = await db.select().from(Calendar).where(eq(Calendar.createBy, user.id))
        if (checkIfUser.length === 0) {
            const createUserRowValidate = inserUserSchema.parse({
                id: user.id,
                email: user.email,
                name: user.given_name,
                surname: user.family_name,
            });

            await db.insert(User).values(createUserRowValidate)
            await db.insert(Calendar).values({
                createBy: user.id,
            })
        }
        return c.redirect("https://clander.netlify.app")
    });