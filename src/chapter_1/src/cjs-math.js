const add = (a, b) => a + b
const subtract = (a, b) => a - b

// この書き方はできなかった
// exports = {
//   add,
//   subtract,
// }

exports.add = add
exports.subtract = subtract