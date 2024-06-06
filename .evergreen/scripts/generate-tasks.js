const { execSync } = require("child_process");
const { writeFileSync } = require("fs");
const { join, parse } = require("path");

const taskMapping = {
  lib: ["lint", "test", "type_check"],
  parsley: [
    "check_codegen",
    "compile",
    "e2e_test_parsley",
    "lint",
    "snapshots",
    "storybook",
    "test",
    "type_check",
  ],
  spruce: [
    "check_codegen",
    "compile",
    "e2e_test_spruce",
    "lint",
    "snapshots",
    "storybook",
    "test",
    "type_check",
  ],
};

const packagesDir = "packages";
const appsDir = "apps";
const fileDestPath = join(__dirname, "../", "generate-tasks.json");

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

const targetsFromChangedFiles = (files) => {
  const targets = new Set();

  files.forEach((file) => {
    const { dir } = parse(file);
    const [packageDir, packageName] = dir.split("/");
    if (packageDir === packagesDir) {
      targets.add("spruce");
      targets.add("parsley");
    }
    if (packageDir === appsDir || packageName === packagesDir) {
      targets.add(packageName);
    }
  });

  return Array.from(targets);
};

const generateTasks = () => {
  const changes = whatChanged();
  if (changes.length === 0) {
    // TODO
    getAllTargets?.();
    return {};
  }

  const targets = targetsFromChangedFiles(changes);
  const buildvariants = targets.map((t) => ({
    name: t,
    tasks: taskMapping[t].map((taskName) => ({ name: taskName })),
  }));
  return { buildvariants };
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
