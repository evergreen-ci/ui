import { readdirSync, statSync } from "fs";
import { join } from "path";

const PARALLEL_COUNT = 4;

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

const getDirs = (dirPath) => {
  const files = readdirSync(dirPath);

  return files
    .map((file) => join(dirPath, file))
    .filter((filePath) => {
      const stats = statSync(filePath);
      return stats.isDirectory();
    });
};

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

const sortDirSizes = (dirSizeMap) => {
  return Object.entries(dirSizeMap).sort((a, b) => b[1] - a[1]);
};

const bucketSpecs = (specs, bucketCount) => {
  const buckets = Array.from(Array(bucketCount), () => []);

  specs.forEach((spec, i) => {
    const bucketIndex = i % bucketCount;
    buckets[bucketIndex].push(spec[0]);
  });

  return buckets;
};

export const getSpecs = (dirPath) => {
  const dirSizes = getDirSizes(dirPath);
  const sorted = sortDirSizes(dirSizes);
  const buckets = bucketSpecs(sorted, PARALLEL_COUNT);
  return buckets.map((specs) => specs.join());
};
