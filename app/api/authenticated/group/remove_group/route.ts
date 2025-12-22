import { pool } from "@/libs/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { startTurbopackTraceServer } from "next/dist/build/swc/generated-native";
import { NextRequest, NextResponse } from "next/server";

interface Local extends RowDataPacket{
  local: number,
}

export async function POST(request: NextRequest) {
  const { group_id } = await request.json();
  const connect = await pool.getConnection();

  try {
    await connect.beginTransaction();
    const test_query = 
    `SELECT local
    FROM tbl_local
    WHERE group_id = ? AND is_exist = true
    ORDER BY local ASC;
    `;
    const [test_rows,test_fields] = await connect.execute<Local[]>(test_query,[
      group_id.toString(),
    ])
    if(test_rows.length){
      console.log(test_rows);
      return NextResponse.json({
        status:501,
        statusText: "Group have linked Locals. Remove Locals first.",
        data:test_rows,
        
      });
    }

    const query = 
    `DELETE FROM tbl_group 
    WHERE group_id=?;`;

    const [rows, fields] = await connect.execute<ResultSetHeader>(query, [
      group_id.toString(),
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
