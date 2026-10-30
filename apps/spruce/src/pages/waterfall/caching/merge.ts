import { FieldFunctionOptions, FieldMergeFunction } from "@apollo/client";
import {
  CachedRange,
  CachedWaterfall,
  ReadField,
  Version,
  Waterfall,
  deduplicateAndSortVersions,
  getCacheOptions,
  getCachedPageLimit,
  getVersionId,
  getVersionOrder,
  getWaterfallBuildsFieldName,
} from "./utils";

const getRange = (
  data: Waterfall,
  args: FieldFunctionOptions["args"],
  readField: ReadField,
): CachedRange => {
  const { date, limit, maxOrder, minOrder, revision } = getCacheOptions(args);
  const { pagination, versions } = data;
  const first = versions[0];
  const last = versions.at(-1);
  let upper = pagination.mostRecentVersionOrder;
  if (maxOrder) {
    upper = maxOrder - 1;
  } else if (minOrder || date || revision) {
    upper = first
      ? getVersionOrder(first, readField)
      : pagination.prevPageOrder || pagination.mostRecentVersionOrder;
  }
  const lastOrder = last ? getVersionOrder(last, readField) : upper;
  let lower = Math.min(lastOrder, pagination.nextPageOrder || lastOrder);
  if (minOrder) {
    lower = minOrder + 1;
    upper = Math.max(upper, lower);
  } else if (!pagination.hasNextPage) {
    lower = Math.min(1, upper);
  }
  const completedLimit = pagination.activeVersionIds.length < limit ? limit : 0;
  return {
    minOrder: lower,
    maxOrder: upper,
    lower: {
      anchor: upper,
      cursor: pagination.nextPageOrder,
      hasMore: pagination.hasNextPage,
      limit: completedLimit,
    },
    upper: {
      anchor: lower,
      cursor: pagination.prevPageOrder,
      hasMore: pagination.hasPrevPage,
      limit: completedLimit,
    },
  };
};

const clipRange = (
  range: CachedRange,
  minOrder: number,
  maxOrder: number,
): CachedRange | undefined => {
  const lower = Math.max(range.minOrder, minOrder);
  const upper = Math.min(range.maxOrder, maxOrder);
  if (lower > upper) {
    return undefined;
  }
  return {
    minOrder: lower,
    maxOrder: upper,
    lower:
      lower === range.minOrder
        ? range.lower
        : { anchor: upper, cursor: lower, hasMore: true, limit: 0 },
    upper:
      upper === range.maxOrder
        ? range.upper
        : { anchor: lower, cursor: upper, hasMore: true, limit: 0 },
  };
};

const mergeCoverage = (
  ranges: CachedRange[],
  incoming: CachedRange,
): CachedRange[] => {
  const merged: CachedRange[] = [];
  [...ranges, incoming]
    .sort((a, b) => b.maxOrder - a.maxOrder)
    .forEach((range) => {
      const previous = merged.at(-1);
      if (!previous || range.maxOrder < previous.minOrder - 1) {
        merged.push(range);
      } else {
        merged[merged.length - 1] = {
          minOrder: Math.min(previous.minOrder, range.minOrder),
          maxOrder: previous.maxOrder,
          lower:
            range.minOrder < previous.minOrder ||
            (range === incoming && range.minOrder === previous.minOrder)
              ? range.lower
              : previous.lower,
          upper:
            range === incoming && range.maxOrder === previous.maxOrder
              ? range.upper
              : previous.upper,
        };
      }
    });
  return merged;
};

