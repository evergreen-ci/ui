import { InMemoryCache, InMemoryCacheConfig } from "@apollo/client";
import { readTaskReviewed } from "components/TaskReview/caching";
import { mergeTasks, readTasks } from "pages/task/taskTabs/TaskHistory/caching";
import { mergeVersions, readVersions } from "pages/waterfall/caching";

export const cacheConfig = {
  typePolicies: {
    Query: {
      fields: {
        hasVersion: {
          keyArgs: ["$patchId"],
        },
        waterfall: {
          // Normalized build/task payloads belong to one current filter context.
          keyArgs: ["options", ["projectIdentifier"]],
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
      // AdminSettings is a singleton type with no identifying field
      keyFields: [],
      merge: true,
    },
    Project: {
      merge: true,
    },
    ProjectAlias: {
      keyFields: false,
    },
    User: {
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
    WaterfallBuild: {
      fields: {
        tasks: {
          merge: false,
        },
      },
    },
    Version: {
      fields: {
        waterfallBuilds: {
          merge: false,
        },
      },
    },
  },
} satisfies InMemoryCacheConfig;

export const cache = new InMemoryCache(cacheConfig);
