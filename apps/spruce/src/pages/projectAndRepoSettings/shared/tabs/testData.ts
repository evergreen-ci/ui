import {
  BannerTheme,
  ProjectSettingsQuery,
  RepoSettingsQuery,
} from "gql/generated/types";
import { JiraTicketType } from "types/jira";

const projectBase: ProjectSettingsQuery["projectSettings"] = {
  githubAppAuth: {
    appId: 12345,
    privateKey: "{REDACTED}",
  },
  githubWebhooksEnabled: true,
  projectRef: {
    externalLinks: [
      {
        requesters: ["gitter_request", "patch_request"],
        displayName: "a link display name",
        urlTemplate: "https://a-link-template-{version_id}.com",
      },
      {
        requesters: ["ad_hoc"],
        displayName: "periodic build link",
        urlTemplate: "https://periodic-build-{version_id}.com",
      },
    ],
    banner: {
      text: "",
      theme: BannerTheme.Announcement,
    },
    id: "projectid",
    identifier: "project",
    repoRefId: "repo",
    enabled: false,
    owner: "evergreen-ci",
    repo: "evergreen",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    branch: null,
    containerSizeDefinitions: [
      {
        name: "default",
        cpu: 1024,
        memoryMb: 1024,
      },
    ],
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    displayName: null,
    notifyOnBuildFailure: null,
    batchTime: 0,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    remotePath: null,
    oldestAllowedMergeBase: "abc",
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    spawnHostScriptPath: null,
    dispatchingDisabled: null,
    versionControlEnabled: true,
    deactivatePrevious: null,
    repotrackerDisabled: null,
    debugSpawnHostsDisabled: null,
    patchingDisabled: null,
    stepbackDisabled: null,
    stepbackBisect: null,
    disabledStatsCache: null,
    restricted: true,
    admins: [],
    prTestingEnabled: null,
    manualPrTestingEnabled: null,
    githubChecksEnabled: null,
    githubPRTriggerAliases: null,
    githubMQTriggerAliases: null,
    gitTagVersionsEnabled: null,
    gitTagAuthorizedUsers: ["privileged"],
    gitTagAuthorizedTeams: [],
    commitQueue: {
      enabled: null,
    },
    perfEnabled: true,
    testSelection: {
      allowed: null,
      defaultEnabled: null,
    },
    buildBaronSettings: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      ticketCreateProject: null,
      ticketSearchProjects: [],
      ticketCreateIssueType: JiraTicketType.Epic,
    },
    taskAnnotationSettings: {
      fileTicketWebhook: {
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        endpoint: null,
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        secret: null,
      },
    },
    patchTriggerAliases: null,
    workstationConfig: {
      setupCommands: [
        {
          command: 'echo "hello spruce"',
          directory: "sophie.stadler",
        },
      ],
      gitClone: null,
    },
    triggers: [],
    periodicBuilds: [],
    parsleyFilters: [
      {
        description: "Filter One",
        expression: "filter_1",
        caseSensitive: true,
        exactMatch: true,
      },
      {
        description: "Filter Two",
        expression: "filter_2",
        caseSensitive: false,
        exactMatch: false,
      },
    ],
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
          pull_requests: "write",
          contents: "admin",
        },
      },
    ],
    githubPermissionGroupByRequester: {
      gitter_request: "permission-group-1",
      trigger_request: "permission-group-2",
    },
  },
  vars: {
    vars: { test_name: "", test_two: "val" },
    privateVars: ["test_name"],
    adminOnlyVars: ["test_name"],
  },
  aliases: [
    {
      id: "1",
      alias: "__github",
      description: "",
      gitTag: "",
      variant: ".*",
      task: ".*",
      remotePath: "",
      variantTags: [],
      taskTags: [],
      parameters: [],
    },
    {
      id: "3",
      alias: "__commit_queue",
      description: "",
      gitTag: "",
      variant: "^ubuntu1604$",
      task: "^lint$",
      remotePath: "",
      variantTags: [],
      taskTags: [],
      parameters: [],
    },
    {
      id: "5",
      alias: "__git_tag",
      description: "",
      gitTag: "tagName",
      variant: "",
      task: "",
      remotePath: "./evergreen.yml",
      variantTags: [],
      taskTags: [],
      parameters: [],
    },
  ],
};

