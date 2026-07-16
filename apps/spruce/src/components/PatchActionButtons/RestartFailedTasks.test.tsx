import { GraphQLError } from "graphql";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  MockedProvider,
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
import {
  BuildVariantsWithChildrenQuery,
  BuildVariantsWithChildrenQueryVariables,
  RestartVersionsMutation,
  RestartVersionsMutationVariables,
} from "gql/generated/types";
import { RESTART_VERSIONS } from "gql/mutations";
import { BUILD_VARIANTS_WITH_CHILDREN } from "gql/queries";
import { RestartFailedTasks } from "./RestartFailedTasks";

const patchId = "test-patch-id";
const refetchQueries = ["VersionTasks"];

describe("restartFailedTasks", () => {
  it("renders the menu item", () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[buildVariantsQueryMock]}>
        <RestartFailedTasks patchId={patchId} refetchQueries={refetchQueries} />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);
    expect(screen.getByDataCy("restart-failed-tasks")).toBeInTheDocument();
  });

  it("is enabled initially since query runs on click", () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[buildVariantsQueryMock]}>
        <RestartFailedTasks patchId={patchId} refetchQueries={refetchQueries} />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);
    expect(screen.getByDataCy("restart-failed-tasks")).toHaveAttribute(
      "aria-disabled",
      "false",
    );
  });

  it("successfully restarts failed tasks", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider
        mocks={[buildVariantsQueryMock, restartVersionsMutationMock]}
      >
        <RestartFailedTasks patchId={patchId} refetchQueries={refetchQueries} />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await user.click(screen.getByDataCy("restart-failed-tasks"));

    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });
    expect(dispatchToast.success).toHaveBeenCalledWith(
      "Successfully restarted tasks!",
    );
  });

  it("shows a warning when no failed tasks exist", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[buildVariantsQueryMockNoFailedTasks]}>
        <RestartFailedTasks patchId={patchId} refetchQueries={refetchQueries} />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await user.click(screen.getByDataCy("restart-failed-tasks"));

    await waitFor(() => {
      expect(dispatchToast.warning).toHaveBeenCalledTimes(1);
    });
    expect(dispatchToast.warning).toHaveBeenCalledWith(
      "No failed tasks to restart.",
    );
  });

  it("shows an error when the query fails", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[buildVariantsQueryErrorMock]}>
        <RestartFailedTasks patchId={patchId} refetchQueries={refetchQueries} />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await user.click(screen.getByDataCy("restart-failed-tasks"));

    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledTimes(1);
    });
    expect(dispatchToast.error).toHaveBeenCalledWith(
      "Error loading task data: Failed to load tasks",
    );
  });

  it("shows an error when the mutation fails", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider
        mocks={[buildVariantsQueryMock, restartVersionsMutationErrorMock]}
      >
        <RestartFailedTasks patchId={patchId} refetchQueries={refetchQueries} />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await user.click(screen.getByDataCy("restart-failed-tasks"));

    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledTimes(1);
    });
    expect(dispatchToast.error).toHaveBeenCalledWith(
      "Error while restarting tasks: 'Failed to restart tasks'",
    );
  });

  it("restarts failed tasks from child versions", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider
        mocks={[
          buildVariantsQueryMockWithChildVersions,
          restartVersionsWithChildrenMutationMock,
        ]}
      >
        <RestartFailedTasks patchId={patchId} refetchQueries={refetchQueries} />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await user.click(screen.getByDataCy("restart-failed-tasks"));

    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });
  });

  it("is disabled when the disabled prop is true", () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[buildVariantsQueryMock]}>
        <RestartFailedTasks
          disabled
          patchId={patchId}
          refetchQueries={refetchQueries}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);
    expect(screen.getByDataCy("restart-failed-tasks")).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });
});

const buildVariantsQueryMock: ApolloMock<
  BuildVariantsWithChildrenQuery,
  BuildVariantsWithChildrenQueryVariables
> = {
  request: {
    query: BUILD_VARIANTS_WITH_CHILDREN,
    variables: {
      id: patchId,
      statuses: [
        TaskStatus.Failed,
        TaskStatus.SetupFailed,
        TaskStatus.SystemFailed,
        TaskStatus.TaskTimedOut,
        TaskStatus.TestTimedOut,
        TaskStatus.KnownIssue,
        TaskStatus.SystemUnresponsive,
        TaskStatus.SystemTimedOut,
        TaskStatus.Succeeded,
        TaskStatus.Aborted,
      ],
    },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        buildVariants: [
          {
            __typename: "GroupedBuildVariant",
            displayName: "Ubuntu 18.04",
            tasks: [
              {
                __typename: "Task",
                baseStatus: TaskStatus.Succeeded,
                displayName: "test-task-1",
                displayStatus: TaskStatus.Failed,
                execution: 0,
                id: "task_1",
              },
              {
                __typename: "Task",
                baseStatus: TaskStatus.Succeeded,
                displayName: "test-task-2",
                displayStatus: TaskStatus.Succeeded,
                execution: 0,
                id: "task_2",
              },
            ],
            variant: "ubuntu1804",
          },
        ],
        childVersions: [],
        generatedTaskCounts: [],
        id: patchId,
      },
    },
  },
};

const buildVariantsQueryMockNoFailedTasks: ApolloMock<
  BuildVariantsWithChildrenQuery,
  BuildVariantsWithChildrenQueryVariables
