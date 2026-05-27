import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from '../models'

const client = createClient({
    url: process.env.NODE_ENV === 'production'
        ? process.env.TURSO_URL!
        : 'file:local.db',
    authToken: process.env.NODE_ENV === 'production'
        ? process.env.TURSO_TOKEN!
        : undefined,
})

export const db = drizzle(client, { schema })