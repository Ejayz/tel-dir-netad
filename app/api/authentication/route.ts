import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { getPool } from "@/libs/db";
import { JWTGenerator } from "@/libs/Tools";
import * as dotenv from "dotenv";

dotenv.config();

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const pool = await getPool();
  const conn = await pool.connect();

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

  const query = await conn.query(
    "SELECT * FROM tel_dir.tbl_users WHERE username=$1  and is_exist=true",
    [username]
  );

  const validateAccount = bcrypt.compareSync(
    password,
    query.rows[0]?.password || ""
  );

  if (validateAccount) {
    const authenticationKey = await JWTGenerator(
      {
        uuid: query.rows[0]?.uuid,
        username: query.rows[0]?.username,
        email: query.rows[0]?.email,
        first_name: query.rows[0]?.first_name,
        middle_name: query.rows[0]?.middle_name,
        last_name: query.rows[0]?.last_name,
        created_at: query.rows[0]?.created_at,
      },
      process.env.KEY || "",
      { expiresIn: "24h" }
    );

    return NextResponse.json({
      status: 200,
      statusText: `Welcome ${username}.`,
    }).cookies.set("token", authenticationKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60,
    });

    
  } else {
    return NextResponse.json({
      status: 401,
      statusText: "Please check your username or password",
    });
  }
}
