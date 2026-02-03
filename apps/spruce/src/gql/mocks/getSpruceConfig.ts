import { ApolloMock } from "@evg-ui/lib/test_utils";
import {
  SpruceConfigQuery,
  SpruceConfigQueryVariables,
  UserSettingsQuery,
  UserSettingsQueryVariables,
} from "gql/generated/types";
import { SPRUCE_CONFIG, USER_SETTINGS } from "gql/queries";

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
            pod: {
              ecs: {
                maxCPU: 10,
                maxMemoryMb: 1024,
              },
            },
            __typename: "AWSConfig",
          },
          __typename: "CloudProviderConfig",
        },
        serviceFlags: {
          jwtTokenForCLIDisabled: true,
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
        },
      },
    },
  },
};
