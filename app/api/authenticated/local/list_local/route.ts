import { pool } from "@/libs/db";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";
import { stringify } from "node:querystring";
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
  let { orderby, search, local_name, group_name, department_name, page } = await req.json();
  let branch = '';
  const token = req.cookies.get('token')?.value || "";

  try {
    // console.log(token);
    // const decodedH = decodeJwt(token.value.toString()).payload;
    if (token != '') {
      const payload = await jsonwebtoken.decode(token);
      branch = getpayloadValue(JSON.stringify(payload), 'branch_id')
      // console.log("list_local API:",branch);
    }
  }
  catch (e) {
    console.log(e);
  }

  const connection = await pool.getConnection();

  try {
    //Preparation of query. insert conditions for query here
    let query;
    if(branch === '0'){
      if (search || local_name) {
        query =
          `SELECT tbl_local.local, tbl_group.group_name , tbl_department.department_name, tbl_location.location_name, tbl_branch.branch_name
          FROM tbl_local 
          LEFT JOIN tbl_group ON tbl_local.group_id=tbl_group.group_id 
          LEFT JOIN tbl_department ON tbl_group.department_id=tbl_department.department_id 
          LEFT JOIN tbl_location ON tbl_local.location_id=tbl_location.location_id 
          LEFT JOIN tbl_branch ON tbl_location.branch_id=tbl_branch.branch_id 
          WHERE local LIKE ? AND tbl_local.is_exist=true ORDER BY ${local_name} ${orderby} LIMIT ? , 10`;
        // `SELECT * FROM tbl_local WHERE local LIKE ? AND is_exist=true ORDER BY ${local_name} ${orderby} LIMIT ? , 10`;
      } else {
        query =
          `SELECT tbl_local.local, tbl_group.group_name , tbl_department.department_name, tbl_location.location_name, tbl_branch.branch_name
          FROM tbl_local 
          LEFT JOIN tbl_group ON tbl_local.group_id=tbl_group.group_id 
          LEFT JOIN tbl_department ON tbl_group.department_id=tbl_department.department_id 
          LEFT JOIN tbl_location ON tbl_local.location_id=tbl_location.location_id 
          LEFT JOIN tbl_branch ON tbl_location.branch_id=tbl_branch.branch_id 
          WHERE local LIKE ? AND tbl_local.is_exist=true ORDER BY ${local_name} ${orderby} LIMIT ? , 10`;
        // `SELECT * FROM tbl_local WHERE local LIKE ? AND is_exist=true ORDER BY  ${local_name} ${orderby}  LIMIT ? , 10`;
        orderby = "ASC";
        (search = ""), (local_name = "local");
        page = 0;
      }

    }
    else{
      if (search || local_name) {
        query =
          `SELECT tbl_local.local, tbl_group.group_name , tbl_department.department_name, tbl_location.location_name, tbl_branch.branch_name
          FROM tbl_local 
          LEFT JOIN tbl_group ON tbl_local.group_id=tbl_group.group_id 
          LEFT JOIN tbl_department ON tbl_group.department_id=tbl_department.department_id 
          LEFT JOIN tbl_location ON tbl_local.location_id=tbl_location.location_id 
          LEFT JOIN tbl_branch ON tbl_location.branch_id=tbl_branch.branch_id 
          WHERE local LIKE ? AND tbl_local.is_exist=true AND tbl_branch.branch_id = ${branch} ORDER BY ${local_name} ${orderby} LIMIT ? , 10`;
        // `SELECT * FROM tbl_local WHERE local LIKE ? AND is_exist=true ORDER BY ${local_name} ${orderby} LIMIT ? , 10`;
      } else {
        query =
          `SELECT tbl_local.local, tbl_group.group_name , tbl_department.department_name, tbl_location.location_name, tbl_branch.branch_name
          FROM tbl_local 
          LEFT JOIN tbl_group ON tbl_local.group_id=tbl_group.group_id 
          LEFT JOIN tbl_department ON tbl_group.department_id=tbl_department.department_id 
          LEFT JOIN tbl_location ON tbl_local.location_id=tbl_location.location_id 
          LEFT JOIN tbl_branch ON tbl_location.branch_id=tbl_branch.branch_id 
          WHERE local LIKE ? AND tbl_local.is_exist=true AND tbl_branch.branch_id = ${branch} ORDER BY ${local_name} ${orderby} LIMIT ? , 10`;
        // `SELECT * FROM tbl_local WHERE local LIKE ? AND is_exist=true ORDER BY  ${local_name} ${orderby}  LIMIT ? , 10`;
        orderby = "ASC";
        (search = ""), (local_name = "local");
        page = 0;
      }

    }
      

    let offset_item = page * 10;

    console.log(
      `SELECT * FROM tbl_local INNER JOIN tbl_group WHERE local LIKE '${`%${search}%`}' ORDER BY ${local_name} ${orderby}  LIMIT ${offset_item} , 10 `
    );

    // console.log(offset_item);
    //Executuion of Query
    const [rows, fields] = await connection.query<Local[]>(query, [
      `%${search}%`,
      offset_item,
    ]);
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
