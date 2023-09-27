const http = require("http")

const todos = [
  { id: 1, title: "ネーム", completed: false },
  { id: 2, title: "下書き", completed: true },
]

// HTTPサーバーの初期化
// acceptとははcreateServerで抽象化されている(おそらく)
// 作成したサーバインスタンスに対して、listenメソッドを呼ぶ
// listenメソッドの戻り値はサーバーインスタンスそのものである
const server = http.createServer((req, res) => {
  //reqは読み込みストリーム、resは書き込みストリーム
  // リクエストのURLやHTTPメソッドに応じて適切なレスポンスを返す
  if (req.url === "/api/todos") {
    if (req.method === "GET") {
      // GETメソッドの場合、  全todoをJSON形式で返す
      res.setHeader("Content-Type", "application/json")
      // 書き込みストリームのendメソッドでレスポンスに書き込んでいる
      return res.end(JSON.stringify(todos))
    }
    // GET以外のHTTPメソッドはサポートしないため405(Method Not Allowed)
    res.statusCode = 405
  } else {
    // /api/todos以外のURLはないので、404(Not Found)
    res.statusCode = 404
  }
  res.end()
}).listen(3000) // 3000番ポートでリクエストを待機