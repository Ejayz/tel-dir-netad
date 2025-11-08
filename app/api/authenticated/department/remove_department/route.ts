import { pool } from "@/libs/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { startTurbopackTraceServer } from "next/dist/build/swc/generated-native";
import { NextRequest, NextResponse } from "next/server";

interface Group extends RowDataPacket{
  group_id: number,
  group_name: string,
}

export async function POST(request: NextRequest) {
  const { department_id,department_name } = await request.json();
  const connect = await pool.getConnection();
  console.log("remove_department API:",department_id,department_name);

  try {
    await connect.beginTransaction();
    const test_query = 
    `SELECT group_id, group_name
    FROM tbl_group
    WHERE department_id = ? AND is_exist = true
    ORDER BY group_name ASC;
    `;
    const [test_rows,test_fields] = await connect.execute<Group[]>(test_query,[
      department_id.toString(),
    ])
    if(test_rows.length){
      console.log(test_rows);
      return NextResponse.json({
        status:501,
        statusText: "Department have linked Group. Remove groups first.",
        data:test_rows,
        
      });
    }

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
