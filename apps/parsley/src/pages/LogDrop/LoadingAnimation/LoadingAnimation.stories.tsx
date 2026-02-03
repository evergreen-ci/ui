import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import LoadingAnimation from ".";

export default {
  component: LoadingAnimation,
} satisfies CustomMeta<typeof LoadingAnimation>;

export const Default: CustomStoryObj<typeof LoadingAnimation> = {
  argTypes: {},
  args: {},
  render: (args) => <LoadingAnimation {...args} />,
};
