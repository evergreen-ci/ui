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
  __typename: "Task" as const,
  baseTask: null,
  displayStatus: TaskStatus.Succeeded,
  execution: 0,
  id: "t1",
  status: TaskStatus.Succeeded,
  versionMetadata: {
    ...taskQuery.task.versionMetadata,
    isPatch: true,
  },
};

const baseTask = {
  __typename: "Task" as const,
  displayStatus: TaskStatus.Failed,
  execution: 0,
  id: baseTaskId,
  revision: "abc123",
  status: TaskStatus.Failed,
  timeTaken: null,
  versionMetadata: {
    __typename: "VersionLite" as const,
    id: "base_version_id",
    revision: "abc123",
  },
};

const patchTaskWithBaseTask = {
  ...taskQuery.task,
  __typename: "Task" as const,
  baseTask,
  displayStatus: TaskStatus.Failed,
  execution: 0,
  id: "t2",
  status: TaskStatus.Failed,
  versionMetadata: {
    ...taskQuery.task.versionMetadata,
    isPatch: true,
  },
};

const mainlineTask = {
  ...taskQuery.task,
  __typename: "Task" as const,
  baseTask,
  displayStatus: TaskStatus.Failed,
  execution: 0,
  id: "t3",
  status: TaskStatus.Failed,
  versionMetadata: {
    ...taskQuery.task.versionMetadata,
    isPatch: false,
  },
};

const getStepbackTasksMock: ApolloMock<
  StepbackTasksQuery,
  StepbackTasksQueryVariables
> = {
  request: {
    query: STEPBACK_TASKS,
    variables: {
      execution: 0,
      isPassing: false,
      taskId: "t3",
    },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        execution: 0,
        id: "t3",
        prevTask: {
          __typename: "Task",
          displayStatus: TaskStatus.Failed,
          execution: 0,
          id: "prev_task",
          revision: "aaa111",
        },
        prevTaskCompleted: {
          __typename: "Task",
          displayStatus: TaskStatus.Failed,
          execution: 0,
          id: "prev_completed",
          revision: "bbb222",
        },
        prevTaskPassing: {
          __typename: "Task",
          displayStatus: TaskStatus.Succeeded,
          execution: 0,
          id: "prev_passing",
          nextTaskFailing: {
            __typename: "Task",
            displayStatus: TaskStatus.Failed,
            execution: 0,
            id: "breaking_task",
            revision: "ddd444",
          },
          revision: "ccc333",
        },
      },
    },
  },
};
