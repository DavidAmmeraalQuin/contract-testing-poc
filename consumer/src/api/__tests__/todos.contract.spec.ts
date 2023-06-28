import { PactV3, MatchersV3, Matchers } from "@pact-foundation/pact";
import { CONTRACTS_ROOT } from "../../constants";
import featureFlags from "../../featureFlags";
import { ToDosApi } from "../todos";

// contract_todo_author )

const provider = new PactV3({
  dir: CONTRACTS_ROOT,
  // Deployable FE app
  consumer: "MyConsumer",
  // Bounded context
  provider: "MyProvider",
});

const baseTodo = {
  id: MatchersV3.like("1"),
  description: MatchersV3.like("Some chore"),
  status: MatchersV3.regex("TODO|IN_PROGRESS|DONE", "TODO"),
};

const expectedTodosList = MatchersV3.eachLike(baseTodo);
describe("GET /todos", () => {
  beforeEach(() => {
    provider
      // This describes the server state at the moment of the request
      .given("Theres a list of TODO's")
      .uponReceiving("a request to get all todos")
      .withRequest({
        method: "GET",
        path: "/todos",
        headers: {
          Accept: "application/json",
        },
      })
      .willRespondWith({
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: MatchersV3.eachLike({
          id: MatchersV3.like("1"),
          description: MatchersV3.like("Some chore"),
          status: MatchersV3.regex("TODO|IN_PROGRESS|DONE", "TODO"),
        }),
      });
  });
  it("returns an HTTP 200 and a list of todos", async () => {
    await provider.executeTest(async (mockServer) => {
      const todosService = new ToDosApi({ baseUrl: mockServer.url });

      const result = await todosService.fetchTodos();
      expect(result[0].id).toBe("1");
    });
  });
});

xdescribe("DELETE /todos/:id", () => {
  beforeEach(() => {
    provider
      // This describes the server state at the moment of the request
      .given("a todo with id 1 exists")
      .uponReceiving("a request to delete todo with id 1")
      .withRequest({
        method: "DELETE",
        path: "/todos/1",
      })
      .willRespondWith({
        status: 204,
      });
  });

  it("return an HTTP 204", async () => {
    await provider.executeTest(async (mockServer) => {
      const todosService = new ToDosApi({ baseUrl: mockServer.url });

      const result = await todosService.deleteTodoById("1");
      expect(result).toBe(true);
    });
  });
});

const describeIf = (condition: boolean) => (condition ? describe : xdescribe);
const xDescribeIf = (condition: boolean) => xdescribe;

describe("POST /todos", () => {
  beforeEach(() => {
    provider
      // This describes the server state at the moment of the request
      .uponReceiving("a request to create a new todo")
      .withRequest({
        method: "POST",
        path: "/todos",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: {
          description: MatchersV3.like("some todo description"),
        },
      })
      .willRespondWith({
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          id: MatchersV3.like("some-id"),
        },
      });
  });

  it("responds with HTTP 200", async () => {
    await provider.executeTest(async (mockServer) => {
      const todosService = new ToDosApi({ baseUrl: mockServer.url });

      const result = await todosService.createTodo({
        description: "some todo description",
      });
      expect(result.id).toBe("some-id");
    });
  });
});
