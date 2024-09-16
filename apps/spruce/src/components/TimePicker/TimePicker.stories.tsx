import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";

import TimePicker, { TimePickerProps } from ".";

export default {
  component: TimePicker,
} satisfies CustomMeta<typeof TimePicker>;

export const Default: CustomStoryObj<TimePickerProps> = {
  render: (args) => <TimePicker {...args} onChange={() => {}} />,
  args: {
    disabled: false,
  },
};
