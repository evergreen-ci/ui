import { InMemoryCache } from "@apollo/client";
import {
  WaterfallPagination,
  WaterfallBuildVariant,
  WaterfallVersionFragment,
} from "gql/generated/types";
import { IMAGE_EVENT_LIMIT } from "pages/image/tabs/EventLogTab/useImageEvents";
import { mergeBuildVariants, readBuildVariants } from "./buildVariants";
import { mergeVersions, readVersions } from "./versions";

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        distroEvents: {
          keyArgs: ["$distroId"],
        },
        projectEvents: {
          keyArgs: ["$identifier"],
        },
        repoEvents: {
          keyArgs: ["$id"],
        },
        hasVersion: {
          keyArgs: ["$patchId"],
        },
        waterfall: {
          keyArgs: ["$projectIdentifier"],
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

            if (minOrder === 0 && maxOrder === 0) {
              return existing;
            }

            const existingFlattenedVersions =
              readField<WaterfallVersionFragment[]>(
                "flattenedVersions",
                existing,
              ) ?? [];
            const existingBuildVariants =
              readField<WaterfallBuildVariant[]>("buildVariants", existing) ??
              [];
            const pagination =
              readField<WaterfallPagination>("pagination", existing) ?? 0;

            const flattenedVersions = readVersions({
              minOrder,
              maxOrder,
              versions: existingFlattenedVersions,
              readField,
              limit,
            });
            const buildVariants: WaterfallBuildVariant[] = readBuildVariants({
              versions: flattenedVersions,
              buildVariants: existingBuildVariants,
              readField,
            });

            console.log("Read result: ", { flattenedVersions, buildVariants });

            return {
              buildVariants,
              flattenedVersions,
              pagination,
            };
          },
          merge(existing, incoming, { readField }) {
            const existingFlattenedVersions =
              readField<WaterfallVersionFragment[]>(
                "flattenedVersions",
                existing,
              ) ?? [];
            const incomingFlattenedVersions =
              readField<WaterfallVersionFragment[]>(
                "flattenedVersions",
                incoming,
              ) ?? [];

            const existingBuildVariants =
              readField<WaterfallBuildVariant[]>("buildVariants", existing) ??
              [];
            const incomingBuildVariants =
              readField<WaterfallBuildVariant[]>("buildVariants", incoming) ??
              [];

            const pagination =
              readField<WaterfallPagination>("pagination", incoming) ?? 0;

            const flattenedVersions = mergeVersions({
              incomingVersions: incomingFlattenedVersions,
              existingVersions: existingFlattenedVersions,
              readField,
            });
            const buildVariants = mergeBuildVariants({
              incomingBuildVariants,
              existingBuildVariants,
              readField,
              versions: flattenedVersions,
            });

            // To help verify that this is working, inspect these variables and
            // check that they do not keep increasing in length as you page
            // backwards and forwards.
            console.log("Merge result: ", { flattenedVersions, buildVariants });

            return {
              buildVariants,
              flattenedVersions,
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
