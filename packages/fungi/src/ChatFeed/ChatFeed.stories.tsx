import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import { ChatFeed } from ".";

export default {
  component: ChatFeed,
} satisfies CustomMeta<typeof ChatFeed>;

export const Default: CustomStoryObj<typeof ChatFeed> = {
  argTypes: {},
  args: {},
};
