import { ReadFieldFunction } from "@apollo/client/cache/core/types/common";
import { WaterfallVersionFragment } from "gql/generated/types";

type ReadVersionsProps = (
  | {
      minOrder: number;
      maxOrder?: never;
    }
  | {
      minOrder?: never;
      maxOrder: number;
    }
) & {
  versions: readonly WaterfallVersionFragment[];
  readField: ReadFieldFunction;
  limit: number;
};

/**
 * `readVersions` is used to read the appropriate versions from the cache (if they exist).
 * @param opts - object containing arguments to this function
 * @param opts.limit - number of activated versions to return
 * @param opts.maxOrder - the max order allowed for any version on the page. Cannot be defined at the same time as minOrder.
 * @param opts.minOrder - the min order allowed for any version on the page. Cannot be defined at the same time as maxOrder.
 * @param opts.readField - function provided by Apollo to access fields from Reference objects
 * @param opts.versions - the existing versions in the cache
 * @returns an array of versions that contains (num = limit) activated versions. It also includes any
 * inactive versions that fall within that range.
 */
const readVersions = ({
  limit,
  maxOrder,
  minOrder,
  readField,
  versions,
}: ReadVersionsProps): WaterfallVersionFragment[] => {
  // Find the index of the version with given minOrder / maxOrder.
  // It looks like minOrder / maxOrder is exclusive based on the backend code,
  // hence why we add 1 or subtract 1.
  const idx = versions.findIndex((v) => {
    const versionOrder = readField<number>("order", v) ?? 0;
    if (minOrder) {
      return versionOrder === minOrder + 1;
    }
    if (maxOrder) {
      return versionOrder === maxOrder - 1;
    }
    return false;
  });

  let startIndex = maxOrder ? idx : 0;
  let endIndex = maxOrder ? 0 : idx;
  let numActivated = 0;

  // NOTE: I think the read function has a bug where it doesn't get the
  // leading inactive versions on the first page. They are present in the
  // cache.

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

  // Add 1 because slice is [inclusive, exclusive).
  return versions.slice(startIndex, endIndex + 1);
};

type MergeVersionsProps = {
  existingVersions: readonly WaterfallVersionFragment[];
  incomingVersions: readonly WaterfallVersionFragment[];
  readField: ReadFieldFunction;
};

/**
 * `mergeVersions` is used to merge existing and incoming versions.
 * @param opts - object containing arguments to this function
 * @param opts.existingVersions - existing versions in the Apollo cache
 * @param opts.incomingVersions - incoming versions as a result of a GraphQL query
 * @param opts.readField - function provided by Apollo to access fields from Reference objects
 * @returns an array of versions (both active or inactive) that contains no duplicates and in
 * descending sort by the `order` field
 */
const mergeVersions = ({
  existingVersions,
  incomingVersions,
  readField,
}: MergeVersionsProps): WaterfallVersionFragment[] => {
  // Order should be unique - the map will enforce that there are no duplicates.
  const versionsMap: { [order: number]: WaterfallVersionFragment } = {};

  existingVersions.forEach((e) => {
    const order = readField<number>("order", e) ?? 0;
    versionsMap[order] = e;
  });
  incomingVersions.forEach((i) => {
    const order = readField<number>("order", i) ?? 0;
    versionsMap[order] = i;
  });

  return Object.values(versionsMap).sort((a, b) => {
    const aOrder = readField<number>("order", a) ?? 0;
    const bOrder = readField<number>("order", b) ?? 0;
    return bOrder - aOrder;
  });
};

export { readVersions, mergeVersions };
