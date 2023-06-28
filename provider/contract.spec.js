const { Verifier } = require("@pact-foundation/pact");
const pkg = require("./package.json");
const { listen, close } = require("./server");
const { setTodos } = require("./todos-service");
const revision = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString()
  .trim();

const BRANCH = process.env.BRANCH;

const stateHandlers = {
  "Theres a list of TODO's": () => {
    setTodos([
      {
        id: "1",
        description: "some chore",
        status: "TODO",
      },
    ]);
  },
};

// (2) Verify that the provider meets all consumer expectations
describe("Pact Verification", () => {
  beforeAll(async () => {
    await listen(8081);
  });
  it("validates the expectations of Matching Service", async () => {
    await new Verifier({
      stateHandlers,
      providerBaseUrl: "http://localhost:8081", // <- location of your running provider
      pactBrokerUrl: "http://localhost:9292",
      provider: "MyProvider",
      publishVerificationResult: process.env.CI === "true",
      providerVersion: revision,
      consumerVersionSelectors: [
        BRANCH
          ? {
              branch: BRANCH,
            }
          : {
              deployedOrReleased: true,
            },
      ],
      includeWipPactsSince: "2020-01-01",
      enablePending: true,
    }).verifyProvider();
  });

  afterAll(async () => {
    await close();
  });
});
