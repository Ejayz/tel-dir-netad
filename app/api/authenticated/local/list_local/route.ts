import { pool } from "@/libs/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";
import { getpayloadValue } from "@/libs/Tools";


interface Local extends RowDataPacket {
  local: number;
  created_at: string;
  updated_at: string;
  is_exist: boolean;
  group: string;
  department: string;
  location: string;
  branch: string;
}

export async function POST(req: NextRequest) {
  let { search, local_sort, group_sort, department_sort, location_sort, branch_sort, page } = await req.json();

  const connection = await pool.getConnection();
  let order_string = "";
  const offset_item = page * 10;
  if (local_sort || group_sort || department_sort || location_sort || branch_sort) {
    if (branch_sort) { order_string += ", " + branch_sort };
    if (department_sort) { order_string += ", " + department_sort };
    if (location_sort) { order_string += ", " + location_sort };
    if (group_sort) { order_string += ", " + group_sort };
    if (local_sort){order_string += ", " + local_sort};
    order_string = order_string.slice(2);
  }else {
    order_string += "local ASC";
  }
  let querry_branch = '';
  let branch = '';
  const token = req.cookies.get('token')?.value || "";
  try {
    if (token) {
      const payload = await jsonwebtoken.decode(token);
      branch = getpayloadValue(JSON.stringify(payload), 'branch_id')
    }
  }
  catch (e) {
    console.log(e);
  }

  if (branch != '0'){
    querry_branch = 'AND tbl_branch.branch_id=' + branch +' '
  }
  

  try {
    //Preparation of query. insert conditions for query here
    let query;
    let query_options;

    if (search) {
      query =
        `SELECT tbl_local.local, tbl_group.group_name , tbl_department.department_name, tbl_location.location_name, tbl_branch.branch_name
        FROM tbl_local 
        LEFT JOIN tbl_group ON tbl_local.group_id=tbl_group.group_id 
        LEFT JOIN tbl_department ON tbl_group.department_id=tbl_department.department_id 
        LEFT JOIN tbl_location ON tbl_local.location_id=tbl_location.location_id 
        LEFT JOIN tbl_branch ON tbl_location.branch_id=tbl_branch.branch_id 
        WHERE tbl_local.is_exist=true ${querry_branch} AND (local LIKE ? OR group_name LIKE ? OR department_name LIKE ? OR location_name LIKE ? OR branch_name LIKE ?) 
        ORDER BY ${order_string} LIMIT 10 OFFSET ?`;
      query_options = [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        offset_item,
      ];
    } else {
      query =
        `SELECT tbl_local.local, tbl_group.group_name , tbl_department.department_name, tbl_location.location_name, tbl_branch.branch_name
        FROM tbl_local 
        LEFT JOIN tbl_group ON tbl_local.group_id=tbl_group.group_id 
        LEFT JOIN tbl_department ON tbl_group.department_id=tbl_department.department_id 
        LEFT JOIN tbl_location ON tbl_local.location_id=tbl_location.location_id 
        LEFT JOIN tbl_branch ON tbl_location.branch_id=tbl_branch.branch_id 
        WHERE tbl_local.is_exist=true ${querry_branch} 
        ORDER BY ${order_string} LIMIT 10 OFFSET ?`;
      query_options = offset_item;
    }



    console.log("list_directory API: ", query);

    // console.log(offset_item);
    //Executuion of Query

    const [rows, fields] = await connection.query<Local[]>(query, query_options);
    // console.log(rows);
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
