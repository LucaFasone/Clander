import { insertEventSchema, insertCalendarSchema } from "./db/schema";
import { z } from "zod";
export const createEvent = insertEventSchema;
export const createCalendar = insertCalendarSchema;
export const shareEvent = z.object({
    permission: z.union([z.literal("all"), z.literal("view"), z.literal("modify"), z.literal("sharable")]),
    sharedToEmail: z.string().email().optional(),
});
