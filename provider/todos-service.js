let todos = [
  {
    id: "1",
    description: "test",
    status: "TODO",
  },
];

function setTodos(newTodos) {
  todos = newTodos;
}

const todosService = {
  getTodos() {
    return todos;
  },
  addTodo(todo) {
    todos.push(todo);
  },
};

module.exports = {
  todosService,
  setTodos,
};