> = {
  request: {
    query: BUILD_VARIANTS_WITH_CHILDREN,
    variables: {
      id: patchId,
      statuses: [
        TaskStatus.Failed,
        TaskStatus.SetupFailed,
        TaskStatus.SystemFailed,
        TaskStatus.TaskTimedOut,
        TaskStatus.TestTimedOut,
        TaskStatus.KnownIssue,
        TaskStatus.SystemUnresponsive,
        TaskStatus.SystemTimedOut,
        TaskStatus.Succeeded,
        TaskStatus.Aborted,
      ],
    },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        buildVariants: [
          {
            __typename: "GroupedBuildVariant",
            displayName: "Ubuntu 18.04",
            tasks: [
              {
                __typename: "Task",
                baseStatus: TaskStatus.Succeeded,
                displayName: "test-task-1",
                displayStatus: TaskStatus.Succeeded,
                execution: 0,
                id: "task_1",
              },
            ],
            variant: "ubuntu1804",
          },
        ],
        childVersions: [],
        generatedTaskCounts: [],
        id: patchId,
      },
    },
  },
};

const buildVariantsQueryMockWithChildVersions: ApolloMock<
  BuildVariantsWithChildrenQuery,
  BuildVariantsWithChildrenQueryVariables
> = {
  request: {
    query: BUILD_VARIANTS_WITH_CHILDREN,
    variables: {
      id: patchId,
      statuses: [
        TaskStatus.Failed,
        TaskStatus.SetupFailed,
        TaskStatus.SystemFailed,
        TaskStatus.TaskTimedOut,
        TaskStatus.TestTimedOut,
        TaskStatus.KnownIssue,
        TaskStatus.SystemUnresponsive,
        TaskStatus.SystemTimedOut,
        TaskStatus.Succeeded,
        TaskStatus.Aborted,
      ],
    },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        buildVariants: [
          {
            __typename: "GroupedBuildVariant",
            displayName: "Ubuntu 18.04",
            tasks: [
              {
                __typename: "Task",
                baseStatus: TaskStatus.Succeeded,
                displayName: "test-task-1",
                displayStatus: TaskStatus.Failed,
                execution: 0,
                id: "task_1",
              },
            ],
            variant: "ubuntu1804",
          },
        ],
        childVersions: [
          {
            __typename: "Version",
            buildVariants: [
              {
                __typename: "GroupedBuildVariant",
                displayName: "Ubuntu 18.04",
                tasks: [
                  {
                    __typename: "Task",
                    baseStatus: TaskStatus.Succeeded,
                    displayName: "child-test-task-1",
                    displayStatus: TaskStatus.Failed,
                    execution: 0,
                    id: "child_task_1",
                  },
                ],
                variant: "ubuntu1804",
              },
            ],
            generatedTaskCounts: [],
            id: "child-version-id",
            projectMetadata: {
              __typename: "Project",
              id: "child-project",
              identifier: "child-project",
            },
          },
        ],
        generatedTaskCounts: [],
        id: patchId,
      },
    },
  },
};

const buildVariantsQueryErrorMock: ApolloMock<
  BuildVariantsWithChildrenQuery,
  BuildVariantsWithChildrenQueryVariables
> = {
  request: {
    query: BUILD_VARIANTS_WITH_CHILDREN,
    variables: {
      id: patchId,
      statuses: [
        TaskStatus.Failed,
        TaskStatus.SetupFailed,
        TaskStatus.SystemFailed,
        TaskStatus.TaskTimedOut,
        TaskStatus.TestTimedOut,
        TaskStatus.KnownIssue,
        TaskStatus.SystemUnresponsive,
        TaskStatus.SystemTimedOut,
        TaskStatus.Succeeded,
        TaskStatus.Aborted,
      ],
    },
  },
  result: {
    errors: [new GraphQLError("Failed to load tasks")],
  },
};

const restartVersionsMutationMock: ApolloMock<
  RestartVersionsMutation,
  RestartVersionsMutationVariables
> = {
  request: {
    query: RESTART_VERSIONS,
    variables: {
      abort: false,
      versionId: patchId,
      versionsToRestart: [
        {
          taskIds: ["task_1"],
          versionId: patchId,
        },
      ],
    },
  },
  result: {
    data: {
      restartVersions: [
        {
          __typename: "Version",
          id: patchId,
          patch: {
            __typename: "Patch",
            childPatches: [],
            id: patchId,
            status: "started",
          },
          status: "started",
          taskStatuses: ["failed", "started"],
        },
      ],
    },
  },
};

const restartVersionsWithChildrenMutationMock: ApolloMock<
  RestartVersionsMutation,
  RestartVersionsMutationVariables
> = {
  request: {
    query: RESTART_VERSIONS,
    variables: {
      abort: false,
      versionId: patchId,
      versionsToRestart: [
        {
          taskIds: ["task_1"],
          versionId: patchId,
        },
        {
          taskIds: ["child_task_1"],
          versionId: "child-version-id",
        },
      ],
    },
  },
  result: {
    data: {
      restartVersions: [
        {
          __typename: "Version",
          id: patchId,
          patch: {
            __typename: "Patch",
            childPatches: [],
            id: patchId,
            status: "started",
          },
          status: "started",
          taskStatuses: ["failed", "started"],
        },
      ],
    },
  },
};

const restartVersionsMutationErrorMock: ApolloMock<
  RestartVersionsMutation,
  RestartVersionsMutationVariables
> = {
  error: new GraphQLError("Failed to restart tasks"),
  request: {
    query: RESTART_VERSIONS,
    variables: {
      abort: false,
      versionId: patchId,
      versionsToRestart: [
        {
          taskIds: ["task_1"],
          versionId: patchId,
        },
      ],
    },
  },
};
