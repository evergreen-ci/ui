import { CustomStoryObj, CustomMeta } from "test_utils/types";
import { DayPicker } from ".";

export default {
  component: DayPicker,
} satisfies CustomMeta<typeof DayPicker>;

export const Default: CustomStoryObj<typeof DayPicker> = {
  render: () => <DayPicker />,
};
