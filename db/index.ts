import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise"
import dotenv from "dotenv";
dotenv.config();

//have fun with the db 
export const connection = await mysql.createConnection("mysql://root:scfVFhVOvPrZQsrAweeaViEOlaGeheQC@junction.proxy.rlwy.net:27873/railway");

export const db = drizzle(connection);
