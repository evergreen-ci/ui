import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { Disclaimer } from ".";

export default {
  component: Disclaimer,
} satisfies CustomMeta<typeof Disclaimer>;

export const Default: CustomStoryObj<typeof Disclaimer> = {
  args: {
    children: "This is the disclaimer message.",
  },
};
