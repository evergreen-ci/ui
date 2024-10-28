import { InMemoryCache } from "@apollo/client";
import { WaterfallBuildVariant, WaterfallVersion } from "gql/generated/types";
import { IMAGE_EVENT_LIMIT } from "pages/image/tabs/EventLogTab/useImageEvents";
import {
  findIndexMatchingOrder,
  mergeBuildVariants,
  readBuildVariants,
} from "./utils";

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
          // The read function is not correct because it does not account for inactive versions.
          // It only works if every version on a waterfall is activated.
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

            // Not correct, because a user can load page with a min or max order applied
            // and in that case it should also returning existing.
            if (minOrder === 0 && maxOrder === 0) {
              return existing;
            }

            const existingVersions =
              readField<WaterfallVersion[]>("versions", existing) ?? [];
            const existingBuildVariants =
              readField<WaterfallBuildVariant[]>("buildVariants", existing) ??
              [];
            const nextPageOrder =
              readField<number>("nextPageOrder", existing) ?? 0;
            const prevPageOrder =
              readField<number>("prevPageOrder", existing) ?? 0;

            const versions: WaterfallVersion[] = [];
            const buildVariants: WaterfallBuildVariant[] = [];

            // Paginating backwards
            if (minOrder > 0) {
              const versionIdx = findIndexMatchingOrder(
                existingVersions,
                minOrder + 1,
                readField,
              );
              versions.push(
                ...existingVersions.slice(
                  versionIdx - limit + 1,
                  versionIdx + 1,
                ),
              );
              buildVariants.push(
                ...readBuildVariants(
                  existingBuildVariants,
                  versionIdx - limit + 1,
                  versionIdx + 1,
                  readField,
                ),
              );
            }
            // Paginating forwards
            if (maxOrder > 0) {
              const versionIdx = findIndexMatchingOrder(
                existingVersions,
                maxOrder - 1,
                readField,
              );
              versions.push(
                ...existingVersions.slice(versionIdx, versionIdx + limit),
              );
              buildVariants.push(
                ...readBuildVariants(
                  existingBuildVariants,
                  versionIdx,
                  versionIdx + limit,
                  readField,
                ),
              );
            }

            console.log("Read result: ", { versions, buildVariants });

            return {
              buildVariants,
              versions,
              prevPageOrder,
              nextPageOrder,
            };
          },
          merge(existing, incoming, { args, readField }) {
            const minOrder = args?.options?.minOrder ?? 0;
            const maxOrder = args?.options?.maxOrder ?? 0;

            const existingVersions =
              readField<WaterfallVersion[]>("versions", existing) ?? [];
            const incomingVersions =
              readField<WaterfallVersion[]>("versions", incoming) ?? [];

            const existingBuildVariants =
              readField<WaterfallBuildVariant[]>("buildVariants", existing) ??
              [];
            const incomingBuildVariants =
              readField<WaterfallBuildVariant[]>("buildVariants", incoming) ??
              [];

            const nextPageOrder =
              readField<number>("nextPageOrder", incoming) ?? 0;
            const prevPageOrder =
              readField<number>("prevPageOrder", incoming) ?? 0;

            // Paginating backwards
            if (minOrder > 0) {
              return {
                buildVariants: mergeBuildVariants(
                  incomingBuildVariants,
                  existingBuildVariants,
                  readField,
                ),
                versions: [...incomingVersions, ...existingVersions],
                prevPageOrder,
                nextPageOrder,
              };
            }
            // Paginating forwards
            if (maxOrder > 0) {
              return {
                buildVariants: mergeBuildVariants(
                  existingBuildVariants,
                  incomingBuildVariants,
                  readField,
                ),
                versions: [...existingVersions, ...incomingVersions],
                prevPageOrder,
                nextPageOrder,
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
