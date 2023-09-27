import { Todo, TodoStatus } from "~/models";

// goみたいに大文字で定義する必要なかったわ
export interface Store {
  // TypeScriptでPromiseの型を指定する場合はジェネリクスを伴いPromise<T>と書きます。
  // TにはPromiseが履行された(fulfilled)ときに返す値の型を指定します。
  all(): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  whereByStatus(status: TodoStatus): Promise<Todo[]>;
  create(todo: Todo): Promise<Todo | null>;
  updateStatus(todo: Todo): Promise<Todo | null>;
  destroy(id: string): Promise<string | null>;
}
