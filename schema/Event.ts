import {z} from "zod";

const idSchema = z.number().int().positive();

const EventSchema = z.object({
    id: idSchema,
    title: z.string().min(3).max(255),
    date: z.coerce.date(),
    description: z.string(),
    createdBy : idSchema,
    dateEnd: z.coerce.date().optional(),
})

export const createEvent = EventSchema.omit({id: true, createdBy: true});