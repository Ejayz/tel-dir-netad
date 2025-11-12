import { pool } from "@/libs/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Branch extends RowDataPacket{
  branch_id:number;
}
interface Test extends RowDataPacket{
  location_name:string;
  branch_name:string;
}
export async function POST(request: NextRequest) {
  const { location, branch } = await request.json();
  const connect = await pool.getConnection();
  await connect.beginTransaction();
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
  else{
    branch_id = branch.toString();
  }

  try{
   const test_query = `
   SELECT location_name, branch_name
   FROM tbl_location
   LEFT JOIN tbl_branch ON tbl_location.branch_id = tbl_branch.branch_id
   WHERE location_name = ? AND tbl_location.branch_id = ? AND tbl_location.is_exist=true;`; 
   const [test_rows, test_fields] = await connect.execute<Test[]>(test_query,
   [location,
    branch_id]
   );
   if(test_rows.length>0){
    const text_response =`Sorry, "${location}" already exist in "${test_rows[0].branch_name}". Please try again.`;
    return NextResponse.json({
      status:501,
      statusText: text_response
    })
   }
  }catch(e){
    console.log(e);
    return NextResponse.json({
      status:50,
      statusText: "Something went wrong. Please contact Adminstrator"
    })
  }

  try {
    const query = "INSERT INTO tbl_location (location_name,branch_id) VALUES (?,?)";

    const [rows, fields] = await connect.execute<ResultSetHeader>(query, [
      location,
      branch_id
    ]);
    if (rows.affectedRows == 1) {
      connect.commit();
      return NextResponse.json({
        status: 200,
        statusText: "Location created successfully.",
      });
    } else {
      return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while adding location. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    connect.rollback();
  } finally {
    pool.releaseConnection(connect);
  }
}
