// const parse = require("./cache/parse")

// parse.parseJSONAsyncWithCache(
//   '{"message": "Hello", "to": "World"}',
//   (err, result) => {
//     console.log("１回目の結果", err, result);
//     // コールバックの中で2回目を実行
//     parse.parseJSONAsyncWithCache(
//       '{"message": "Hello", "to": "World"}',
//       (err, result) => {
//         console.log("2回目の結果", err, result);
//       }
//     )
//     console.log("2回目の呼び出し完了");
//   }
// )
// console.log("1回目の呼び出し完了");





// const callbackHell = require("./callback-hell/sample")

// callbackHell.fetchUserById("25", (err, result) => {
//   console.log("非同期API: fetchUserByIdが完了しました");
//   // fetchUserByIdという非同期APIの後に実行したい非同期APIがあるなら、
//   // 非同期APIの後に実行されるコールバックの中に非同期APIを書く

//   // エラーハンドリング
//   if (err) {
//     console.error(err)
//     // コールバックをここで終わらせる
//     return
//   }

//   callbackHell.parseUser(result, (err, result) => {
//     console.log("非同期API: parseUserが完了しました");

//     // エラーハンドリング
//     if (err) {
//       console.error(err)
//       // コールバックをここで終わらせる
//       return
//     }

//     callbackHell.formateName(result, (err, result) => {
//       console.log("非同期API: formateNameが完了しました");

//       // エラーハンドリング
//       if (err) {
//         console.error(err)
//         // コールバックをここで終わらせる
//         return
//       }

//       console.log(result);
//     })
//   })
// })

// console.log("プログラムスタート");


// const parse = require("./cache/parse")

// const toBeFulfilled = parse.parseJSONAsync('{"name": "yuki"}').then(user => { throw new Error("エラーです")});
// const toBeRejected = parse.parseJSONAsync("error json").then(user => user.name);
// console.log("========Promise生成直後==========");
// console.log(toBeFulfilled);
// console.log(toBeRejected);
// setTimeout(() => {
//   console.log("========2秒後==========");
//   // Promiseの解決時に実行するコールバック。
//   // Promiseの解決や拒否のためのコールバックをアタッチします。
//   // const fulfiled = toBeFulfilled.then((user => user.name))
//   // console.log(fulfiled);
//   console.log(toBeFulfilled);
//   console.log(toBeRejected);
// }, 2000)

// const promiseHell = require("./promise-hell/sample")

// promiseHell.fetchUserById(5)
//   .then(encodedUser => {
//     console.log("1回目の非同期APIの実行が完了");
//     console.log({ encodedUser });

//     return promiseHell.parseUser(encodedUser)
//   })
//   .then(user => {
//     console.log("2回目の非同期APIの実行が完了");
//     console.log({ user });

//     // return promiseHell.formateName(user)

//     // わざとreject状態のPromiseを返す
//     return Promise.reject(new Error("エラー出たよん"))
//   })
//   .then(result => {
//     console.log("3回目の非同期APIの実行が完了");
//     // 全ての非同期処理が完了した後の処理
//     console.log({ result });
//   })
//   .catch(err => {
//     // エラーハンドリング
//     console.log("新しいエラーがでます");
//     console.log(err);
//   }).finally(() => {
//     console.log("ファイナリーです");
//   })

// とりあえずpending状態のPromiseインスタンスが入っている
// const allResolved = Promise.all([
//   1, // => Promise.resolve(1)として扱われる
//   Promise.reject("foo"),
//   Promise.resolve(true),
// ])

// setTimeout(() => {
//   // Promise.allの戻り値
//   // 全部の非同期処理が完了して全部fulfilledのPromiseが帰ってきたら、fulfilledなPromiseを返す
//   // 1つでもrejectedになると、その他のPromiseインスタンスの結果を待たずにrejectedなPromiseが返される。
//   console.log(allResolved); // => Promise { [ 1, 'foo', true ] }
// }, [3000])

// const perf_hooks = require("perf_hooks")

// function asyncFunc() {
//   // 重い処理を想定
//   // setTimeoutの第一引数はコールバック関数だから、resolveでええんか
//   return new Promise(resolve => setTimeout(resolve, 1000))
// }

// // perf_hooks.performance.now()で現在時刻を取得できる
// const start = perf_hooks.performance.now()

// // 逐次実行
// asyncFunc()
//   .then(asyncFunc) // thenの中のコールバック関数でPromiseを返すと、thenはそのPromiseの値でfulfilledなPromiseを返してくれる
//   .then(asyncFunc)
//   .then(asyncFunc)
//   .then(() => console.log("逐次実行所要時間", perf_hooks.performance.now() - start))

// // Promise.allで並行実行
// Promise.all([
//   asyncFunc(),
//   asyncFunc(),
//   asyncFunc(),
// ])
//   .then(() => console.log("並行実行所要時間", perf_hooks.performance.now() - start))


// ジェネレータ
// ジェネレータ関数
// ジェネレータ関数はfunctionの後ろに*をつけることで宣言できる
// yieldキーワードはジェネレータから値を返すとともに(ジェネレータは値を生成する)、
// 関数内の処理を一時停止したり再開したりする
// function* generatorFunc() {
//   yield 1
//   yield 2
//   console.log("次は3です");
//   yield 3

//   console.log("ジェネレータ関数終了するよー");
//   return "ジェネレータ関数戻り値"
// }

// // ジェネレータの生成
// // ジェネレータはジェネレータ関数を生成する
// // この時点ではジェネレータ関数の処理は実行されない
// const generator = generatorFunc()

