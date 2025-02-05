import { InMemoryCache } from "@apollo/client";
import { IMAGE_EVENT_LIMIT } from "pages/image/tabs/EventLogTab/useImageEvents";
import { WaterfallQuery } from "../generated/types";

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
          read(existing, { args, readField, variables }) {
            if (!existing) {
              return undefined;
            }

            const minOrder = args?.options?.minOrder ?? 0;
            const maxOrder = args?.options?.maxOrder ?? 0;
            const limit = variables?.options?.limit ?? 0;

            const existingVersions =
              readField<WaterfallQuery["waterfall"]["flattenedVersions"]>(
                "flattenedVersions",
                existing,
              ) ?? [];

            const idx = existingVersions.findIndex((v) => {
              const versionOrder = readField<number>("order", v) ?? 0;
              if (minOrder) {
                return versionOrder - 1 === minOrder;
              }
              if (maxOrder) {
                return versionOrder + 1 === maxOrder;
              }
              return false;
            });

            if (idx === -1) {
              return undefined;
            }

            let startIndex = maxOrder ? idx : 0;
            let endIndex = maxOrder ? existingVersions.length : idx;
            let numActivated = 0;

            // Count backwards for paginating backwards.
            if (minOrder) {
              for (let i = endIndex; i >= 0; i--) {
                if (readField<boolean>("activated", existingVersions[i])) {
                  numActivated += 1;
                  if (numActivated === limit) {
                    startIndex = i;
                    if (i > 0) {
                      // Check for leading inactive versions
                      if (
                        [...Array(i).keys()].every(
                          (index) =>
                            readField<boolean>(
                              "activated",
                              existingVersions[index],
                            ) === false,
                        )
                      ) {
                        startIndex = 0;
                      }
                    }
                    break;
                  }
                }
              }
            }

            // Count forwards for paginating forwards.
            if (maxOrder) {
              for (let i = startIndex; i < existingVersions.length; i++) {
                if (readField<boolean>("activated", existingVersions[i])) {
                  numActivated += 1;
                  if (numActivated === limit) {
                    endIndex = i;
                    break;
                  }
                }
              }
            }

            // Add 1 because slice is [inclusive, exclusive).
            const flattenedVersions = existingVersions.slice(
              startIndex,
              endIndex + 1,
            );

            const prevOrderNumber =
              startIndex === 0
                ? 0
                : (readField<number>("order", flattenedVersions[0]) ?? 0);
            const lastVersionOrder = readField<number>(
              "order",
              flattenedVersions[flattenedVersions.length - 1],
            );
            const nextOrderNumber =
              !lastVersionOrder || lastVersionOrder === 1
                ? 0
                : lastVersionOrder;

            return {
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
              readField<WaterfallQuery["waterfall"]["flattenedVersions"]>(
                "flattenedVersions",
                existing,
              ) ?? [];
            const incomingVersions =
              readField<WaterfallQuery["waterfall"]["flattenedVersions"]>(
                "flattenedVersions",
                incoming,
              ) ?? [];
            const versions = [...existingVersions, ...incomingVersions];

            // Use a map to enforce that there are no duplicates.
            const versionsMap = new Map();
            versions.forEach((v) => {
              const order = readField<number>("order", v) ?? 0;
              versionsMap.set(order, v);
            });

            const v = Array.from(versionsMap.values()).sort((a, b) => {
              const aOrder = readField<number>("order", a) ?? 0;
              const bOrder = readField<number>("order", b) ?? 0;
              return bOrder - aOrder;
            });

            const pagination = readField("pagination", incoming);
            return {
              flattenedVersions: v,
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
    WaterfallTask: {
      keyFields: false,
    },
  },
});
