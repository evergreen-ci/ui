import { InMemoryCache } from "@apollo/client";
import { IMAGE_EVENT_LIMIT } from "pages/image/tabs/EventLogTab/useImageEvents";
import { mergeVersions, readVersions } from "pages/waterfall/caching";

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
          read(...args) {
            return readVersions(...args);
          },
          merge(...args) {
            return mergeVersions(...args);
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
