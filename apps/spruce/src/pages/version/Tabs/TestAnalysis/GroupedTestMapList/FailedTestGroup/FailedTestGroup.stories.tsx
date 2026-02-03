import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import FailedTestGroup from ".";

export default {
  component: FailedTestGroup,
} satisfies CustomMeta<typeof FailedTestGroup>;

export const Default: CustomStoryObj<typeof FailedTestGroup> = {
  render: (args) => <FailedTestGroup {...args} />,
  argTypes: {},
  args: {
    testName: "TestName",
    tasks: [
      {
        taskName: "TaskName",
        buildVariant: "BuildVariant",
        id: "TaskId",
        displayStatus: "failed",
        logs: {
          urlParsley: "LogsUrl",
        },
      },
    ],
  },
};

export const LongTestName: CustomStoryObj<typeof FailedTestGroup> = {
  render: (args) => <FailedTestGroup {...args} />,
  argTypes: {},
  args: {
    testName:
      "This_is_a_very_long_test_name_that_should_wrap_This_is_a_very_long_test_name_that_should_wrap_This_is_a_very_long_test_name_that_should_wrap",
    tasks: [
      {
        taskName: "TaskName",
        buildVariant: "BuildVariant",
        id: "TaskId",
        displayStatus: "failed",
        logs: {
          urlParsley: "LogsUrl",
        },
      },
    ],
  },
};
