import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";

import LoadingSection from ".";

export default {
  component: LoadingSection,
  title: "components/HistoryTable/LoadingSection",
} satisfies CustomMeta<typeof LoadingSection>;

export const LoadingSectionStory: CustomStoryObj<typeof LoadingSection> = {
  args: {
    numLoadingRows: 5,
    numVisibleCols: 7,
  },
  render: (args) => <LoadingSection {...args} />,
};
