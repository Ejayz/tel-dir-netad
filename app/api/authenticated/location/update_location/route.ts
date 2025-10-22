import { pool } from "@/libs/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { location_id, location_name } = await req.json();
  const connection = await pool.getConnection();

  try {
    connection.beginTransaction();
    const query =
      "UPDATE tbl_location SET location_name=? WHERE location_id=? AND is_exist=1";
    const [rows, fields] = await connection.execute<ResultSetHeader>(query, [
      location_name,
      location_id,
    ]);
    if (rows.affectedRows === 1) {
      connection.commit();
      return NextResponse.json(
        { status: 200, statusText: "Successfully updated data." },
        { status: 200, statusText: "Successfully updated data." }
      );
    } else {
      connection.rollback();
      NextResponse.json(
        { status: 500, statusText: "Something went wrong. Please try again." },
        { status: 500, statusText: "Something went wrong. Please try again." }
      );
    }
  } catch (e) {
    console.log(e);
    connection.rollback();
    return NextResponse.json(
      {},
      { status: 500, statusText: "Something went wrong . Please try again." }
    );
  } finally {
    pool.releaseConnection(connection);
  }
}
