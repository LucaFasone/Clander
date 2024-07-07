import { Hono } from "hono";
import { createEvent } from "../schema/Event";

export const calendar = new Hono()
    .get("/", (c) => {
       return  c.json({ message: "Hello World"});
    })