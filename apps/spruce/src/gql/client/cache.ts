import { InMemoryCache } from "@apollo/client";
import { readTaskReviewed } from "components/TaskReview/caching";
import { mergeTasks, readTasks } from "pages/task/taskTabs/TaskHistory/caching";
import { mergeVersions, readVersions } from "pages/waterfall/caching";

export const cache = new InMemoryCache({
  typePolicies: {
    AdminSettings: {
      merge: true,
    },
    GeneralSubscription: {
      keyFields: false,
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
    Project: {
      merge: true,
    },
    ProjectAlias: {
      keyFields: false,
    },
    Query: {
      fields: {
        hasVersion: {
          keyArgs: ["$patchId"],
        },
        taskHistory: {
          keyArgs: [
            "options",
            ["projectIdentifier", "taskName", "buildVariant", "date"],
          ],
          merge(...args) {
            return mergeTasks(...args);
          },
          read(...args) {
            return readTasks(...args);
          },
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
          merge(...args) {
            return mergeVersions(...args);
          },
          read(...args) {
            return readVersions(...args);
          },
        },
      },
    },
    ServiceFlag: {
      keyFields: ["name"],
    },
    SpruceConfig: {
      // SpruceConfig is a singleton type with no identifying field
      keyFields: [],
      merge: true,
    },
    Task: {
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
      keyFields: ["execution", "id"],
    },
    UIConfig: {
      keyFields: false,
      merge: true,
    },
    User: {
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
      keyFields: ["userId"],
    },
    UserConfig: {
      keyFields: ["user"],
    },
    UserLite: {
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
      keyFields: ["id"],
    },
    UserSettings: {
      keyFields: false,
      merge: true,
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
    WaterfallTask: {
      keyFields: false,
    },
  },
});
