import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
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
        status: "failed",
        logs: {
          urlParsley: "LogsUrl",
        },
      },
    ],
  },
};
