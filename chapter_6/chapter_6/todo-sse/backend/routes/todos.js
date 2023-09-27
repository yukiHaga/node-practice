"use strict";
const express = require("express");
const router = express.Router();

const todos = [
  { id: 1, title: "ネーム", status: "completed" },
  { id: 2, title: "下書き", status: "progress" },
];

// 「/api/todos/」にマッチする場合
// クエリパラメータで絞り込めるようにした
// todo一覧の取得
router
  .route("/")
  .get((req, res) => {
    const status = req.query.status;

    if (status) {
      const filterdTodos = todos.filter((todo) => todo.status === status);
      res.json(filterdTodos);
    } else {
      res.json(todos);
    }
  })
  .post((req, res) => {
    // POSTリクエストに対する処理を記述
    const { title } = req.body;
    if (!title || typeof title !== "string") {
      const err = new Error("title is required");
      err.statusCode = 400;
      throw err;
    }

    const lastTodo = [...todos].pop();
    const newTodo = {
      id: lastTodo.id + 1,
      title,
      status: "progress",
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
    // この関数を実行して、サーバーサイドで状態が変化したことクライアントサイドに通知する
    onUpdateTodos();
  });

// パスパラメータを書く場合は以下のように書く
router.route("/:id(\\d+)").get((req, res) => {
  // GETリクエストに対する処理を記述
  const todoId = Number(req.params.id);
  const todo = todos.find((todo) => todo.id === todoId);

  if (todo) {
    // てか、bodyをjson形式のエンコーディング処理とかいらんのね。すごい
    res.json(todo);
  } else {
    res.status(404);
    res.json();
  }
});

// 全クライアントに対するSSE送信関数を保持する配列
let sseSenders = [];
// SSEのIDを管理するための変数
let sseId = 1;
// todo一覧の取得(SSE)
router.route("/events").get((req, res) => {
  // タイムアウトを抑止
  // req.socket.setTimeout(0)を呼び出すと、ソケットのタイムアウトが無効化されます。
  // 通常、サーバーは一定の期間内にクライアントからリクエストが届かない場合に、ソケットをタイムアウトさせて接続を閉じることがあります。
  // しかし、req.socket.setTimeout(0)を呼び出すことで、このタイムアウトが無効になります。
  req.socket.setTimeout(0);

  // 1秒でタイムアウトする
  req.socket.setTimeout(1000);

  // Content-TypeがSSEであることを示す
  res.header("Content-Type", "text/event-stream");

  // クライアントにSSE(イベント)を送信する関数を作成して登録
  // メッセージを送っているのか
  // イベント名を指定していないので、イベントはmessageになる
  const sendEvent = (id, data) => res.write(`id: ${id}\ndata: ${data}\n\n`);

  sseSenders.push(sendEvent);

  // リクエスト発生した時点の状態を送信
  //これが初回リクエスト時のレスポンスか
  // dataプロパティをフロントでパースすれば良いのか。なるほどね。
  sendEvent(sseId, JSON.stringify(todos));
  // リクエストがクローズされたら、レスポンスを終了してSSE送信関数を配列から削除
  //reqは読み込みストリーム。リクエストがクローズされた時にこのリスナを発火させる
  req.on("close", () => {
    res.end();
    sseSenders = sseSenders.filter((_send) => _send !== sendEvent);
  });
});

// Todoの更新に伴い、全クライアントに対してSSEを送信する
function onUpdateTodos() {
  sseId++;
  // 差分だけ送るんじゃなくて、todo全部送るのか。
  // 効率悪そう
  const data = JSON.stringify(todos);
  // 全クライアントのsendEventを実行する
  sseSenders.forEach((sendEvent) => sendEvent(sseId, data));
}

module.exports = router;
