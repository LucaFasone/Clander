import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
export const connection = await mysql.createConnection("mysql://root:AbTvVTcdgympVljHkdxtHcGJaEfABLqM@mysql.railway.internal:3306/railway");
export const db = drizzle(connection);
