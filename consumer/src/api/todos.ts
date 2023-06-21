type ToDo = {
  id: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
};

export class ToDosApi {
  private baseUrl: string;
  constructor({ baseUrl }: { baseUrl: string }) {
    this.baseUrl = baseUrl;
  }

  async fetchTodos(): Promise<ToDo[]> {
    const response = await (
      await fetch(`${this.baseUrl}/todos`, {
        headers: {
          Accept: "application/json",
        },
      })
    ).json();

    return response;
  }

  async createTodo(data: Pick<ToDo, "description">) {
    const response = await (
      await fetch(`${this.baseUrl}/todos`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
    ).json();

    return response;
  }

  async deleteTodoById(id: string) {
    await fetch(`${this.baseUrl}/todos/${id}`, {
      method: "DELETE",
    });

    return true;
  }
}
