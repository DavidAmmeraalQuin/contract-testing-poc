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
};

module.exports = {
  todosService,
  setTodos,
};
