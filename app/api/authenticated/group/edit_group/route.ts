import { pool } from "@/libs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Group extends RowDataPacket {
  local: number;
  group_id: number;
  department_id: number
  created_at: string;
  updated_at: string;
  is_exist: boolean;
}


export async function POST(request: NextRequest) {
  const { group_id, group_name, department_id } = await request.json();
  const connect = await pool.getConnection();
  

  try {
    await connect.beginTransaction();
    // const test_query = 
    // `SELECT *
    // FROM tbl_group
    // WHERE group_name=? AND is_exist = true;
    // `;

    // const [test_rows, test_fields] = await connect.execute<Group[]>(test_query, [
    //   group_name,
    // ]);
    // if (test_rows.length > 0) {
    //   return NextResponse.json({
    //     status: 501,
    //     statusText:
    //       "group already exists. Please try again.",
    //   });
    // }
    const q_departmentId = department_id.toString();
    

    const query = 
    `UPDATE tbl_group
    SET group_name = ?, department_id= ?, updated_at = NOW() 
    WHERE group_id = ?;`;

    const [rows, fields] = await connect.execute<ResultSetHeader>(query, [
      group_name,
      q_departmentId,
      group_id
    ]);
    if (rows.affectedRows == 1) {
      connect.commit();
      return NextResponse.json({
        status: 200,
        statusText: "Group Updated successfully.",
      });
    } else {
      return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while creating Group. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    connect.rollback();
    return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while Editing Group. Contact Administrator",
      });
  } finally {
    pool.releaseConnection(connect);
  }
}
