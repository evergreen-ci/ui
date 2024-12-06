import { ReadFieldFunction } from "@apollo/client/cache/core/types/common";
import { WaterfallBuild, WaterfallVersionFragment } from "gql/generated/types";

type ReadBuildsProps = {
  versionIds: string[];
  builds: readonly WaterfallBuild[];
  readField: ReadFieldFunction;
};

/**
 * `readBuilds` is used to read appropriate builds from the cache.
 * @param opts - object containing arguments to this function
 * @param opts.builds - existing builds in the Apollo cache
 * @param opts.readField - function provided by Apollo to access fields from Reference objects
 * @param opts.versionIds - upper bound limit for order
 * @returns an array of builds containing no duplicates and in descending sort by the
 * `order` field
 */
const readBuilds = ({
  builds,
  readField,
  versionIds,
}: ReadBuildsProps): WaterfallBuild[] => {
  const resultBuilds: WaterfallBuild[] = [];

  builds.forEach((b) => {
    const version = readField<string>("version", b) ?? "";
    if (versionIds.includes(version)) {
      resultBuilds.push(b);
    }
  });

  return resultBuilds;
};

type ReadVersionsProps = {
  maxOrder?: number;
  minOrder?: number;
  limit: number;
  versions: readonly WaterfallVersionFragment[];
  readField: ReadFieldFunction;
};

/**
 * `readVersions` is used to read the appropriate versions from the cache (if they exist).
 * @param opts - object containing arguments to this function
 * @param opts.readField - function provided by Apollo to access fields from Reference objects
 * @param opts.versions - the existing versions in the cache
 * @param opts.maxOrder - upper bound limit for order
 * @param opts.minOrder - lower bound limit for order
 * @param opts.limit - number of active versions to display
 * @returns an array of versions (activated or inactivated) whose orders fall between prevPageOrder
 * and nextPageOrder
 */
const readVersions = ({
  limit,
  maxOrder,
  minOrder,
  readField,
  versions,
}: ReadVersionsProps): WaterfallVersionFragment[] => {
  const idx = versions.findIndex((v) => {
    const versionOrder = readField<number>("order", v) ?? 0;
    if (minOrder) {
      return versionOrder - 1 === minOrder;
    }
    if (maxOrder) {
      return versionOrder + 1 === maxOrder;
    }
    return false;
  });

  let startIndex = maxOrder ? idx : 0;
  let endIndex = maxOrder ? 0 : idx;
  let numActivated = 0;

  // Count backwards for paginating backwards.
  if (minOrder) {
    for (let i = endIndex; i >= 0; i--) {
      if (readField<boolean>("activated", versions[i])) {
        numActivated += 1;
        if (numActivated === limit) {
          startIndex = i;
          break;
        }
      }
    }
  }

  // Count forwards for paginating forwards.
  if (maxOrder) {
    for (let i = startIndex; i < versions.length; i++) {
      if (readField<boolean>("activated", versions[i])) {
        numActivated += 1;
        if (numActivated === limit) {
          endIndex = i;
          break;
        }
      }
    }
  }

  // need code for leading inactive versions

  // Add 1 because slice is [inclusive, exclusive).
  return versions.slice(startIndex, endIndex + 1);
};

export { readVersions, readBuilds };
