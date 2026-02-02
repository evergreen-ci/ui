import { GraphQLError } from "graphql";
import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import { TaskStatus } from "@evg-ui/lib/types/task";
import {
  MockedProvider,
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
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
        <RestartFailedTasks
          patchId={patchId}
          refetchQueries={refetchQueries}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);
    expect(screen.getByDataCy("restart-failed-tasks")).toBeInTheDocument();
  });

  it("is disabled while loading", () => {
    const { Component } = RenderFakeToastContext(
      <MockedProvider mocks={[buildVariantsQueryMock]}>
        <RestartFailedTasks
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

  it("successfully restarts failed tasks", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider
        mocks={[buildVariantsQueryMock, restartVersionsMutationMock]}
      >
        <RestartFailedTasks
          patchId={patchId}
          refetchQueries={refetchQueries}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await waitFor(() => {
      expect(screen.getByDataCy("restart-failed-tasks")).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    await user.click(screen.getByDataCy("restart-failed-tasks"));

    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
      expect(dispatchToast.success).toHaveBeenCalledWith(
        "Successfully restarted tasks!",
      );
    });
  });

  it("shows a warning when no failed tasks exist", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[buildVariantsQueryMockNoFailedTasks]}>
        <RestartFailedTasks
          patchId={patchId}
          refetchQueries={refetchQueries}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await waitFor(() => {
      expect(screen.getByDataCy("restart-failed-tasks")).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    await user.click(screen.getByDataCy("restart-failed-tasks"));

    await waitFor(() => {
      expect(dispatchToast.warning).toHaveBeenCalledTimes(1);
      expect(dispatchToast.warning).toHaveBeenCalledWith(
        "No failed tasks to restart.",
      );
    });
  });

  it("shows an error when the query fails", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider mocks={[buildVariantsQueryErrorMock]}>
        <RestartFailedTasks
          patchId={patchId}
          refetchQueries={refetchQueries}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await waitFor(() => {
      expect(screen.getByDataCy("restart-failed-tasks")).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    await user.click(screen.getByDataCy("restart-failed-tasks"));

    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledTimes(1);
      expect(dispatchToast.error).toHaveBeenCalledWith(
        "Error loading task data: Failed to load tasks",
      );
    });
  });

  it("shows an error when the mutation fails", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <MockedProvider
        mocks={[buildVariantsQueryMock, restartVersionsMutationErrorMock]}
      >
        <RestartFailedTasks
          patchId={patchId}
          refetchQueries={refetchQueries}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await waitFor(() => {
      expect(screen.getByDataCy("restart-failed-tasks")).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

    await user.click(screen.getByDataCy("restart-failed-tasks"));

    await waitFor(() => {
      expect(dispatchToast.error).toHaveBeenCalledTimes(1);
      expect(dispatchToast.error).toHaveBeenCalledWith(
        "Error while restarting tasks: 'Failed to restart tasks'",
      );
    });
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
        <RestartFailedTasks
          patchId={patchId}
          refetchQueries={refetchQueries}
        />
      </MockedProvider>,
    );
    renderWithRouterMatch(<Component />);

    await waitFor(() => {
      expect(screen.getByDataCy("restart-failed-tasks")).not.toHaveAttribute(
        "aria-disabled",
        "true",
      );
    });

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
        id: patchId,
        buildVariants: [
          {
            __typename: "GroupedBuildVariant",
            displayName: "Ubuntu 18.04",
            variant: "ubuntu1804",
            tasks: [
              {
                __typename: "Task",
                id: "task_1",
                displayName: "test-task-1",
                execution: 0,
                displayStatus: TaskStatus.Failed,
                baseStatus: TaskStatus.Succeeded,
              },
              {
                __typename: "Task",
                id: "task_2",
                displayName: "test-task-2",
                execution: 0,
                displayStatus: TaskStatus.Succeeded,
                baseStatus: TaskStatus.Succeeded,
              },
            ],
          },
        ],
        childVersions: [],
        generatedTaskCounts: [],
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
        id: patchId,
        buildVariants: [
          {
            __typename: "GroupedBuildVariant",
            displayName: "Ubuntu 18.04",
            variant: "ubuntu1804",
            tasks: [
              {
                __typename: "Task",
                id: "task_1",
                displayName: "test-task-1",
                execution: 0,
                displayStatus: TaskStatus.Succeeded,
                baseStatus: TaskStatus.Succeeded,
              },
            ],
          },
        ],
        childVersions: [],
        generatedTaskCounts: [],
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
        id: patchId,
        buildVariants: [
          {
            __typename: "GroupedBuildVariant",
            displayName: "Ubuntu 18.04",
            variant: "ubuntu1804",
            tasks: [
              {
                __typename: "Task",
                id: "task_1",
                displayName: "test-task-1",
                execution: 0,
                displayStatus: TaskStatus.Failed,
                baseStatus: TaskStatus.Succeeded,
              },
            ],
          },
        ],
        childVersions: [
          {
            __typename: "Version",
            id: "child-version-id",
            project: "child-project",
            projectIdentifier: "child-project",
            buildVariants: [
              {
                __typename: "GroupedBuildVariant",
                displayName: "Ubuntu 18.04",
                variant: "ubuntu1804",
                tasks: [
                  {
                    __typename: "Task",
                    id: "child_task_1",
                    displayName: "child-test-task-1",
                    execution: 0,
                    displayStatus: TaskStatus.Failed,
                    baseStatus: TaskStatus.Succeeded,
                  },
                ],
              },
            ],
            generatedTaskCounts: [],
          },
        ],
        generatedTaskCounts: [],
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
  error: new GraphQLError("Failed to load tasks"),
};

const restartVersionsMutationMock: ApolloMock<
  RestartVersionsMutation,
  RestartVersionsMutationVariables
> = {
  request: {
    query: RESTART_VERSIONS,
    variables: {
      versionId: patchId,
      versionsToRestart: [
        {
          versionId: patchId,
          taskIds: ["task_1"],
        },
      ],
      abort: false,
    },
  },
  result: {
    data: {
      restartVersions: [
        {
          __typename: "Version",
          id: patchId,
          status: "started",
          taskStatuses: ["failed", "started"],
          patch: {
            __typename: "Patch",
            id: patchId,
            status: "started",
            childPatches: [],
          },
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
      versionId: patchId,
      versionsToRestart: [
        {
          versionId: patchId,
          taskIds: ["task_1"],
        },
        {
          versionId: "child-version-id",
          taskIds: ["child_task_1"],
        },
      ],
      abort: false,
    },
  },
  result: {
    data: {
      restartVersions: [
        {
          __typename: "Version",
          id: patchId,
          status: "started",
          taskStatuses: ["failed", "started"],
          patch: {
            __typename: "Patch",
            id: patchId,
            status: "started",
            childPatches: [],
          },
        },
      ],
    },
  },
};

const restartVersionsMutationErrorMock: ApolloMock<
  RestartVersionsMutation,
  RestartVersionsMutationVariables
> = {
  request: {
    query: RESTART_VERSIONS,
    variables: {
      versionId: patchId,
      versionsToRestart: [
        {
          versionId: patchId,
          taskIds: ["task_1"],
        },
      ],
      abort: false,
    },
  },
  error: new GraphQLError("Failed to restart tasks"),
};
