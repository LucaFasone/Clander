import { createMiddleware } from "hono/factory";
export const userHaveAccessToEvent = createMiddleware(async (c, next) => {
    const EventId = c.req.query('eventId');
    console.log(EventId);
    return next();
});
