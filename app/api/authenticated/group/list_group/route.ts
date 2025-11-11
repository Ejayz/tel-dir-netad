import { pool } from "@/libs/db";
import { group } from "console";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { LoadComponentsReturnType } from "next/dist/server/load-components";
import { NextRequest, NextResponse } from "next/server";


interface Group extends RowDataPacket {
  group_id: number;
  group_name: string;
  department_id: number;
  created_at: string;
  updated_at: string;
  is_exist: boolean;
  local_list: object;
}
interface Local extends RowDataPacket {
  local: number;
  location_id: number;
  location_list: object;
}

export async function POST(req: NextRequest) {
  let { search, group_sort, department_sort, page } = await req.json();

  const connection = await pool.getConnection();
  let query_options;
  let query_sort = 'ORDER BY ';
  if (group_sort || department_sort) {
    if (department_sort) query_sort += department_sort + ', ';
    if (group_sort) query_sort += group_sort + ', ';
  }
  else {
    query_sort += `group_name ASC, `;
  }
  query_sort = query_sort.slice(0,query_sort.length-2);
  try {
    let query;

    if (search) {
      query =
        `SELECT group_id, group_name, department_name, tbl_group.department_id  
        FROM tbl_group 
        LEFT JOIN tbl_department ON tbl_group.department_id = tbl_department.department_id
        WHERE group_name LIKE ? AND tbl_group.is_exist=true ${query_sort} LIMIT 10 OFFSET ?`;
      query_options = [
        `%${search}%`,
        page * 10,
      ];
    } else {
      query =
        `SELECT group_id, group_name, department_name, tbl_group.department_id  
        FROM tbl_group 
        LEFT JOIN tbl_department ON tbl_group.department_id = tbl_department.department_id
        WHERE tbl_group.is_exist=true ${query_sort} LIMIT 10 OFFSET ?`;
      query_options = [
        page * 10,
      ];
    }

    // console.log(query);
    // console.log(offset_item);
    const [rows, fields] = await connection.query<Group[]>(query, query_options);
    const l_query = `
        SELECT local, location_id
        FROM tbl_local
        WHERE group_id = ? AND is_exist = true
        ORDER BY local ASC;`;
    for (let i = 0; i < rows.length; i++) {
      const [l_rows, l_fields] = await connection.query<Local[]>(l_query, rows[i].group_id.toString());
      rows[i].local_list = l_rows;
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
