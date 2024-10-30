import { InMemoryCache } from "@apollo/client";
import {
  WaterfallPagination,
  WaterfallBuildVariant,
  Version,
} from "gql/generated/types";
import { IMAGE_EVENT_LIMIT } from "pages/image/tabs/EventLogTab/useImageEvents";
import { mergeBuildVariants, readBuildVariants, readVersions } from "./utils";

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
            const minOrder = args?.options?.minOrder ?? 0;
            const maxOrder = args?.options?.maxOrder ?? 0;
            const limit = variables?.options?.limit ?? 0;

            console.log("Read args: ", { minOrder, maxOrder, limit });

            // A read function should always return undefined if existing is
            // undefined. Returning undefined signals that the field is
            // missing from the cache, which instructs Apollo Client to
            // fetch its value from your GraphQL server.
            if (!existing) {
              return undefined;
            }

            if (minOrder === 0 && maxOrder === 0) {
              return existing;
            }

            const existingFlattenedVersions =
              readField<Version[]>("flattenedVersions", existing) ?? [];
            const existingBuildVariants =
              readField<WaterfallBuildVariant[]>("buildVariants", existing) ??
              [];
            const pagination =
              readField<WaterfallPagination>("pagination", existing) ?? 0;

            const flattenedVersions: Version[] = readVersions({
              minOrder,
              maxOrder,
              versions: existingFlattenedVersions,
              readField,
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
          merge(existing, incoming, { args, readField }) {
            const minOrder = args?.options?.minOrder ?? 0;
            const maxOrder = args?.options?.maxOrder ?? 0;

            const existingFlattenedVersions =
              readField<Version[]>("flattenedVersions", existing) ?? [];
            const incomingFlattenedVersions =
              readField<Version[]>("flattenedVersions", incoming) ?? [];

            console.log({
              existingFlattenedVersions,
              incomingFlattenedVersions,
            });

            const existingBuildVariants =
              readField<WaterfallBuildVariant[]>("buildVariants", existing) ??
              [];
            const incomingBuildVariants =
              readField<WaterfallBuildVariant[]>("buildVariants", incoming) ??
              [];

            const pagination =
              readField<WaterfallPagination>("pagination", incoming) ?? 0;

            // Need to write a more robust merge function to prevent saving overlapping
            // data. This happens because we're naively just appending / preprending incoming
            // data, but not considering the fact that the data may already exist.

            // Paginating backwards.
            if (minOrder > 0) {
              return {
                buildVariants: mergeBuildVariants(
                  incomingBuildVariants,
                  existingBuildVariants,
                  readField,
                ),
                flattenedVersions: [
                  ...incomingFlattenedVersions,
                  ...existingFlattenedVersions,
                ],
                pagination,
              };
            }
            // Paginating forwards.
            if (maxOrder > 0) {
              return {
                buildVariants: mergeBuildVariants(
                  existingBuildVariants,
                  incomingBuildVariants,
                  readField,
                ),
                flattenedVersions: [
                  ...existingFlattenedVersions,
                  ...incomingFlattenedVersions,
                ],
                pagination,
              };
            }
            return incoming;
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
