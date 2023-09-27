const http = require("http")

// httpリクエストを送信するには、requestメソッドを使う
// requestメソッドは書き込みストリームであるhttp.ClientRequestオブジェクトを返す
// requestメソッドを実行しただけではHTTPリクエストは送信されず、http.Clientrequestオブジェクトのend()メソッドを実行した
// タイミングで送信される
// requestメソッドはデフォルトで、GETリクエストを送信する(第二引数でHTTPメソッドを指定できる)
http.request("http://localhost:3000/api/todos", res => {
  // このresは読み込みストリーム
  let responseData = ""
  console.log("statusCode", res.statusCode);
  // dataイベントからデータを受け取って、結果を蓄積して、
  res.on("data", chunk => responseData += chunk)
  // endイベントのタイミングで出力する
  res.on("end", () => console.log("responseData", JSON.parse(responseData)))
}).end()
// =>
// statusCode 200
// responseData [
//   { id: 1, title: 'ネーム', completed: false },
//   { id: 2, title: '下書き', completed: true }
// ]

// 2回目のリクエスト(405 Method Not Allowed)
http.request(
  "http://localhost:3000/api/todos",
  { method: "POST"},
  res => {
    // このresは読み込みストリーム
    let responseData = ""
    console.log("statusCode", res.statusCode);
  }
).end()
// => statusCode 405

// 3回目のリクエスト(404 Bad Request)
http.request(
  "http://localhost:3000/api/foo",
  res => {
    // このresは読み込みストリーム
    let responseData = ""
    console.log("statusCode", res.statusCode);
  }
).end()
// => statusCode 404