import { InMemoryCache } from "@apollo/client";
import { IMAGE_EVENT_LIMIT } from "pages/image/tabs/EventLogTab/useImageEvents";

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
    // Waterfall: {
    //   fields: {
    //     buildVariants: {
    //       read(existing, { args }) {
    //         const order = args?.minOrder ?? args?.maxOrder;
    //         const limit = args?.limit ?? 0;
    //         // @ts-expect-error
    //         const idx = existing.findIndex((e) => e.order === order);

    //         if (idx < 0) {
    //           return existing;
    //         }
    //         // Paginating Backwards
    //         if (args?.minOrder) {
    //           const endIndex = idx + 1;
    //           const startIndex = endIndex - limit;
    //           // Not correct, does not consider inactive versions
    //           return existing.slice(startIndex, endIndex);
    //         }
    //         // Paginating Forwards
    //         if (args?.maxOrder) {
    //           const startIndex = idx;
    //           const endIndex = startIndex + limit + 1;
    //           return existing.slice(startIndex, endIndex);
    //         }
    //         return existing;
    //       },
    //       merge(existing, incoming, { args }) {
    //         // Paginating Backwards
    //         if (args?.minOrder) {
    //           return [...incoming, ...existing];
    //         }
    //         // Paginating Forwards
    //         if (args?.maxOrder) {
    //           return [...existing, ...incoming];
    //         }
    //         return incoming;
    //       },
    //     },
    //     versions: {
    //       read(existing, { args }) {
    //         const order = args?.minOrder ?? args?.maxOrder;
    //         const limit = args?.limit ?? 0;
    //         // @ts-expect-error
    //         const idx = existing.findIndex((e) => e.order === order);

    //         if (idx < 0) {
    //           return existing;
    //         }
    //         // Paginating Backwards
    //         if (args?.minOrder) {
    //           const endIndex = idx + 1;
    //           const startIndex = endIndex - limit;
    //           return existing.slice(startIndex, endIndex);
    //         }
    //         // Paginating Forwards
    //         if (args?.maxOrder) {
    //           const startIndex = idx;
    //           const endIndex = startIndex + limit + 1;
    //           return existing.slice(startIndex, endIndex);
    //         }
    //         console.log("Read versions: ", existing);
    //         return existing;
    //       },
    //       merge(existing, incoming, { args }) {
    //         console.log("Merge versions: ", existing, incoming);
    //         // Paginating Backwards
    //         if (args?.minOrder) {
    //           return [...incoming, ...existing];
    //         }
    //         // Paginating Forwards
    //         if (args?.maxOrder) {
    //           return [...existing, ...incoming];
    //         }
    //         return incoming;
    //       },
    //     },
    //   },
    // },
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
