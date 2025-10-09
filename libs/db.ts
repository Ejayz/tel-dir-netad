import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise"



export const pool=await mysql.createConnection({
  user: process.env.DB_USER,
  database:process.env.DB_NAME,
  host:process.env.HOST,
  password:process.env.PASS
 })


