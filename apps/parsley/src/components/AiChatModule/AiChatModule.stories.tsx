import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";

import AIChatModule from ".";

export default {
  component: AIChatModule,
} satisfies CustomMeta<typeof AIChatModule>;

export const Default: CustomStoryObj<typeof AIChatModule> = {
  render: (args) => <AIChatModule {...args} />,
};
