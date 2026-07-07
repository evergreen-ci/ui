import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { QuarantinedTestsSkipped } from ".";

export default {
  component: QuarantinedTestsSkipped,
} satisfies CustomMeta<typeof QuarantinedTestsSkipped>;

export const ZeroSkipped: CustomStoryObj<typeof QuarantinedTestsSkipped> = {
  render: () => (
    <QuarantinedTestsSkipped
      count={0}
      execution={0}
      taskId="t1"
      testSelectionEnabled
    />
  ),
};

export const SomeSkipped: CustomStoryObj<typeof QuarantinedTestsSkipped> = {
  render: () => (
    <QuarantinedTestsSkipped
      count={12}
      execution={0}
      taskId="t1"
      testSelectionEnabled
    />
  ),
};
