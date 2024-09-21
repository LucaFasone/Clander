import { insertEventSchema, insertCalendarSchema } from "./db/schema";
import {z} from "zod";

export const createEvent = insertEventSchema
export const createCalendar = insertCalendarSchema
export type formType = {
    date?: Date,
    dateEnd?: Date | undefined,
    currentPage?: number | null,
    currentMonth?: number,
    title?: string,
    description?: string,
    activeReminder?: boolean,
    eventId?: number,
    currentYear?: number,
}
export const shareEvent = z.object({
    permission:z.union([z.literal("all"), z.literal("view"),z.literal("modify"),z.literal("sharable")]),
    sharedToEmail: z.string().email().optional(),
})
