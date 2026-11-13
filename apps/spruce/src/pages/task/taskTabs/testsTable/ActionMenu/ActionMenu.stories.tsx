import { userEvent } from "storybook/test";
import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TestStatus } from "@evg-ui/lib/types/test";
import { TestResult } from "gql/generated/types";
import { taskQuery } from "gql/mocks/taskData";
import { ActionMenu } from ".";

export default {
  component: ActionMenu,
  decorators: [(Story: () => React.JSX.Element) => WithToastContext(Story)],
  play: async ({ canvasElement }) => {
    const trigger = canvasElement.querySelector<HTMLElement>(
      '[data-testid="ellipsis-btn"]',
    );
    if (trigger) {
      await userEvent.click(trigger);
    }
  },
} satisfies CustomMeta<typeof ActionMenu>;

const failingTest: TestResult = {
  id: "1",
  testFile: "test_1",
  status: TestStatus.Fail,
  canQuarantine: true,
  isManuallyQuarantined: false,
  logs: {},
};

const passingTest: TestResult = {
  id: "2",
  testFile: "test_2",
  status: TestStatus.Pass,
  canQuarantine: true,
  isManuallyQuarantined: false,
  logs: {},
};

const quarantinedTest: TestResult = {
  id: "3",
  testFile: "test_3",
  status: TestStatus.Pass,
  canQuarantine: true,
  isManuallyQuarantined: true,
  logs: {},
};

const failingTestOnDisplayTask: TestResult = {
  id: "4",
  taskId: "execTaskId",
  testFile: "test_4",
  status: TestStatus.Fail,
  canQuarantine: true,
  isManuallyQuarantined: false,
  logs: {},
};

export const NotCheckedByTestSelection: CustomStoryObj<typeof ActionMenu> = {
  render: () => (
    <ActionMenu
      task={taskQuery.task}
      test={{ ...failingTest, canQuarantine: false }}
    />
  ),
};

export const DisplayTask: CustomStoryObj<typeof ActionMenu> = {
  render: () => (
    <ActionMenu
      task={{ ...taskQuery.task, displayOnly: true }}
      test={failingTestOnDisplayTask}
    />
  ),
};

export const Quarantined: CustomStoryObj<typeof ActionMenu> = {
  render: () => <ActionMenu task={taskQuery.task} test={quarantinedTest} />,
};

export const FailingTest: CustomStoryObj<typeof ActionMenu> = {
  render: () => <ActionMenu task={taskQuery.task} test={failingTest} />,
};

export const PassingTest: CustomStoryObj<typeof ActionMenu> = {
  render: () => <ActionMenu task={taskQuery.task} test={passingTest} />,
};
