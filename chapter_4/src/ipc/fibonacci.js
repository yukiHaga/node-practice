// 指定された位置のフィボナッチ数を返す
function fibonacci(n) {
  // nが1以下の場合は、それ以外の場合は直前の2つのフィボナッチ数の和を返す
  return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2)
}

module.exports = {
  fibonacci,
}