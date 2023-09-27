// ディレクトリを指定した場合、そのディレクトリ配下のindexファイルが読み込まれる
import { Todos } from "../components";

const Completed = () => {
  const page = {
    id: 3,
    path: "/completed",
    title: "完了したToDO",
    query: {
      status: ["completed"],
    }
  }

  return (
    <Todos page={page} />
  )
}

export default Completed