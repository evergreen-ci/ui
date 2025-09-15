import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { Suggestions } from ".";

export default {
  component: Suggestions,
} satisfies CustomMeta<typeof Suggestions>;

export const Default: CustomStoryObj<typeof Suggestions> = {
  args: {
    handleSend: () => {},
    suggestions: [
      "Suggested prompt This is a new one",
      "Suggested prompt B",
      "Suggested prompt C",
    ],
  },
};
