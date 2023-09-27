// ディレクトリを指定した場合、そのディレクトリ配下のindexファイルが読み込まれる
import { Todos } from "../components";

const Index = () => {
  const page = {
    id: 1,
    path: "/",
    title: "すべてのToDo",
  }

  return (
    <Todos page={page} />
  )
}

export default Index

