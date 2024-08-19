import {insertEventSchema, insertCalendarSchema} from "./db/schema";

export const createEvent = insertEventSchema
export const createCalendar = insertCalendarSchema
export type formType = {
    date: Date,
    dateEnd: Date | undefined,
    currentPage: number | null,
    currentMonth: number,
    title?: string,
    description?: string,
    activeReminder?: boolean,
    eventId?: number,
}