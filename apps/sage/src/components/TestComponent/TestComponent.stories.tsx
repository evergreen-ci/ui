import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TestComponent } from ".";

export default {
  component: TestComponent,
} satisfies CustomMeta<typeof TestComponent>;

export const Default: CustomStoryObj<typeof TestComponent> = {
  render: () => <TestComponent />,
};
