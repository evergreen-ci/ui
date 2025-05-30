import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  BaseVersionAndTaskQuery,
  BaseVersionAndTaskQueryVariables,
  LastMainlineCommitQuery,
  LastMainlineCommitQueryVariables,
  SpruceConfigQuery,
  SpruceConfigQueryVariables,
  TaskTestSampleQuery,
  TaskTestSampleQueryVariables,
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import {
  BASE_VERSION_AND_TASK,
  LAST_MAINLINE_COMMIT,
  SPRUCE_CONFIG,
  TASK_TEST_SAMPLE,
  USER_SETTINGS,
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
