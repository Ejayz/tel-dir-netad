import { pool } from "@/libs/db";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { branch_name } = await req.json();
  const connection = await pool.getConnection();

  try {
    const sql = "INSERT INTO tbl_branch (branch_name) VALUES (?); ";

    const [rows, field] = await connection.execute<ResultSetHeader>(sql, [
      branch_name,
    ]);

    if (rows.affectedRows === 0) {
      return NextResponse.json(
        { status: 500, statusText: "Please try again." }

      );
    } else {
      return NextResponse.json(
        { status: 200, statusText: "Branch added successfully" }

      );
    }
  } catch (_e) {
    if (_e instanceof Error) {
      if (_e.message.includes("Duplicate entry")) {
        return NextResponse.json(
          { status: 409, statusText: `${branch_name} already exist.` }

        );
      } else {
        return NextResponse.json(
          { status: 500, statusText: "Something went wrong." }

        );
      }
    } else {
      return NextResponse.json(
        { status: 500, statusText: "Something went wrong." }

      );
    }
  } finally {
    pool.releaseConnection(connection);
  }
}
