import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  BuildBaronQuery,
  BuildBaronQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
  SpruceConfigQuery,
  SpruceConfigQueryVariables,
  TaskOwnerTeamsForTaskQuery,
  TaskOwnerTeamsForTaskQueryVariables,
  TaskStatusesQuery,
  TaskStatusesQueryVariables,
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables,
  UserSettingsQuery,
  UserSettingsQueryVariables,
  VersionQuery,
  VersionQueryVariables,
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables,
} from "gql/generated/types";
import {
  BASE_VERSION_AND_TASK,
  BUILD_BARON,
  LAST_MAINLINE_COMMIT,
  SPRUCE_CONFIG,
  TASK_OWNER_TEAM,
  TASK_STATUSES,
  TASK_TEST_SAMPLE,
  USER_SETTINGS,
  VERSION,
  VERSION_UPSTREAM_PROJECT,
} from "gql/queries";

export const getSpruceConfigMock: ApolloMock<
  SpruceConfigQuery,
  SpruceConfigQueryVariables
> = {
  request: {
    query: SPRUCE_CONFIG,
    variables: {},
  },
  result: {
    data: {
      spruceConfig: {
        bannerTheme: "warning",
        banner: "",
        ui: {
          defaultProject: "evergreen",
          __typename: "UIConfig",
        },
        containerPools: {
          pools: [
            {
              distro: "localhost",
              id: "test-pool",
              maxContainers: 5,
              port: 1234,
            },
          ],
        },
        jira: {
          host: "jira.mongodb.org",
          __typename: "JiraConfig",
          email: "test@example.com",
        },
        providers: {
          aws: {
            maxVolumeSizePerUser: 1500,
            pod: null,
            __typename: "AWSConfig",
          },
          __typename: "CloudProviderConfig",
        },
        slack: {
          name: "everygreen_slack",
        },
        spawnHost: {
          spawnHostsPerUser: 6,
          unexpirableHostsPerUser: 2,
          unexpirableVolumesPerUser: 1,
          __typename: "SpawnHostConfig",
        },
        __typename: "SpruceConfig",
      },
    },
  },
};

export const getUserSettingsMock: ApolloMock<
  UserSettingsQuery,
  UserSettingsQueryVariables
> = {
  request: {
    query: USER_SETTINGS,
    variables: {},
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "user.id",
        settings: {
          __typename: "UserSettings",
          dateFormat: "MM/dd/yyyy",
          region: "us-east-1",
          slackMemberId: "1234",
          slackUsername: "user",
          timeFormat: "H:mm:ss",
          timezone: "America/New_York",
          githubUser: {
            lastKnownAs: "user",
            __typename: "GithubUser",
          },
          notifications: {
            __typename: "Notifications",
            buildBreak: "",
            patchFinish: "",
            patchFirstFailure: "",
            spawnHostExpiration: "",
            spawnHostOutcome: "",
          },
          useSpruceOptions: {
            __typename: "UseSpruceOptions",
            spruceV1: true,
          },
        },
      },
    },
  },
};

export const baseVersionAndTaskMock: ApolloMock<
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables
> = {
  request: {
    query: BASE_VERSION_AND_TASK,
    variables: {
      taskId:
        "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
    },
  },
  result: {
    data: {
      __typename: "Query",
      task: {
        __typename: "Task",
        id: "evergreen_lint_lint_agent_patch_f4fe4814088e13b8ef423a73d65a6e0a5579cf93_61a8edf132f41750ab47bc72_21_12_02_16_01_54",
        baseTask: {
          __typename: "Task",
          id: "base_task_id",
          displayStatus: "success",
          execution: 0,
        },
        buildVariant: "lint",
        displayName: "lint-agent",
        displayStatus: "success",
        execution: 0,
        projectIdentifier: "evergreen",
        versionMetadata: {
          __typename: "Version",
          id: "version_id",
          baseVersion: {
            __typename: "Version",
            id: "base_version_id",
            order: 3676,
          },
          isPatch: true,
        },
      },
    },
  },
};