// // ジェネレータ(イテラブル)から、[Symbol.iterator]()メソッドによってイテレータを取り出す
// const iterator = generator[Symbol.iterator]()
// // イテレータ
// console.log(iterator);
// console.log(iterator.next());
// console.log(iterator.next());
// console.log(iterator.next());
// // =>
// // Object [Generator] {}
// // { value: 1, done: false }
// // { value: 2, done: false }
// // 次は3です
// // { value: 3, done: false }
// console.log(iterator == generator) // => true

// // [Symbol.iterator]()メソッドによってイテレータを取り出す
// const arrayIterator = [1, 2, 3][Symbol.iterator]()
// console.log(arrayIterator); // => Object [Array Iterator] {}
// console.log(arrayIterator.next()); // => { value: 1, done: false }
// console.log(arrayIterator.next()); // => { value: 2, done: false }

// console.log(generator.next()); // => { value: 1, done: false }
// generator.next();
// console.log(generator.next()); // => { value: 3, done: false }
// console.log(generator.next());
// // =>
// // ジェネレータ関数終了するよー
// // { value: 'ジェネレータ関数戻り値', done: true }
// console.log(generator.next()); // => { value: undefined, done: true }

// 無限に返し続けるジェネレータを生成するジェネレータ関数
// function* resetableGeneratorFactory() {
//   let count = 0
//   while(true) {
//     // next()を真に評価される引数(trueなど)で実行すると
//     // ここでカウンタがリセットされる
//     // yieldの結果が真に評価された場合、カウンタの値を0にリセットする
//     console.log("アイウエオ");
//     // nextからtrue値が引数として渡されたら、 直前に実行されたyield count++がtrueに置き換わる
//     // yildはnextに値を返すけど、yield自体を変数に入れるとundefinedになる
//     const isReset = yield count++
//     // 2回目以降のnextを呼び出す際にはここからスタートする
//     // ループして上のyieldを実行したらyieldに指定されてい値で戻れる
//     console.log({ isReset });
//     if (isReset) {
//       count = 0
//     }
//   }
// }

// const generator = resetableGeneratorFactory()

// console.log(generator.next());
// console.log(generator.next(true)); //ここでvalueがリセットされる
// console.log(generator.next());
// =>
// node main.js
// アイウエオ
// { value: 0, done: false }
// { isReset: true }
// アイウエオ
// { value: 0, done: false }
// { isReset: undefined }
// アイウエオ
// { value: 1, done: false }

// function* tryCatchGeneratorFactory() {
//     yield 1
//     yield 2
// }

// const generator = tryCatchGeneratorFactory()
// console.log(generator.next());
// // ここでエラーが出て以降の行が実行されない
// console.log(generator.throw(new Error("エラーだよん")));
// console.log(generator.next());

// =>
// node main.js
// { value: 1, done: false }
// /Users/yuuki_haga/repos/node/node-practice/chapter_2/src/main.js:241
//     yield 1
//     ^

// Error: エラーだよん
//     at Object.<anonymous> (/Users/yuuki_haga/repos/node/node-practice/chapter_2/src/main.js:248:29)
//     at Module._compile (node:internal/modules/cjs/loader:1119:14)
//     at Module._extensions..js (node:internal/modules/cjs/loader:1173:10)
//     at Module.load (node:internal/modules/cjs/loader:997:32)
//     at Module._load (node:internal/modules/cjs/loader:838:12)
//     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
//     at node:internal/main/run_main_module:18:47

// Node.js v18.9.1

// // 正常系
// const generator1 = generatorFunc.asyncWithGeneratorFactory('{"name": "yuki"}')

// // pendingされたpromiseが返される
// const promise1 = generator1.next().value
// console.log({ promise1 });

// // このプログラムが終了してからキューに積ませるような非同期的に処理する
// setTimeout(() => {
//   promise1.then(decodedUser => generator1.next(decodedUser))
// }, 2000)

// =>
// node main.js
// { promise1: Promise { <pending> } }
// パース結果 { name: 'yuki' }

// const generatorFunc = require("./generator/sample")

// const generator2 = generatorFunc.asyncWithGeneratorFactory("不正なJSON")
// // この時点ではpromise2はpending状態
// const promise2 = generator2.next().value
// console.log({ promise2 });

// setTimeout(() => {
//   // この時点ではpromise2はrejectedな状態で値にエラーを持っている
//   // 直前に実行されたyieldの部分にエラーを流し込んで実行する
//   promise2.catch(err => generator2.throw(err))
// })
// =>
// { promise2: Promise { <pending> } }
// エラーをキャッチ SyntaxError: Unexpected token 不 in JSON at position 0
//     at JSON.parse (<anonymous>)
//     at Timeout._onTimeout (/Users/yuuki_haga/repos/node/node-practice/chapter_2/src/generator/sample.js:7:28)
//     at listOnTimeout (node:internal/timers:564:17)
//     at process.processTimers (node:internal/timers:507:7)

// const generatorHell = require("./generator-hell/sample")

// // 正常系
// // catchには関数式を渡す。console.errorは (...value: any) => void的な型の関数だからそのまま入れられる
// generatorHell.handleAsyncWithGenerator(generatorHell.asyncWithGeneratorFactory(25))
//   .then(formatedName => console.log({ formatedName })).catch(console.err)

// // 異常系
// generatorHell.handleAsyncWithGenerator(generatorHell.asyncWithGeneratorFactory("不正なid"))
//   .then(formatedName => console.log({ formatedName })).catch(console.err)


const async = require("./async/sample")

// 正常系
async.asyncFunc('{ "name": "yuki" }')
console.log("async関数外の処理はawaitの影響を受けない");

// 異常系
// async.asyncFunc("不正なJSON")
