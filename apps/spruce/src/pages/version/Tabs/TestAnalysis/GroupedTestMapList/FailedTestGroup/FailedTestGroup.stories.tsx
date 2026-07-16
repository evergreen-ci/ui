import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import FailedTestGroup from ".";

export default {
  component: FailedTestGroup,
} satisfies CustomMeta<typeof FailedTestGroup>;

export const Default: CustomStoryObj<typeof FailedTestGroup> = {
  args: {
    tasks: [
      {
        buildVariant: "BuildVariant",
        displayStatus: "failed",
        id: "TaskId",
        logs: {
          urlParsley: "LogsUrl",
        },
        taskName: "TaskName",
      },
    ],
    testName: "TestName",
  },
  argTypes: {},
  render: (args) => <FailedTestGroup {...args} />,
};

export const LongTestName: CustomStoryObj<typeof FailedTestGroup> = {
  args: {
    tasks: [
      {
        buildVariant: "BuildVariant",
        displayStatus: "failed",
        id: "TaskId",
        logs: {
          urlParsley: "LogsUrl",
        },
        taskName: "TaskName",
      },
    ],
    testName:
      "This_is_a_very_long_test_name_that_should_wrap_This_is_a_very_long_test_name_that_should_wrap_This_is_a_very_long_test_name_that_should_wrap",
  },
  argTypes: {},
  render: (args) => <FailedTestGroup {...args} />,
};
