import { useRef } from "react";
import { StoryObj } from "@storybook/react-vite";
import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { ApolloMock } from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { TestStatus } from "@evg-ui/lib/types/test";
import {
  TaskOverviewPopupQuery,
  TaskOverviewPopupQueryVariables,
  TaskTestsQuery,
  TaskTestsQueryVariables,
} from "gql/generated/types";
import { TASK_OVERVIEW_POPUP, TASK_TESTS } from "gql/queries";
import { TaskOverviewPopup } from ".";

export default {
  title: "Pages/Waterfall/TaskOverviewPopup",
  decorators: [(Story: () => React.JSX.Element) => WithToastContext(Story)],
  component: TaskOverviewPopup,
};

const taskId = "spruce_ubuntu1604_test_task";

const TaskOverviewPopupWrapper = (args: {
  taskId: string;
  execution: number;
}) => {
  const taskBoxRef = useRef<HTMLButtonElement>(null);
  return (
    <TaskOverviewPopup
      execution={args.execution}
      open
      setOpen={() => {}}
      taskBoxRef={taskBoxRef}
      taskId={args.taskId}
    />
  );
};

const defaultMock: ApolloMock<
  TaskOverviewPopupQuery,
  TaskOverviewPopupQueryVariables
> = {
  request: {
    query: TASK_OVERVIEW_POPUP,
    variables: { taskId, execution: 0 },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskId,
        execution: 0,
        buildVariant: "ubuntu1604",
        canRestart: true,
        displayName: "test-task",
        displayOnly: false,
        displayStatus: TaskStatus.Succeeded,
        distroId: "ubuntu1604-small",
        finishTime: new Date("2024-01-15T10:30:00Z"),
        status: TaskStatus.Succeeded,
        timeTaken: 125000,
        annotation: null,
        details: {
          description: "Running unit tests",
          failingCommand: null,
        },
      },
    },
  },
};

export const Default: StoryObj<typeof TaskOverviewPopup> = {
  render: (args) => <TaskOverviewPopupWrapper {...args} />,
  parameters: {
    apolloClient: {
      mocks: [defaultMock],
    },
  },
  args: {
    taskId,
    execution: 0,
  },
};

const withAnnotationsMock: ApolloMock<
  TaskOverviewPopupQuery,
  TaskOverviewPopupQueryVariables
> = {
  request: {
    query: TASK_OVERVIEW_POPUP,
    variables: { taskId, execution: 0 },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskId,
        execution: 0,
        buildVariant: "ubuntu2004",
        canRestart: true,
        displayName: "e2e-test",
        displayOnly: true,
        displayStatus: TaskStatus.Failed,
        distroId: "ubuntu2004-small",
        finishTime: new Date("2024-01-15T12:00:00Z"),
        status: TaskStatus.Failed,
        timeTaken: 256000,
        annotation: {
          id: "annotation_123",
          createdIssues: [
            {
              issueKey: "EVG-1234",
              url: "https://jira.mongodb.org/browse/EVG-1234",
            },
          ],
          issues: [
            {
              issueKey: "EVG-5678",
              url: "https://jira.mongodb.org/browse/EVG-5678",
              jiraTicket: {
                fields: {
                  failingTasks: ["test-task-1", "test-task-2"],
                },
              },
            },
          ],
          suspectedIssues: [
            {
              issueKey: "EVG-9012",
              url: "https://jira.mongodb.org/browse/EVG-9012",
            },
          ],
        },
        details: {
          description: "",
          failingCommand:
            "'shell.exec' in function 'pnpm-cypress' (step 11 of 11)",
        },
      },
    },
  },
};

export const WithAnnotations: StoryObj<typeof TaskOverviewPopup> = {
  render: (args) => <TaskOverviewPopupWrapper {...args} />,
  parameters: {
    apolloClient: {
      mocks: [withAnnotationsMock],
    },
  },
  args: {
    taskId,
    execution: 0,
  },
};

const longTaskNameMock: ApolloMock<
  TaskOverviewPopupQuery,
  TaskOverviewPopupQueryVariables
> = {
  request: {
    query: TASK_OVERVIEW_POPUP,
    variables: { taskId, execution: 0 },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskId,
        execution: 0,
        buildVariant: "ubuntu2004",
        canRestart: false,
        displayName:
          "very-long-task-name-that-should-wrap-or-truncate-properly-in-the-popup",
        displayOnly: false,
        displayStatus: TaskStatus.WillRun,
        distroId: "ubuntu2004-xlarge-with-very-long-distro-name",
        finishTime: null,
        status: TaskStatus.WillRun,
        timeTaken: null,
        annotation: null,
        details: {
          description:
            "This is a very long description that should demonstrate how the popup handles lengthy text content. It should wrap appropriately within the popup bounds.",
          failingCommand: null,
        },
      },
    },
  },
};

