import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise"
import dotenv from "dotenv";
dotenv.config();

export const connection = await mysql.createConnection({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD!,
    multipleStatements: true,
});

export const db = drizzle(connection);
