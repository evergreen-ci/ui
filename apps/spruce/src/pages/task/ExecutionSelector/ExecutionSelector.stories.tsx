import {
  ApolloMock,
  CustomMeta,
  CustomStoryObj,
} from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
import {
  TaskAllExecutionsQuery,
  TaskAllExecutionsQueryVariables,
} from "gql/generated/types";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";
import { TASK_ALL_EXECUTIONS } from "gql/queries";
import ExecutionSelector from ".";

const taskAllExecutions: TaskAllExecutionsQuery["taskAllExecutions"] = [
  {
    __typename: "Task",
    activatedTime: new Date("2025-06-12T07:42:16.486Z"),
    displayStatus: TaskStatus.Succeeded,
    execution: 0,
    id: "a",
    ingestTime: new Date("2025-06-12T07:42:16.486Z"),
  },
  {
    __typename: "Task",
    activatedTime: new Date("2025-06-13T07:42:16.486Z"),
    displayStatus: TaskStatus.Failed,
    execution: 1,
    id: "b",
    ingestTime: new Date("2025-06-13T07:42:16.486Z"),
  },
  {
    __typename: "Task",
    activatedTime: new Date("2025-06-14T07:42:16.486Z"),
    displayStatus: TaskStatus.KnownIssue,
    execution: 2,
    id: "c",
    ingestTime: new Date("2025-06-14T07:42:16.486Z"),
  },
  {
    __typename: "Task",
    activatedTime: new Date("2025-06-15T07:42:16.486Z"),
    displayStatus: TaskStatus.Aborted,
    execution: 3,
    id: "d",
    ingestTime: new Date("2025-06-15T07:42:16.486Z"),
  },
  {
    __typename: "Task",
    activatedTime: new Date("2025-06-16T07:42:16.486Z"),
    displayStatus: TaskStatus.SystemFailed,
    execution: 4,
    id: "e",
    ingestTime: new Date("2025-06-16T07:42:16.486Z"),
  },
  {
    __typename: "Task",
    activatedTime: new Date("2025-06-17T07:42:16.486Z"),
    displayStatus: TaskStatus.SetupFailed,
    execution: 5,
    id: "f",
    ingestTime: new Date("2025-06-17T07:42:16.486Z"),
  },
  {
    __typename: "Task",
    activatedTime: new Date("2025-06-18T07:42:16.486Z"),
    displayStatus: TaskStatus.TaskTimedOut,
    execution: 6,
    id: "g",
    ingestTime: new Date("2025-06-18T07:42:16.486Z"),
  },
  {
    __typename: "Task",
    activatedTime: new Date("2025-06-19T07:42:16.486Z"),
    displayStatus: TaskStatus.Unstarted,
    execution: 7,
    id: "h",
    ingestTime: new Date("2025-06-19T07:42:16.486Z"),
  },
  {
    __typename: "Task",
    activatedTime: new Date("2025-06-20T07:42:16.486Z"),
    displayStatus: TaskStatus.Started,
    execution: 8,
    id: "i",
    ingestTime: new Date("2025-06-20T07:42:16.486Z"),
  },
];

const allExecutionsMock: ApolloMock<
  TaskAllExecutionsQuery,
  TaskAllExecutionsQueryVariables
> = {
  request: {
    query: TASK_ALL_EXECUTIONS,
    variables: {
      taskId: "abcdef",
    },
  },
  result: {
    data: {
      taskAllExecutions: taskAllExecutions,
    },
  },
};

export default {
  component: ExecutionSelector,
  parameters: {
    apolloClient: {
      mocks: [allExecutionsMock, getSpruceConfigMock],
    },
  },
} satisfies CustomMeta<typeof ExecutionSelector>;

export const Default: CustomStoryObj<typeof ExecutionSelector> = {
  render: () => (
    <ExecutionSelector
      currentExecution={4}
      latestExecution={taskAllExecutions.length - 1}
      taskId="abcdef"
      updateExecution={(i) => console.log(`Updated execution to ${i}`)}
    />
  ),
};
