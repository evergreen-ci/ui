import {
  MockedProvider,
  MockedProviderProps,
  renderHook,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables,
  UserRepoSettingsPermissionsQuery,
  UserRepoSettingsPermissionsQueryVariables,
} from "gql/generated/types";
import {
  USER_PROJECT_SETTINGS_PERMISSIONS,
  USER_REPO_SETTINGS_PERMISSIONS,
} from "gql/queries";
import { useHasProjectOrRepoEditPermission } from ".";

interface ProviderProps {
  mocks?: MockedProviderProps["mocks"];
  children: React.ReactNode;
}
const ProviderWrapper: React.FC<ProviderProps> = ({ children, mocks = [] }) => (
  <MockedProvider mocks={mocks}>{children}</MockedProvider>
);

describe("useHasProjectOrRepoEditPermission", () => {
  describe("project permission", () => {
    it("correctly determines that user has edit permission", async () => {
      const { result } = renderHook(
        () => useHasProjectOrRepoEditPermission(projectIdentifier, ""),
        {
          wrapper: ({ children }) =>
            ProviderWrapper({
              children,
              mocks: [userHasProjectPermissions],
            }),
        },
      );
      await waitFor(() => {
        expect(result.current.canEdit).toBe(true);
      });
    });

    it("correctly determines that user does NOT have edit permission", async () => {
      const { result } = renderHook(
        () => useHasProjectOrRepoEditPermission(projectIdentifier, ""),
        {
          wrapper: ({ children }) =>
            ProviderWrapper({
              children,
              mocks: [userNoProjectPermissions],
            }),
        },
      );
      await waitFor(() => {
        expect(result.current.canEdit).toBe(false);
      });
    });
  });

  describe("repo permission", () => {
    it("correctly determines that user has edit permission", async () => {
      const { result } = renderHook(
        () => useHasProjectOrRepoEditPermission("", repoId),
        {
          wrapper: ({ children }) =>
            ProviderWrapper({
              children,
              mocks: [userHasRepoPermissions],
            }),
        },
      );
      await waitFor(() => {
        expect(result.current.canEdit).toBe(true);
      });
    });

    it("correctly determines that user does NOT have edit permission", async () => {
      const { result } = renderHook(
        () => useHasProjectOrRepoEditPermission("", repoId),
        {
          wrapper: ({ children }) =>
            ProviderWrapper({
              children,
              mocks: [userNoRepoPermissions],
            }),
        },
      );
      await waitFor(() => {
        expect(result.current.canEdit).toBe(false);
      });
    });
  });
});

const projectIdentifier = "evergreen";
const repoId = "12345";

const userHasProjectPermissions: ApolloMock<
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables
> = {
  request: {
    query: USER_PROJECT_SETTINGS_PERMISSIONS,
    variables: { projectIdentifier },
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "evergreen.user",
        permissions: {
          __typename: "Permissions",
          canCreateProject: true,
          projectPermissions: {
            __typename: "ProjectPermissions",
            edit: true,
          },
        },
      },
    },
  },
};

const userNoProjectPermissions: ApolloMock<
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables
> = {
  request: {
    query: USER_PROJECT_SETTINGS_PERMISSIONS,
    variables: { projectIdentifier },
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "evergreen.user",
        permissions: {
          __typename: "Permissions",
          canCreateProject: true,
          projectPermissions: {
            __typename: "ProjectPermissions",
            edit: false,
          },
        },
      },
    },
  },
};

const userHasRepoPermissions: ApolloMock<
  UserRepoSettingsPermissionsQuery,
  UserRepoSettingsPermissionsQueryVariables
> = {
  request: {
    query: USER_REPO_SETTINGS_PERMISSIONS,
    variables: { repoId },
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "evergreen.user",
        permissions: {
          __typename: "Permissions",
          repoPermissions: {
            __typename: "RepoPermissions",
            edit: true,
          },
        },
      },
    },
  },
};

const userNoRepoPermissions: ApolloMock<
  UserRepoSettingsPermissionsQuery,
  UserRepoSettingsPermissionsQueryVariables
> = {
  request: {
    query: USER_REPO_SETTINGS_PERMISSIONS,
    variables: { repoId },
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "evergreen.user",
        permissions: {
          __typename: "Permissions",
          repoPermissions: {
            __typename: "RepoPermissions",
            edit: false,
          },
        },
      },
    },
  },
};
