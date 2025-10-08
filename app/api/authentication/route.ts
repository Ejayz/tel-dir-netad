import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { getPool } from "@/libs/db";
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
    return NextResponse.json({
      status: 200,
      statusText: `Welcome ${username}.`,
    });
  } else {
    return NextResponse.json({
      status: 401,
      statusText: "Please check your username or password",
    });
  }
}
