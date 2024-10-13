import { defineConfig } from 'drizzle-kit';
import dotenv from "dotenv";
dotenv.config();
export default defineConfig({
    schema: './db/schema.ts',
    out: './drizzle',
    dialect: 'mysql',
    dbCredentials: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
    },
});
