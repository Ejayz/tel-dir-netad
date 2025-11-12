import { pool } from "@/libs/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Location extends RowDataPacket{
  location_id: number;
  location_name:string;
}

export async function POST(req: NextRequest) {
  const { branch_id, branch_name } = await req.json();
  const connection = await pool.getConnection();

  try{
    const test_query=`
    SELECT location_id,location_name
    FROM tbl_location
    WHERE branch_id = ?;`;
    const [test_rows, test_fields] = await connection.execute<Location[]>(test_query,[
      branch_id.toString(),
    ]);
    if(test_rows.length>0){
      return NextResponse.json({
        status:500,
        statusText: "Branch have existing Locations. Please remove them first."
    });
    }
  }catch (e){
    console.log(e);
    return NextResponse.json({
        status:500,
        statusText: "Something went wrong. Please contact Administrator."
    });
  }

  try {
    connection.beginTransaction();
    const query =
      `DELETE FROM tbl_branch
      WHERE branch_id=?;`;
    const [rows, fields] = await connection.execute<ResultSetHeader>(query, [
      branch_id,
    ]);
    if (rows.affectedRows === 1) {
      connection.commit();
      return NextResponse.json(
        { status: 200, statusText: `Successfully removed ${branch_name}` }
      );
    } else {
      connection.rollback();
      NextResponse.json(
        { status: 500, statusText: "Something went wrong. Please try again." }
      );
    }
  } catch (e) {
    connection.rollback();
    return NextResponse.json(
      {},
      { status: 500, statusText: "Something went wrong . Please try again." }
    );
  } finally {
    pool.releaseConnection(connection);
  }
}
