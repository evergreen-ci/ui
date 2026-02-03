import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";

import TimePicker from ".";

export default {
  component: TimePicker,
} satisfies CustomMeta<typeof TimePicker>;

export const Default: CustomStoryObj<typeof TimePicker> = {
  render: (args) => (
    <div style={{ width: "110px" }}>
      <TimePicker
        {...args}
        onDateChange={() => console.log("date changed")}
        value={new Date(args.value)}
      />
    </div>
  ),
  args: {
    disabled: false,
    value: new Date("2025-01-01T12:33:00Z"),
  },
  argTypes: {
    disabled: {
      control: { type: "boolean" },
    },
    value: {
      control: { type: "date" },
    },
  },
};
