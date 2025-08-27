import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { Chatbot } from ".";

export default {
  component: Chatbot,
  decorators: [(Story: () => JSX.Element) => <Story />],
} satisfies CustomMeta<typeof Chatbot>;

export const Default: CustomStoryObj<typeof Chatbot> = {
  argTypes: {},
  args: {},
};
