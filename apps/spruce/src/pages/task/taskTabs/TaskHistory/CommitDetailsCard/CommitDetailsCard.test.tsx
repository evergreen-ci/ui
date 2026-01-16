import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch,
  screen,
  userEvent,
  waitFor,
  MockedProviderProps,
} from "@evg-ui/lib/src/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  RestartTaskMutation,
  RestartTaskMutationVariables,
  ScheduleTasksMutation,
  ScheduleTasksMutationVariables,
  SetTaskPrioritiesMutation,
  SetTaskPrioritiesMutationVariables,
} from "gql/generated/types";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { taskQuery } from "gql/mocks/taskData";
import {
  RESTART_TASK,
  SCHEDULE_TASKS,
  SET_TASK_PRIORITIES,
} from "gql/mutations";
import { MockedProvider } from "test_utils/graphql";
import { TaskHistoryContextProvider } from "../context";
import { tasks } from "../testData";
import CommitDetailsCard from ".";

interface ProviderProps {
  mocks?: MockedProviderProps["mocks"];
  children: React.ReactNode;
}
const ProviderWrapper: React.FC<ProviderProps> = ({ children, mocks = [] }) => (
  <MockedProvider mocks={mocks}>
    <TaskHistoryContextProvider
      baseTaskId=""
      isPatch={false}
      task={taskQuery.task}
    >
      {children}
    </TaskHistoryContextProvider>
  </MockedProvider>
);

const wrapper = ({ children }: { children: React.ReactNode }) =>
  ProviderWrapper({
    children,
    mocks: [
      getSpruceConfigMock,
      restartTaskMock,
      scheduleTasksMock,
      setTaskPrioritiesMock,
    ],
  });

describe("CommitDetailsCard component", () => {
  it("shows 'Restart Task' button if task is activated", () => {
    const task = {
      ...currentTask,
      activated: true,
      canRestart: true,
    };
    const { Component } = RenderFakeToastContext(
      <CommitDetailsCard isMatching task={task} />,
    );
    renderWithRouterMatch(<Component />, { wrapper });
    const restartButton = screen.getByRole("button", { name: "Restart Task" });
    expect(restartButton).toBeVisible();
    expect(restartButton).toHaveAttribute("aria-disabled", "false");
  });

  it("shows 'Schedule Task' button if task is inactive", () => {
    const task = {
      ...currentTask,
      activated: false,
      canSchedule: true,
    };
    const { Component } = RenderFakeToastContext(
      <CommitDetailsCard isMatching task={task} />,
    );
    renderWithRouterMatch(<Component />, { wrapper });
    const scheduleButton = screen.getByRole("button", {
      name: "Schedule Task",
    });
    expect(scheduleButton).toBeVisible();
    expect(scheduleButton).toHaveAttribute("aria-disabled", "false");
  });

  it("can expand and collapse long description", async () => {
    const user = userEvent.setup();
    const longMessage =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
    const task = {
      ...currentTask,
      versionMetadata: {
        ...currentTask.versionMetadata,
        message: longMessage,
      },
    };
    const { Component } = RenderFakeToastContext(
      <CommitDetailsCard isMatching task={task} />,
    );
    renderWithRouterMatch(<Component />, { wrapper });
    expect(screen.queryByText(longMessage)).toBeNull();

    const showMoreButton = screen.getByRole("button", {
      name: "Show more",
    });
    expect(showMoreButton).toBeVisible();
    await user.click(showMoreButton);
    expect(screen.getByText(longMessage)).toBeVisible();

    const showLessButton = screen.getByRole("button", {
      name: "Show less",
    });
    expect(showLessButton).toBeVisible();
    await user.click(showLessButton);
    expect(screen.queryByText(longMessage)).toBeNull();
  });

  it("can expand and collapse failed tests table", async () => {
    const user = userEvent.setup();
    const { Component } = RenderFakeToastContext(
      <CommitDetailsCard isMatching task={currentTask} />,
    );
    renderWithRouterMatch(<Component />, { wrapper });

    const accordionContainer = screen.getByDataCy(
      "accordion-collapse-container",
    );
    expect(accordionContainer).toHaveAttribute("aria-expanded", "false");

    const accordionIcon = screen.getByDataCy("accordion-toggle");
    await user.click(accordionIcon);
    expect(accordionContainer).toHaveAttribute("aria-expanded", "true");

    expect(screen.getByDataCy("failing-tests-changes-table")).toBeVisible();
    expect(screen.getAllByDataCy("failing-tests-table-row")).toHaveLength(1);
  });

  it("shows 'This Task' badge if it's the current task", () => {
    const task = {
      ...currentTask,
      id: taskQuery.task.id,
    };
    const { Component } = RenderFakeToastContext(
      <CommitDetailsCard isMatching task={task} />,
    );
    renderWithRouterMatch(<Component />, { wrapper });
    const thisTaskBadge = screen.getByDataCy("this-task-badge");
    expect(thisTaskBadge).toBeVisible();
  });

  it("shows correct links", () => {
    const task = {
      ...currentTask,
      revision: "abcdef",
    };
    const { Component } = RenderFakeToastContext(
      <CommitDetailsCard isMatching task={task} />,
    );
    renderWithRouterMatch(<Component />, { wrapper });
    const githubLink = screen.getByDataCy("github-link");
    expect(githubLink).toHaveAttribute(
      "href",
      `https://github.com/${taskQuery.task?.project?.owner}/${taskQuery.task?.project?.repo}/commit/${task.revision}`,
    );

    const taskLink = screen.getByDataCy("task-link");
    expect(taskLink).toHaveAttribute("href", `/task/${task.id}/history`);
  });

  it("decreases opacity if isMatching is 'false'", () => {
    const { Component } = RenderFakeToastContext(
      <CommitDetailsCard isMatching={false} task={currentTask} />,
    );
    renderWithRouterMatch(<Component />, { wrapper });
    const card = screen.getByDataCy("commit-details-card");
    expect(card).toHaveStyle("opacity: 0.4");
  });

  describe("button interactions", () => {
    it("clicking the 'Schedule' button schedules the task", async () => {
      const user = userEvent.setup();
      const task = {
        ...currentTask,
        activated: false,
        canSchedule: true,
      };
      const { Component, dispatchToast } = RenderFakeToastContext(
        <CommitDetailsCard isMatching task={task} />,
      );
      renderWithRouterMatch(<Component />, { wrapper });
      const scheduleButton = screen.getByRole("button", {
        name: "Schedule Task",
      });
      expect(scheduleButton).toHaveAttribute("aria-disabled", "false");
      await user.click(scheduleButton);
      await waitFor(() => {
        expect(dispatchToast.success).toHaveBeenCalledWith(
          "Task scheduled to run",
        );
      });
    });

    it("clicking the 'Restart' button restarts the task", async () => {
      const user = userEvent.setup();
      const task = {
        ...currentTask,
        activated: true,
        canRestart: true,
      };
      const { Component, dispatchToast } = RenderFakeToastContext(
        <CommitDetailsCard isMatching task={task} />,
      );
      renderWithRouterMatch(<Component />, { wrapper });
      const restartButton = screen.getByRole("button", {
        name: "Restart Task",
      });
      expect(restartButton).toHaveAttribute("aria-disabled", "false");
      await user.click(restartButton);
      await waitFor(() => {
        expect(dispatchToast.success).toHaveBeenCalledWith(
          "Task scheduled to restart",
        );
      });
    });

    it("clicking the 'Notify Me' button opens the notification modal", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <CommitDetailsCard isMatching task={currentTask} />,
      );
      renderWithRouterMatch(<Component />, { wrapper });
      const notifyButton = screen.getByRole("button", { name: "Notify me" });
      await user.click(notifyButton);
      expect(screen.getByDataCy("task-notification-modal")).toBeVisible();
    });

    it("clicking the 'Set Priority' button opens popconfirm and allows entering a value", async () => {
      const user = userEvent.setup();
      const task = {
        ...currentTask,
        canSetPriority: true,
        priority: 0,
      };
      const { Component, dispatchToast } = RenderFakeToastContext(
        <CommitDetailsCard isMatching task={task} />,
      );
      renderWithRouterMatch(<Component />, { wrapper });

      expect(screen.queryByDataCy("priority-chip")).not.toBeInTheDocument();
      const setPriorityButton = screen.getByRole("button", {
        name: "Set priority",
      });
      await user.click(setPriorityButton);

      const priorityInput = await screen.findByLabelText("Set New Priority");
      expect(priorityInput).toHaveValue(0);
      await user.clear(priorityInput);
      await user.type(priorityInput, "25");

      const setButton = screen.getByRole("button", { name: "Set" });
      await user.click(setButton);
      await waitFor(() => {
        expect(dispatchToast.success).toHaveBeenCalledWith(
          "Priority updated for 1 task.",
        );
      });
    });
  });
});

