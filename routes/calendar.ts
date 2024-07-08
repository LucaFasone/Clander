import { Hono } from "hono";
import { createEvent } from "../db/schema/Event";
import {getUser} from "../kinde";
import { zValidator } from "@hono/zod-validator";

export const calendar = new Hono()
    .get("/", (c) => {
        //get all events rom db
       return  c.json({ message: "Hello World"});
    })
    .post("/",getUser ,zValidator("json", createEvent),async (c) => {
        const data = c.req.valid('json');
        const user = c.var.user
        const validate = createEvent.parse({
            ...data,
            createdBy: user.id
        });

    });