export const lastMainlineCommitMock: ApolloMock<
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables
> = {
  request: {
    query: LAST_MAINLINE_COMMIT,
    variables: {
      projectIdentifier: "evergreen",
      skipOrderNumber: 3676,
      buildVariantOptions: {
        variants: ["^lint$"],
        tasks: ["^lint-agent$"],
      },
    },
  },
  result: {
    data: {
      __typename: "Query",
      mainlineCommits: {
        __typename: "MainlineCommits",
        versions: [
          {
            __typename: "MainlineCommitVersion",
            version: {
              __typename: "Version",
              id: "version_id",
              buildVariants: [
                {
                  __typename: "GroupedBuildVariant",
                  tasks: [
                    {
                      __typename: "Task",
                      id: "task_id",
                      displayStatus: "success",
                      execution: 0,
                      order: 3676,
                    },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
  },
};

export const taskTestSampleMock: ApolloMock<
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables
> = {
  request: {
    query: TASK_TEST_SAMPLE,
    variables: {
      versionId: "evergreen_d4cf298cf0b2536fb3bff875775b93a9ceafb75c",
      taskIds: [
        "some_id_1",
        "some_id_2",
        "some_id_3",
        "some_id_4",
        "some_id_5",
        "some_id_6",
        "some_id_7",
      ],
      filters: [],
    },
  },
  result: {
    data: {
      __typename: "Query",
      taskTestSample: [
        {
          __typename: "TaskTestResultSample",
          execution: 0,
          matchingFailedTestNames: ["test1", "test2"],
          taskId: "some_id_1",
          totalTestCount: 10,
        },
      ],
    },
  },
};

export const versionMock: ApolloMock<VersionQuery, VersionQueryVariables> = {
  request: {
    query: VERSION,
    variables: {
      id: "1",
    },
  },
  result: {
    data: {
      __typename: "Query",
      version: {
        __typename: "Version",
        id: "version_id",
        activated: true,
        author: "author",
        authorEmail: "author@example.com",
        baseVersion: {
          __typename: "Version",
          id: "base_version_id",
        },
        createTime: new Date(),
        errors: [],
        externalLinksForMetadata: [],
        finishTime: new Date(),
        gitTags: [],
        ignored: false,
        isPatch: false,
        message: "commit message",
        order: 1234,
        parameters: [],
        project: "project",
        projectIdentifier: "project",
        repo: "repo",
        requester: "requester",
        revision: "revision",
        startTime: new Date(),
        status: "success",
        upstreamProject: null,
        warnings: [],
      },
    },
  },
};

export const versionMock1234: ApolloMock<VersionQuery, VersionQueryVariables> =
  {
    request: {
      query: VERSION,
      variables: {
        id: "version-1234",
      },
    },
    result: {
      data: {
        __typename: "Query",
        version: {
          __typename: "Version",
          id: "version_id",
          activated: true,
          author: "author",
          authorEmail: "author@example.com",
          baseVersion: {
            __typename: "Version",
            id: "base_version_id",
          },
          createTime: new Date(),
          errors: [],
          externalLinksForMetadata: [],
          finishTime: new Date(),
          gitTags: [],
          ignored: false,
          isPatch: false,
          message: "commit message",
          order: 1234,
          parameters: [],
          project: "project",
          projectIdentifier: "project",
          repo: "repo",
          requester: "requester",
          revision: "revision",
          startTime: new Date(),
          status: "success",
          upstreamProject: null,
          warnings: [],
        },
      },
    },
  };

export const buildBaronMock: ApolloMock<
  BuildBaronQuery,
  BuildBaronQueryVariables
> = {
  request: {
    query: BUILD_BARON,
    variables: {
      taskId: "task_id",
      execution: 0,
    },
  },
  result: {
    data: {
      __typename: "Query",
      buildBaron: {
        __typename: "BuildBaron",
        bbTicketCreationDefined: true,
        buildBaronConfigured: true,
        searchReturnInfo: {
          __typename: "SearchReturnInfo",
          featuresURL: "https://example.com/features",
          issues: [
            {
              __typename: "JiraTicket",
              fields: {
                __typename: "TicketFields",
                assigneeDisplayName: "Assignee",
                created: "2023-05-30T12:00:00Z",
                resolutionName: "Fixed",
                status: {
                  __typename: "JiraStatus",
                  id: "status_id",
                  name: "Done",
                },
                summary: "Issue summary",
                updated: "2023-05-30T14:00:00Z",
              },
              key: "ISSUE-123",
            },
          ],
          search: "search query",
          source: "JIRA",
        },
      },
    },
  },
};

export const taskOwnerTeamsMock: ApolloMock<
  TaskOwnerTeamsForTaskQuery,
  TaskOwnerTeamsForTaskQueryVariables
> = {
  request: {
    query: TASK_OWNER_TEAM,
    variables: {
      taskId: "task_id",
      execution: 0,
    },
  },
  result: {
    data: {
      __typename: "Query",
      task: {
        __typename: "Task",
        id: "task_id",
        execution: 0,
        taskOwnerTeam: {
          __typename: "TaskOwnerTeam",
          messages: "",
          teamName: "Team Name",
        },
      },
    },
  },
};

export const taskStatusesMock: ApolloMock<
  TaskStatusesQuery,
  TaskStatusesQueryVariables
> = {
  request: {
    query: TASK_STATUSES,
    variables: {
      id: "1",
    },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: "1",
        baseTaskStatuses: [],
        taskStatuses: [],
      },
    },
  },
};

export const taskStatusesUndefinedMock: ApolloMock<
  TaskStatusesQuery,
  TaskStatusesQueryVariables
> = {
  request: {
    query: TASK_STATUSES,
    variables: {
      id: undefined as unknown as string,
    },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: "",
        baseTaskStatuses: [],
        taskStatuses: [],
      },
    },
  },
};

export const taskStatusesEmptyStringMock: ApolloMock<
  TaskStatusesQuery,
  TaskStatusesQueryVariables
> = {
  request: {
    query: TASK_STATUSES,
    variables: {
      id: "",
    },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: "",
        baseTaskStatuses: [],
        taskStatuses: [],
      },
    },
  },
};

export const taskStatusesMock1234: ApolloMock<
  TaskStatusesQuery,
  TaskStatusesQueryVariables
> = {
  request: {
    query: TASK_STATUSES,
    variables: {
      id: "version-1234",
    },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: "version-1234",
        baseTaskStatuses: [],
        taskStatuses: [],
      },
    },
  },
};

export const getVersionUpstreamProjectMock = (
  versionId = "evergreen_ui_aec8832bace91f0f3b6d8ad3bb3b27fb4263be83",
): ApolloMock<
  VersionUpstreamProjectQuery,
  VersionUpstreamProjectQueryVariables
> => ({
  request: {
    query: VERSION_UPSTREAM_PROJECT,
    variables: {
      versionId,
    },
  },
  result: {
    data: {
      __typename: "Query",
      version: {
        __typename: "Version",
        id: versionId,
        upstreamProject: {
          __typename: "UpstreamProject",
          owner: "evergreen-ci",
          project: "evergreen",
          repo: "evergreen",
          revision: "abcdefg",
          task: {
            __typename: "Task",
            execution: 0,
            id: "task_id",
          },
          triggerID: "trigger_id",
          triggerType: "task",
          version: {
            __typename: "Version",
            id: "version_id",
          },
        },
      },
    },
  },
});
