import { InMemoryCache } from "@apollo/client";
import { readTaskReviewed } from "components/TaskReview/caching";
import { mergeTasks, readTasks } from "pages/task/taskTabs/TaskHistory/caching";
import { mergeVersions, readVersions } from "pages/waterfall/caching";

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
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
    AdminSettings: {
      merge: true,
    },
    Project: {
      merge: true,
    },
    ProjectAlias: {
      keyFields: false,
    },
    User: {
      keyFields: ["userId"],
      fields: {
        displayName: {
          read(existing, { readField }) {
            // Return userId if displayName is not set so that displayName is always populated
            return existing || readField("userId");
          },
        },
        userId: {
          read(existing, { readField }) {
            // Service users don't have userIds, just displayNames. Make sure both fields are set.
            return existing || readField("displayName");
          },
        },
      },
    },
    UserLite: {
      keyFields: ["id"],
      fields: {
        displayName: {
          read(existing, { readField }) {
            // Return id if displayName is not set so that displayName is always populated
            return existing || readField("id");
          },
        },
        id: {
          read(existing, { readField }) {
            // Service users don't have ids, just displayNames. Make sure both fields are set.
            return existing || readField("displayName");
          },
        },
      },
    },
    UserConfig: {
      keyFields: ["user"],
    },
    UserSettings: {
      keyFields: false,
      merge: true,
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
          read(...args) {
            return readTaskReviewed(...args);
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
    Permissions: {
      keyFields: false,
      merge: true,
    },
    ServiceFlag: {
      keyFields: ["name"],
    },
    SpruceConfig: {
      // SpruceConfig is a singleton type with no identifying field
      keyFields: [],
      merge: true,
    },
    UIConfig: {
      keyFields: false,
      merge: true,
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
