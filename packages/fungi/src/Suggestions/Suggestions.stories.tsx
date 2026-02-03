import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import { Suggestions } from ".";

export default {
  component: Suggestions,
} satisfies CustomMeta<typeof Suggestions>;

export const Default: CustomStoryObj<typeof Suggestions> = {
  args: {
    handleSend: () => {},
    suggestions: [
      "Suggested prompt A",
      "Suggested prompt B",
      "Suggested prompt C",
    ],
  },
};