const repoBase: RepoSettingsQuery["repoSettings"] = {
  githubWebhooksEnabled: true,
  projectRef: {
    externalLinks: [
      {
        requesters: ["gitter_request", "patch_request"],
        displayName: "a link display name",
        urlTemplate: "https://a-link-template-{version_id}.com",
      },
      {
        requesters: ["ad_hoc"],
        displayName: "periodic build link",
        urlTemplate: "https://periodic-build-{version_id}.com",
      },
    ],
    id: "123",
    owner: "evergreen-ci",
    repo: "spruce",
    displayName: "",
    batchTime: 12,
    remotePath: "evergreen.yml",
    spawnHostScriptPath: "/test/path",
    oldestAllowedMergeBase: "abc",
    dispatchingDisabled: true,
    versionControlEnabled: false,
    deactivatePrevious: true,
    repotrackerDisabled: false,
    debugSpawnHostsDisabled: false,
    notifyOnBuildFailure: false,
    patchingDisabled: false,
    stepbackDisabled: true,
    stepbackBisect: true,
    disabledStatsCache: false,
    restricted: true,
    admins: ["admin"],
    prTestingEnabled: false,
    manualPrTestingEnabled: false,
    githubChecksEnabled: true,
    githubPRTriggerAliases: ["alias1"],
    githubMQTriggerAliases: ["mq-alias"],
    gitTagVersionsEnabled: false,
    gitTagAuthorizedUsers: ["admin"],
    gitTagAuthorizedTeams: [],
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
          pull_requests: "write",
          contents: "admin",
        },
      },
    ],
    commitQueue: {
      enabled: true,
    },
    perfEnabled: true,
    testSelection: {
      allowed: true,
      defaultEnabled: true,
    },
    buildBaronSettings: {
      ticketCreateProject: "EVG",
      ticketSearchProjects: ["EVG"],
      ticketCreateIssueType: JiraTicketType.Epic,
    },
    taskAnnotationSettings: {
      fileTicketWebhook: {
        endpoint: "endpoint",
        secret: "secret",
      },
    },
    patchTriggerAliases: [
      {
        alias: "alias1",
        childProjectIdentifier: "spruce",
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
        status: "success",
        parentAsModule: "",
      },
      {
        alias: "mq-alias",
        childProjectIdentifier: "spruce",
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
        status: "success",
        parentAsModule: "",
      },
    ],
    workstationConfig: {
      setupCommands: [],
      gitClone: true,
    },
    triggers: [
      {
        project: "spruce",
        dateCutoff: 1,
        level: "task",
        status: "succeeded",
        buildVariantRegex: ".*",
        taskRegex: ".*",
        configFile: ".evergreen.yml",
        alias: "my-alias",
        unscheduleDownstreamVersions: true,
      },
    ],
    periodicBuilds: [
      {
        alias: "",
        configFile: "evergreen.yml",
        id: "123",
        intervalHours: 24,
        cron: "",
        message: "",
        nextRunTime: new Date("2022-03-30T17:07:10.942Z"),
      },
      {
        alias: "test",
        configFile: "evergreen.yml",
        id: "456",
        intervalHours: 0,
        cron: "*/5 * * * *",
        message: "Build Message",
        nextRunTime: new Date("2022-03-30T17:07:10.942Z"),
      },
    ],
    parsleyFilters: [
      {
        description: "Repo Filter",
        expression: "repo-filter",
        caseSensitive: false,
        exactMatch: false,
      },
    ],
  },
  vars: {
    vars: { repo_name: "repo_value" },
    privateVars: [],
    adminOnlyVars: [],
  },
  aliases: [
    {
      id: "2",
      alias: "__github_checks",
      description: "",
      gitTag: "",
      variant: "",
      task: "",
      remotePath: "",
      variantTags: ["vTag"],
      taskTags: ["tTag"],
      parameters: [],
    },
    {
      id: "4",
      alias: "my alias name",
      description: "my description",
      gitTag: "",
      variant: "",
      task: "",
      remotePath: "",
      variantTags: ["okay"],
      taskTags: ["hi"],
      parameters: [],
    },
  ],
};

export const data = {
  projectBase,
  repoBase,
};
