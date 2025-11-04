import { pool } from "@/libs/db";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Department extends RowDataPacket {
  department_id: number;
  department_name: string;
  department_head: string;
  created_at: string;
  updated_at: string;
  is_exist: boolean;
}

export async function POST(req: NextRequest) {
  let { search, department_sort, page } = await req.json();

  const connection = await pool.getConnection();
  let query_options;
  let query_sort = '';
  if (department_sort) {
    query_sort = `ORDER BY ${department_sort}`;
  }

  try {
    let query;

    if (search) {
      query =
        `SELECT * FROM tbl_department WHERE department_name LIKE ? AND is_exist=true ${query_sort} LIMIT 10 OFFSET ?`;
      query_options = [
        `%${search}%`,
        page * 10,
      ];
      } else {
      query =
        `SELECT * FROM tbl_department WHERE is_exist=true ${query_sort} LIMIT 10 OFFSET ?`;
      query_options = [
        page * 10,
      ];
      }

    console.log(query);

    // console.log(offset_item);

    const [rows, fields] = await connection.query<Department[]>(query, query_options);
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
