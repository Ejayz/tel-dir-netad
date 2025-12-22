import { pool } from "@/libs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { get_uuid } from "@/components/TokenCheck";

interface Branch extends RowDataPacket{
    branch_id:number
}

export async function POST(request: NextRequest) {
  const { uuid, username, email, password, first_name, middle_name, last_name, branch_id } = await request.json();
  const connect = await pool.getConnection();
  await connect.beginTransaction();
  let hash_password = ""
  let query_values = [""];
  let query = "";
  let branchId = 0;
  const user_uuid = await get_uuid();
  if(uuid == user_uuid){
    return NextResponse.json({
        status:500,
        statusText:"User not Allowed"
    });
  }
  let i = 1;
  if(branch_id === undefined){
    const get_query = `SELECT branch_id FROM tbl_branch WHERE branch_name = "No Branch";`;
    const [get_rows,get_fields] = await connect.execute<Branch[]>(get_query);
    if(get_rows.length == 1){
      branchId = get_rows[0].branch_id;
    }else if(get_rows.length == 0){
      const set_query = `INSERT INTO tbl_branch (branch_name, created_at,updated_at,is_exist) VALUES ("No Branch", NOW(),NOW(),true);`;
      const [set_rows,set_fields] = await connect.execute<ResultSetHeader>(get_query);
      if(set_rows.affectedRows != 1){
        pool.releaseConnection(connect);
        return NextResponse.json({
        status: 500,
        statusText:
          "Somethin went wrong.Please contact Administrator. (Error Code: NBNF-CC).",
        });
      }
      if(!i){
        pool.releaseConnection(connect);
        return NextResponse.json({
        status: 500,
        statusText:
          "Somethin went wrong.Please contact Administrator. (Error Code: NBNF-SC).",
        });
      }
      i--;
    }else{
      pool.releaseConnection(connect);
        return NextResponse.json({
        status: 500,
        statusText:
          "Somethin went wrong.Please contact Administrator. (Error Code: NBMF).",
        });
    }
  }
  if(password){
     hash_password = await bcrypt.hash(password,11);
     query = 
     `UPDATE tbl_user
     SET username= ?, email=?, password=?, first_name=?, middle_name=?, last_name=?, branch_id=?, updated_at=NOW()
     WHERE uuid = ?;`;
     query_values = [username,email,hash_password,first_name,middle_name,last_name,branchId.toString(),uuid]
  }
  else{
    query = 
     `UPDATE tbl_user
     SET username= ?, email=?, first_name=?, middle_name=?, last_name=?, branch_id=?, updated_at=NOW()
     WHERE uuid = ?;`;
     query_values = [username,email,first_name,middle_name,last_name,branchId.toString(),uuid]
  }
  
  try {
    
    const [rows, fields] = await connect.execute<ResultSetHeader>(query,query_values);
    if (rows.affectedRows == 1) {
      connect.commit();
      return NextResponse.json({
        status: 200,
        statusText: "User details updated successfully.",
      });
    } else {
      return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while updating User. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    connect.rollback();
    return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while updating user. Contact Administrator",
      });
  } finally {
    pool.releaseConnection(connect);
  }
}
