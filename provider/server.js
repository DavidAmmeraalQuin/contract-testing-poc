const { todosService } = require("./todos-service");
const crypto = require("crypto");

const getId = () => crypto.randomBytes(16).toString("hex");

// Require the framework and instantiate it
const fastify = require("fastify")({ logger: true });

fastify.get("/todos", async (request, reply) => {
  reply.send(todosService.getTodos());
});

fastify.post("/todos", async (req, reply) => {
  const id = getId();
  todosService.addTodo({ ...req.body, id });
  reply.send({
    id: false,
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
