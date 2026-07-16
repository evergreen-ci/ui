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
  component: TaskOverviewPopup,
  decorators: [(Story: () => React.JSX.Element) => WithToastContext(Story)],
  title: "Pages/Waterfall/TaskOverviewPopup",
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
    variables: { execution: 0, taskId },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        annotation: null,
        buildVariant: "ubuntu1604",
        canRestart: true,
        details: {
          description: "Running unit tests",
          failingCommand: null,
        },
        displayName: "test-task",
        displayOnly: false,
        displayStatus: TaskStatus.Succeeded,
        distroId: "ubuntu1604-small",
        execution: 0,
        finishTime: new Date("2024-01-15T10:30:00Z"),
        id: taskId,
        status: TaskStatus.Succeeded,
        timeTaken: 125000,
      },
    },
  },
};

export const Default: StoryObj<typeof TaskOverviewPopup> = {
  args: {
    execution: 0,
    taskId,
  },
  parameters: {
    apolloClient: {
      mocks: [defaultMock],
    },
  },
  render: (args) => <TaskOverviewPopupWrapper {...args} />,
};

const withAnnotationsMock: ApolloMock<
  TaskOverviewPopupQuery,
  TaskOverviewPopupQueryVariables
> = {
  request: {
    query: TASK_OVERVIEW_POPUP,
    variables: { execution: 0, taskId },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        annotation: {
          createdIssues: [
            {
              issueKey: "EVG-1234",
              url: "https://jira.mongodb.org/browse/EVG-1234",
            },
          ],
          id: "annotation_123",
          issues: [
            {
              issueKey: "EVG-5678",
              jiraTicket: {
                fields: {
                  failingTasks: ["test-task-1", "test-task-2"],
                },
              },
              url: "https://jira.mongodb.org/browse/EVG-5678",
            },
          ],
          suspectedIssues: [
            {
              issueKey: "EVG-9012",
              url: "https://jira.mongodb.org/browse/EVG-9012",
            },
          ],
        },
        buildVariant: "ubuntu2004",
        canRestart: true,
        details: {
          description: "",
          failingCommand:
            "'shell.exec' in function 'pnpm-cypress' (step 11 of 11)",
        },
        displayName: "e2e-test",
        displayOnly: true,
        displayStatus: TaskStatus.Failed,
        distroId: "ubuntu2004-small",
        execution: 0,
        finishTime: new Date("2024-01-15T12:00:00Z"),
        id: taskId,
        status: TaskStatus.Failed,
        timeTaken: 256000,
      },
    },
  },
};

export const WithAnnotations: StoryObj<typeof TaskOverviewPopup> = {
  args: {
    execution: 0,
    taskId,
  },
  parameters: {
    apolloClient: {
      mocks: [withAnnotationsMock],
    },
  },
  render: (args) => <TaskOverviewPopupWrapper {...args} />,
};

const longTaskNameMock: ApolloMock<
  TaskOverviewPopupQuery,
  TaskOverviewPopupQueryVariables
> = {
  request: {
    query: TASK_OVERVIEW_POPUP,
    variables: { execution: 0, taskId },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        annotation: null,
        buildVariant: "ubuntu2004",
        canRestart: false,
        details: {
          description:
            "This is a very long description that should demonstrate how the popup handles lengthy text content. It should wrap appropriately within the popup bounds.",
          failingCommand: null,
        },
        displayName:
          "very-long-task-name-that-should-wrap-or-truncate-properly-in-the-popup",
        displayOnly: false,
        displayStatus: TaskStatus.WillRun,
        distroId: "ubuntu2004-xlarge-with-very-long-distro-name",
        execution: 0,
        finishTime: null,
        id: taskId,
        status: TaskStatus.WillRun,
        timeTaken: null,
      },
    },
  },
};

export const LongTaskName: StoryObj<typeof TaskOverviewPopup> = {
  args: {
    execution: 0,
    taskId,
  },
  parameters: {
    apolloClient: {
      mocks: [longTaskNameMock],
    },
  },
  render: (args) => <TaskOverviewPopupWrapper {...args} />,
};

const failedTaskMock: ApolloMock<
  TaskOverviewPopupQuery,
  TaskOverviewPopupQueryVariables
> = {
  request: {
    query: TASK_OVERVIEW_POPUP,
    variables: { execution: 0, taskId },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        annotation: null,
        buildVariant: "ubuntu1604",
        canRestart: true,
        details: {
          description: null,
          failingCommand:
            "'shell.exec' in function 'pnpm-cypress' (step 11 of 11)",
        },
        displayName: "cypress-test",
        displayOnly: false,
        displayStatus: TaskStatus.Failed,
        distroId: "ubuntu1604-large",
        execution: 0,
        finishTime: new Date("2024-01-15T11:45:00Z"),
        id: taskId,
        status: TaskStatus.Failed,
        timeTaken: 98000,
      },
    },
  },
};

const failingTestsMock: ApolloMock<TaskTestsQuery, TaskTestsQueryVariables> = {
  request: {
    query: TASK_TESTS,
    variables: {
      execution: 0,
      id: taskId,
      limitNum: 3,
      statusList: [TestStatus.Fail, TestStatus.SilentFail],
      testName: "",
    },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        execution: 0,
        id: taskId,
        tests: {
          filteredTestCount: 5,
          testResults: [
            {
              baseStatus: null,
              duration: 1234,
              id: "test-1",
              isManuallyQuarantined: false,
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
              baseStatus: null,
              duration: 890,
              id: "test-2",
              isManuallyQuarantined: false,
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
              baseStatus: null,
              duration: 2345,
              id: "test-3",
              isManuallyQuarantined: false,
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
  args: {
    execution: 0,
    taskId,
  },
  parameters: {
    apolloClient: {
      mocks: [failedTaskMock, failingTestsMock],
    },
  },
  render: (args) => <TaskOverviewPopupWrapper {...args} />,
};

const stepbackCompleteMock: ApolloMock<
  TaskOverviewPopupQuery,
  TaskOverviewPopupQueryVariables
> = {
  request: {
    query: TASK_OVERVIEW_POPUP,
    variables: { execution: 0, taskId },
  },
  result: {
    data: {
      task: {
        __typename: "Task",
        annotation: null,
        buildVariant: "ubuntu1604",
        canRestart: true,
        details: {
          description: null,
          failingCommand:
            "'shell.exec' in function 'run-integration-test' (step 3 of 10)",
        },
        displayName: "test-task-stepback-complete",
        displayOnly: false,
        displayStatus: TaskStatus.Failed,
        distroId: "ubuntu1604-small",
        execution: 0,
        finishTime: new Date("2024-01-15T14:00:00Z"),
        id: taskId,
        status: TaskStatus.Failed,
        stepbackInfo: {
          lastFailingStepbackTaskId: "breaking_task_id",
          nextStepbackTaskId: null,
        },
        timeTaken: 155000,
      },
    },
  },
};

export const StepbackComplete: StoryObj<typeof TaskOverviewPopup> = {
  args: {
    execution: 0,
    taskId,
  },
  parameters: {
    apolloClient: {
      mocks: [stepbackCompleteMock],
    },
  },
  render: (args) => <TaskOverviewPopupWrapper {...args} />,
};
