import {z} from "zod";

const idSchema = z.number().int().positive();

const Event = z.object({
    id: idSchema,
    title: z.string().min(3).max(255),
    date: z.coerce.date(),
    description: z.string(),
    createdBy : idSchema
})