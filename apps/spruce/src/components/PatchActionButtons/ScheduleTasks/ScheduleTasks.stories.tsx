import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { mocks } from "./testData";
import { ScheduleTasks } from ".";

export default {
  component: ScheduleTasks,
  decorators: [(Story: () => JSX.Element) => WithToastContext(Story)],
  parameters: {
    apolloClient: {
      mocks,
    },
  },
} satisfies CustomMeta<typeof ScheduleTasks>;

export const ScheduleTasksPopulated: CustomStoryObj<typeof ScheduleTasks> = {
  render: () => <ScheduleTasks isButton versionId="version" />,
};

export const ScheduleTasksEmpty: CustomStoryObj<typeof ScheduleTasks> = {
  render: () => <ScheduleTasks isButton versionId="emptyVersion" />,
};
