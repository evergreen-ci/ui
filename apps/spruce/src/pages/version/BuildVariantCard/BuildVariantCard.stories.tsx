import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import { mocks } from "./testData";
import BuildVariantCard from ".";

export default {
  title: "Pages/Version/BuildVariantCard",
  component: BuildVariantCard,
  parameters: {
    apolloClient: {
      mocks,
    },
  },
} satisfies CustomMeta<typeof BuildVariantCard>;

export const Default: CustomStoryObj<typeof BuildVariantCard> = {
  render: (args) => <BuildVariantCard {...args} />,
  args: {
    versionId: "version",
  },
};
