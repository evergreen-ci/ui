import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TaskTableInfo } from "components/TasksTable/types";
import {
  TaskStatusesQuery,
  TaskStatusesQueryVariables,
} from "gql/generated/types";
import { TASK_STATUSES } from "gql/queries";

export const versionId = "version-1234";

export const taskStatusesMock: ApolloMock<
  TaskStatusesQuery,
  TaskStatusesQueryVariables
> = {
  request: {
    query: TASK_STATUSES,
    variables: { id: versionId },
  },
  result: {
    data: {
      version: {
        __typename: "Version",
        id: versionId,
        baseTaskStatuses: [TaskStatus.Failed, TaskStatus.Unscheduled],
        taskStatuses: [TaskStatus.Started, TaskStatus.Succeeded],
      },
    },
  },
};

export const tasks: TaskTableInfo[] = [
  {
    id: "some_id",
    projectIdentifier: "evg",
    execution: 0,
    displayName: "Some Fancy ID",
    displayStatus: TaskStatus.Started,
    buildVariant: "ubuntu1604",
    buildVariantDisplayName: "Ubuntu 16.04",
    baseTask: {
      id: "some_base_task",
      execution: 0,
      displayStatus: TaskStatus.Unscheduled,
    },
    executionTasksFull: [],
    dependsOn: [],
  },
  {
    id: "some_id_2",
    projectIdentifier: "evg",
    execution: 0,
    displayName: "Some other Fancy ID",
    displayStatus: TaskStatus.Succeeded,
    buildVariant: "ubuntu1604",
    buildVariantDisplayName: "Ubuntu 16.04",
    baseTask: {
      id: "some_base_task_2",
      execution: 0,
      displayStatus: TaskStatus.Failed,
    },
    executionTasksFull: [],
    dependsOn: [],
  },
  {
    id: "some_id_3",
    projectIdentifier: "evg",
    execution: 0,
    displayName: "Some different Fancy ID",
    displayStatus: TaskStatus.Succeeded,
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    baseTask: {
      id: "some_base_task_3",
      execution: 0,
      displayStatus: TaskStatus.Failed,
    },
    executionTasksFull: [],
    dependsOn: [],
  },
  {
    id: "some_id_4",
    projectIdentifier: "evg",
    execution: 0,
    displayName: "Some Fancy Display Task",
    displayStatus: TaskStatus.Succeeded,
    buildVariant: "Windows",
    buildVariantDisplayName: "Windows 97",
    baseTask: {
      id: "some_base_task_4",
      execution: 0,
      displayStatus: TaskStatus.Failed,
    },
    executionTasksFull: [
      {
        id: "some_id_5",
        execution: 0,
        displayName: "Some fancy execution task",
        displayStatus: TaskStatus.Succeeded,
        buildVariant: "Windows",
        buildVariantDisplayName: "Windows 97",
        baseTask: {
          id: "some_base_task_5",
          execution: 0,
          displayStatus: TaskStatus.Aborted,
        },
      },
      {
        id: "some_id_6",
        projectIdentifier: "evg",
        execution: 0,
        displayName: "Another execution task",
        displayStatus: TaskStatus.Succeeded,
        buildVariant: "Windows",
        buildVariantDisplayName: "Windows 97",
        baseTask: {
          id: "some_base_task_6",
          execution: 0,
          displayStatus: TaskStatus.SystemFailed,
        },
      },
    ],
    dependsOn: [],
  },
];
