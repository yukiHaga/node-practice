import { readdir, readFile, unlink, writeFile } from "fs/promises";
import { extname } from "path";
import { rootDir } from "~/constants";
import { Todo, TodoStatus } from "~/models";
import { Store } from "./store";

// インターフェースをクラスに実装するには、implementsキーワードを使う
// てかこのfileSysteってだいぶ実装がtodoに依存しているな。todo以外にも使えるようにしたい
export class FileSystem implements Store {
  async all() {
    const files = (await readdir(`${rootDir}/store/fileStore/todos`)).filter(
      (file) => extname(file) === ".json",
    );

    // Promise.all()の返すPromiseインスタンスは、引数の配列に含まれているPromiseインスタンスが全てfulfilledになった時にfulfilledになる。
    // 1つでもrejectedになると、その他のPromiseインスタンスの結果を待たずにrejectedになる。
    // fulfilledなPromiseインスタンスを返す時、その値は引数のPromiseインスタンスが解決された値を、引数で与えられた順番通り保持する配列になる。
    return Promise.all(
      files.map((file) =>
        readFile(`${rootDir}/store/fileStore/todos/${file}`, "utf8").then(
          (todo) => JSON.parse(todo) as Todo,
        ),
      ),
    );
  }

  async findById(id: string) {
    const todos = await this.all();
    return todos.find((todo) => todo.id === id);
  }

  async whereByStatus(status: TodoStatus) {
    const todos = await this.all();
    return todos.filter((todo) => todo.status === status);
  }

  async create(todo: Todo) {
    const newTodo = new Todo({
      id: crypto.randomUUID(),
      title: todo.title,
      status: TodoStatus.Progress,
    });

    await writeFile(`${rootDir}/store/fileStore/todos/${newTodo.id}.json`, JSON.stringify(newTodo));
    return newTodo;
  }

  async updateStatus(todo: Todo) {
    const fileName = `${rootDir}/store/fileStore/todos/${todo.id}.json`;
    return readFile(fileName, "utf8").then(
      (content) => {
        const newTodo = new Todo({
          ...JSON.parse(content),
          ...todo,
        });
        return writeFile(fileName, JSON.stringify(newTodo)).then(() => newTodo);
      },
      // ファイルやディレクトリが存在しない場合、エラーオブジェクトのcodeプロパティに"ENOENT"という文字列がセットされる
      (err) => (err.code === "ENOENT" ? null : Promise.reject(err)),
    );
  }

  async destroy(id: string) {
    return unlink(`${rootDir}/store/fileStore/todos/${id}.json`).then(
      () => id,
      (err) => (err.code === "ENOENT" ? null : Promise.reject(err)),
    );
  }
}
