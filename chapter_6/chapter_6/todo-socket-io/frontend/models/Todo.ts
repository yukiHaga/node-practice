const TodoStatuses = {
  Completed: "completed",
  Progress: "progress",
} as const

type TodoStatuses = typeof TodoStatuses[keyof typeof TodoStatuses]

export class Todo {
  id?: number;
  title = "";
  status: TodoStatuses = TodoStatuses.Progress;

  constructor(data: Partial<Todo> = {}) {
    Object.assign(this, data);
  }

  isCompleted() {
    return this.status === "completed";
  }
}