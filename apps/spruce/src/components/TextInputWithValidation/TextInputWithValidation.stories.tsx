import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import TextInputWithValidation from ".";

export default {
  title: "Components/TextInput/TextInputWithValidation",
  component: TextInputWithValidation,
} satisfies CustomMeta<typeof TextInputWithValidation>;

export const Default: CustomStoryObj<typeof TextInputWithValidation> = {
  render: (args) => <TextInputWithValidation {...args} />,
  argTypes: {},
  args: {
    validator: (v) => v !== "bad",
    label: "Some search field",
  },
};
