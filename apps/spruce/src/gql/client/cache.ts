import { InMemoryCache } from "@apollo/client";
import { IMAGE_EVENT_LIMIT } from "pages/image/tabs/EventLogTab/useImageEvents";
import { mergeTasks, readTasks } from "pages/task/taskTabs/TaskHistory/caching";
import { mergeVersions, readVersions } from "pages/waterfall/caching";

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
          keyArgs: ["$repoId"],
        },
        hasVersion: {
          keyArgs: ["$patchId"],
        },
        waterfall: {
          // All server-side filter params should be used as cache keyArgs to maintain separate caches when they are applied.
          keyArgs: [
            "options",
            [
              "projectIdentifier",
              "requesters",
              "statuses",
              "tasks",
              "variants",
            ],
          ],
          read(...args) {
            return readVersions(...args);
          },
          merge(...args) {
            return mergeVersions(...args);
          },
        },
        taskHistory: {
          keyArgs: [
            "options",
            ["projectIdentifier", "taskName", "buildVariant", "date"],
          ],
          read(...args) {
            return readTasks(...args);
          },
          merge(...args) {
            return mergeTasks(...args);
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
    Project: {
      keyFields: false,
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
        reviewed: {
          read(existing) {
            // TODO DEVPROD-19104: Fetch stored value for this field, and return false if none is found.
            return existing ?? false;
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
    Version: {
      fields: {
        waterfallBuilds: {
          merge(existing, incoming) {
            // Applying a server-side filter causes non-matching versions to return with waterfallBuilds = null.
            // We don't want to overwrite existing build data for versions that previously matched, so check to see if the new waterfallBuilds is defined before merging it with the cache.
            return incoming ?? existing;
          },
        },
      },
    },
  },
});
