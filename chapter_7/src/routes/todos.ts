import express, { Request } from "express";
import { AppError, StatusErrorCode, StatusSuccessCode, Todo, TodoStatus } from "~/models";
import { TodoStore } from "~/store";

const store = new TodoStore();

export const router = express.Router();

router.route("/hello").get((req, res, next) => {
  res.status(StatusSuccessCode.Ok).send("World");
});

// 「/api/todos/」にマッチする場合
// クエリパラメータで絞り込めるようにした
router
  .route("/")
  // Todo一覧の取得
  .get((req, res, next) => {
    const { status } = req.query;

    if (status === TodoStatus.Completed || status === TodoStatus.Progress) {
      store
        .whereByStatus(status)
        .then((todos) => res.json(todos))
        .catch(next);
    } else {
      store
        .all()
        .then((todos) => res.json(todos))
        .catch(next);
    }
  })
  // Todoの新規登録
  .post((req: Request<unknown, unknown, { todo: { title: string } }>, res, next) => {
    const { title } = req.body.todo;

    if (!title || typeof title !== "string") {
      // Expressではミドルウェアでnextがエラー引数で呼び出されるか、同期処理がエラーを投げたとき(throw)に、そのエラーを捕虜してエラーハンドリングミドルウェアで処理する
      // 独自のエラーハンドリングミドルウェアを用意していないなら、デフォルトのエラーハンドリングミドルウェアでエラーハンドリングが行われる
      const err = new AppError({
        statusCode: StatusErrorCode.BadRequest,
        message: "title is required",
      });
      next(err);
    }

    const newTodo = new Todo({ title });
    store
      .create(newTodo)
      .then((todo) => res.status(StatusSuccessCode.Created).json(todo))
      .catch(next);
  });

router
  .route("/:id")
  // 指定したidでTodoを取得
  .get((req: Request<{ id: string }>, res, next) => {
    const { id } = req.params;
    store
      .findById(id)
      .then((todo) => res.status(StatusSuccessCode.Ok).json(todo))
      .catch(next);
  })
  // 指定したTodoを削除
  .delete((req: Request<{ id: string }>, res, next) => {
    const { id } = req.params;
    store
      .destroy(id)
      .then((id) => {
        if (id) {
          // res.endはボディを何も返さない時に使う
          res.status(StatusSuccessCode.NoContent).end();
        } else {
          next();
        }
      })
      .catch(next);
  });

router
  .route("/:id/status")
  // putはリソース自体を上書きする
  // putにボディは必要
  .put((req: Request<{ id: string }, unknown, { todo: { status: TodoStatus } }>, res, next) => {
    const { status } = req.body.todo;
    const { id } = req.params;
    store
      .updateStatus(new Todo({ id, status }))
      .then((todo) => res.status(StatusSuccessCode.Ok).json(todo))
      .catch(next);
  });
