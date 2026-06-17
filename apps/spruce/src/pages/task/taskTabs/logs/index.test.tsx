import { RenderFakeToastContext } from "@evg-ui/lib/context/toast/__mocks__";
import {
  renderWithRouterMatch as render,
  screen,
} from "@evg-ui/lib/test_utils";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import {
  TaskEventLogsQuery,
  TaskEventLogsQueryVariables,
  TaskLogLinks,
} from "gql/generated/types";
import { TASK_EVENT_LOGS } from "gql/queries";
import { MockedProvider } from "test_utils/graphql";
import Logs from ".";

const taskId = "task-id";
const execution = 0;

const taskEventLogsMock: ApolloMock<
  TaskEventLogsQuery,
  TaskEventLogsQueryVariables
> = {
  request: {
    query: TASK_EVENT_LOGS,
    variables: { id: taskId, execution },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskId,
        execution,
        taskLogs: {
          __typename: "TaskLogs",
          eventLogs: [],
        },
      },
    },
  },
};

const renderLogs = (isDisplayTask: boolean) => {
  const { Component } = RenderFakeToastContext(
    <MockedProvider mocks={[taskEventLogsMock]}>
      <Logs
        execution={execution}
        isDisplayTask={isDisplayTask}
        logLinks={{} as TaskLogLinks}
        taskId={taskId}
      />
    </MockedProvider>,
  );
  render(<Component />, {
    route: `/task/${taskId}/logs?logtype=event`,
    path: "/task/:id/:tab",
  });
};

describe("logs", () => {
  it("renders every log type option for a regular task", () => {
    renderLogs(false);
    expect(screen.getByText("Task Logs")).toBeInTheDocument();
    expect(screen.getByText("Agent Logs")).toBeInTheDocument();
    expect(screen.getByText("System Logs")).toBeInTheDocument();
    expect(screen.getByText("Event Logs")).toBeInTheDocument();
    expect(screen.getByText("Combined")).toBeInTheDocument();
  });

  it("only offers the event logs option for a display task, since display tasks have no execution logs", () => {
    renderLogs(true);
    expect(screen.getByText("Event Logs")).toBeInTheDocument();
    expect(screen.queryByText("Task Logs")).toBeNull();
    expect(screen.queryByText("Agent Logs")).toBeNull();
    expect(screen.queryByText("System Logs")).toBeNull();
    expect(screen.queryByText("Combined")).toBeNull();
  });
});
