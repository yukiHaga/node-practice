"use strict"
const express = require("express")
const router = express.Router()

const todos = [
  { id: 1, title: "ネーム", status: "completed" },
  { id: 2, title: "下書き", status: "progress" },
]

// 「/api/todos/」にマッチする場合
// クエリパラメータで絞り込めるようにした
router.route("/")
  .get((req, res) => {
    const status = req.query.status

    if (status) {
      const filterdTodos = todos.filter(todo => todo.status === status)
      res.json(filterdTodos)
    } else {
      res.json(todos)
    }
  })
  .post((req, res) => {
    // POSTリクエストに対する処理を記述
    const { title } = req.body
    if (!title || typeof title !== "string") {
      const err = new Error("title is required")
      err.statusCode = 400
      throw err
    }

    const lastTodo = [...todos].pop();
    const newTodo = {
      id: lastTodo.id + 1,
      title,
      status: "progress",
    }
    todos.push(newTodo)
    res.status(201).json(newTodo)
  })

// パスパラメータを書く場合は以下のように書く
router.route("/:id(\\d+)")
  .get((req, res) => {
    // GETリクエストに対する処理を記述
    const todoId = Number(req.params.id)
    const todo = todos.find(todo => todo.id === todoId)

    if (todo) {
      // てか、bodyをjson形式のエンコーディング処理とかいらんのね。すごい
      res.json(todo)
    } else {
      res.status(404)
      res.json()
    }
  })

module.exports = router