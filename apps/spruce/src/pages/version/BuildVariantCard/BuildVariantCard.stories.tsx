import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { mocks } from "./testData";
import BuildVariantCard from ".";

export default {
  component: BuildVariantCard,
  parameters: {
    apolloClient: {
      mocks,
    },
  },
  title: "Pages/Version/BuildVariantCard",
} satisfies CustomMeta<typeof BuildVariantCard>;

export const Default: CustomStoryObj<typeof BuildVariantCard> = {
  args: {
    versionId: "version",
  },
  render: (args) => <BuildVariantCard {...args} />,
};
