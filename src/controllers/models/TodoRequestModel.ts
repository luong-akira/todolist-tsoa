export interface CreateTodoParams {
  title: string;
  body: string;
  status?: string;
}

export interface UpdateTodoParams {
  title?: string;
  body?: string;
  status?: string;
}
