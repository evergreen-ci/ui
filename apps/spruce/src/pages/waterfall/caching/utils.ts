import { ApolloCache, FieldFunctionOptions } from "@apollo/client";
import { WaterfallQuery } from "gql/generated/types";
import { VERSION_LIMIT } from "../constants";

const DEFAULT_CACHED_PAGE_LIMIT = 6;
const MONGODB_MONGO_CACHED_PAGE_LIMIT = 2;
const MONGODB_MONGO_PROJECT_PREFIX = "mongodb-mongo-";

export type Waterfall = WaterfallQuery["waterfall"];
export type Version = Waterfall["versions"][number];
export type ReadField = FieldFunctionOptions["readField"];

export const getCacheOptions = (args: FieldFunctionOptions["args"]) => ({
  date: args?.options?.date ?? "",
  limit: args?.options?.limit ?? VERSION_LIMIT,
  maxOrder: args?.options?.maxOrder ?? 0,
  minOrder: args?.options?.minOrder ?? 0,
  projectIdentifier: args?.options?.projectIdentifier ?? "",
  revision: args?.options?.revision ?? "",
});

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
