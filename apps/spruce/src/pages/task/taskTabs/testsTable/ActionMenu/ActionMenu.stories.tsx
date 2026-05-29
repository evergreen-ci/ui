import { userEvent } from "storybook/test";
import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TestStatus } from "@evg-ui/lib/types/test";
import { TaskQuery, TestResult } from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { ActionMenu } from ".";

export default {
  component: ActionMenu,
  decorators: [(Story: () => React.JSX.Element) => WithToastContext(Story)],
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>(
      '[data-cy="ellipsis-btn"]',
    );
    if (trigger) {
      await userEvent.click(trigger);
    }
  },
} satisfies CustomMeta<typeof ActionMenu>;

const taskWithTestSelection: NonNullable<TaskQuery["task"]> = {
  ...taskQuery.task,
  testSelectionEnabled: true,
};

const failingTest: TestResult = {
  id: "1",
  testFile: "test_1",
  status: TestStatus.Fail,
  isManuallyQuarantined: false,
  logs: {},
};

const passingTest: TestResult = {
  id: "2",
  testFile: "test_2",
  status: TestStatus.Pass,
  isManuallyQuarantined: false,
  logs: {},
};

const quarantinedTest: TestResult = {
  id: "3",
  testFile: "test_3",
  status: TestStatus.Pass,
  isManuallyQuarantined: true,
  logs: {},
};

const failingTestOnDisplayTask: TestResult = {
  id: "4",
  taskId: "execTaskId",
  testFile: "test_4",
  status: TestStatus.Fail,
  isManuallyQuarantined: false,
  logs: {},
};

export const TestSelectionDisabled: CustomStoryObj<typeof ActionMenu> = {
  render: () => (
    <ActionMenu
      task={{ ...taskWithTestSelection, testSelectionEnabled: false }}
      test={failingTest}
    />
  ),
};

export const DisplayTask: CustomStoryObj<typeof ActionMenu> = {
  render: () => (
    <ActionMenu
      task={{ ...taskWithTestSelection, displayOnly: true }}
      test={failingTestOnDisplayTask}
    />
  ),
};

export const Quarantined: CustomStoryObj<typeof ActionMenu> = {
  render: () => (
    <ActionMenu task={taskWithTestSelection} test={quarantinedTest} />
  ),
};

export const FailingTest: CustomStoryObj<typeof ActionMenu> = {
  render: () => <ActionMenu task={taskWithTestSelection} test={failingTest} />,
};

export const PassingTest: CustomStoryObj<typeof ActionMenu> = {
  render: () => <ActionMenu task={taskWithTestSelection} test={passingTest} />,
};
