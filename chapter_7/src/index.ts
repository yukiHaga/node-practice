import express from "express";
import { router as todoRouter } from "./routes";

const app = express();

// JSONリクエストボディをパースするミドルウェアを適用させる
// このミドルウェアを使うと、req.bodyからパース結果をオブジェクトとして取得できる。
app.use(express.json());

app.use("/api/todos", todoRouter);

// 独自エラーハンドリングミドルウェアを追加
// エラーハンドリングミドルウェアは、その他の app.use() およびルート呼び出しの後で最後に定義する。
// app.use(errorHandlingMiddleware);

app.listen(3000);

// async function initDBConnection() {
//   const connection = await createConnection({
//     host: "db",
//     port: 3366,
//     user: "root",
//     password: "password",
//     database: "todo_development",
//   });

//   return connection;
// // }

// async function initDB() {
//   const mysql = require("mysql2/promise");

//   const connection = await mysql.createConnection({
//     host: "db",
//     user: "root",
//     password: "password",
//     database: "todo_development",
//     port: 3306,
//   });

//   const [rows, fields] = await connection.execute("SELECT * FROM `todos`");

//   return {
//     rows,
//     fields,
//   };
// }

// initDB()
//   .then((result) => console.log({ result }))
//   .catch(console.error);
