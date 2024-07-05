import { Hono } from "hono";

export const calendar = new Hono()
    .get("/", (c) => {
       return  c.json({ message: "Hello World"});
    })