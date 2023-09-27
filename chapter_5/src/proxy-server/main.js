const http = require("http")
const url = require("url")

http.createServer((clientReq, clientRes) => {
  // リクエストが来た際の処理を書く
  const url = new URL(clientReq.url, `http://${clientReq.headers.host}`);
  // =>
  // {
  //   url: URL {
  //     href: 'http://localhost:8080/apis',
  //     origin: 'http://localhost:8080',
  //     protocol: 'http:',
  //     username: '',
  //     password: '',
  //     host: 'localhost:8080',
  //     hostname: 'localhost',
  //     port: '8080',
  //     pathname: '/apis',
  //     search: '',
  //     searchParams: URLSearchParams {},
  //     hash: ''
  //   }
  // }

  const options = {
    host: "localhost",
    port: 3000,
    path: url.pathname + url.search,
    method: url.method,
    // HTTPサーバが元のHTTPクライアントからのHTTPリクエスト情報を知ることができるように、
    // プロキシはHTTPリクエストを中継する際に、次に挙げる各ヘッダをリクエストに付与する
    headers: {
      // 元のHTTPリクエストのHostヘッダ
      "X-Forwarded-Host": clientReq.headers.host,
      // 元のHTTPリクエストのプロトコル
      // expressだとreq.protocolでリクエストのプロトコルを参照できる
      "X-Forwarded-Proto": url.protocol,
      // 元のHTTPリクエストのアクセス元IPアドレス
      "X-Forwarded-For": clientReq.socket.remoteAddress

    },
  }

  // requestメソッドを実行しただけではHTTPリクエストは送信されず、http.Clientrequestオブジェクトのend()メソッドを実行した
  // タイミングで送信される
  const serverReq = http.request(options, serverRes => {
    // レスポンス後の処理を書く

    // ステータスコードとヘッダーを設定する
    clientRes.writeHead(serverRes.statusCode, serverRes.headers)

    // サーバーからのレスポンスのデータを、クライアントへのレスポンスに直接転送する
    serverRes.pipe(clientRes)
  })

  // ここ何やっているのかよくわからんなあ
  clientReq.pipe(serverReq)
}).listen(8000)
