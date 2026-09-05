import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { RequesterSelector } from "./RequesterSelector";

export default {
  component: RequesterSelector,
} satisfies CustomMeta<typeof RequesterSelector>;

export const Default: CustomStoryObj<typeof RequesterSelector> = {
  render: () => <RequesterSelector />,
};
