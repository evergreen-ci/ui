import {
  BannerTheme,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { JiraTicketType } from "types/jira";

const projectBase: ProjectSettingsQuery["projectSettings"] = {
  aliases: [
    {
      alias: "__github",
      description: "",
      gitTag: "",
      id: "1",
      parameters: [],
      remotePath: "",
      task: ".*",
      taskTags: [],
      variant: ".*",
      variantTags: [],
    },
    {
      alias: "__commit_queue",
      description: "",
      gitTag: "",
      id: "3",
      parameters: [],
      remotePath: "",
      task: "^lint$",
      taskTags: [],
      variant: "^ubuntu1604$",
      variantTags: [],
    },
    {
      alias: "__git_tag",
      description: "",
      gitTag: "tagName",
      id: "5",
      parameters: [],
      remotePath: "./evergreen.yml",
      task: "",
      taskTags: [],
      variant: "",
      variantTags: [],
    },
  ],
  githubAppAuth: {
    appId: 12345,
    privateKey: "{REDACTED}",
  },
  githubWebhooksEnabled: true,
  projectRef: {
    admins: [],
    banner: {
      text: "",
      theme: BannerTheme.Announcement,
    },
    batchTime: 0,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    branch: null,
    buildBaronSettings: {
      ticketCreateIssueType: JiraTicketType.Epic,
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      ticketCreateProject: null,
      ticketSearchProjects: [],
    },
    commitQueue: {
      enabled: null,
    },
    containerSizeDefinitions: [
      {
        cpu: 1024,
        memoryMb: 1024,
        name: "default",
      },
    ],
    deactivatePrevious: null,
    debugSpawnHostsDisabled: null,
    disabledStatsCache: null,
    dispatchingDisabled: null,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    displayName: null,
    enabled: false,
    externalLinks: [
      {
        displayName: "a link display name",
        requesters: ["gitter_request", "patch_request"],
        urlTemplate: "https://a-link-template-{version_id}.com",
      },
      {
        displayName: "periodic build link",
        requesters: ["ad_hoc"],
        urlTemplate: "https://periodic-build-{version_id}.com",
      },
    ],
    githubChecksEnabled: null,
    githubDynamicTokenPermissionGroups: [
      {
        name: "permission-group-1",
        permissions: {
          actions: "read",
          organization_hooks: "read",
        },
      },
      {
        name: "permission-group-2",
        permissions: {
          contents: "admin",
          pull_requests: "write",
        },
      },
    ],
    githubMQTriggerAliases: null,
    githubPermissionGroupByRequester: {
      gitter_request: "permission-group-1",
      trigger_request: "permission-group-2",
    },
    githubPRTriggerAliases: null,
    gitTagAuthorizedTeams: [],
    gitTagAuthorizedUsers: ["privileged"],
    gitTagVersionsEnabled: null,
    id: "projectid",
    identifier: "project",
    manualPrTestingEnabled: null,
    notifyOnBuildFailure: null,
    oldestAllowedMergeBase: "abc",
    owner: "evergreen-ci",
    parsleyFilters: [
      {
        caseSensitive: true,
        description: "Filter One",
        exactMatch: true,
        expression: "filter_1",
      },
      {
        caseSensitive: false,
        description: "Filter Two",
        exactMatch: false,
        expression: "filter_2",
      },
    ],
    patchingDisabled: null,
    patchTriggerAliases: null,
    perfEnabled: true,
    periodicBuilds: [],
    prTestingEnabled: null,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    remotePath: null,
    repo: "evergreen",
    repoRefId: "repo",
    repotrackerDisabled: null,
    restricted: true,
    runEveryMainlineCommit: null,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    spawnHostScriptPath: null,
    stepbackBisect: null,
    stepbackDisabled: null,
    taskAnnotationSettings: {
      fileTicketWebhook: {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        endpoint: null,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        secret: null,
      },
    },
    testSelection: {
      allowed: null,
      defaultEnabled: null,
    },
    triggers: [],
    versionControlEnabled: true,
    waterfallDisabled: null,
    workstationConfig: {
      gitClone: null,
      setupCommands: [
        {
          command: 'echo "hello spruce"',
          directory: "sophie.stadler",
        },
      ],
    },
  },
  vars: {
    adminOnlyVars: ["test_name"],
    privateVars: ["test_name"],
    vars: { test_name: "", test_two: "val" },
    varsDescriptions: {
      test_name: "this is really important",
      test_two: "delete me later",
    },
  },
};

const repoBase: RepoSettingsQuery["repoSettings"] = {
  aliases: [
    {
      alias: "__github_checks",
      description: "",
      gitTag: "",
      id: "2",
      parameters: [],
      remotePath: "",
      task: "",
      taskTags: ["tTag"],
      variant: "",
      variantTags: ["vTag"],
    },
    {
      alias: "my alias name",
      description: "my description",
      gitTag: "",
      id: "4",
      parameters: [],
      remotePath: "",
      task: "",
      taskTags: ["hi"],
      variant: "",
      variantTags: ["okay"],
    },
  ],
  githubWebhooksEnabled: true,
  projectRef: {
    admins: ["admin"],
    batchTime: 12,
    buildBaronSettings: {
      ticketCreateIssueType: JiraTicketType.Epic,
      ticketCreateProject: "EVG",
      ticketSearchProjects: ["EVG"],
    },
    commitQueue: {
      enabled: true,
    },
    deactivatePrevious: true,
    debugSpawnHostsDisabled: false,
    disabledStatsCache: false,
    dispatchingDisabled: true,
    displayName: "",
    externalLinks: [
      {
        displayName: "a link display name",
        requesters: ["gitter_request", "patch_request"],
        urlTemplate: "https://a-link-template-{version_id}.com",
      },
      {
        displayName: "periodic build link",
        requesters: ["ad_hoc"],
        urlTemplate: "https://periodic-build-{version_id}.com",
      },
    ],
    githubChecksEnabled: true,
    githubDynamicTokenPermissionGroups: [
      {
        name: "permission-group-1",
        permissions: {
          actions: "read",
          organization_hooks: "read",
        },
      },
      {
        name: "permission-group-2",
        permissions: {
          contents: "admin",
          pull_requests: "write",
        },
      },
    ],
    githubMQTriggerAliases: ["mq-alias"],
    githubPRTriggerAliases: ["alias1"],
    gitTagAuthorizedTeams: [],
    gitTagAuthorizedUsers: ["admin"],
    gitTagVersionsEnabled: false,
    id: "123",
    manualPrTestingEnabled: false,
    notifyOnBuildFailure: false,
    oldestAllowedMergeBase: "abc",
    owner: "evergreen-ci",
    parsleyFilters: [
      {
        caseSensitive: false,
        description: "Repo Filter",
        exactMatch: false,
        expression: "repo-filter",
      },
    ],
    patchingDisabled: false,
    patchTriggerAliases: [
      {
        alias: "alias1",
        childProjectIdentifier: "spruce",
        parentAsModule: "",
        status: "success",
        taskSpecifiers: [
          {
            patchAlias: "alias2",
            taskRegex: "",
            variantRegex: "",
          },
          {
            patchAlias: "",
            taskRegex: ".*",
            variantRegex: ".*",
          },
        ],
      },
      {
        alias: "mq-alias",
        childProjectIdentifier: "spruce",
        parentAsModule: "",
        status: "success",
        taskSpecifiers: [
          {
            patchAlias: "alias2",
            taskRegex: "",
            variantRegex: "",
          },
          {
            patchAlias: "",
            taskRegex: ".*",
            variantRegex: ".*",
          },
        ],
      },
    ],
    perfEnabled: true,
    periodicBuilds: [
      {
        alias: "",
        configFile: "evergreen.yml",
        cron: "",
        id: "123",
        intervalHours: 24,
        message: "",
        nextRunTime: new Date("2022-03-30T17:07:10.942Z"),
      },
      {
        alias: "test",
        configFile: "evergreen.yml",
        cron: "*/5 * * * *",
        id: "456",
        intervalHours: 0,
        message: "Build Message",
        nextRunTime: new Date("2022-03-30T17:07:10.942Z"),
      },
    ],
    prTestingEnabled: false,
    remotePath: "evergreen.yml",
    repo: "spruce",
    repotrackerDisabled: false,
    restricted: true,
    runEveryMainlineCommit: false,
    spawnHostScriptPath: "/test/path",
    stepbackBisect: true,
    stepbackDisabled: true,
    taskAnnotationSettings: {
      fileTicketWebhook: {
        endpoint: "endpoint",
        secret: "secret",
      },
    },
    testSelection: {
      allowed: true,
      defaultEnabled: true,
    },
    triggers: [
      {
        alias: "my-alias",
        buildVariantRegex: ".*",
        configFile: ".evergreen.yml",
        dateCutoff: 1,
        level: "task",
        project: "spruce",
        status: "succeeded",
        taskRegex: ".*",
        unscheduleDownstreamVersions: true,
      },
    ],
    versionControlEnabled: false,
    waterfallDisabled: false,
    workstationConfig: {
      gitClone: true,
      setupCommands: [],
    },
  },
  vars: {
    adminOnlyVars: [],
    privateVars: [],
    vars: { repo_name: "repo_value" },
    varsDescriptions: {},
  },
};

export const data = {
  projectBase,
  repoBase,
};
