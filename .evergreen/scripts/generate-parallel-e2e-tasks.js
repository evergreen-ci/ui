import { readdirSync, statSync, writeFileSync } from "fs";
import { join } from "path";
import { APPS_DIR, PACKAGE_JSON, PACKAGES_DIR, PARALLEL_COUNT, Tasks } from "./constants.js"
import { hasChangesInDirectoryOrFile } from "./git-utils.js";

const ALWAYS_GENERATE_TASKS_REQUESTERS = ["trigger", "patch", "commit"];
const PARENT_PATCH_USER = "parent_patch";
const EVERGREEN_DIR = join(process.cwd(), "/.evergreen");
const TASKS_FILE = join(EVERGREEN_DIR, "generate-parallel-e2e-tasks.json");
/**
 * getDirSize calculates the size of a directory at a given path, optionally including the size of its subdirectories.
 * @param {string} dirPath - string representing the root directory path
 * @param {boolean} [includeNestedDirs=true] - boolean indicating whether to recurse and calculate size of nested directories
 * @returns {number} - directory size in bytes
 */
const getDirSize = (dirPath, includeNestedDirs = true) => {
  let size = 0;
  const files = readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = join(dirPath, file);
    const stats = statSync(filePath);

    if (stats.isFile()) {
      size += stats.size;
    } else if (stats.isDirectory() && includeNestedDirs) {
      size += getDirSize(filePath);
    }
  });

  return size;
};

/**
 * getDirs creates a list of all subdirectories located under dirPath
 * @param {string} dirPath - string representing the root directory path
 * @returns {Array.<string>} - array of subdir paths
 */
const getDirs = (dirPath) => {
  const files = readdirSync(dirPath);

  return files
    .map((file) => join(dirPath, file))
    .filter((filePath) => {
      const stats = statSync(filePath);
      return stats.isDirectory();
    });
};

/**
 * getCypressDirSizes creates a map of directory sizes. The keys represent each subdirectory within dirPath, and the value represents the directory's size. An entry is also added for the root directory size (i.e. the size of all files at root, omitting subdirectories)
 * @param {string} dirPath - string representing the root directory path
 * @returns {Object.<string, number>} - mapping of subdirectory path to its size
 */
const getCypressDirSizes = (dirPath) => {
  const makeRelative = (d) => d.substring(d.indexOf("cypress"));

  const dirSizeMap = {};
  const dirs = getDirs(dirPath);

  dirs.forEach((dir) => {
    const size = getDirSize(dir);
    dirSizeMap[`${makeRelative(dir)}/**/*.ts`] = size;
  });
  // Specifically add root tests with no wildcard directory regex
  dirSizeMap[`${makeRelative(dirPath)}/*.ts`] = getDirSize(dirPath, false);
  return dirSizeMap;
};

/**
 * sortDirSizes sorts the {[filepath]: size} map returned by getCypressDirSizes in descending order.
 * @param {Object.<string, number>} dirSizeMap - map of filepath to size
 * @returns {Object.<string, number>} - sorted map
 */
const sortDirSizes = (dirSizeMap) =>
  Object.entries(dirSizeMap).sort((a, b) => b[1] - a[1]);

/**
 * bucketSpecs splits the Cypress spec paths into n=bucketCount buckets. By iterating through the sorted list and round robin-ing the specs into each bucket, we attempt to make the bucket file sizes roughly even, since file size can function as a rough heuristic of how long a spec takes to run on Cypress.
 * @param {Object.<string, number>} specs - sorted map of {[filepath]: size} as returned by sortDirSizes
 * @param {number} bucketCount - integer representing number of buckets
 * @returns {Array.<Array.<string>>} - array of length bucketCount, with each array entry containing an array of filepaths
 */
const bucketSpecs = (specs, bucketCount) => {
  const buckets = Array.from(Array(bucketCount), () => []);

  specs.forEach((spec, i) => {
    const bucketIndex = i % bucketCount;
    buckets[bucketIndex].push(spec[0]);
  });

  return buckets;
};

/**
 * getSpecs attempts to split the Cypress specs located at dirPath into n similarly-sized groups. It returns an array of strings listing spec files. Each string should be an argument for the "--spec" option in a separate Cypress run.
 * @param {string} dirPath - string representing the root Cypress integration test path
 * @returns {Array.<string>} - array of comma-separated specs. Each array entry represents the specs to be run in a parallelized execution task.
 */
export const getSpecs = (dirPath) => {
  const dirSizes = getCypressDirSizes(dirPath);
  const sorted = sortDirSizes(dirSizes);
  const buckets = bucketSpecs(sorted, PARALLEL_COUNT);
  return buckets.map((specs) => specs.join());
};

/**
 * generateParallelE2ETasks generates an object indicating build variants and tasks for running parallelized e2e tasks.
 * @returns an Evergreen-compliant generate.tasks object
 */
const generateParallelE2ETasks = (bv) => {
  const specs = getSpecs(`./${APPS_DIR}/${bv}/cypress/integration`);
  const e2eTasks = specs.map((spec, i) => ({
    name: `e2e_${bv}_${i}`,
    commands: [
      { func: "setup-mongodb" },
      { func: "generate-token" },
      { func: "run-make-background", vars: { target: "local-evergreen" } },
      { func: "symlink" },
      { func: "seed-bucket-data" },
      { func: "run-logkeeper" },
      { func: "pnpm-build" },
      { func: "pnpm-preview" },
      { func: "wait-for-evergreen" },
      { func: "pnpm-verify-backend" },
      { func: "pnpm-cypress", vars: { cypress_spec: spec } },
    ],
  }));
  const bvTasks = e2eTasks.map(({ name }) => ({ name }));
  const displayTasks = [
    {
      name: Tasks.E2EParallel,
      execution_tasks: e2eTasks.map(({ name }) => name),
    }
  ]
  const buildvariants = [
    {
      name: bv,
      tasks: bvTasks,
      display_tasks: displayTasks,
    }
  ]
  return { buildvariants, tasks: e2eTasks };
};

const main = () => {
  const buildVariant = process.env.BUILD_VARIANT;
  const requester = process.env.REQUESTER;
  const activatedBy = process.env.ACTIVATED_BY;

  // If the task is triggered by a upstream task, we should always generate the tasks
  const shouldAlwaysGenerateTasks = ALWAYS_GENERATE_TASKS_REQUESTERS.includes(requester);
  const isActivatedByParentPatch = activatedBy === PARENT_PATCH_USER;
  const mustGenerateTasks = shouldAlwaysGenerateTasks || isActivatedByParentPatch;

  // Check if there are any changes in the given build variant directory or package.json
  const pathsToCheck = [
    `${APPS_DIR}/${buildVariant}`,
    PACKAGES_DIR,
    PACKAGE_JSON,
    EVERGREEN_DIR,
  ];
  const hasRelevantChanges = pathsToCheck.some((path) => hasChangesInDirectoryOrFile(path));
  if (!mustGenerateTasks && !hasRelevantChanges) {
    console.log(`No changes detected in ${buildVariant} or packages directory, skipping e2e task generation`);
    // Write an empty task list to maintain the expected file output
    writeFileSync(
      TASKS_FILE,
      JSON.stringify({ tasks: [] })
    );
    return;
  }

  if (buildVariant || mustGenerateTasks) {
    const evgObj = generateParallelE2ETasks(buildVariant);
    const evgJson = JSON.stringify(evgObj);
  
    try {
      writeFileSync(
        TASKS_FILE,
        evgJson
      );
    } catch (e) {
      throw new Error("writing e2e tasks file", { cause: e });
    }
  }
};

main();
