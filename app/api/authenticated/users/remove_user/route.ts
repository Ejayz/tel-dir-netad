import { pool } from "@/libs/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import { get_uuid } from "@/components/TokenCheck";

interface User extends RowDataPacket{
  username: string;
  branch_name:string;
  branch_id:number;
}


export async function POST(request: NextRequest) {
  const { uuid, branch_id } = await request.json();
  const connect = await pool.getConnection();
  const current_user = await get_uuid();

  
  try {
    await connect.beginTransaction();
    const test_query = 
    `SELECT username, tbl_user.branch_id, branch_name
    FROM tbl_user
    JOIN tbl_branch ON tbl_user.branch_id = tbl_branch.branch_id
    WHERE tbl_user.is_exist = true  AND branch_name = "No Branch";
    `;
    const [test_rows,test_fields] = await connect.execute<User[]>(test_query,[])

    if(test_rows.length){
        if(test_rows.length == 1 && test_rows[0].branch_id == branch_id){
            return NextResponse.json({
            status:501,
            statusText: "Cannot Delete last Admin. Please create other Admins first.",
            });
        }
      
    }
    if(current_user == uuid){
    return NextResponse.json({
    status:501,
    statusText: "Cannot delete self Account. Please contact other Admin",
    });
  }

    const query = 
    `DELETE FROM tbl_user
    WHERE uuid=?;`;

    const [rows, fields] = await connect.execute<ResultSetHeader>(query, [
      uuid,
    ]);
    if (rows.affectedRows == 1) {
      connect.commit();
      return NextResponse.json({
        status: 200,
        statusText: "User removed!",
      });
    } else {
      return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while Removing User. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    connect.rollback();
  } finally {
    pool.releaseConnection(connect);
  }
}
