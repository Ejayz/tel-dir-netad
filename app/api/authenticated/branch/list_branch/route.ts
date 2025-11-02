import { pool } from "@/libs/db";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Local extends RowDataPacket {
  branch_name: number;
  created_at: string;
  updated_at: string;
  is_exist: boolean;
}

export async function POST(req: NextRequest) {
  let { orderby, search, column_name, page } = await req.json();

  const connection = await pool.getConnection();

  try {
    //Preparation of query. insert conditions for query here
    let query;

    if (search || column_name) {
      query = `SELECT * FROM tbl_branch WHERE is_exist=true AND branch_name LIKE ? AND branch_name != "No Branch" ORDER BY ${column_name} ${orderby} LIMIT ? , 10`;
      // `SELECT * FROM tbl_local WHERE local LIKE ? AND is_exist=true ORDER BY ${local_name} ${orderby} LIMIT ? , 10`;
    } else {
      query = `SELECT * FROM tbl_branch WHERE is_exist=true AND branch_name LIKE ? ORDER BY  ${column_name} ${orderby}  LIMIT ? , 10`;
      // `SELECT * FROM tbl_local WHERE local LIKE ? AND is_exist=true ORDER BY  ${local_name} ${orderby}  LIMIT ? , 10`;
      orderby = "ASC";
      (search = ""), (column_name = "branch_id");
      page = 0;
    }

    let offset_item = page * 10;

    //Executuion of Query
    const [rows, fields] = await connection.query<Local[]>(query, [
      `%${search}%`,
      offset_item,
    ]);
    if (search == "" && rows.length == 0) {
      return NextResponse.json({
        status: 404,
        statusText: `No more data to display.`,
      });
    } else if (rows.length == 0) {
      return NextResponse.json({
        status: 404,
        statusText: `No data found related to ${search}.Please try again.`,
      });
    } else {
      return NextResponse.json({
        status: 200,
        statusText: "Retrieved data successfully",
        data: rows,
      });
    }
  } catch (e) {
    pool.releaseConnection(connection);
    return NextResponse.json({
      status: 500,
      statusText: `Something went wrong. ${e}`,
    });
  } finally {
    pool.releaseConnection(connection);
  }
}
