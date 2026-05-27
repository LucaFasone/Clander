import { defineConfig } from 'drizzle-kit';
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
    schema: './db/schema.ts',
    out: './drizzle',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.NODE_ENV === 'production' ? process.env.TURSO_URL! : 'file:local.db',
        authToken: process.env.NODE_ENV === 'production' ? process.env.TURSO_TOKEN! : undefined,
    },
});
