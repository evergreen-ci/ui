import { ApolloCache, FieldFunctionOptions } from "@apollo/client";
import { WaterfallOptions, WaterfallQuery } from "gql/generated/types";
import { VERSION_LIMIT } from "../constants";

const DEFAULT_CACHED_PAGE_LIMIT = 6;
const MONGODB_MONGO_CACHED_PAGE_LIMIT = 2;
const MONGODB_MONGO_PROJECT_PREFIX = "mongodb-mongo-";

export type Waterfall = WaterfallQuery["waterfall"];
export type Version = Waterfall["versions"][number];
export type ReadField = FieldFunctionOptions["readField"];
export type CachedWaterfall = Waterfall & {
  filterContext: string;
  lastRequest: string;
  lastPageVersionIds: string[];
  allActiveVersions: Set<string>;
};

const normalizeFilters = (filters: WaterfallOptions["tasks"]) =>
  [...new Set(filters ?? [])].sort();

export const getFilterContext = (options: Partial<WaterfallOptions>) =>
  JSON.stringify({
    tasks: normalizeFilters(options.tasks),
    variants: normalizeFilters(options.variants),
    statuses: normalizeFilters(options.statuses),
    requesters: normalizeFilters(options.requesters),
    omitInactiveBuilds: options.omitInactiveBuilds ?? false,
    includeAllBuildsAndTasks: options.includeAllBuildsAndTasks ?? true,
    taskCaseSensitive: options.tasks?.length
      ? (options.taskCaseSensitive ?? null)
      : null,
    variantCaseSensitive: options.variants?.length
      ? (options.variantCaseSensitive ?? null)
      : null,
  });

export const getCacheOptions = (args: FieldFunctionOptions["args"]) => {
  const options: Partial<WaterfallOptions> = args?.options ?? {};
  const anchors = {
    date: options.date ?? "",
    limit: options.limit ?? VERSION_LIMIT,
    maxOrder: options.maxOrder ?? 0,
    minOrder: options.minOrder ?? 0,
    revision: options.revision ?? "",
  };
  return {
    ...anchors,
    projectIdentifier: options.projectIdentifier ?? "",
    filterContext: getFilterContext(options),
    lastRequest: JSON.stringify(anchors),
  };
};

export const getCachedPageLimit = (projectIdentifier: string) =>
  projectIdentifier.startsWith(MONGODB_MONGO_PROJECT_PREFIX)
    ? MONGODB_MONGO_CACHED_PAGE_LIMIT
    : DEFAULT_CACHED_PAGE_LIMIT;

export const getVersionId = (version: Version, readField: ReadField) =>
  readField<string>("id", version) ?? "";

export const getVersionOrder = (version: Version, readField: ReadField) =>
  readField<number>("order", version) ?? 0;

export const deduplicateAndSortVersions = (
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

export const evictWaterfallCache = (
  cache: ApolloCache,
  { broadcast }: { broadcast?: boolean } = {},
) => {
  cache.evict({
    broadcast,
    id: "ROOT_QUERY",
    fieldName: "waterfall",
  });
  cache.gc();
};
