"use strict"

const express = require("express")
const app = express()
const { logMiddleware, errorHandlingMiddleware, throwErrorMiddleware, corsMiddleware } = require("./middlewares")
const cookieParser = require("cookie-parser")

app.use(logMiddleware)

// フォームで送られるリクエストボディをパースするミドルウェアを適用させる
app.use(express.urlencoded({ extended: true }))

// JSONリクエストボディをパースするミドルウェアを適用させる
// このミドルウェアを使うと、req.bodyからパース結果をオブジェクトとして取得できる。
app.use(express.json())

// ファイルを送信すファイルを送信するためのミドルウェア
app.use(express.static("public"))

// プロキシサーバが付与する各ヘッダをリクエストオブジェクトで参照するためには、trust proxyを有効にする必要がある。
// app.enable()関数は、ブーリアン値すなわちnameをtrueに設定するために使用される。
// 基本的には、app.set(name, true)またはapp.set(name, false)の省略形である。
//つまり、app.enable(name)関数を使えば、システムのExpress.js設定にブール値を設定することができる。
app.enable("trust proxy")

// HTTPリクエストで送られてくるクッキーを取得するミドルウェア
app.use(cookieParser())

// corsのミドルウェアを追加
app.use(corsMiddleware)

// ルーティングテーブルみたいなやな
// /api/todos以下のパスに対するリクエストのハンドリングを
// ./routes/todosモジュールに以上
// todosはコントローラみたいな感じやな
app.use("/api/todos", require("./routes/todos"))
app.use("/form-handling", require("./routes/form-handling"))
app.use("/sign_up", require("./routes/sign_up"))
app.use("/mypage", require("./routes/mypage"))

// /errors以下の全てのパス、HTTPメソッドのリクエストに対して、ミドルウェアを適用する
app.use("/errors", throwErrorMiddleware)

// 独自エラーハンドリングミドルウェアを追加
// エラーハンドリングミドルウェアは、その他の app.use() およびルート呼び出しの後で最後に定義する。
app.use(errorHandlingMiddleware)

app.listen(8000)