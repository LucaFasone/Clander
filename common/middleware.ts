import { createMiddleware } from "hono/factory"

type Env = {
    Variables: {
        authorized: boolean
    }
}
export const userHaveAccessToEvent = createMiddleware<Env>(async (c, next,) => {
    const EventId = c.req.query('eventId');
    console.log(EventId);
    
    return next()
}) 