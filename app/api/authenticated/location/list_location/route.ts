import { pool } from "@/libs/db";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken from "jsonwebtoken";
import { getpayloadValue } from "@/libs/Tools";

interface Location extends RowDataPacket {
  location_id: number;
  location_name: string;
  created_at: string;
  updated_at: string;
  is_exist: boolean;
  local_list: Local[];
}
interface Local extends RowDataPacket{
  local: number;
}

export async function POST(req: NextRequest) {
  let { search, location_sort,branch_sort, page } = await req.json();

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
    query_branch = 'AND tbl_branch.branch_id=' + branch +' '
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
        `SELECT location_id, location_name, branch_name
         FROM tbl_location 
         LEFT JOIN tbl_branch
         ON tbl_location.branch_id = tbl_branch.branch_id
         WHERE location_name LIKE ? AND tbl_location.is_exist=true ${query_branch} ${query_sort} LIMIT ? , 11;`;
      values = [`%${search}%`,page * 10];
    } else {
      query =
        `SELECT location_id, location_name, tbl_location.branch_id, branch_name
         FROM tbl_location 
         LEFT JOIN tbl_branch
         ON tbl_location.branch_id = tbl_branch.branch_id
         WHERE tbl_location.is_exist=true ${query_branch} ${query_sort} LIMIT ? , 11;`;
      values = [page * 10];
    }

    const [rows, fields] = await connection.query<Location[]>(query, values);
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
        const l_query=`SELECT local FROM tbl_local WHERE is_exist = true AND location_id =?;`;
        const [l_rows, l_fields] = await connection.query<Local[]>(l_query,[rows[i].location_id]);
        rows[i].local_list = l_rows;
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
