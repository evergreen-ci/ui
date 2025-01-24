import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import LoadingBar from ".";

export default {
  argTypes: {
    indeterminate: {
      control: { type: "boolean" },
    },
    progress: {
      control: { max: 100, min: 0, step: 1, type: "range" },
    },
  },
  args: {
    indeterminate: true,
  },
  component: LoadingBar,
} satisfies CustomMeta<typeof LoadingBar>;

export const Default: CustomStoryObj<typeof LoadingBar> = {};
