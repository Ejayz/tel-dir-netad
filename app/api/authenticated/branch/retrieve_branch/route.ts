import { pool } from "@/libs/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Location extends RowDataPacket {
  branch_id:number;
  branch_name:string;
  created_at: string;
  updated_at: string;
  is_exist: boolean;
}

export async function POST(req: NextRequest) {
  const { branch_id } = await req.json();
  const connection = await pool.getConnection();

  if (!branch_id) {
    return NextResponse.json(
      { status: 401, statusText: "Undefined id" },
      { status: 401, statusText: "Undefined id" }
    );
  }

  try {
    const query =
      "SELECT * FROM tbl_branch WHERE branch_id=? and is_exist=true";

    const [rows, fields] = await connection.execute<Location[]>(query, [
      branch_id,
    ]);
    if (rows.length == 0) {
      return NextResponse.json(
        {
          status: 404,
          statusText:
            "Data not found . It might have been modified already. Please refresh this page.",
        },
        {
          status: 404,
          statusText:
            "Data not found . It might have been modified already. Please refresh this page.",
        }
      );
    } else {
      return NextResponse.json(
        {
          status: 200,
          statusText: "Successfully retrieved the data. ",
          data: rows,
        },
        {
          status: 200,
          statusText: "Successfully retrieved the data. ",
        }
      );
    }
  } catch (e) {
    return NextResponse.json(
      {
        status: 500,
        statusText: "Something went wrong. Please try again.",
      },
      {
        status: 500,
        statusText: "Something went wrong. Please try again.",
      }
    );
  } finally {
    pool.releaseConnection(connection);
  }
}
