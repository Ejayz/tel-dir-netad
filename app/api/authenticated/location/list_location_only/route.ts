import { pool } from "@/libs/db";
import { RowDataPacket } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

interface Location extends RowDataPacket{
    location_id: number;
    location_name: string;
}

interface Branch extends RowDataPacket{
    branch_id: number;
}

export async function POST(req:NextRequest){
    const {branch_id } = await req.json();
    const connect = await pool.getConnection();
    await connect.beginTransaction();
    let q_filter = "";
    let q_val = [""];

    if(!branch_id || branch_id == "No Branch"){
        let nb_value = '';
        const get_query = `SELECT branch_id FROM tbl_branch WHERE branch_name = 'No Branch';`;
        try{
            const [get_rows, get_fields] = await connect.execute<Branch[]>(get_query,[])
            if(get_rows.length == 1){
                nb_value = get_rows[0].branch_id.toString();
            } else{
                console.log(`"No Branch" was not found!`);
                return NextResponse.json({
                    status: 500,
                    statusText: "Server Error, pleace contact Administrator."
                });
            }
            q_filter+="AND branch_id = ?"
            q_val=[nb_value];
        } catch(e){return NextResponse.json({status:500,statusText:"Server Error, pleace contact Administrator."})}

    }
    else if(branch_id == "All"){

    }else{
        q_filter+="AND branch_id = ?"
        q_val = [branch_id.toString()];
    }
   
    
    const query =`
    SELECT location_id, location_name 
    FROM tbl_location
    WHERE is_exist = true ${q_filter}
    ORDER BY location_name ASC;`;

    try{
        
        const [rows,fields] = await connect.execute<Location[]>(query,q_val);
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