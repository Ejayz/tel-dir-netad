import { pool } from "@/libs/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Department extends RowDataPacket{
    department_id: number;
    department_name: string;
}

export async function POST(req:NextRequest){
    const { } = await req.json();
    
    const connect = await pool.getConnection();
    const query =`
    SELECT department_id, department_name 
    FROM tbl_department
    WHERE is_exist = true
    ORDER BY department_name ASC;`;

    try{
        await connect.beginTransaction();
        const [rows,fields] = await connect.execute<Department[]>(query,[]);
        // console.log("API Response",rows);
        if(rows.length == 0){
            return NextResponse.json ({
                status:404,
                statusText: "No Data",
                data: rows
            });
        }else{
            return NextResponse.json({
                status:200,
                statusText: "Query success",
                data: rows
            })
        }
    }
    catch(e){
        console.log(e);
        return NextResponse.json({
            status: 500,
            statusText: "Something went wrong while fetching data"
        });
        connect.rollback();
    }
    finally{
        pool.releaseConnection(connect);
    }

}