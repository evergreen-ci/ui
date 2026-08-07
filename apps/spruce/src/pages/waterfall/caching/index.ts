import {
  FieldFunctionOptions,
  FieldMergeFunction,
  FieldReadFunction,
} from "@apollo/client";
import { WaterfallQuery } from "gql/generated/types";
import { VERSION_LIMIT } from "../constants";

const DEFAULT_CACHED_PAGE_LIMIT = 6;
const MONGODB_MONGO_CACHED_PAGE_LIMIT = 2;
const MONGODB_MONGO_PROJECT_PREFIX = "mongodb-mongo-";

type Waterfall = WaterfallQuery["waterfall"];
type Version = Waterfall["versions"][number];
type ReadField = FieldFunctionOptions["readField"];

const getCacheOptions = (args: FieldFunctionOptions["args"]) => ({
  date: args?.options?.date ?? "",
  limit: args?.options?.limit ?? VERSION_LIMIT,
  maxOrder: args?.options?.maxOrder ?? 0,
  minOrder: args?.options?.minOrder ?? 0,
  projectIdentifier: args?.options?.projectIdentifier ?? "",
  revision: args?.options?.revision ?? "",
});

const getCachedPageLimit = (projectIdentifier: string) =>
  projectIdentifier.startsWith(MONGODB_MONGO_PROJECT_PREFIX)
    ? MONGODB_MONGO_CACHED_PAGE_LIMIT
    : DEFAULT_CACHED_PAGE_LIMIT;

const getVersionId = (version: Version, readField: ReadField) =>
  readField<string>("id", version) ?? "";

const getVersionOrder = (version: Version, readField: ReadField) =>
  readField<number>("order", version) ?? 0;

const deduplicateAndSortVersions = (
  versions: readonly Version[],
  readField: ReadField,
) => {
  const versionsByOrder = new Map<number, Version>();
  versions.forEach((version) => {
    versionsByOrder.set(getVersionOrder(version, readField), version);
  });
  return [...versionsByOrder.values()].sort(
    (a, b) => getVersionOrder(b, readField) - getVersionOrder(a, readField),
  );
};

const boundVersions = ({
  activeVersionIds,
  keepOldest,
  maxActiveVersions,
  readField,
  versions,
}: {
  activeVersionIds: Set<string>;
  keepOldest: boolean;
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

  if (activeVersionIndexes.length <= maxActiveVersions) {
    return [...versions];
  }
  if (keepOldest) {
    const startIndex =
      activeVersionIndexes[activeVersionIndexes.length - maxActiveVersions];
    return versions.slice(startIndex);
  }
  const endIndex = activeVersionIndexes[maxActiveVersions - 1];
  return versions.slice(0, endIndex + 1);
};

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

  // Leverage cache if there are no other query params.
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
  // Add 1 because slice is [inclusive, exclusive).
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
      // Sort is only necessary for consistency in testing
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

export const mergeVersions = ((existing, incoming, { args, readField }) => {
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

  const boundedVersions = boundVersions({
    activeVersionIds: allActiveVersions,
    keepOldest: Boolean(maxOrder),
    maxActiveVersions: limit * getCachedPageLimit(projectIdentifier),
    readField,
    versions: mergedVersions,
  });

  const retainedVersionIds = new Set(
    boundedVersions.map((version) => getVersionId(version, readField)),
  );
  const retainedActiveVersions = new Set(
    [...allActiveVersions].filter((versionId) =>
      retainedVersionIds.has(versionId),
    ),
  );

  return {
    versions: boundedVersions,
    pagination,
    allActiveVersions: retainedActiveVersions,
  };
}) satisfies FieldMergeFunction<
  Waterfall & { allActiveVersions?: Set<string> }
>;
