import { Variant } from "@leafygreen-ui/button";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { LoadingButton } from ".";

export default {
  component: LoadingButton,
} satisfies CustomMeta<typeof LoadingButton>;

export const Default: CustomStoryObj<typeof LoadingButton> = {
  args: {
    loading: false,
    variant: Variant.Default,
  },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: Object.values(Variant),
    },
  },
  render: (args) => <LoadingButton {...args}>Button text</LoadingButton>,
};
