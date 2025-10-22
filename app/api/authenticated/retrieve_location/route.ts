import { pool } from "@/libs/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Location extends RowDataPacket {
  location_id: number;
  location_name: string;
  created_at: string;
  updated_at: string;
  is_exist: boolean;
}

export async function POST(req: NextRequest) {
  const { location_id } = await req.json();
  const connection = await pool.getConnection();
  

  if(!location_id){
    return NextResponse.json({},{status:401,statusText:"Undefined id"})
  }

  try {
    const query =
      "SELECT * FROM tbl_location WHERE location_id=? and is_exist=true";

    const [rows, fields] = await connection.execute<Location[]>(query, [
      location_id,
    ]);
    if (rows.length == 0) {
      return NextResponse.json({
        status: 404,
        statusText:
          "Data not found . It might have been modified already. Please refresh this page.",
      });
    } else {
      return NextResponse.json({
        status: 200,
        statusText: "Successfully retrieved the data. ",
        data: rows,
      });
    }
  } catch (e) {
    console.log(e)
    return NextResponse.json({
      status: 500,
      statusText: "Something went wrong. Please try again.",
    });
  } finally {
    pool.releaseConnection(connection);
  }
}
