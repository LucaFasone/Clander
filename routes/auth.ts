import { Hono } from "hono";

export const authRoute = new Hono()
.get("/login",(c) => {
    return c.json({ message: "Login" });
});