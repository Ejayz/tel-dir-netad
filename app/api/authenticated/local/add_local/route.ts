import { pool } from "@/libs/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { location } = await request.json();
  const connect = await pool.getConnection();
  await connect.beginTransaction();

  try {
    const query = "INSERT INTO tbl_local (local) values (?)";

    const [rows, fields] = await connect.execute<ResultSetHeader>(query, [
      location,
    ]);
    if (rows.affectedRows == 1) {
      connect.commit();
      return NextResponse.json({
        status: 200,
        statusText: "Local created successfully.",
      });
    } else {
      return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while adding location. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    connect.rollback();
  } finally {
    pool.releaseConnection(connect);
  }
}
