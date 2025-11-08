import { pool } from "@/libs/db";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { LoadComponentsReturnType } from "next/dist/server/load-components";
import { NextRequest, NextResponse } from "next/server";

interface Department extends RowDataPacket {
  department_id: number;
  department_name: string;
  department_head: string;
  created_at: string;
  updated_at: string;
  is_exist: boolean;
  group_list: object;
}
interface Group extends RowDataPacket{
  group_id: number;
  group_name: string;
  local_list: object;
}
interface Local extends RowDataPacket{
  local: number;
  location_id: number;
  location_list: object;
}

export async function POST(req: NextRequest) {
  let { search, department_sort, page } = await req.json();

  const connection = await pool.getConnection();
  let query_options;
  let query_sort = '';
  if (department_sort) {
    query_sort = `ORDER BY ${department_sort}`;
  }
  else{
    query_sort = `Order BY department_name ASC`
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

    // console.log(query);
    // console.log(offset_item);
    const [rows, fields] = await connection.query<Department[]>(query, query_options);
    console.log(rows);
    const g_query = `
    SELECT group_id, group_name
    FROM tbl_group
    WHERE department_id = ? AND is_exist = true
    ORDER BY group_name ASC;`;
    for(let i=0;i<rows.length;i++){
      const [g_rows, g_fields] = await connection.query<Group[]>(g_query,[rows[i].department_id.toString()]);
      if(g_rows.length){
        const l_query = `
        SELECT local, location_id
        FROM tbl_local
        WHERE group_id = ? AND is_exist = true
        ORDER BY local ASC;`;
        for(let j=0;j<g_rows.length;j++){
          const [l_rows, l_fields] = await connection.query<Local[]>(l_query,[g_rows[j].group_id.toString()]);
          g_rows[j].local_list = l_rows;
        }
        
      }
      rows[i].group_list = g_rows;
    }
    // console.dir(rows,{depth:null});
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
