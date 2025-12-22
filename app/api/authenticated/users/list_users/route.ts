import { pool } from "@/libs/db";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";
import { getpayloadValue } from "@/libs/Tools";
import { get_uuid } from "@/components/TokenCheck";

interface Users extends RowDataPacket {
  uuid:string;
  username: string;
  email:string;
  first_name:string;
  middle_name:string;
  last_name:string;
  branch_id: number;
  branch_name:string;
  current_user:boolean;
}
interface Local extends RowDataPacket{
  local: number;
}

export async function POST(req: NextRequest) {
  let { search, location_sort,branch_sort, page } = await req.json();
  let user_uuid = await get_uuid();
  let branch = '';
  let query_branch='';
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
    return NextResponse.json({
        status:500,
        statusText:"User not allowed! Please go back."
    })
  }

  let query_sort="ORDER BY ";
  if(location_sort || branch_sort){
    if(branch_sort)query_sort+= branch_sort + ", ";
    if(location_sort)query_sort+= location_sort + ", ";
  }else{
    query_sort += 'location_name ASC, '
  }
  query_sort = query_sort.slice(0,query_sort.length-2);
  const connection = await pool.getConnection();

  try {
    let query;
    let values = [];

    if (search) {
      query =
        `SELECT uuid, username, email, first_name, middle_name, last_name, tbl_user.branch_id, branch_name
         FROM tbl_user
         LEFT JOIN tbl_branch
         ON tbl_user.branch_id = tbl_branch.branch_id
         WHERE tbl_user.is_exist=true LIMIT ? , 11;`;
      values = [page * 10];
    } else {
      query =
        `SELECT uuid, username, email, first_name,  middle_name,last_name, tbl_user.branch_id, branch_name
         FROM tbl_user
         LEFT JOIN tbl_branch
         ON tbl_user.branch_id = tbl_branch.branch_id
         WHERE tbl_user.is_exist=true LIMIT ? , 11;`;
      values = [page * 10];
    }

    const [rows, fields] = await connection.query<Users[]>(query, values);
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
      for(let i=0; i<rows.length;i++){
        if(rows[i].uuid == user_uuid){
          rows[i].current_user = true;
        }else{
          rows[i].current_user = false;
        }
      }
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
