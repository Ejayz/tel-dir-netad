import { pool } from "@/libs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

interface Branch extends RowDataPacket{
    branch_id:number
}

export async function POST(request: NextRequest) {
  const { username, email, password, first_name, middle_name, last_name, branch } = await request.json();
  const connect = await pool.getConnection();
  await connect.beginTransaction();
  let hash_password = await bcrypt.hash(password,11);
  
  let branch_id = '0';
  if(!branch || branch == "No Branch"){
    try{
      const b_query = `
      SELECT branch_id 
      FROM tbl_branch
      WHERE branch_name = 'No Branch';`;
      const[b_rows,b_fields] = await connect.execute<Branch[]>(b_query)
      if(b_rows.length==1){
        branch_id = b_rows[0].branch_id.toString();
      }
      else if(b_rows.length == 0){
        const b_query = `
        INSERT INTO tbl_branch (branch_name, created_at, updated_at, is_exist)
        VALUES (No Branch,NOW(),NOW(),TRUE);`;
        const[b_rows,b_fields] = await connect.execute<Branch[]>(b_query);
      }else{

      }
    }catch(e){
      console.log(e);
      return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while adding location. Please contact Administrator",
      });
    }
  }
    
  try {
    const query = 
    `INSERT INTO tbl_user
    (uuid,username, email, password, first_name, middle_name, last_name, branch_id, created_at, updated_at, is_exist) 
    VALUES (UUID(),? ,? ,?, ?, ?, ?, ?, NOW(), NOW(), true)`;
    const [rows, fields] = await connect.execute<ResultSetHeader>(query, [
      username,
      email,
      hash_password,
      first_name,
      middle_name,
      last_name,
      branch_id
    ]);
    if (rows.affectedRows == 1) {
      connect.commit();
      return NextResponse.json({
        status: 200,
        statusText: "User created successfully.",
      });
    } else {
      return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while creating User. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    connect.rollback();
    return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while creating User. Contact Administrator",
      });
  } finally {
    pool.releaseConnection(connect);
  }
}
