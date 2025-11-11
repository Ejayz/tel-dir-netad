import { pool } from "@/libs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Group extends RowDataPacket {
  group_id: number;
  group_name: string;
  group_head: string;
  created_at: string;
  updated_at: string;
  is_exist: boolean;
}


export async function POST(request: NextRequest) {
  const { group_name, department_name } = await request.json();
  const connect = await pool.getConnection();
  

  try {
    await connect.beginTransaction();
    let department_id = "";
    if(!department_name || department_name =="No Department"){
      const d_query = `
      SELECT department_id
      FROM tbl_department
      WHERE department_name = 'No Department'`;
      const [d_rows, d_fields] = await connect.execute<Group[]>(d_query, []);
      if(d_rows.length == 1){
        department_id = d_rows[0].department_id.toString();
      }
      else{
        const setD_query = `INSERT INTO tbl_department
        (department_name, created_at, updated_at, is_exist)
        VALUES (No Department, NOW(), NOW(), false)`;
        const [d_rows, d_fields] = await connect.execute<Group[]>(setD_query, []);
      }
    }
    else{
      department_id = department_name.toString();
    }

    const test_query = 
    `SELECT *
    FROM tbl_group 
    WHERE group_name=? AND department_id =? AND is_exist = true;
    `;

    const [test_rows, test_fields] = await connect.execute<Group[]>(test_query, [
      group_name,
      department_id,
    ]);
    if (test_rows.length > 0) {
      return NextResponse.json({
        status: 501,
        statusText:
          "group already exists. Please try again.",
      });
    }
    
    

    const query = 
    `INSERT INTO tbl_group 
    (group_name, department_id, created_at, updated_at, is_exist) 
    VALUES (? , ? , NOW(), NOW(), true)`;




    const [rows, fields] = await connect.execute<ResultSetHeader>(query, [
      group_name,
      department_id,
    ]);
    if (rows.affectedRows == 1) {
      connect.commit();
      return NextResponse.json({
        status: 200,
        statusText: "Group created successfully.",
      });
    } else {
      return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while creating Group. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    connect.rollback();
    return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while creating Group. Contact Administrator",
      });
  } finally {
    pool.releaseConnection(connect);
  }
}
