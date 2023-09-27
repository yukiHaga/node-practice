import { createPool } from "mysql2/promise";

import { OkPacket, ProcedureCallPacket, ResultSetHeader, RowDataPacket } from "mysql2";

export type Rows =
  | OkPacket
  | RowDataPacket[]
  | ResultSetHeader[]
  | RowDataPacket[][]
  | OkPacket[]
  | ProcedureCallPacket;

export async function initDBConnection() {
  const pool = await createPool({
    host: "db",
    port: 3306,
    user: "root",
    password: "password",
    database: "todo_development",
  });

  return pool;
}
