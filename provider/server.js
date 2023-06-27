const { todosService } = require("./todos-service");

// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });

fastify.get("/todos", async (request, reply) => {
  reply.send(todosService.getTodos());
});

fastify.post("/todos", async (req, reply) => {
  todosService.addTodo(req.body);
  reply.send({
    id: req.body.id,
  });
});

const listen = async (port, callback) => {
  try {
    await fastify.listen({ port });
    if (callback) callback();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

const close = async () => {
  await fastify.close();
};

module.exports = {
  listen,
  close,
};
