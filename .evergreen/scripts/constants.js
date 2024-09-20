const Tasks = {
    CheckCodegen: "check_codegen",
    Compile: "compile",
    E2E: "e2e",
    E2EParallel: "e2e_parallel",
    Lint: "lint",
    Snapshots: "snapshots",
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
    "deploy-utils": [
        Tasks.Lint, 
        Tasks.Test, 
        Tasks.TypeCheck
    ],
    lib: [
      Tasks.Lint,
      Tasks.Snapshots,
      Tasks.Storybook,
      Tasks.Test,
      Tasks.TypeCheck,
    ],
    parsley: [
      Tasks.CheckCodegen,
      Tasks.Compile,
      Tasks.E2E,
      Tasks.Lint,
      Tasks.Snapshots,
      Tasks.Storybook,
      Tasks.Test,
      Tasks.TypeCheck,
    ],
    spruce: [
      Tasks.CheckCodegen,
      Tasks.Compile,
      Tasks.E2EParallel,
      Tasks.Lint,
      Tasks.Snapshots,
      Tasks.Storybook,
      Tasks.Test,
      Tasks.TypeCheck,
    ],
};

const APPS_DIR = "apps";

const PARALLEL_COUNT = 4;

export { Tasks, TASK_MAPPING, APPS_DIR, PARALLEL_COUNT };