const evictBuildsForVersions = ({
  args,
  cache,
  discardedVersions,
  readField,
  storage,
}: {
  args: FieldFunctionOptions["args"];
  cache: FieldFunctionOptions["cache"];
  discardedVersions: readonly Version[];
  readField: ReadField;
  storage: FieldFunctionOptions["storage"];
}) => {
  if (!discardedVersions.length) {
    return;
  }

  discardedVersions.forEach((version) => {
    const versionCacheId = cache.identify({
      __typename: "Version",
      id: getVersionId(version, readField),
    });
    if (versionCacheId) {
      cache.evict({
        broadcast: false,
        fieldName: getWaterfallBuildsFieldName(args?.options ?? {}),
        id: versionCacheId,
      });
    }
  });

  if (storage.pendingGarbageCollection) {
    return;
  }
  storage.pendingGarbageCollection = true;
  queueMicrotask(() => {
    storage.pendingGarbageCollection = false;
    cache.gc({ resetResultCache: true });
  });
};

export const mergeVersions: FieldMergeFunction<CachedWaterfall, Waterfall> = (
  existing,
  incoming,
  context,
) => {
  const { args, cache, readField, storage } = context;
  const { limit, maxOrder, projectIdentifier } = getCacheOptions(args);
  const maxActiveVersions = limit * getCachedPageLimit(projectIdentifier);
  const incomingRange = getRange(incoming, args, readField);
  const activeIds = new Set(existing?.allActiveVersions);
  incoming.versions.forEach((version) => {
    activeIds.delete(getVersionId(version, readField));
  });
  incoming.pagination.activeVersionIds.forEach((id) => activeIds.add(id));
  const mergedVersions = deduplicateAndSortVersions(
    [...(existing?.versions ?? []), ...incoming.versions],
    readField,
  );
  const isActive = (version: Version) =>
    activeIds.has(getVersionId(version, readField));
  const activeIndexes = mergedVersions.flatMap((version, index) =>
    isActive(version) ? [index] : [],
  );
  let minRetainedOrder = -Infinity;
  let maxRetainedOrder = Infinity;
  if (activeIndexes.length > maxActiveVersions) {
    if (maxOrder) {
      let firstRetainedIndex =
        activeIndexes[activeIndexes.length - maxActiveVersions];
      while (
        firstRetainedIndex > 0 &&
        !isActive(mergedVersions[firstRetainedIndex - 1])
      ) {
        firstRetainedIndex -= 1;
      }
      maxRetainedOrder = getVersionOrder(
        mergedVersions[firstRetainedIndex],
        readField,
      );
    } else {
      let lastRetainedIndex = activeIndexes[maxActiveVersions - 1];
      while (
        lastRetainedIndex < mergedVersions.length - 1 &&
        !isActive(mergedVersions[lastRetainedIndex + 1])
      ) {
        lastRetainedIndex += 1;
      }
      minRetainedOrder = getVersionOrder(
        mergedVersions[lastRetainedIndex],
        readField,
      );
    }
  }

  let coverage = mergeCoverage(existing?.coverage ?? [], incomingRange).flatMap(
    (range) => {
      const retained = clipRange(range, minRetainedOrder, maxRetainedOrder);
      return retained ? [retained] : [];
    },
  );
  // Disconnected empty scans must also remain bounded without consuming version slots.
  coverage = maxOrder
    ? coverage.slice(-maxActiveVersions)
    : coverage.slice(0, maxActiveVersions);
  const isCovered = (order: number) =>
    coverage.some(
      (range) => range.minOrder <= order && order <= range.maxOrder,
    );
  const retainedVersions = mergedVersions.filter((version) =>
    isCovered(getVersionOrder(version, readField)),
  );
  const retainedIds = new Set(
    retainedVersions.map((version) => getVersionId(version, readField)),
  );
  const discardedVersions = (existing?.versions ?? []).filter(
    (version) => !retainedIds.has(getVersionId(version, readField)),
  );
  evictBuildsForVersions({
    args,
    cache,
    discardedVersions,
    readField,
    storage,
  });

  return {
    __typename: incoming.__typename,
    versions: retainedVersions,
    mostRecentVersionOrder: incoming.pagination.mostRecentVersionOrder,
    allActiveVersions: new Set(
      [...activeIds].filter((id) => retainedIds.has(id)),
    ),
    coverage,
  };
};
