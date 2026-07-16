import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import PopoverButton from ".";

export default {
  component: PopoverButton,
} satisfies CustomMeta<typeof PopoverButton>;

export const Default: CustomStoryObj<typeof PopoverButton> = {
  args: {
    buttonText: "Popover Button",
  },

  render: (args) => <PopoverButton {...args}>Some Content</PopoverButton>,
};
