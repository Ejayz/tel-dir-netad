import { pool } from "@/libs/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

 export async function POST(req: NextRequest) {
  const { department_id } = await req.json();

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const query = `SELECT * FROM tbl_group 
        WHERE department_id = ?
        ORDER BY group_name ASC;`;

    const [rows, fields] = await connection.execute<ResultSetHeader>(query, [
      department_id,
    ]);

    if (rows.affectedRows !== 1) {
        connection.rollback()
      return NextResponse.json(
        {},
        { status: 500, statusText: "Something went wrong while fetching group list" }
      );
    } else {
        connection.commit()
      return NextResponse.json(
        {},
        { status: 200, statusText: "Fetch complete" }
      );
    }
  } catch (e) {
    console.log(e);
    connection.rollback();
    return NextResponse.json(
      {},
      { status: 500, statusText: "Something went wrong." }
    );
  } finally {
    connection.release();
  }
}