export const LongTaskName: StoryObj<typeof TaskOverviewPopup> = {
  render: (args) => <TaskOverviewPopupWrapper {...args} />,
  parameters: {
    apolloClient: {
      mocks: [longTaskNameMock],
    },
  },
  args: {
    taskId,
    execution: 0,
  },
};

const failedTaskMock: ApolloMock<
  TaskOverviewPopupQuery,
  TaskOverviewPopupQueryVariables
> = {
  request: {
    query: TASK_OVERVIEW_POPUP,
    variables: { taskId, execution: 0 },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskId,
        execution: 0,
        buildVariant: "ubuntu1604",
        canRestart: true,
        displayName: "cypress-test",
        displayOnly: false,
        displayStatus: TaskStatus.Failed,
        distroId: "ubuntu1604-large",
        finishTime: new Date("2024-01-15T11:45:00Z"),
        status: TaskStatus.Failed,
        timeTaken: 98000,
        annotation: null,
        details: {
          description: null,
          failingCommand:
            "'shell.exec' in function 'pnpm-cypress' (step 11 of 11)",
        },
      },
    },
  },
};

const failingTestsMock: ApolloMock<TaskTestsQuery, TaskTestsQueryVariables> = {
  request: {
    query: TASK_TESTS,
    variables: {
      id: taskId,
      execution: 0,
      statusList: [TestStatus.Fail, TestStatus.SilentFail],
      limitNum: 3,
      testName: "",
    },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskId,
        execution: 0,
        tests: {
          filteredTestCount: 5,
          testResults: [
            {
              id: "test-1",
              baseStatus: null,
              duration: 1234,
              isQuarantined: false,
              logs: {
                lineNum: 42,
                testName: "test_authentication_flow",
                url: "https://example.com/logs/test-1",
                urlParsley: "https://example.com/logs/test-1/parsley",
                urlRaw: "https://example.com/logs/test-1/raw",
              },
              status: TestStatus.Fail,
              testFile: "tests/integration/auth/test_authentication_flow.py",
            },
            {
              id: "test-2",
              baseStatus: null,
              duration: 890,
              isQuarantined: false,
              logs: {
                lineNum: 156,
                testName: "test_user_permissions",
                url: "https://example.com/logs/test-2",
                urlParsley: "https://example.com/logs/test-2/parsley",
                urlRaw: "https://example.com/logs/test-2/raw",
              },
              status: TestStatus.Fail,
              testFile:
                "tests/integration/permissions/test_user_permissions.py",
            },
            {
              id: "test-3",
              baseStatus: null,
              duration: 2345,
              isQuarantined: false,
              logs: {
                lineNum: 89,
                testName: "test_database_connection",
                url: "https://example.com/logs/test-3",
                urlParsley: "https://example.com/logs/test-3/parsley",
                urlRaw: "https://example.com/logs/test-3/raw",
              },
              status: TestStatus.SilentFail,
              testFile:
                "tests/unit/database/test_database_connection_with_a_very_long_filename_that_should_wrap.py",
            },
          ],
          totalTestCount: 150,
        },
      },
    },
  },
};

export const WithFailingTests: StoryObj<typeof TaskOverviewPopup> = {
  render: (args) => <TaskOverviewPopupWrapper {...args} />,
  parameters: {
    apolloClient: {
      mocks: [failedTaskMock, failingTestsMock],
    },
  },
  args: {
    taskId,
    execution: 0,
  },
};

const stepbackCompleteMock: ApolloMock<
  TaskOverviewPopupQuery,
  TaskOverviewPopupQueryVariables
> = {
  request: {
    query: TASK_OVERVIEW_POPUP,
    variables: { taskId, execution: 0 },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        id: taskId,
        execution: 0,
        buildVariant: "ubuntu1604",
        canRestart: true,
        displayName: "test-task-stepback-complete",
        displayOnly: false,
        displayStatus: TaskStatus.Failed,
        distroId: "ubuntu1604-small",
        finishTime: new Date("2024-01-15T14:00:00Z"),
        status: TaskStatus.Failed,
        timeTaken: 155000,
        annotation: null,
        stepbackInfo: {
          lastFailingStepbackTaskId: "breaking_task_id",
          nextStepbackTaskId: null,
        },
        details: {
          description: null,
          failingCommand:
            "'shell.exec' in function 'run-integration-test' (step 3 of 10)",
        },
      },
    },
  },
};

export const StepbackComplete: StoryObj<typeof TaskOverviewPopup> = {
  render: (args) => <TaskOverviewPopupWrapper {...args} />,
  parameters: {
    apolloClient: {
      mocks: [stepbackCompleteMock],
    },
  },
  args: {
    taskId,
    execution: 0,
  },
};
