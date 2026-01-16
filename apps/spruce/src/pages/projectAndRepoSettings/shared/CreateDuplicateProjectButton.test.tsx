import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  MockedResponse,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables,
  GithubOrgsQuery,
  GithubOrgsQueryVariables,
  CopyProjectMutation,
  CopyProjectMutationVariables,
} from "gql/generated/types";
import { COPY_PROJECT } from "gql/mutations";
import { USER_PROJECT_SETTINGS_PERMISSIONS, GITHUB_ORGS } from "gql/queries";
import { CreateDuplicateProjectButton } from "./CreateDuplicateProjectButton";
import { ProjectType } from "./tabs/utils";

const owner = "existing_owner";
const repo = "existing_repo";

const Button = ({
  additionalMocks = [],
  permMock = permissionsMock,
  projectType = ProjectType.AttachedProject,
}: {
  additionalMocks?: MockedResponse[];
  permMock?: MockedResponse;
  projectType?: ProjectType;
}) => (
  <MockedProvider mocks={[permMock, githubOrgsMock, ...additionalMocks]}>
    <CreateDuplicateProjectButton
      id="my_id"
      identifier="my_identifier"
      label={`${owner}/${repo}`}
      owner={owner}
      projectType={projectType}
      repo={repo}
    />
  </MockedProvider>
);

describe("createDuplicateProjectField", () => {
  it("does not show button when user lacks permissions", async () => {
    const lacksPermissionsMock: ApolloMock<
      UserProjectSettingsPermissionsQuery,
      UserProjectSettingsPermissionsQueryVariables
    > = {
      request: {
        query: USER_PROJECT_SETTINGS_PERMISSIONS,
        variables: { projectIdentifier: "my_identifier" },
      },
      result: {
        data: {
          user: {
            __typename: "User",
            userId: "string",
            permissions: {
              __typename: "Permissions",
              canCreateProject: false,
              projectPermissions: {
                __typename: "ProjectPermissions",
                edit: false,
              },
            },
          },
        },
      },
    };
    const { Component } = RenderFakeToastContext(
      <Button permMock={lacksPermissionsMock} />,
    );
    render(<Component />);

    expect(screen.queryByDataCy("new-project-button")).not.toBeInTheDocument();
  });

  describe("when looking at a repo", () => {
    it("clicking the button opens the new project modal", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <Button projectType={ProjectType.Repo} />,
      );
      render(<Component />);

      await screen.findByText("New project");
      await user.click(screen.getByDataCy("new-project-button"));
      await waitFor(() => {
        expect(screen.queryByDataCy("create-project-modal")).toBeVisible();
      });
      expect(screen.queryByDataCy("new-project-menu")).not.toBeInTheDocument();
    });
  });

  describe("when looking at a project", () => {
    it("clicking the button opens the menu", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(<Button />);
      render(<Component />);

      await screen.findByText("New project");
      await user.click(screen.getByDataCy("new-project-button"));
      await waitFor(() => {
        expect(screen.queryByDataCy("new-project-menu")).toBeVisible();
      });
    });

    it("clicking the 'Create New Project' button opens the create project modal and closes the menu", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(<Button />);
      render(<Component />);

      await screen.findByText("New project");
      await user.click(screen.getByDataCy("new-project-button"));
      await waitFor(() => {
        expect(screen.queryByDataCy("new-project-menu")).toBeVisible();
      });
      await user.click(screen.getByDataCy("create-project-button"));
      await waitFor(() => {
        expect(screen.queryByDataCy("create-project-modal")).toBeVisible();
      });
      expect(screen.queryByDataCy("new-project-menu")).not.toBeVisible();
    });

    it("clicking the 'Duplicate Project' button opens the create project modal and closes the menu", async () => {
      const newIdentifier = "new_identifier";
      const copyProjectMock: ApolloMock<
        CopyProjectMutation,
        CopyProjectMutationVariables
      > = {
        request: {
          query: COPY_PROJECT,
          variables: {
            project: {
              newProjectIdentifier: newIdentifier,
              projectIdToCopy: "my_id",
            },
            requestS3Creds: false,
          },
        },
        result: {
          data: {
            copyProject: {
              __typename: "Project",
              id: newIdentifier,
              identifier: newIdentifier,
            },
          },
        },
      };
      const user = userEvent.setup();
      const { Component, dispatchToast } = RenderFakeToastContext(
        <Button additionalMocks={[copyProjectMock]} />,
      );
      render(<Component />);

      await screen.findByText("New project");
      await user.click(screen.getByDataCy("new-project-button"));
      await waitFor(() => {
        expect(screen.queryByDataCy("new-project-menu")).toBeVisible();
      });
      await user.click(screen.getByDataCy("copy-project-button"));
      await waitFor(() => {
        expect(screen.queryByDataCy("copy-project-modal")).toBeVisible();
      });
      expect(screen.queryByDataCy("new-project-menu")).not.toBeVisible();

      await user.type(
        screen.getByDataCy("project-name-input"),
        "new_identifier",
      );

      const confirmButton = screen.getByRole("button", {
        name: "Duplicate",
      });
      expect(confirmButton).toBeEnabled();

      await user.click(confirmButton);
      await waitFor(() =>
        expect(dispatchToast.success).toHaveBeenCalledTimes(1),
      );
      await waitFor(() =>
        expect(dispatchToast.warning).toHaveBeenCalledTimes(0),
      );
      await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
    });
  });
});

const permissionsMock: ApolloMock<
  UserProjectSettingsPermissionsQuery,
  UserProjectSettingsPermissionsQueryVariables
> = {
  request: {
    query: USER_PROJECT_SETTINGS_PERMISSIONS,
    variables: { projectIdentifier: "my_identifier" },
  },
  result: {
    data: {
      user: {
        __typename: "User",
        userId: "string",
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

const githubOrgsMock: ApolloMock<GithubOrgsQuery, GithubOrgsQueryVariables> = {
  request: {
    query: GITHUB_ORGS,
    variables: {},
  },
  result: {
    data: {
      spruceConfig: {
        __typename: "SpruceConfig",
        githubOrgs: ["evergreen"],
      },
    },
  },
};
