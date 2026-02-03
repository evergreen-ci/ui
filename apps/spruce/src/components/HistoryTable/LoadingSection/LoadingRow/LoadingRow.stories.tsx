import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";

import LoadingRow from ".";

export default {
  component: LoadingRow,
  title: "components/HistoryTable/LoadingSection/LoadingRow",
} satisfies CustomMeta<typeof LoadingRow>;

export const LoadingRowStory: CustomStoryObj<typeof LoadingRow> = {
  render: (args) => <LoadingRow {...args} />,
  args: {
    numVisibleCols: 3,
  },
};
