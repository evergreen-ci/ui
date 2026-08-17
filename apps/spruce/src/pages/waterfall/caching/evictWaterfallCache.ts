import { ApolloCache } from "@apollo/client";

interface EvictWaterfallCacheOptions {
  broadcast?: boolean;
}

export const evictWaterfallCache = (
  cache: ApolloCache,
  { broadcast }: EvictWaterfallCacheOptions = {},
) => {
  cache.evict({
    broadcast,
    id: "ROOT_QUERY",
    fieldName: "waterfall",
  });
  cache.gc();
};
