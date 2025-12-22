import { pool } from "@/libs/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { local } = await request.json();
  const connect = await pool.getConnection();

  try {
    await connect.beginTransaction();

    const query = 
    `DELETE FROM tbl_local 
    WHERE local=?;`;

    const [rows, fields] = await connect.execute<ResultSetHeader>(query, [
      local.toString(),
    ]);
    if (rows.affectedRows == 1) {
      connect.commit();
      return NextResponse.json({
        status: 200,
        statusText: "Local removed!",
      });
    } else {
      return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while Removing Local. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    connect.rollback();
  } finally {
    pool.releaseConnection(connect);
  }
}
