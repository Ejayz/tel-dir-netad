import { pool } from "@/libs/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Group extends RowDataPacket{
    group_id: number;
    group_name: string;
}

interface Department extends RowDataPacket{
    department_id: number;
}

export async function POST(req:NextRequest){
    const {department_id } = await req.json();
    const connect = await pool.getConnection();
    await connect.beginTransaction();
    let q_filter = "";
    let q_val = [""];

    if(!department_id || department_id == "No Department"){
        let nd_value = '';
        const get_query = `SELECT department_id FROM tbl_department WHERE department_name = 'No Department';`;
        try{
            const [get_rows, get_fields] = await connect.execute<Department[]>(get_query,[])
            if(get_rows.length == 1){
                nd_value = get_rows[0].department_id.toString();
            } else{
                console.log(`"No Department" was not found!`);
                return NextResponse.json({
                    status: 500,
                    statusText: "Server Error, pleace contact Administrator."
                });
            }
            q_filter+="AND department_id = ?"
            q_val=[nd_value];
        } catch(e){return NextResponse.json({status:500,statusText:"Server Error, pleace contact Administrator."})}

    }
    else if(department_id == "All"){

    }else{
        q_filter+="AND department_id = ?"
        q_val = [department_id.toString()];
    }
   
    
    const query =`
    SELECT group_id, group_name 
    FROM tbl_group
    WHERE is_exist = true ${q_filter}
    ORDER BY group_name ASC;`;

    try{
        
        const [rows,fields] = await connect.execute<Group[]>(query,q_val);
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