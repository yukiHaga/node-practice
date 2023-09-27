const http = require("http")

// サーバオブジェクト(EventEmitterインスタンス)の生成
// こいつが要はSubject(監視対象)。リスナがObserver(監視役)
// ObserverはあらかじめSubject(NodeではEventEmitterのインスタンス)に対して監視を行うための登録処理を行う
// Subjectはイベント発生のタイミングで登録済みのObserver(リスナ)に対して通知処理を実行する
// Subjectには複数のObserver(リスナ)を登録できる
const server = http.createServer()

// requestイベントのリスナ登録
server.on("request", (request, response) => {
  // レスポンスを返す
  response.writeHead(200, { "Content-Type": "text/plain"})
  response.write("Hello, World!")
  response.end()
})

// listening(リクエストの受付開始)イベントのリスナ登録
server.on("listening", () => {
  // ...
})

// errorイベントのリスナ登録
server.on("error", err => {
  // ...
})

// close(リクエストの受付終了)イベントのリスナ登録
server.on("close", () => {
  // ...
})

// サーバーの起動
server.listen(8000)


