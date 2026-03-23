import { GraphQLError } from "graphql";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  MockedResponse,
  renderWithRouterMatch as render,
  screen,
  stubGetClientRects,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  CreateProjectMutation,
  CreateProjectMutationVariables,
  GithubOrgsQuery,
  GithubOrgsQueryVariables,
} from "gql/generated/types";
import { CREATE_PROJECT } from "gql/mutations";
import { GITHUB_ORGS } from "gql/queries";
import { selectLGOption } from "test_utils/utils";
import { CreateProjectModal } from "./CreateProjectModal";

const defaultOwner = "evergreen-ci";
const defaultRepo = "spruce";

const NewProjectModal = ({
  mock = createProjectMock,
  open = true,
  owner = defaultOwner,
  repo = defaultRepo,
}: {
  mock?: MockedResponse;
  open?: boolean;
  owner?: string;
  repo?: string;
}) => (
  <MockedProvider mocks={[getGithubOrgsMock, mock]}>
    <CreateProjectModal
      handleClose={() => {}}
      open={open}
      owner={owner}
      repo={repo}
    />
  </MockedProvider>
);

const waitForModalLoad = async () => {
  await waitFor(() =>
    expect(screen.queryByDataCy("create-project-modal")).toBeVisible(),
  );
  await waitFor(() =>
    expect(screen.queryByDataCy("loading-skeleton")).toBeNull(),
  );
};

describe("createProjectField", () => {
  beforeAll(() => {
    stubGetClientRects();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not render the modal when open prop is false", () => {
    const { Component } = RenderFakeToastContext(
      <NewProjectModal open={false} />,
    );
    render(<Component />);

    expect(screen.queryByDataCy("create-project-modal")).not.toBeVisible();
  });

  it("disables the confirm button on initial render", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    await waitForModalLoad();

    expect(
      screen.getByRole("button", {
        name: "Create project",
      }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("shows warning banner for performance tooling", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    await waitForModalLoad();
    expect(screen.queryByDataCy("performance-tooling-banner")).toBeVisible();
  });

  it("shows info banner for S3 bucket setup", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);

    await waitForModalLoad();
    expect(screen.queryByDataCy("s3-bucket-info-banner")).toBeVisible();
  });

  it("pre-fills the owner and repo", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);
    await waitForModalLoad();

    expect(screen.queryByDataCy("new-owner-select")).toHaveTextContent(
      defaultOwner,
    );
    expect(screen.queryByDataCy("new-repo-input")).toHaveValue(defaultRepo);
  });

  it("disables the confirm button when repo field is missing", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);
    await waitForModalLoad();

    await user.type(
      screen.getByDataCy("project-name-input"),
      "new-project-name-input",
    );
    await user.clear(screen.getByDataCy("new-repo-input"));
    expect(
      screen.getByRole("button", {
        name: "Create project",
      }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("disables the confirm button when project name field is missing", async () => {
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);
    await waitForModalLoad();

    expect(screen.queryByDataCy("project-name-input")).toHaveValue("");
    expect(
      screen.getByRole("button", {
        name: "Create project",
      }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("disables the confirm button when project name contains a space", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(<NewProjectModal />);
    render(<Component />);
    await waitForModalLoad();

    await user.type(screen.getByDataCy("project-name-input"), "my test");
    expect(
      screen.getByRole("button", {
        name: "Create project",
      }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("form submission succeeds when performance tooling is enabled", async () => {
    const mockWithId: ApolloMock<
      CreateProjectMutation,
      CreateProjectMutationVariables
    > = {
      request: {
        query: CREATE_PROJECT,
        variables: {
          project: {
            id: "new-project-id",
            identifier: "new-project-id",
            owner: "10gen",
            repo: "new-repo-name",
          },
        },
      },
      result: {
        data: {
          createProject: {
            __typename: "Project",
            id: "new-project-id",
            identifier: "new-project-id",
          },
        },
      },
    };
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <NewProjectModal mock={mockWithId} />,
    );
    const { router } = render(<Component />);
    await waitForModalLoad();

    await user.type(screen.getByDataCy("project-name-input"), "new-project-id");
    await selectLGOption("new-owner-select", "10gen");
    await user.clear(screen.getByDataCy("new-repo-input"));
    await user.type(screen.getByDataCy("new-repo-input"), "new-repo-name");

    const confirmButton = screen.getByText("Create project");
    expect(confirmButton).toBeEnabled();

    // Check performance tooling checkbox.
    const enablePerformanceTooling = screen.getByDataCy(
      "enable-performance-tooling",
    );
    const enablePerformanceToolingLabel = screen.getByText(
      "Enable performance tooling",
    );
    expect(enablePerformanceTooling).not.toBeChecked();
    await user.click(enablePerformanceToolingLabel); // LeafyGreen checkbox has pointer-events: none so click on the label instead.
    expect(enablePerformanceTooling).toBeChecked();
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
    expect(router.state.location.pathname).toBe(
      "/project/new-project-id/settings",
    );
  }, 15000);

  it("shows a warning toast when an error and data are returned", async () => {
    const mockWithWarn = {
      request: {
        query: CREATE_PROJECT,
        variables: {
          project: {
            identifier: "new-project-name",
            owner: "10gen",
            repo: "new-repo-name",
          },
        },
      },
      result: {
        data: {
          createProject: {
            id: "new-project-id",
            identifier: "new-project-name",
          },
        },
        errors: [new GraphQLError("There was an error creating the project")],
      },
    };
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <NewProjectModal mock={mockWithWarn} />,
    );
    const { router } = render(<Component />);
    await waitForModalLoad();

    await user.type(
      screen.getByDataCy("project-name-input"),
      "new-project-name",
    );
    await selectLGOption("new-owner-select", "10gen");
    await user.clear(screen.getByDataCy("new-repo-input"));
    await user.type(screen.getByDataCy("new-repo-input"), "new-repo-name");

    const confirmButton = screen.getByText("Create project");
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);
    await waitFor(() => expect(dispatchToast.success).toHaveBeenCalledTimes(0));
    await waitFor(() => expect(dispatchToast.warning).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dispatchToast.error).toHaveBeenCalledTimes(0));
    expect(router.state.location.pathname).toBe(
      "/project/new-project-name/settings",
    );
  }, 15000);
});

const createProjectMock: ApolloMock<
  CreateProjectMutation,
  CreateProjectMutationVariables
> = {
  request: {
    query: CREATE_PROJECT,
    variables: {
      project: {
        identifier: "new-project-name",
        owner: "10gen",
        repo: "new-repo-name",
      },
    },
  },
  result: {
    data: {
      createProject: {
        __typename: "Project",
        id: "new-project-id",
        identifier: "new-project-name",
      },
    },
  },
};

const getGithubOrgsMock: ApolloMock<GithubOrgsQuery, GithubOrgsQueryVariables> =
  {
    request: {
      query: GITHUB_ORGS,
    },
    result: {
      data: {
        spruceConfig: {
          __typename: "SpruceConfig",
          githubOrgs: ["evergreen-ci", "10gen"],
        },
      },
    },
  };
