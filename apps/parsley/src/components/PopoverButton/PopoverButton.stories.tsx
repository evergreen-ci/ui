import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import PopoverButton from ".";

export default {
  component: PopoverButton,
} satisfies CustomMeta<typeof PopoverButton>;

export const Default: CustomStoryObj<typeof PopoverButton> = {
  render: (args) => <PopoverButton {...args}>Some Content</PopoverButton>,

  args: {
    buttonText: "Popover Button",
  },
};
