import {
  ApolloMock,
  MockedProvider,
  RenderFakeToastContext,
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "@evg-ui/lib/test_utils";
import {
  AdminTasksToRestartQuery,
  AdminTasksToRestartQueryVariables,
  RestartAdminTasksMutation,
  RestartAdminTasksMutationVariables,
  RestartAdminTasksOptions,
} from "gql/generated/types";
import { RESTART_ADMIN_TASKS } from "gql/mutations";
import { ADMIN_TASKS_TO_RESTART } from "gql/queries";
import { RestartTasksButton } from "./RestartTasksButton";
import { RestartTasksFormState } from "./types";

interface RestartTasksProps {
  disabled: boolean;
  hasTasksToRestart: boolean;
}

const RestartTasks = ({
  disabled = false,
  hasTasksToRestart,
}: RestartTasksProps) => (
  <MockedProvider
    mocks={[
      restartAdminTasksMock,
      hasTasksToRestart ? hasTasksToRestartMock : noTasksToRestartMock,
    ]}
  >
    <RestartTasksButton
      disabled={disabled}
      formState={
        hasTasksToRestart ? hasTasksToRestartForm : noTasksToRestartForm
      }
    />
  </MockedProvider>
);

describe("restartTasksButton", () => {
  it("button is correctly disabled", async () => {
    const { Component } = RenderFakeToastContext(
      <RestartTasks disabled hasTasksToRestart />,
    );
    render(<Component />);
    const restartTasksButton = screen.getByDataCy("restart-tasks-button");
    expect(restartTasksButton).toBeInTheDocument();
    expect(restartTasksButton).toHaveAttribute("aria-disabled", "true");
  });

  it("when there are tasks to restart", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <RestartTasks disabled={false} hasTasksToRestart />,
    );
    render(<Component />);
    const restartTasksButton = screen.getByDataCy("restart-tasks-button");
    expect(restartTasksButton).toBeInTheDocument();
    expect(restartTasksButton).toHaveAttribute("aria-disabled", "false");
    await user.click(restartTasksButton);
    expect(screen.getByDataCy("restart-tasks-modal")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("task-1")).toBeInTheDocument();
    });
    expect(screen.getByText("task-2")).toBeInTheDocument();
    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    await waitFor(() => {
      expect(confirmButton).toHaveAttribute("aria-disabled", "false");
    });
  });

  it("when there are no tasks to restart", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <RestartTasks disabled={false} hasTasksToRestart={false} />,
    );
    render(<Component />);
    const restartTasksButton = screen.getByDataCy("restart-tasks-button");
    expect(restartTasksButton).toBeInTheDocument();
    expect(restartTasksButton).toHaveAttribute("aria-disabled", "false");
    await user.click(restartTasksButton);
    expect(screen.getByDataCy("restart-tasks-modal")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("No tasks found.")).toBeInTheDocument();
    });
    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
  });

  it("restarting tasks is successful and dispatches toast", async () => {
    const user = userEvent.setup();
    const { Component, dispatchToast } = RenderFakeToastContext(
      <RestartTasks disabled={false} hasTasksToRestart />,
    );
    render(<Component />);
    const restartTasksButton = screen.getByDataCy("restart-tasks-button");
    expect(restartTasksButton).toBeInTheDocument();
    expect(restartTasksButton).toHaveAttribute("aria-disabled", "false");
    await user.click(restartTasksButton);
    expect(screen.getByDataCy("restart-tasks-modal")).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", { name: "Confirm" });
    await waitFor(() => {
      expect(confirmButton).toHaveAttribute("aria-disabled", "false");
    });
    await user.click(confirmButton);
    await waitFor(() => {
      expect(dispatchToast.success).toHaveBeenCalledTimes(1);
    });
  });
});

const hasTasksToRestartOpts: RestartAdminTasksOptions = {
  startTime: new Date("2025-07-01T10:00:00Z"),
  endTime: new Date("2025-07-12T19:00:00Z"),
  includeSetupFailed: true,
  includeSystemFailed: true,
  includeTestFailed: true,
};

const hasTasksToRestartMock: ApolloMock<
  AdminTasksToRestartQuery,
  AdminTasksToRestartQueryVariables
> = {
  request: {
    query: ADMIN_TASKS_TO_RESTART,
    variables: { opts: hasTasksToRestartOpts },
  },
  result: {
    data: {
      adminTasksToRestart: {
        tasksToRestart: [
          {
            __typename: "Task",
            id: "task-1",
            execution: 0,
          },
          {
            __typename: "Task",
            id: "task-2",
            execution: 1,
          },
        ],
      },
    },
  },
};

const hasTasksToRestartForm: RestartTasksFormState = {
  start: {
    startDate: "2025-07-01T00:00:00Z",
    startTime: "1970-07-01T10:00:00Z",
  },
  end: {
    endDate: "2025-07-12T00:00:00Z",
    endTime: "1970-07-12T19:00:00Z",
  },
  includeTasks: {
    includeTestFailed: true,
    includeSystemFailed: true,
    includeSetupFailed: true,
  },
};

const restartAdminTasksMock: ApolloMock<
  RestartAdminTasksMutation,
  RestartAdminTasksMutationVariables
> = {
  request: {
    query: RESTART_ADMIN_TASKS,
    variables: { opts: hasTasksToRestartOpts },
  },
  result: {
    data: {
      restartAdminTasks: {
        numRestartedTasks: 2,
      },
    },
  },
};

const noTasksToRestartOpts: RestartAdminTasksOptions = {
  startTime: new Date("2025-07-01T10:00:00Z"),
  endTime: new Date("2025-07-01T11:00:00Z"),
  includeSetupFailed: true,
  includeSystemFailed: true,
  includeTestFailed: true,
};

const noTasksToRestartMock: ApolloMock<
  AdminTasksToRestartQuery,
  AdminTasksToRestartQueryVariables
> = {
  request: {
    query: ADMIN_TASKS_TO_RESTART,
    variables: { opts: noTasksToRestartOpts },
  },
  result: {
    data: {
      adminTasksToRestart: {
        tasksToRestart: [],
      },
    },
  },
};

const noTasksToRestartForm: RestartTasksFormState = {
  start: {
    startDate: "2025-07-01T00:00:00Z",
    startTime: "1970-07-01T10:00:00Z",
  },
  end: {
    endDate: "2025-07-01T00:00:00Z",
    endTime: "1970-07-01T11:00:00Z",
  },
  includeTasks: {
    includeTestFailed: true,
    includeSystemFailed: true,
    includeSetupFailed: true,
  },
};
