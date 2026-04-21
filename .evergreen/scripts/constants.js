const Tasks = {
  CheckCodegen: "check_codegen",
  Compile: "compile",
  E2E: "e2e",
  E2EParallel: "e2e_parallel",
  E2ECypress: "e2e_cypress", // TODO: Delete when migration to Playwright is complete.
  E2ECypressParallel: "e2e_cypress_parallel", // TODO: Delete when migration to Playwright is complete.
  Lint: "lint",
  Storybook: "storybook",
  Test: "test",
  TypeCheck: "type_check",
};

/**
 * Mapping from build variant to tasks.
 * Evergreen does not reevaluate tags as part of generate.tasks, so we must list out every variant and its
 * corresponding tasks.
 */
const TASK_MAPPING = {
  "analytics-visualizer": [Tasks.Lint, Tasks.Test, Tasks.TypeCheck],
  "deploy-utils": [Tasks.Lint, Tasks.Test, Tasks.TypeCheck],
  fungi: [Tasks.Lint, Tasks.Storybook, Tasks.Test, Tasks.TypeCheck],
  lib: [
    Tasks.Lint,
    Tasks.Storybook,
    Tasks.Test,
    Tasks.TypeCheck,
    Tasks.CheckCodegen
  ],
  parsley: [
    Tasks.CheckCodegen,
    Tasks.Compile,
    Tasks.E2E,
    Tasks.Lint,
    Tasks.Storybook,
    Tasks.Test,
    Tasks.TypeCheck,
  ],
  spruce: [
    Tasks.CheckCodegen,
    Tasks.Compile,
    Tasks.Lint,
    Tasks.Storybook,
    Tasks.Test,
    Tasks.TypeCheck,
  ],
};

const APPS_DIR = "apps";
const PACKAGES_DIR = "packages";
const PACKAGE_JSON = "package.json";

const MARKDOWN_EXT = ".md";

const IGNORED_FILE_EXTENSIONS = new Set([MARKDOWN_EXT]);

const CYPRESS_PARALLEL_COUNT = 4;
const PLAYWRIGHT_PARALLEL_COUNT = 1;

export {
  Tasks,
  APPS_DIR,
  PACKAGES_DIR,
  PACKAGE_JSON,
  IGNORED_FILE_EXTENSIONS,
  CYPRESS_PARALLEL_COUNT,
  PLAYWRIGHT_PARALLEL_COUNT,
  TASK_MAPPING,
};
