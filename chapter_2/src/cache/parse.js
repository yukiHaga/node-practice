const cache = {}

function parseJSONAsyncWithCache(json, callback) {
  const cached = cache.json
  // if (cached) {
  //   callback(cached.err, cached.result)
  //   return
  // }
  if (cached) {
    // cacheがあっても非同期でコールバックを実行する
    // 非同期APIなら、キャッシュがあっても非同期で実行したほうが良い
    setTimeout(() => callback(cached.err, cached.result), 0)
    return
  }
  parseJSONAsync(json, (err, result) => {
    cache.json = {err, result}
    callback(err, result)
  })
}

// jsの関数定義はホイスティングされるから宣言の前に参照できる
// 関数式はホイスティングされない
// function parseJSONAsync(json, callback) {
//   setTimeout(() => {
//     try {
//       callback(null, JSON.parse(json))
//     } catch (err) {
//       callback(err)
//     }
//   }, 2000)
// }

// jsonを受け取ってPromiseインスタンスを返す関数
function parseJSONAsync(json) {
  // Promiseのコンストラクタを使って、Promiseインスタンスを作っている
  // Promiseコンストラクタは一つの関数をパラメータとする
  // (resolve, reject) => voidはプロミスの初期化に使用されるコールバック(使用されるって言ってる)。
  // このコールバックには2つの引数が渡されます：
  // resolveコールバックは、値または別のプロミスの結果でプロミスを解決するために使用されます。
  // resolveは(value: any) => voidのインターフェースを満たす任意のコールバック関数
  // rejectコールバックは、提供された理由またはエラーでプロミスを拒否するために使用されます。
  // rejectはreject: (reason?: any) => voidを満たす任意のコールバック関数
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // 処理結果を引数にresolve()を実行する(解決する)とPromiseインスタンスの状態が
        // fulfilledになる
        // 引数なしで実行しても良い。その場合、空の値を持ったPromiseになる
        const user = JSON.parse(json)
        resolve(user)
      } catch (err) {
        // エラーを引数にrejectを実行する(拒否する)とPromiseインスタンスの状態がrejectedになる
        // なしで実行しても良い引数なしで実行しても良い通常はErrorのインスタンスを引数に渡す
        reject(err)
      }
    }, 2000)
  })
}

module.exports = {
  parseJSONAsync,
  parseJSONAsyncWithCache,
}