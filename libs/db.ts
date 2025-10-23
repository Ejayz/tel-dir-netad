import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise"



export const pool=await mysql.createPool({
  user: process.env.DB_USER,
  database:process.env.DB_NAME,
  host:process.env.HOST,
  password:process.env.PASS
 })

try {
  const connection = await pool.getConnection();
  console.log('Got connection from pool!');
  connection.release();
} catch (err) {
  console.error('Error connecting to the database:', err);
}
