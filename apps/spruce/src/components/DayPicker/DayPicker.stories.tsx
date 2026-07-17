import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { DayPicker } from ".";

export default {
  component: DayPicker,
} satisfies CustomMeta<typeof DayPicker>;

export const Default: CustomStoryObj<typeof DayPicker> = {
  args: {
    disabled: false,
  },
  render: (args) => <DayPicker {...args} />,
};
