import { FC, useEffect, useState } from "react";
import Link from "next/link"
import Head from "next/head"
import "isomorphic-fetch"

type Page = {
  id: number;
  path: string;
  title: string;
  fetchQuery: string;
}

type Props = {
  page: Page;
}

type Todo = {
  id: number;
  title: string;
  status: "completed" | "progress";
}

// Reactコンポーネントを実装して、外部のモジュールで利用可能なようにexport文で公開
export const Todos: FC<Props> = ({ page: { id, path, title, fetchQuery }}) =>  {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    // fetchによるTodo取得の削除
    // fetch(`http://localhost:8000/api/todos${fetchQuery}`)
    //   .then(async res => res.ok
    //     ? setTodos(await res.json())
    //     : alert(await res.text())
    //   )

    // EventSourceを使った実装に置き換え
    // jsの標準にEventSourceというコンストラクタがある
    // イベントソース
    // EventSourceインターフェイスは、サーバーから送られるイベントに対するウェブコンテンツのインターフェイスです。
    // EventSourceインスタンスはHTTPサーバーへの持続的な接続を開き、イベントをテキスト/イベントストリーム形式で送信します。
    // 接続は、EventSource.close() を呼び出して閉じるまで、オープンなままです。
    // EventSource() コンストラクターでインスタンスを生成した場合、その時点でHTTPリクエストが自動的に送信されます
    const eventSource = new EventSource("http://localhost:8000/api/todos/events")

    // SSE受信時の処理
    eventSource.addEventListener("message", e => {
      const todos = JSON.parse(e.data) as Todo[]
      setTodos(todos)
    })

    // エラーハンドリング
    // オブザーバーパターン
    eventSource.addEventListener("error", e => {
      console.error("SESエラー", e)
    })

    // useEffectで関数を返すと副作用のクリーンアップとして実行される
    // ここではEventSourceインスタンスをクローズする
    return () => eventSource.close()
  }, [path, fetchQuery])

  // 各ページに関する情報の定義
  const pages = [
    { id: 1, path: "/", title: "すべてのToDo", fetchQuery: "" },
    { id: 2, path: "/active", title: "未完了のToDo", fetchQuery: "?status=progress" },
    { id: 3, path: "/completed", title: "完了したToDO", fetchQuery: "?status=completed" },
  ]

  // このコンポーネントが描画するUIをJSX構文で記述して返す
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      {/* Todo一覧の表示 */}
      <ul>
        {todos.map(({ id, title, status }) => (
          <li key={id}>
            <span style={status === "completed" ? { textDecoration: "line-through" } : {}}>
              {title}
            </span>
          </li>
        ))}
      </ul>
      <div>
        {pages.map(({ id, path, title }) => (
          <Link href={path} key={id} style={{ marginRight: 10 }}>{title}</Link>
        ))}
      </div>
    </>
  )
}
