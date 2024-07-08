import {insertEventSchema, insertCalendarSchema} from "./db/schema";

export const createEvent = insertEventSchema.omit({
    createAt: true,
})
export const createCalendar = insertCalendarSchema.omit({
    createAt: true,
})