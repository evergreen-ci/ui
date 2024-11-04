import { MockedProvider, MockedProviderProps } from "@apollo/client/testing";
import { renderHook, waitFor } from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  IsRepoQuery,
  IsRepoQueryVariables,
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables,
  UserRepoSettingsPermissionsQuery,
  UserRepoSettingsPermissionsQueryVariables,
} from "gql/generated/types";
import {
  IS_REPO,
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
        () => useHasProjectOrRepoEditPermission(projectIdentifier),
        {
          wrapper: ({ children }) =>
            ProviderWrapper({
              children,
              mocks: [isNotRepo, userHasProjectPermissions],
            }),
        },
      );
      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it("correctly determines that user does NOT have edit permission", async () => {
      const { result } = renderHook(
        () => useHasProjectOrRepoEditPermission(projectIdentifier),
        {
          wrapper: ({ children }) =>
            ProviderWrapper({
              children,
              mocks: [isNotRepo, userNoProjectPermissions],
            }),
        },
      );
      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });
  });

  describe("repo permission", () => {
    it("correctly determines that user has edit permission", async () => {
      const { result } = renderHook(
        () => useHasProjectOrRepoEditPermission(repoId),
        {
          wrapper: ({ children }) =>
            ProviderWrapper({
              children,
              mocks: [isRepo, userHasRepoPermissions],
            }),
        },
      );
      await waitFor(() => {
        expect(result.current).toBe(true);
      });
    });

    it("correctly determines that user does NOT have edit permission", async () => {
      const { result } = renderHook(
        () => useHasProjectOrRepoEditPermission(repoId),
        {
          wrapper: ({ children }) =>
            ProviderWrapper({
              children,
              mocks: [isRepo, userNoRepoPermissions],
            }),
        },
      );
      await waitFor(() => {
        expect(result.current).toBe(false);
      });
    });
  });
});

const projectIdentifier = "evergreen";
const repoId = "12345";

const isRepo: ApolloMock<IsRepoQuery, IsRepoQueryVariables> = {
  request: {
    query: IS_REPO,
    variables: { projectOrRepoId: repoId },
  },
  result: {
    data: {
      isRepo: true,
    },
  },
};

const isNotRepo: ApolloMock<IsRepoQuery, IsRepoQueryVariables> = {
  request: {
    query: IS_REPO,
    variables: { projectOrRepoId: projectIdentifier },
  },
  result: {
    data: {
      isRepo: false,
    },
  },
};

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
