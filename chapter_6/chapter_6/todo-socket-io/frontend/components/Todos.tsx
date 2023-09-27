import { FC, useEffect, useState, ChangeEvent, useCallback, FormEvent } from "react";
import Link from "next/link"
import Head from "next/head"
import { io, Socket } from "socket.io-client"
import { Todo } from "../models"
// import "isomorphic-fetch"

type ServerToClientEvents = {
  todos: (todos: Todo[]) => void;
}

type ClientToServerEvents = {
  createTodo: (todo: Todo) => void;
  updatedCompleted: (id: number) => void;
  deleteTodo: (id: number) => void;
}

type Props = {
  page: {
    id: number;
    path: string;
    title: string;
    query?: {
      [key in string]: string[];
    };
  };
}

// Reactコンポーネントを実装して、外部のモジュールで利用可能なようにexport文で公開
export const Todos: FC<Props> = ({ page: { id, path, title, query }}) =>  {
  const [todos, setTodos] = useState<Todo[]>([])

  // socketをstateとして保持
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    // socketの生成
    // ws://localhost:8000/todos はWebSocketプロトコルを使用して localhost のポート 8000 に対して /todos パスに接続しようとするリクエストを表します。
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("ws://localhost:8000/todos", { query })

    socket.on("todos", todos => {
      const newTodos = todos.map(todo => new Todo(todo))
      setTodos(newTodos)
    })

    setSocket(socket)

    // コンポーネントのクリーンアップ時にsocketをクローズ
    return () => {
      socket.close()
    }
  }, [path, query])

  // 各ページに関する情報の定義
  const pages = [
    { id: 1, path: "/", title: "すべてのToDo", fetchQuery: "" },
    { id: 2, path: "/active", title: "未完了のToDo", fetchQuery: "?status=progress" },
    { id: 3, path: "/completed", title: "完了したToDO", fetchQuery: "?status=completed" },
  ]

  const [todo, setTodo] = useState(new Todo())

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTodo(new Todo({ title: e.target.value }))
  }, [])

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    // submitイベントの本来の動作を止める
    // Formで画面遷移しなくなる
    e.preventDefault();
    socket?.emit("createTodo", todo)
    setTodo(new Todo())
  }, [socket, todo])

  // なるべくDOMを直接触りたくない
  const onChangeFactory = useCallback((id: number) => () => {
    socket?.emit("updatedCompleted", id)
  }, [socket])

  const onClickDeleteFactory = useCallback((id: number) => () => {
    socket?.emit("deleteTodo", id)
  }, [socket])

  // このコンポーネントが描画するUIをJSX構文で記述して返す
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      {/*form要素に送信先が指定されていない場合、現在のURLに対してフォームの内容を送信する */}
      <form onSubmit={onSubmit}>
        <label>新しいTodoを入力</label>
        <input type="text" value={todo.title} onChange={onChange} />
        <input type="submit" value="submit" />
      </form>
      {/* Todo一覧の表示 */}
      <ul>
        {todos.map((todo) => {
          return (
            <li key={id}>
              <label style={todo.isCompleted() ? { textDecoration: "line-through" } : {}}>{todo.title}</label>
              <input
                type="checkbox"
                checked={todo.isCompleted()}
                onChange={onChangeFactory(id)}
              />
              <button onClick={onClickDeleteFactory(id)}>削除</button>
            </li>
          )
        }
        )}
      </ul>
      <div>
        {pages.map(({ id, path, title }) => (
          <Link href={path} key={id} style={{ marginRight: 10 }}>{title}</Link>
        ))}
      </div>
    </>
  )
}
