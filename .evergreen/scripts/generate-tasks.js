import { writeFileSync } from "fs";
import { join, parse } from "path";
import {
  APPS_DIR,
  IGNORED_FILE_EXTENSIONS,
  TASK_MAPPING,
  PACKAGE_APP_MAPPING
} from "./constants.js";
import { whatChanged } from "./git-utils.js";

// This file is written in plain JS because it makes the generator super fast. No need to install TypeScript.

/**
 * targetsFromChangedFiles returns a list of build variants to run based on a list of changed files.
 * If any non-app code has changed, all apps will run (unless a specific package-to-app mapping exists).
 * @param files - string array of modified files as per git
 * @returns a list of build variants found as keys in TASK_MAPPING
 */
const targetsFromChangedFiles = (files) => {
  const targets = new Set();

  files.forEach((file) => {
    const { dir, ext } = parse(file);
    const [packageDir, packageName] = dir.split("/");

    if (IGNORED_FILE_EXTENSIONS.has(ext.toLowerCase())) {
      return;
    }

    if (packageDir !== APPS_DIR) {
      // If the package has a specific app mapping, only add those apps. Otherwise, test all apps.
      if (PACKAGE_APP_MAPPING[packageName]) {
        PACKAGE_APP_MAPPING[packageName].forEach((app) => targets.add(app));
      } else {
        targets.add("spruce");
        targets.add("parsley");
        targets.add("sage");
      }
    }

    if (TASK_MAPPING[packageName]) {
      targets.add(packageName);
    }
  });

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
