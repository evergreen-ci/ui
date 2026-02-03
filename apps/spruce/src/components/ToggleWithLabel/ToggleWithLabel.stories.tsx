import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import { ToggleWithLabel } from ".";

export default {
  component: ToggleWithLabel,
} satisfies CustomMeta<typeof ToggleWithLabel>;

export const Default: CustomStoryObj<typeof ToggleWithLabel> = {
  args: {
    checked: false,
    description: "This is a toggle description.",
    disabled: false,
    id: "my-id",
    label: "My toggle",
    onChange: () => {},
  },
};
