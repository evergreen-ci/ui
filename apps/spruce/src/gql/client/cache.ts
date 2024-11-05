import { InMemoryCache } from "@apollo/client";
import {
  WaterfallBuildVariant,
  WaterfallPagination,
  WaterfallVersionFragment,
} from "gql/generated/types";
import { IMAGE_EVENT_LIMIT } from "pages/image/tabs/EventLogTab/useImageEvents";
import { mergeBuildVariants } from "./buildVariants";
import { mergeVersions } from "./versions";

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
          keyArgs: ["options", ["projectIdentifier"]],
          read() {
            return undefined;
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
            console.debug("Merge result: ", {
              flattenedVersions,
              buildVariants,
            });

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
    WaterfallBuildVariant: {
      keyFields: ["version", "id"],
    },
  },
});
