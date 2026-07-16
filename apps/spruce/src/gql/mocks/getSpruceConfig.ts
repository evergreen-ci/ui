import { ApolloMock } from "@evg-ui/lib/test_utils/types";
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
        __typename: "SpruceConfig",
        banner: "",
        bannerTheme: "warning",
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
          __typename: "JiraConfig",
          email: "test@example.com",
          host: "jira.mongodb.org",
        },
        providers: {
          __typename: "CloudProviderConfig",
          aws: {
            __typename: "AWSConfig",
            maxVolumeSizePerUser: 1500,
          },
        },
        serviceFlags: {
          debugSpawnHostDisabled: false,
        },
        slack: {
          name: "everygreen_slack",
        },
        spawnHost: {
          __typename: "SpawnHostConfig",
          spawnHostsPerUser: 6,
          unexpirableHostsPerUser: 2,
          unexpirableVolumesPerUser: 1,
        },
        ui: {
          __typename: "UIConfig",
          defaultProject: "evergreen",
        },
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
        __typename: "UserLite",
        settings: {
          __typename: "UserSettings",
          dateFormat: "MM/dd/yyyy",
          githubUser: {
            __typename: "GithubUser",
            lastKnownAs: "user",
          },
          notifications: {
            __typename: "Notifications",
            buildBreak: "",
            patchFinish: "",
            patchFirstFailure: "",
            spawnHostExpiration: "",
            spawnHostOutcome: "",
          },
          region: "us-east-1",
          slackMemberId: "1234",
          slackUsername: "user",
          timeFormat: "H:mm:ss",
          timezone: "America/New_York",
        },
        userId: "user.id",
      },
    },
  },
};
