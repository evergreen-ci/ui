import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import TextInputWithValidation from ".";

export default {
  component: TextInputWithValidation,
  title: "Components/TextInput/TextInputWithValidation",
} satisfies CustomMeta<typeof TextInputWithValidation>;

export const Default: CustomStoryObj<typeof TextInputWithValidation> = {
  args: {
    label: "Some search field",
    validator: (v) => v !== "bad",
  },
  argTypes: {},
  render: (args) => <TextInputWithValidation {...args} />,
};
