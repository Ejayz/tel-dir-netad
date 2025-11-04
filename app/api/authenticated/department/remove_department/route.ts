import { pool } from "@/libs/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { department_id,department_name } = await request.json();
  const connect = await pool.getConnection();
  console.log("remove_department API:",department_id,department_name);

  try {
    await connect.beginTransaction();
    const query = 
    `DELETE FROM tbl_department 
    WHERE department_id=?;`;

    const [rows, fields] = await connect.execute<ResultSetHeader>(query, [
      department_id.toString(),
    ]);
    if (rows.affectedRows == 1) {
      connect.commit();
      return NextResponse.json({
        status: 200,
        statusText: "Department removed!",
      });
    } else {
      return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while Removing Department. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    connect.rollback();
  } finally {
    pool.releaseConnection(connect);
  }
}
