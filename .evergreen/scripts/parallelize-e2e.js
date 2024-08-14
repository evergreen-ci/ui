import { readdirSync, statSync } from "fs";
import { join } from "path";

const PARALLEL_COUNT = 4;

/**
 *  getDirSize calculates the size of a directory at a given path, optionally including the size of its subdirectories.
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
 * getDirSizes creates a map of directory sizes. The keys represent each subdirectory within dirPath, and the value represents the directory's size. An entry is also added for the root directory size (i.e. the size of all files at root, omitting subdirectories)
 * @param {string} dirPath - string representing the root directory path
 * @returns {Object.<string, number>} - mapping of subdirectory path to its size
 */
const getDirSizes = (dirPath) => {
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
 * sortDirSizes sorts the {[filepath]: size} map returned by getDirSizes in descending order.
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
  const dirSizes = getDirSizes(dirPath);
  const sorted = sortDirSizes(dirSizes);
  const buckets = bucketSpecs(sorted, PARALLEL_COUNT);
  return buckets.map((specs) => specs.join());
};
