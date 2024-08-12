import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { join, parse } from "path";
import { getSpecs } from "./parallelize-e2e.js";

// This file is written in plain JS because it makes the generator super fast. No need to install TypeScript.

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

// Enumerate each task in a build variant that can run as part of a PR.
// It would be nice to use tags for this, but Evergreen does not reevaluate tags as part of generate.tasks.
const TASK_MAPPING = {
  "deploy-utils": [Tasks.Lint, Tasks.Test, Tasks.TypeCheck],
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
const fileDestPath = join(process.cwd(), "/.evergreen", "generate-tasks.json");

const getMergeBase = () => {
  try {
    const mergeBaseCmd = execSync("git merge-base main@{upstream} HEAD")
      .toString()
      .trim();
    return mergeBaseCmd;
  } catch (e) {
    throw new Error("getting merge-base", { cause: e });
  }
};

/**
 * whatChanged returns a list of files modified in this patch or PR.
 * Prior art from Evergreen:
 * https://github.com/evergreen-ci/evergreen/blob/ab7d4112b352b759acd54c685524177018467c30/cmd/generate-lint/generate-lint.go#L30
 * @returns a string array of modified file names relative to the git root directory
 */
const whatChanged = () => {
  const mergeBase = getMergeBase();
  try {
    const diffFiles = execSync(
      `git diff ${mergeBase} --name-only --diff-filter=d`,
    )
      .toString()
      .trim();

    // If there is no diff, this is not a patch build.
    if (!diffFiles) {
      return [];
    }
    return diffFiles.split("\n").map((file) => file.trim());
  } catch (e) {
    throw new Error("getting diff", { cause: e });
  }
};

/**
 * targetsFromChangedFiles returns a list of build variants to run based on a list of changed files.
 * If any non-app code has changed, all apps will run.
 * @param files - string array of modified files as per git
 * @returns a list of build variants found as keys in TASK_MAPPING
 */
const targetsFromChangedFiles = (files) => {
  const targets = new Set();

  files.forEach((file) => {
    const { dir } = parse(file);
    const [packageDir, packageName] = dir.split("/");

    // If a change is made to a shared directory, test both apps.
    if (packageDir !== APPS_DIR) {
      targets.add("spruce");
      targets.add("parsley");
    }

    if (TASK_MAPPING[packageName]) {
      targets.add(packageName);
    }
  });

  return Array.from(targets);
};

const generateE2E = (bv) => {
  const specs = getSpecs(`./apps/${bv}/cypress/integration`);
  return specs.map((spec, i) => {
    return {
      name: `e2e_${bv}_${i}`,
      commands: [
        { func: "setup-mongodb" },
        { func: "run-make-background", vars: { target: "local-evergreen" } },
        { func: "symlink" },
        { func: "seed-bucket-data" },
        { func: "run-logkeeper" },
        { func: "yarn-build" },
        { func: "yarn-preview" },
        { func: "wait-for-evergreen" },
        { func: "yarn-verify-backend" },
        { func: "yarn-cypress", vars: { cypress_spec: spec } },
      ],
    };
  });
};

/**
 * generateTasks generates an object indicating build variants and tasks to run based on changed files.
 * @returns an Evergreen-compliant generate.tasks object.
 */
const generateTasks = () => {
  const changes = whatChanged();
  const targets =
    changes.length === 0
      ? Object.keys(TASK_MAPPING)
      : targetsFromChangedFiles(changes);

  const tasks = [];
  const buildvariants = targets.map((bv) => {
    const bvTasks = [];
    const displayTasks = [];
    TASK_MAPPING[bv].forEach((name) => {
      if (name === Tasks.E2EParallel) {
        // Make display tasks
        const e2eTasks = generateE2E(bv);
        tasks.push(...e2eTasks);
        bvTasks.push(...e2eTasks.map(({ name }) => ({ name }))),
          displayTasks.push({
            name: Tasks.E2EParallel,
            execution_tasks: e2eTasks.map(({ name }) => name),
          });
      } else {
        bvTasks.push({ name });
      }
    });
    const variant = {
      name: bv,
      tasks: bvTasks,
      display_tasks: displayTasks,
    };

    return variant;
  });

  return { buildvariants, tasks };
};

const main = () => {
  const evgObj = generateTasks();
  const evgJson = JSON.stringify(evgObj);

  try {
    writeFileSync(fileDestPath, evgJson);
  } catch (e) {
    throw new Error("writing file", { cause: e });
  }
};

main();
