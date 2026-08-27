import { FieldFunctionOptions, FieldMergeFunction } from "@apollo/client";
import {
  ReadField,
  Version,
  Waterfall,
  deduplicateAndSortVersions,
  getCacheOptions,
  getCachedPageLimit,
  getVersionId,
} from "./utils";

// Limit the number of active versions kept in the cache, using pagination direction to remove either the oldest or newest active versions present.
const boundVersions = ({
  activeVersionIds,
  evictNewestVersions,
  maxActiveVersions,
  readField,
  versions,
}: {
  activeVersionIds: Set<string>;
  evictNewestVersions: boolean;
  maxActiveVersions: number;
  readField: ReadField;
  versions: readonly Version[];
}) => {
  const activeVersionIndexes = versions.reduce<number[]>(
    (indexes, version, index) => {
      if (activeVersionIds.has(getVersionId(version, readField))) {
        indexes.push(index);
      }
      return indexes;
    },
    [],
  );

  let retainedVersions: Version[];
  let discardedVersions: Version[];

  if (activeVersionIndexes.length <= maxActiveVersions) {
    retainedVersions = [...versions];
    discardedVersions = [];
  } else if (evictNewestVersions) {
    // Retain adjacent inactive versions so each cached page remains complete.
    const startIndex =
      activeVersionIndexes[activeVersionIndexes.length - maxActiveVersions];
    retainedVersions = versions.slice(startIndex);
    discardedVersions = versions.slice(0, startIndex);
  } else {
    const endIndex = activeVersionIndexes[maxActiveVersions - 1];
    retainedVersions = versions.slice(0, endIndex + 1);
    discardedVersions = versions.slice(endIndex + 1);
  }

  return {
    discardedVersions,
    retainedVersionIds: new Set(
      retainedVersions.map((version) => getVersionId(version, readField)),
    ),
    retainedVersions,
  };
};

// Remove WaterfallBuild cache entries if their versions have been dropped by boundVersions
const evictBuildsForVersions = ({
  cache,
  discardedVersions,
  readField,
  storage,
}: {
  cache: FieldFunctionOptions["cache"] | undefined;
  discardedVersions: readonly Version[];
  readField: ReadField;
  storage: FieldFunctionOptions["storage"] | undefined;
}) => {
  if (!cache || discardedVersions.length === 0) {
    return;
  }

  discardedVersions.forEach((version) => {
    const versionCacheId = cache.identify({
      __typename: "VersionLite",
      id: getVersionId(version, readField),
    });
    if (versionCacheId) {
      cache.evict({
        broadcast: false,
        fieldName: "waterfallBuilds",
        id: versionCacheId,
      });
    }
  });

  if (storage?.pendingGarbageCollection) {
    return;
  }
  if (storage) {
    storage.pendingGarbageCollection = true;
  }
  queueMicrotask(() => {
    if (storage) {
      storage.pendingGarbageCollection = false;
    }
    cache.gc({ resetResultCache: true });
  });
};

export const mergeVersions = ((
  existing,
  incoming,
  { args, cache, readField, storage },
) => {
  const { limit, maxOrder, projectIdentifier } = getCacheOptions(args);
  const existingVersions = existing
    ? (readField<Waterfall["versions"]>("versions", existing) ?? [])
    : [];
  const incomingVersions =
    readField<Waterfall["versions"]>("versions", incoming) ?? [];
  const mergedVersions = deduplicateAndSortVersions(
    [...existingVersions, ...incomingVersions],
    readField,
  );

  const pagination = readField<Waterfall["pagination"]>(
    "pagination",
    incoming,
  ) ?? {
    activeVersionIds: [],
    hasNextPage: true,
    hasPrevPage: true,
    mostRecentVersionOrder: 0,
    nextPageOrder: 0,
    prevPageOrder: 0,
  };

  const allActiveVersions = existing
    ? new Set(readField<Set<string>>("allActiveVersions", existing) ?? [])
    : new Set<string>();
  const incomingActiveVersions =
    readField<string[]>("activeVersionIds", pagination) ?? [];
  incomingActiveVersions.forEach((versionId) =>
    allActiveVersions.add(versionId),
  );

  const maxActiveVersions = limit * getCachedPageLimit(projectIdentifier);
  let retainedVersions = mergedVersions;
  let retainedActiveVersions = allActiveVersions;

  if (allActiveVersions.size > maxActiveVersions) {
    const {
      discardedVersions,
      retainedVersionIds,
      retainedVersions: bounded,
    } = boundVersions({
      activeVersionIds: allActiveVersions,
      evictNewestVersions: Boolean(maxOrder),
      maxActiveVersions,
      readField,
      versions: mergedVersions,
    });
    retainedVersions = bounded;
    retainedActiveVersions = new Set(
      [...allActiveVersions].filter((versionId) =>
        retainedVersionIds.has(versionId),
      ),
    );
    evictBuildsForVersions({
      cache,
      discardedVersions,
      readField,
      storage,
    });
  }

  return {
    versions: retainedVersions,
    pagination,
    allActiveVersions: retainedActiveVersions,
  };
}) satisfies FieldMergeFunction<
  Waterfall & { allActiveVersions?: Set<string> }
>;
