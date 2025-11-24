import { pool } from "@/libs/db";
import { groupCollapsed } from "console";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Group extends RowDataPacket{
  group_id:number;
}
interface Location extends RowDataPacket{
  location_id:number;
}

export async function POST(request: NextRequest) {
  const { local_old,local_new, group_id, location_id } = await request.json();
  const connect = await pool.getConnection();
  await connect.beginTransaction();
  let q_value = [""]
  
  try{
    let g_id = group_id;
    let l_id = location_id;

    let loopCount = 0;
    while(!g_id || g_id=="No Group"){
      const get_query = 'SELECT group_id FROM tbl_group WHERE group_name = "No Group";'
      const [get_rows, get_fields] = await connect.execute<Group[]>(get_query,[]);
      if(get_rows.length == 1){
        g_id = get_rows[0].group_id.toString();
        break;
      }
      else{
        const post_query = `INSERT INTO tbl_group (group_name, department_id,created_at,updated_at,is_exist) 
        VALUE ("No Group",(SELECT department_id FROM tbl_department WHERE department_name = "No Department"),NOW(),NOW(),false);`;
        const [post_rows, post_fields] = await connect.execute<ResultSetHeader[]>(post_query,[]);
        if(loopCount){
          return NextResponse.json({
          status:500,
          statusText: "Something went wrong. Please contact Adminstrator.(Code:NGNF)"
        });
        }
        loopCount++;
      }
    }
    loopCount = 0;
    while(!l_id || l_id=="No Location"){
      const get_query = 'SELECT location_id FROM tbl_location WHERE location_name = "No Location";'
      const [get_rows, get_fields] = await connect.execute<Location[]>(get_query,[]);
      if(get_rows.length == 1){
        l_id = get_rows[0].location_id.toString();
        break;
      }
      else{
        const post_query = `INSERT INTO tbl_location (location_name, branch_id,created_at,updated_at,is_exist) 
        VALUE ("No Location",(SELECT branch_id FROM tbl_branch WHERE branch_name = "No Branch"),NOW(),NOW(),false);`;
        const [post_rows, post_fields] = await connect.execute<ResultSetHeader[]>(post_query,[]);
        if(loopCount){
          return NextResponse.json({
          status:500,
          statusText: "Something went wrong. Please contact Adminstrator.(Code:NLNF)"
        });
        }
        loopCount++;
      }
    }
    q_value = [local_new,g_id,l_id,local_old]
  }catch(e){
    console.log(e);
    return NextResponse.json({
        status:500,
        statusText: "Something went wrong. Please contact Adminstrator.(Code:TError)"
      });
  }



  try {
    
    const query = `
    UPDATE tbl_local
    SET local = ? , group_id = ?, location_id = ?
    WHERE local=?`;

    const [rows, fields] = await connect.execute<ResultSetHeader>(query,q_value);
    if (rows.affectedRows == 1) {
      connect.commit();
      return NextResponse.json({
        status: 200,
        statusText: "Local created successfully.",
      });
    } else {
      return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while adding local. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    connect.rollback();
  } finally {
    pool.releaseConnection(connect);
  }
}
