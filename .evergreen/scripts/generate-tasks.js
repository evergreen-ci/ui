import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { join, parse } from "path";
import {
  APPS_DIR,
  IGNORED_FILE_EXTENSIONS,
  TASK_MAPPING,
} from "./constants.js";

// This file is written in plain JS because it makes the generator super fast. No need to install TypeScript.

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
    const diffFiles = execSync(`git diff ${mergeBase} --name-only`)
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
  const appSpecificChanges = {
    spruce: false,
    parsley: false,
  };

  files.forEach((file) => {
    const { dir, ext } = parse(file);
    const [packageDir, packageName] = dir.split("/");

    if (IGNORED_FILE_EXTENSIONS.has(ext.toLowerCase())) {
      return;
    }

    if (packageDir === APPS_DIR && (packageName === "spruce" || packageName === "parsley")) {
      appSpecificChanges[packageName] = true;
    }

    // If a change is made to a shared directory, test both apps.
    if (packageDir !== APPS_DIR) {
      targets.add("spruce");
      targets.add("parsley");
    }

    if (TASK_MAPPING[packageName]) {
      targets.add(packageName);
    }
  });

  // Parsley-specific changes do not require adding Spruce to the targets.

  return Array.from(targets);
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
  const buildvariants = targets.map((bv) => ({
    name: bv,
    tasks: TASK_MAPPING[bv].map((name) => ({ name })),
  }));
  return { buildvariants };
};

const main = () => {
  const fileDestPath = join(
    process.cwd(),
    "/.evergreen",
    "generate-tasks.json",
  );
  const evgObj = generateTasks();
  const evgJson = JSON.stringify(evgObj);

  try {
    writeFileSync(fileDestPath, evgJson);
  } catch (e) {
    throw new Error("writing file", { cause: e });
  }
};

main();
