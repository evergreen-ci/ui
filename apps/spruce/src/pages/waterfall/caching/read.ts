import { FieldReadFunction } from "@apollo/client";
import {
  ReadField,
  Version,
  Waterfall,
  getCacheOptions,
  getVersionId,
  getVersionOrder,
} from "./utils";

// Within all versions, identify the indices that identify the current page being read.
const findPageRange = ({
  activeVersionIds,
  hasNextPage,
  limit,
  maxOrder,
  minOrder,
  readField,
  versions,
}: {
  activeVersionIds: Set<string>;
  hasNextPage: boolean;
  limit: number;
  maxOrder: number;
  minOrder: number;
  readField: ReadField;
  versions: readonly Version[];
}) => {
  const anchorIndex = versions.findIndex((version) => {
    const order = getVersionOrder(version, readField);
    return minOrder ? order - 1 === minOrder : order + 1 === maxOrder;
  });
  if (anchorIndex === -1) {
    return undefined;
  }

  let startIndex = maxOrder ? anchorIndex : 0;
  let endIndex = maxOrder ? versions.length : anchorIndex;
  const pageActiveVersionIds: string[] = [];

  if (minOrder) {
    for (let i = endIndex; i >= 0; i--) {
      const versionId = getVersionId(versions[i], readField);
      if (activeVersionIds.has(versionId)) {
        pageActiveVersionIds.push(versionId);
        if (pageActiveVersionIds.length === limit) {
          startIndex = i;
          while (
            startIndex > 0 &&
            !activeVersionIds.has(
              getVersionId(versions[startIndex - 1], readField),
            )
          ) {
            startIndex -= 1;
          }
          break;
        }
      }
    }
  }

  if (maxOrder) {
    for (let i = startIndex; i < versions.length; i++) {
      const versionId = getVersionId(versions[i], readField);
      if (activeVersionIds.has(versionId)) {
        pageActiveVersionIds.push(versionId);
        if (pageActiveVersionIds.length === limit) {
          endIndex = i;
          break;
        }
      }
    }
    if (pageActiveVersionIds.length < limit) {
      if (hasNextPage) {
        return undefined;
      }
      endIndex = versions.length - 1;
    }
  }

  return {
    activeVersionIds: pageActiveVersionIds,
    endIndex,
    startIndex,
  };
};

export const readVersions = ((existing, { args, readField }) => {
  if (!existing) {
    return undefined;
  }

  const options = getCacheOptions(args);
  const { date, limit, minOrder, revision } = options;
  let { maxOrder } = options;

  const { hasNextPage = true, mostRecentVersionOrder = 0 } =
    readField<Waterfall["pagination"]>("pagination", existing) ?? {};

  if (minOrder === 0 && maxOrder === 0 && !date && !revision) {
    maxOrder = mostRecentVersionOrder + 1;
  }

  const existingVersions =
    readField<Waterfall["versions"]>("versions", existing) ?? [];
  const allActiveVersions =
    readField<Set<string>>("allActiveVersions", existing) ?? new Set();
  const pageRange = findPageRange({
    activeVersionIds: allActiveVersions,
    hasNextPage,
    limit,
    maxOrder,
    minOrder,
    readField,
    versions: existingVersions,
  });
  if (!pageRange) {
    return undefined;
  }

  const { activeVersionIds, endIndex, startIndex } = pageRange;
  const versions = existingVersions.slice(startIndex, endIndex + 1);
  const zerothOrder = getVersionOrder(versions[0], readField);
  const prevOrderNumber =
    mostRecentVersionOrder === zerothOrder ? 0 : zerothOrder;

  const lastVersionOrder = getVersionOrder(
    versions[versions.length - 1],
    readField,
  );
  const nextOrderNumber = lastVersionOrder === 1 ? 0 : lastVersionOrder;

  return {
    pagination: {
      activeVersionIds: activeVersionIds.sort(),
      mostRecentVersionOrder,
      prevPageOrder: prevOrderNumber,
      nextPageOrder: nextOrderNumber,
      hasNextPage: nextOrderNumber > 0,
      hasPrevPage: prevOrderNumber > 0,
    },
    versions,
  };
}) satisfies FieldReadFunction<Waterfall>;
