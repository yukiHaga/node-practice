// ディレクトリを指定した場合、そのディレクトリ配下のindexファイルが読み込まれる
import { Todos } from "../components";

const Active = () => {
  const page = { id: 2, path: "/active", title: "未完了のToDo", fetchQuery: "?status=progress" }

  return (
    <Todos page={page} />
  )
}

export default Active