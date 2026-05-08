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
  StepbackTasksQuery,
  StepbackTasksQueryVariables,
} from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { STEPBACK_TASKS } from "gql/queries";
import { StepbackMenu } from ".";

describe("stepbackMenu", () => {
  describe("patch tasks", () => {
    it("the button is disabled when there is no base task", async () => {
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[]}>
          <StepbackMenu task={patchTaskWithNoBaseTask} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: "Stepback" }),
        ).toHaveAttribute("aria-disabled", "true");
      });
    });

    it("shows base commit link for patch tasks", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[]}>
          <StepbackMenu task={patchTaskWithBaseTask} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.getByRole("button", { name: "Stepback" }));
      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeVisible();
      });
      expect(screen.getByText("Base commit")).toBeInTheDocument();
    });
  });

  describe("mainline commit tasks", () => {
    it("shows previous commit, last completed, last passing, and breaking commit items", async () => {
      const user = userEvent.setup();
      const { Component } = RenderFakeToastContext(
        <MockedProvider mocks={[getStepbackTasksMock]}>
          <StepbackMenu task={mainlineTask} />
        </MockedProvider>,
      );
      renderWithRouterMatch(<Component />);

      await user.click(screen.getByRole("button", { name: "Stepback" }));
      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeVisible();
      });
      await waitFor(() => {
        expect(screen.getByText("Previous commit")).toBeInTheDocument();
      });
      expect(screen.getByText("Last completed")).toBeInTheDocument();
      expect(screen.getByText("Last passing")).toBeInTheDocument();
      expect(screen.getByText("Breaking commit")).toBeInTheDocument();
    });
  });
});

const baseTaskId = "base_task_id";

const patchTaskWithNoBaseTask = {
  ...taskQuery.task,
  id: "t1",
  execution: 0,
  status: TaskStatus.Succeeded,
  displayStatus: TaskStatus.Succeeded,
  baseTask: null,
  versionMetadata: {
    ...taskQuery.task.versionMetadata,
    isPatch: true,
  },
  __typename: "Task" as const,
};

const baseTask = {
  __typename: "Task" as const,
  id: baseTaskId,
  displayStatus: TaskStatus.Failed,
  execution: 0,
  revision: "abc123",
  status: TaskStatus.Failed,
  timeTaken: null,
  versionMetadata: {
    __typename: "Version" as const,
    id: "base_version_id",
    revision: "abc123",
  },
};

const patchTaskWithBaseTask = {
  ...taskQuery.task,
  id: "t2",
  execution: 0,
  status: TaskStatus.Failed,
  displayStatus: TaskStatus.Failed,
  baseTask,
  versionMetadata: {
    ...taskQuery.task.versionMetadata,
    isPatch: true,
  },
  __typename: "Task" as const,
};

const mainlineTask = {
  ...taskQuery.task,
  id: "t3",
  execution: 0,
  status: TaskStatus.Failed,
  displayStatus: TaskStatus.Failed,
  baseTask,
  versionMetadata: {
    ...taskQuery.task.versionMetadata,
    isPatch: false,
  },
  __typename: "Task" as const,
};

const getStepbackTasksMock: ApolloMock<
  StepbackTasksQuery,
  StepbackTasksQueryVariables
> = {
  request: {
    query: STEPBACK_TASKS,
    variables: {
      taskId: "t3",
      execution: 0,
      isPassing: false,
    },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: "t3",
        execution: 0,
        prevTask: {
          __typename: "Task",
          id: "prev_task",
          displayStatus: TaskStatus.Failed,
          execution: 0,
          revision: "aaa111",
        },
        prevTaskCompleted: {
          __typename: "Task",
          id: "prev_completed",
          displayStatus: TaskStatus.Failed,
          execution: 0,
          revision: "bbb222",
        },
        prevTaskPassing: {
          __typename: "Task",
          id: "prev_passing",
          displayStatus: TaskStatus.Succeeded,
          execution: 0,
          revision: "ccc333",
          nextTaskFailing: {
            __typename: "Task",
            id: "breaking_task",
            displayStatus: TaskStatus.Failed,
            execution: 0,
            revision: "ddd444",
          },
        },
      },
    },
  },
};
