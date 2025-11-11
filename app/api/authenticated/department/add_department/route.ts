import { pool } from "@/libs/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Department extends RowDataPacket {
  department_id: number;
  department_name: string;
  department_head: string;
  created_at: string;
  updated_at: string;
  is_exist: boolean;
}


export async function POST(request: NextRequest) {
  const { department_name } = await request.json();
  const connect = await pool.getConnection();
  

  try {
    await connect.beginTransaction();
    const test_query = 
    `SELECT *
    FROM tbl_department 
    WHERE department_name=? AND is_exist = true;
    `;

    const [test_rows, test_fields] = await connect.execute<Department[]>(test_query, [
      department_name,
    ]);
    if (test_rows.length > 0) {
      return NextResponse.json({
        status: 501,
        statusText:
          "Department already exists. Please try again.",
      });
    }

    const query = 
    `INSERT INTO tbl_department 
    (department_name, department_head, created_at, updated_at, is_exist) 
    VALUES (? , 'default', NOW(), NOW(), true)`;




    const [rows, fields] = await connect.execute<ResultSetHeader>(query, [
      department_name,
    ]);
    if (rows.affectedRows == 1) {
      connect.commit();
      return NextResponse.json({
        status: 200,
        statusText: "Department created successfully.",
      });
    } else {
      return NextResponse.json({
        status: 500,
        statusText:
          "Something went wrong while adding Department. Please try again.",
      });
    }
  } catch (error) {
    console.log(error);
    connect.rollback();
  } finally {
    pool.releaseConnection(connect);
  }
}
