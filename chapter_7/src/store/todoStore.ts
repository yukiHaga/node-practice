import { generateUUID } from "~/helpers";
import { Todo, TodoStatus } from "~/models";
import { initDBConnection } from "./db";
import { Store } from "./store";

export class TodoStore implements Store {
  async all() {
    const connection = await this.buildDBConnection();
    const [rows] = await connection.execute("SELECT * FROM `todos`");

    if (Array.isArray(rows)) {
      const newRows = rows as Todo[];
      // 空の配列に対してmapをやったら空の配列
      return newRows.map((row) => new Todo(row));
    } else {
      return [];
    }
  }

  async findById(id: string) {
    const connection = await this.buildDBConnection();
    const [rows] = await connection.execute("SELECT * FROM `todos` WHERE `id` = ?", [id]);

    if (Array.isArray(rows)) {
      const newRows = rows as Todo[];
      const todos = newRows.map((row) => new Todo(row));
      return todos.find((todo) => todo.id === id);
    } else {
      return null;
    }
  }

  async whereByStatus(status: TodoStatus) {
    const connection = await this.buildDBConnection();
    const [rows] = await connection.execute("SELECT * FROM `todos` WHERE status = ?", [status]);

    if (Array.isArray(rows)) {
      const newRows = rows as Todo[];
      // 空の配列に対してmapをやったら空の配列
      return newRows.map((row) => new Todo(row));
    } else {
      return [];
    }
  }

  async create(todo: Todo) {
    try {
      const connection = await this.buildDBConnection();
      const todoId = generateUUID();
      const newTodo = new Todo({ ...todo, id: todoId });
      const [rows] = await connection.execute(
        "INSERT INTO todos (id, title, status) VALUES (?, ?, ?)",
        [newTodo.id, newTodo.title, newTodo.status],
      );

      return newTodo;
    } catch (err) {
      return null;
    }
  }

  async updateStatus(todo: Todo) {
    try {
      const connection = await this.buildDBConnection();
      const [rows] = await connection.execute("UPDATE todos SET status = ? WHERE id = ?", [
        todo.status,
        todo.id,
      ]);
      return todo;
    } catch (err) {
      return null;
    }
  }

  async destroy(id: string) {
    try {
      const connection = await this.buildDBConnection();
      const [rows] = await connection.execute("DELETE FROM todos WHERE id = ?", [id]);
      return id;
    } catch (err) {
      console.error("エラーが出ました", err);
      return null;
    }
  }

  async buildDBConnection() {
    const connection = await initDBConnection();
    return connection;
  }
}
