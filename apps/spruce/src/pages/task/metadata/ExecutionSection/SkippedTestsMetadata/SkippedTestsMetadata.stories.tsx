import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { SkippedTestsMetadata } from ".";

export default {
  component: SkippedTestsMetadata,
} satisfies CustomMeta<typeof SkippedTestsMetadata>;

export const ZeroSkipped: CustomStoryObj<typeof SkippedTestsMetadata> = {
  render: () => (
    <SkippedTestsMetadata
      count={0}
      execution={0}
      latestExecution={0}
      taskId="t1"
      testSelectionEnabled
    />
  ),
};

export const SomeSkipped: CustomStoryObj<typeof SkippedTestsMetadata> = {
  render: () => (
    <SkippedTestsMetadata
      count={12}
      execution={0}
      latestExecution={0}
      taskId="t1"
      testSelectionEnabled
    />
  ),
};

export const PreviousExecution: CustomStoryObj<typeof SkippedTestsMetadata> = {
  render: () => (
    <SkippedTestsMetadata
      count={12}
      execution={0}
      latestExecution={1}
      taskId="t1"
      testSelectionEnabled
    />
  ),
};
