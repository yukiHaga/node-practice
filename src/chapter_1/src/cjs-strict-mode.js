"use strict"
let myString = "色は"

// 変数名のタイプミス
// strictモードではvar, let, constを使って宣言されていない変数に対する値の割り当てはエラーとなる。
// この結果、タイプミスにいち早く気づくことができる
myStrng = "二歩へと"
// => /Users/yuuki_haga/repos/node/node-practice/chapter_1/src/cjs-strict-mode.js:5
// myStrng = "二歩へと"
// ^

// ReferenceError: myStrng is not defined

console.log(global.myStrng);
// => 二歩へと
