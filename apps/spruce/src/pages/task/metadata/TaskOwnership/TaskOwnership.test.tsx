import { MockedProvider } from "@apollo/client/testing";
import {
  renderWithRouterMatch as render,
  screen,
  waitFor,
  act,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  TaskOwnerTeamsForTaskQuery,
  TaskOwnerTeamsForTaskQueryVariables,
} from "gql/generated/types";
import { TASK_OWNER_TEAM } from "gql/queries";
import TaskOwnership from ".";

const taskId = "task123";
const execution = 5;

const taskOwnerTeamMock: ApolloMock<
  TaskOwnerTeamsForTaskQuery,
  TaskOwnerTeamsForTaskQueryVariables
> = {
  request: {
    query: TASK_OWNER_TEAM,
    variables: { taskId, execution },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskId,
        execution,
        taskOwnerTeam: {
          __typename: "TaskOwnerTeam",
          assignmentType: "auto",
          jiraProject: "EVG",
          messages: "Assigned based on task history",
          teamName: "Platform Team",
        },
      },
    },
  },
};

const taskOwnerTeamEmptyMock: ApolloMock<
  TaskOwnerTeamsForTaskQuery,
  TaskOwnerTeamsForTaskQueryVariables
> = {
  request: {
    query: TASK_OWNER_TEAM,
    variables: { taskId, execution },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskId,
        execution,
        taskOwnerTeam: null,
      },
    },
  },
};

const taskOwnerTeamNoNameMock: ApolloMock<
  TaskOwnerTeamsForTaskQuery,
  TaskOwnerTeamsForTaskQueryVariables
> = {
  request: {
    query: TASK_OWNER_TEAM,
    variables: { taskId, execution },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskId,
        execution,
        taskOwnerTeam: {
          __typename: "TaskOwnerTeam",
          assignmentType: "auto",
          jiraProject: "EVG",
          messages: "Assigned based on task history",
          teamName: "",
        },
      },
    },
  },
};

const loadingMock: ApolloMock<
  TaskOwnerTeamsForTaskQuery,
  TaskOwnerTeamsForTaskQueryVariables
> = {
  request: {
    query: TASK_OWNER_TEAM,
    variables: { taskId, execution },
  },
  result: { data: undefined },
};

describe("TaskOwnership", () => {
  it("renders nothing while loading", async () => {
    render(
      <MockedProvider mocks={[loadingMock]}>
        <TaskOwnership execution={execution} taskId={taskId} />
      </MockedProvider>,
    );

    // Should not find the component while loading
    expect(
      screen.queryByDataCy("task-metadata-task-ownership"),
    ).not.toBeInTheDocument();
  });

  it("renders team name when available", async () => {
    render(
      <MockedProvider mocks={[taskOwnerTeamMock]}>
        <TaskOwnership execution={execution} taskId={taskId} />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByDataCy("task-metadata-task-ownership"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Task Owner:")).toBeInTheDocument();
    expect(screen.getByText("Platform Team")).toBeInTheDocument();

    // Hover over the tooltip
    act(() => {
      screen.getByDataTestid("info-sprinkle-icon").focus();
    });

    await waitFor(() => {
      expect(
        screen.getByText("Assigned based on task history"),
      ).toBeInTheDocument();
    });
  });

  it("renders fallback text when no team name is available", async () => {
    render(
      <MockedProvider mocks={[taskOwnerTeamNoNameMock]}>
        <TaskOwnership execution={execution} taskId={taskId} />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByDataCy("task-metadata-task-ownership"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Task Owner:")).toBeInTheDocument();
    expect(screen.getByText("No known team")).toBeInTheDocument();
  });

  it("renders fallback text when taskOwnerTeam is null", async () => {
    render(
      <MockedProvider mocks={[taskOwnerTeamEmptyMock]}>
        <TaskOwnership execution={execution} taskId={taskId} />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByDataCy("task-metadata-task-ownership"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Task Owner:")).toBeInTheDocument();
    expect(screen.getByText("No known team")).toBeInTheDocument();
  });

  it("uses the correct query variables", async () => {
    // Using a different taskId and execution to verify variables are passed correctly
    const specificTaskId = "specific-task-id";
    const specificExecution = 2;

    const specificMock: ApolloMock<
      TaskOwnerTeamsForTaskQuery,
      TaskOwnerTeamsForTaskQueryVariables
    > = {
      request: {
        query: TASK_OWNER_TEAM,
        variables: { taskId: specificTaskId, execution: specificExecution },
      },
      result: {
        data: {
          task: {
            __typename: "Task",
            id: specificTaskId,
            execution: specificExecution,
            taskOwnerTeam: {
              __typename: "TaskOwnerTeam",
              assignmentType: "manual",
              jiraProject: "TEST",
              messages: "Manual assignment",
              teamName: "Test Team",
            },
          },
        },
      },
    };

    render(
      <MockedProvider mocks={[specificMock]}>
        <TaskOwnership execution={specificExecution} taskId={specificTaskId} />
      </MockedProvider>,
    );

    await waitFor(() => {
      expect(
        screen.getByDataCy("task-metadata-task-ownership"),
      ).toBeInTheDocument();
    });

    expect(screen.getByText("Test Team")).toBeInTheDocument();
  });
});
