import { pool } from "@/libs/db";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Location extends RowDataPacket {
  location_id: number;
  location_name: string;
  created_at: string;
  updated_at: string;
  is_exist: boolean;
}

export async function POST(req: NextRequest) {
  let { orderby, search, column_name, page } = await req.json();

  const connection = await pool.getConnection();

  try {
    let query;

    if (search || column_name) {
      query =
        `SELECT * FROM tbl_location WHERE location_name LIKE ? AND is_exist=true ORDER BY ${column_name} ${orderby} LIMIT ? , 10`;
    } else {
      query =
        `SELECT * FROM tbl_location WHERE location_name LIKE ? AND is_exist=true ORDER BY  ${column_name} ${orderby}  LIMIT ? , 10`;
      orderby = "ASC";
      (search = ""), (column_name = "location_id");
      page = 0;
    }

    let offset_item = page * 10;

    console.log(
      `SELECT * FROM tbl_location WHERE location_name LIKE '${`%${search}%`}' ORDER BY ${column_name} ${orderby}  LIMIT ${offset_item} , 10 `
    );

    console.log(offset_item);

    const [rows, fields] = await connection.query<Location[]>(query, [
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
    console.log(e);

    pool.releaseConnection(connection);
    return NextResponse.json({
      status: 500,
      statusText: `Something went wrong. ${e}`,
    });
  } finally {
    pool.releaseConnection(connection);
  }
}
