import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import { DayPicker } from ".";

export default {
  component: DayPicker,
} satisfies CustomMeta<typeof DayPicker>;

export const Default: CustomStoryObj<typeof DayPicker> = {
  render: (args) => <DayPicker {...args} />,
  args: {
    disabled: false,
  },
};
