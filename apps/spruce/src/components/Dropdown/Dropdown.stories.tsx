import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";

import Dropdown from ".";

export default {
  component: Dropdown,
} satisfies CustomMeta<typeof Dropdown>;

export const Default: CustomStoryObj<typeof Dropdown> = {
  render: (args) => <Dropdown {...args}>Some Children</Dropdown>,
  args: {
    disabled: false,
  },
};

export const CustomButtonRender: CustomStoryObj<typeof Dropdown> = {
  render: (args) => (
    <Dropdown {...args} buttonRenderer={() => <b>Some Magic Button</b>}>
      Some Children
    </Dropdown>
  ),
  args: Default.args,
};
