const baseUrl = "http://localhost:3000/api/todos";

const createTodo = () => {
  const titles = ["ネーム", "下書き"];

  return Promise.all(
    titles.map(async (title) => {
      const body = JSON.stringify({ todo: { title } });

      const res = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });

      console.log("=== レスポンス ===");
      console.log(res.status, await res.json());
    }),
  );
};

createTodo()
  .then((result) => console.log(result))
  .catch(console.error);
