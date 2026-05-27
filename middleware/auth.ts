import { getCookie } from "hono/cookie";
import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import { db } from "../db";
import { User } from "../db/schema";
import { eq } from "drizzle-orm";

declare module 'hono' {
  interface ContextVariableMap {
    user: {
      id: string;
      email: string;
      given_name: string;
      family_name: string | null;
    };
    timezone: string;
  }
}

export const getUser = createMiddleware(async (c, next) => {
  try {
    const token = getCookie(c, "auth_token");
    if (!token) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const decoded = await verify(token, process.env.JWT_SECRET || "super-secret-key-change-me", "HS256");
    if (!decoded || !decoded.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const userResult = await db.select().from(User).where(eq(User.id, decoded.id as string));
    if (userResult.length === 0) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const user = {
      id: userResult[0].id,
      email: userResult[0].email,
      given_name: userResult[0].name,
      family_name: userResult[0].surname
    };

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    c.set("user", user);
    c.set("timezone", timezone);
    await next();
  } catch (error) {
    console.log("Auth Error:", error);
    return c.json({ error: "Unauthorized" }, 401);
  }
});
