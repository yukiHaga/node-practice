export const TodoStatus = {
  Progress: "progress",
  Completed: "completed",
} as const;

export type TodoStatus = (typeof TodoStatus)[keyof typeof TodoStatus];

export class Todo {
  id: string;
  title: string;
  status: TodoStatus = TodoStatus.Progress;

  constructor(data: Partial<Todo> = {}) {
    Object.assign(this, data);
  }
}