const currentTask = tasks[5];

const restartTaskMock: ApolloMock<
  RestartTaskMutation,
  RestartTaskMutationVariables
> = {
  request: {
    query: RESTART_TASK,
    variables: {
      taskId: currentTask.id,
      failedOnly: false,
    },
  },
  result: {
    data: {
      restartTask: {
        id: currentTask.id,
        execution: 1,
        latestExecution: 1,
        priority: 0,
        buildVariant: "ubuntu",
        buildVariantDisplayName: "Ubuntu",
        displayName: "test_task",
        displayStatus: "will-run",
        revision: currentTask.revision,
        __typename: "Task",
      },
    },
  },
};

const scheduleTasksMock: ApolloMock<
  ScheduleTasksMutation,
  ScheduleTasksMutationVariables
> = {
  request: {
    query: SCHEDULE_TASKS,
    variables: {
      taskIds: [currentTask.id],
      versionId: currentTask.versionMetadata.id,
    },
  },
  result: {
    data: {
      scheduleTasks: [
        {
          id: currentTask.id,
          execution: 0,
          canSchedule: false,
          canUnschedule: true,
          status: "will-run",
          buildVariant: "ubuntu",
          buildVariantDisplayName: "Ubuntu",
          displayName: "test_task",
          displayStatus: "will-run",
          revision: currentTask.revision,
          __typename: "Task",
        },
      ],
    },
  },
};

const setTaskPrioritiesMock: ApolloMock<
  SetTaskPrioritiesMutation,
  SetTaskPrioritiesMutationVariables
> = {
  request: {
    query: SET_TASK_PRIORITIES,
    variables: {
      taskPriorities: [{ taskId: currentTask.id, priority: 25 }],
    },
  },
  result: {
    data: {
      setTaskPriorities: [
        {
          id: currentTask.id,
          execution: 0,
          priority: 25,
          __typename: "Task",
        },
      ],
    },
  },
};
