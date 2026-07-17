import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { getSpruceConfigMock } from "gql/mocks/getSpruceConfig";

import { foldedCommitData } from "./testData";
import FoldedCommit from ".";

export default {
  component: FoldedCommit,
  title: "components/HistoryTable/FoldedCommit",
} satisfies CustomMeta<typeof FoldedCommit>;

export const FoldedCommitStory: CustomStoryObj<typeof FoldedCommit> = {
  args: {
    data: foldedCommitData,
    index: 0,
    numVisibleCols: 5,
    selected: false,
  },
  parameters: {
    apolloClient: {
      mocks: [getSpruceConfigMock],
    },
  },
  render: (args) => <FoldedCommit {...args} />,
};
