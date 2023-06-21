const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const fetchContractToggles = async () => {
  const json = await promisify(fs.readFile)(
    path.resolve(__dirname, "../../feature-flags.json")
  );

  return JSON.parse(json);
};

const executeContractTest = async (contract) => {
  const toggles = await fetchContractToggles();

  const { spawn } = require("child_process");
  const currentToggles = JSON.stringify({
    ...toggles,
    [contract]: true,
  });

  const proc = spawn("yarn", ["jest"], {
    env: { ...process.env, FEATURE_FLAGS: currentToggles },
  });
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);

  return new Promise((resolve, reject) => {
    proc.on("close", (code) => {
      resolve(code);
    });
  });
};

const getGitRevision = () => {
  return require("child_process")
    .execSync("git rev-parse --short HEAD")
    .toString()
    .trim();
};

const executePublishContract = async (contractToggle) => {
  const { spawn } = require("child_process");

  const CONTRACT_VERSION =
    contractToggle !== undefined
      ? `${getGitRevision()}+${contractToggle}`
      : getGitRevision();

  console.log("Publishing contract version: ", CONTRACT_VERSION);

  const proc = spawn("yarn", ["ci:contract:publish"], {
    env: { ...process.env, CONTRACT_VERSION },
  });
  proc.stdout.pipe(process.stdout);
  proc.stderr.pipe(process.stderr);

  return new Promise((resolve, reject) => {
    proc.on("close", (code) => {
      resolve(code);
    });
  });
};

const readDir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const CONTRACTS_DIR = path.resolve(__dirname, "../contracts");

const cleanContracts = async () => {
  for (const file of await readDir(CONTRACTS_DIR)) {
    await unlink(path.join(CONTRACTS_DIR, file));
  }
};

(async () => {
  const toggles = await fetchContractToggles();

  for (const [contract] of Object.entries(toggles)) {
    console.log(`Performing contract test for ${contract}`);
    await executeContractTest(contract);
    await executePublishContract(contract);
    await cleanContracts();
  }

  await executeContractTest();
  await executePublishContract();
  await cleanContracts();
})();
