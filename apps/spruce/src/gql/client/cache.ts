import { InMemoryCache } from "@apollo/client";
import {
  WaterfallBuild,
  WaterfallPagination,
  WaterfallVersionFragment,
} from "gql/generated/types";
import { IMAGE_EVENT_LIMIT } from "pages/image/tabs/EventLogTab/useImageEvents";
import { mergeVersions, mergeBuilds } from "./mergeFunctions";
import { readBuilds, readVersions } from "./readFunctions";

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        distroEvents: {
          keyArgs: ["$distroId"],
        },
        projectEvents: {
          keyArgs: ["$projectIdentifier"],
        },
        repoEvents: {
          keyArgs: ["$id"],
        },
        hasVersion: {
          keyArgs: ["$patchId"],
        },
        waterfall: {
          keyArgs: ["options", ["projectIdentifier"]],
          read(existing, { args, readField, variables }) {
            // A read function should always return undefined if existing is
            // undefined. Returning undefined signals that the field is
            // missing from the cache, which instructs Apollo Client to
            // fetch its value from your GraphQL server.
            if (!existing) {
              return undefined;
            }

            const minOrder = args?.options?.minOrder ?? 0;
            const maxOrder = args?.options?.maxOrder ?? 0;
            const limit = variables?.options?.limit ?? 0;

            const existingVersions =
              readField<WaterfallVersionFragment[]>(
                "flattenedVersions",
                existing,
              ) ?? [];

            const flattenedVersions = readVersions({
              maxOrder,
              minOrder,
              limit,
              versions: existingVersions,
              readField,
            });

            const allVersionIds: string[] = [];
            const activeVersionIds: string[] = [];

            flattenedVersions.forEach((v) => {
              const activated = readField<boolean>("activated", v) ?? false;
              const versionId = readField<string>("id", v) ?? "";
              if (activated) {
                activeVersionIds.push(versionId);
              }
              allVersionIds.push(versionId);
            });

            if (activeVersionIds.length < limit) {
              console.log("Number of active versions is below limit: ", {
                flattenedVersions,
                activeVersionIds,
                allVersionIds,
              });
              return undefined;
            }

            const existingBuilds =
              readField<WaterfallBuild[]>("flattenedBuilds", existing) ?? [];

            const builds = readBuilds({
              versionIds: allVersionIds,
              builds: existingBuilds,
              readField,
            });

            const prevOrderNumber =
              readField<number>("order", flattenedVersions[0]) ?? 0;
            const nextOrderNumber =
              readField<number>(
                "order",
                flattenedVersions[flattenedVersions.length - 1],
              ) ?? 0;

            console.log("Read result: ", {
              builds,
              flattenedVersions,
              prevOrderNumber,
              nextOrderNumber,
            });

            return {
              flattenedBuilds: builds,
              flattenedVersions,
              pagination: {
                prevPageOrder: prevOrderNumber,
                nextPageOrder: nextOrderNumber,
                hasNextPage: nextOrderNumber > 0,
                hasPrevPage: prevOrderNumber > 0,
              },
            };
          },
          merge(existing, incoming, { readField }) {
            const existingVersions =
              readField<WaterfallVersionFragment[]>(
                "flattenedVersions",
                existing,
              ) ?? [];
            const incomingVersions =
              readField<WaterfallVersionFragment[]>(
                "flattenedVersions",
                incoming,
              ) ?? [];
            const versions = mergeVersions({
              existingVersions,
              incomingVersions,
              readField,
            });

            const existingBuilds =
              readField<WaterfallBuild[]>("flattenedBuilds", existing) ?? [];
            const incomingBuilds =
              readField<WaterfallBuild[]>("flattenedBuilds", incoming) ?? [];
            const flattenedBuilds = mergeBuilds({
              existingBuilds,
              incomingBuilds,
              readField,
            });

            const pagination = readField<WaterfallPagination>(
              "pagination",
              incoming,
            );

            // To help verify that this is working, inspect these variables and
            // check that they do not keep increasing in length as you page
            // backwards (since those results were already seen and merged).
            console.log("Merge result: ", {
              versions,
              flattenedBuilds,
            });

            return {
              flattenedBuilds,
              flattenedVersions: versions,
              pagination,
            };
          },
        },
      },
    },
    GeneralSubscription: {
      keyFields: false,
    },
    DistroEventsPayload: {
      fields: {
        count: {
          merge(existing = 0, incoming = 0) {
            return existing + incoming;
          },
        },
        eventLogEntries: {
          merge(existing = [], incoming = []) {
            return [...existing, ...incoming];
          },
        },
      },
    },
    Image: {
      fields: {
        events: {
          keyArgs: ["$imageId"],
          merge(existing, incoming, { args }) {
            const {
              count: existingCount = 0,
              eventLogEntries: existingEntries = [],
            } = existing || {};
            const { count: incomingCount, eventLogEntries: incomingEntries } =
              incoming;
            const count = existingCount + incomingCount;
            const page = args?.page ?? 0;
            const merged = existingEntries ? existingEntries.slice(0) : [];
            for (let i = 0; i < incomingEntries.length; ++i) {
              merged[page * IMAGE_EVENT_LIMIT + i] = incomingEntries[i];
            }
            return {
              count,
              eventLogEntries: merged,
            };
          },
        },
      },
    },
    ProjectEvents: {
      fields: {
        count: {
          merge(existing = 0, incoming = 0) {
            return existing + incoming;
          },
        },
        eventLogEntries: {
          merge(existing = [], incoming = []) {
            return [...existing, ...incoming];
          },
        },
      },
    },
    ProjectAlias: {
      keyFields: false,
    },
    User: {
      keyFields: ["userId"],
    },
    Task: {
      keyFields: ["execution", "id"],
      fields: {
        annotation: {
          merge(existing, incoming, { mergeObjects }) {
            return mergeObjects(existing, incoming);
          },
        },
        taskLogs: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
    Patch: {
      fields: {
        time: {
          merge(existing, incoming, { mergeObjects }) {
            return mergeObjects(existing, incoming);
          },
        },
      },
    },
  },
});
