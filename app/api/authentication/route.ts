import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { pool } from "@/libs/db";
import { JWTGenerator } from "@/libs/Tools";
import * as dotenv from "dotenv";
import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
dotenv.config();

interface User extends RowDataPacket {
  uuid: number,
  username: string,
  password: string,
  email: string,
  first_name: string,
  middle_name: String,
  last_name: string,
  created_at: string
}


export async function POST(req: NextRequest) {
  console.log(req)
  const { username, password } = await req.json();

  console.log()
  console.log(await bcrypt.hashSync(password, bcrypt.genSaltSync()))
  console.log(username, password)

  if (username == "" || password == "") {
    return NextResponse.json(
      {
        code: 401,
        message: "Please check your username or password.",
      },
      {
        status: 401,
        statusText: "Please check your username or password.",
      }
    );
  }

  const prep = "SELECT * FROM tbl_user WHERE username=?  and is_exist=true"
  const [rows, fields] = await pool.execute<User[]>(prep, [username])

  let validateAccount = false;

  try {
    validateAccount = bcrypt.compareSync(
      password,
      rows[0].password
    );

  }
  catch{
    console.log("Authentication Failed!")
    console.log(fields);
  }
  



  if (validateAccount) {
    const authenticationKey = await JWTGenerator(
      {
        uuid: rows[0]?.uuid,
        username: rows[0]?.username,
        email: rows[0]?.email,
        first_name: rows[0]?.first_name,
        middle_name: rows[0]?.middle_name,
        last_name: rows[0]?.last_name,
        created_at: rows[0]?.created_at,
      },
      process.env.KEY || "",
      { expiresIn: "24h" }
    );

    const response = NextResponse.json({
      status: 200,
      statusText: `Welcome ${username}.`,
    })
    response.cookies.set("token", authenticationKey, {
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60,
    });
    return response
  } else {
    return NextResponse.json({
      status: 401,
      statusText: "Please check your username or password",
    });
  }
}
