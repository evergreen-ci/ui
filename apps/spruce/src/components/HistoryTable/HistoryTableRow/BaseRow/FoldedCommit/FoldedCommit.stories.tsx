import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";

import { foldedCommitData } from "./testData";
import FoldedCommit from ".";

export default {
  component: FoldedCommit,
  title: "components/HistoryTable/FoldedCommit",
} satisfies CustomMeta<typeof FoldedCommit>;

export const FoldedCommitStory: CustomStoryObj<typeof FoldedCommit> = {
  render: (args) => <FoldedCommit {...args} />,
  args: {
    index: 0,
    data: foldedCommitData,
    numVisibleCols: 5,
    selected: false,
  },
  parameters: {
    apolloClient: {
      mocks: [getSpruceConfigMock],
    },
  },
};
