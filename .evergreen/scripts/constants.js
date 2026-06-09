const Tasks = {
  CheckCodegen: "check_codegen",
  Compile: "compile",
  E2E: "e2e",
  E2EParallel: "e2e_parallel",
  E2ENoDB: "e2e_no_db",
  Lint: "lint",
  Storybook: "storybook",
  Test: "test",
  TypeCheck: "type_check",
};

const APPS_DIR = "apps";
const PACKAGES_DIR = "packages";
const PACKAGE_JSON = "package.json";

const E2E_PARALLEL_COUNT = 4;

export {
  Tasks,
  APPS_DIR,
  PACKAGES_DIR,
  PACKAGE_JSON,
  E2E_PARALLEL_COUNT,
  TASK_MAPPING
};
