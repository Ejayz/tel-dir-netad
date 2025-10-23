import { pool } from "@/libs/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

 export async function POST(req: NextRequest) {
  const { group_name } = await req.json();

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const query = "INSERT INTO tbl_group (group_name) VALUES (?)";

    const [rows, fields] = await connection.execute<ResultSetHeader>(query, [
      group_name,
    ]);

    if (rows.affectedRows !== 1) {
        connection.rollback()
      return NextResponse.json(
        {},
        { status: 500, statusText: "Something went wrong while adding group." }
      );
    } else {
        connection.commit()
      return NextResponse.json(
        {},
        { status: 200, statusText: "New group was added." }
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
