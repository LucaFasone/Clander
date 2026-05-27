import { Hono } from "hono";
import { getUser } from "../middleware/auth";
import { db } from "../db";
import { Calendar, User } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";
import { setCookie, deleteCookie } from "hono/cookie";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "Lax" as const,
};

export const authRoute = new Hono()
    .post("/login", async (c) => {
        try {
            const body = await c.req.json();
            const { email, password } = body;
            
            if (!email || !password) {
                return c.json({ error: "Email and password are required" }, 400);
            }

            const users = await db.select().from(User).where(eq(User.email, email));
            if (users.length === 0) {
                return c.json({ error: "Invalid credentials" }, 401);
            }
            
            const user = users[0];
            const isValid = await bcrypt.compare(password, user.password);
            
            if (!isValid) {
                return c.json({ error: "Invalid credentials" }, 401);
            }

            const token = await sign({ id: user.id }, process.env.JWT_SECRET || "super-secret-key-change-me", "HS256");
            setCookie(c, "auth_token", token, cookieOptions);

            return c.json({ success: true, user: { id: user.id, email: user.email, name: user.name, surname: user.surname } });
        } catch (e) {
            console.log(e);
            return c.json({ error: "Internal Server Error" }, 500);
        }
    })
    .post("/register", async (c) => {
        try {
            const body = await c.req.json();
            const { email, password, name, surname } = body;

            if (!email || !password || !name) {
                return c.json({ error: "Missing required fields" }, 400);
            }

            const existingUser = await db.select().from(User).where(eq(User.email, email));
            if (existingUser.length > 0) {
                return c.json({ error: "Email already in use" }, 400);
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const id = crypto.randomUUID();

            await db.insert(User).values({
                id,
                email,
                name,
                surname: surname || "",
                password: hashedPassword,
            });

            await db.insert(Calendar).values({
                createBy: id,
            });

            const token = await sign({ id }, process.env.JWT_SECRET || "super-secret-key-change-me", "HS256");
            setCookie(c, "auth_token", token, cookieOptions);

            return c.json({ success: true, user: { id, email, name, surname } });
        } catch (e) {
            console.log(e);
            return c.json({ error: "Internal Server Error" }, 500);
        }
    })
    .post("/logout", async (c) => {
        deleteCookie(c, "auth_token", cookieOptions);
        return c.json({ success: true });
    })
    .get("/me", getUser, async (c) => {
        const user = c.var.user;
        return c.json({ user });
    });