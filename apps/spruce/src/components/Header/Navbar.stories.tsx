import { AuthStateContext } from "@evg-ui/lib/context/AuthProvider";
import {
  ApolloMock,
  CustomStoryObj,
  CustomMeta,
} from "@evg-ui/lib/test_utils/types";
import {
  SpruceConfigQuery,
  SpruceConfigQueryVariables,
  UserQuery,
  UserQueryVariables,
} from "gql/generated/types";
import { USER, SPRUCE_CONFIG } from "gql/queries";
import { Navbar } from "./Navbar";

const userMock: ApolloMock<UserQuery, UserQueryVariables> = {
  request: { query: USER },
  result: {
    data: {
      user: {
        __typename: "UserLite",
        displayName: "Mohamed Khelif",
        emailAddress: "mohamed.khelif@mongodb.com",
        userId: "mohamed.khelif",
        permissions: {
          __typename: "Permissions",
          canEditAdminSettings: false,
        },
      },
    },
  },
};

const spruceConfigMock: ApolloMock<
  SpruceConfigQuery,
  SpruceConfigQueryVariables
> = {
  request: { query: SPRUCE_CONFIG },
  result: {
    data: {
      spruceConfig: {
        __typename: "SpruceConfig",
        banner: null,
        bannerTheme: null,
        containerPools: null,
        jira: null,
        providers: null,
        serviceFlags: {
          __typename: "UserServiceFlags",
          debugSpawnHostDisabled: false,
          jwtTokenForCLIDisabled: false,
        },
        slack: null,
        spawnHost: {
          __typename: "SpawnHostConfig",
          spawnHostsPerUser: 5,
          unexpirableHostsPerUser: 2,
          unexpirableVolumesPerUser: 2,
        },
        ui: {
          __typename: "UIConfig",
          defaultProject: "mongodb-mongo-master",
        },
      },
    },
  },
};

const mocks = [userMock, spruceConfigMock];

export default {
  component: Navbar,
  parameters: {
    apolloClient: { mocks },
  },
} satisfies CustomMeta<typeof Navbar>;

export const Default: CustomStoryObj<typeof Navbar> = {
  render: () => (
    <AuthStateContext.Provider
      value={{
        isAuthenticated: true,
        hasCheckedAuth: true,
        localLogin: () => {},
        logoutAndRedirect: () => {},
        dispatchAuthenticated: () => {},
      }}
    >
      <Navbar />
    </AuthStateContext.Provider>
  ),
};
