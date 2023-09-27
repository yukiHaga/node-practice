"use strict"

const express = require("express")
const app = express()
const http = require("http")
const { Server } = require("socket.io");
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

// === socket.ioの処理 ===


const todos = [
  { id: 1, title: "ネーム", status: "completed" },
  { id: 2, title: "下書き", status: "progress" },
]

const server = http.createServer(app);
// Serverインスタンスを生成
// 生成されたServerインスタンス(io)はEventEmitterであり、クライアントとのデータのやり取りはイベントを介して行われる
const io = new Server(server, {
  // socket.ioのcorsの設定
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"]
  }
})

// /todos名前空間で接続待機
// Socket.ioの名前空間の機能を使うと、クライアント接続してきた名前空間ごとに異なる処理を実装できる。
// 1つのクライアントが複数の名前空間にアクセスしても、リソースを節約するためサーバとの接続自体は1つのものを共有する作りになっている
// デフォルト(ioをそのまま使った場合)の名前空間は、「/」である。io.of()によって、任意の名前空間を指定して、その中でのクライアントとのやりとりを実装できる
const ioTodos = io.of("/todos")
// connectionイベントは、新しいクライアントからの接続に伴うイベント
// connectionイベントのペイロードとして与えられるSocketインスタンス(socket)を介して、個別のクライアントと通信ができる。
ioTodos.on("connection", socket => {
  console.log("connected");

  // statusは["completed", "progress"]のようにくる
  const { status } = socket.handshake.query;

  if (status) {
    const filteredTodos = todos.filter(todo => status.includes(todo.status))
    // 接続したクライアントにToDo一覧を送信
    // 任意のイベント名でsocketが表すクライアントにデータを送信
    socket.emit("todos", filteredTodos)
  } else {
    socket.emit("todos", todos)
  }

  // 接続したクライアントからの各種イベントに対応
  socket
    // todo作成
    .on("createTodo", todo => {
      if (typeof todo.title !== "string" || !(todo.title)) {
        return
      }

      const lastTodo = [...todos].pop();
      const newTodo = {
        id: lastTodo.id + 1,
        title: todo.title,
        status: todo.status,
      }
      todos.push(newTodo)

      // サーバ側でtodosが更新された際に、 瞬時にユーザーに変更を知らせる
      ioTodos.emit("todos", todos)
    })
    // todoのstatusをcompletedに更新
    .on("updateCompleted", (id) => {
      todos = todos.map(todo => todo.id === id ? { ...todo, status: "completed" } : todo)

      // サーバ側でtodosが更新された際に、 瞬時にユーザーに変更を知らせる
      ioTodos.emit("todos", todos)
    })
    // todo削除
    .on("deleteTodo", id => {
      todos = todos.filter(todo => todo.id !== id)
      // サーバ側で削除した際に、瞬時にユーザーに変更を知らせる
      ioTodos.emit("todos", todos)
    })
})

server.listen(8000)