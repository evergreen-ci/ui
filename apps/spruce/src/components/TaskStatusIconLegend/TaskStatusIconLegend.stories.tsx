import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";

import { TaskStatusIconLegend, LegendContent } from ".";

export default {
  component: TaskStatusIconLegend,
} satisfies CustomMeta<typeof TaskStatusIconLegend>;

export const LegendWithButton: CustomStoryObj<typeof TaskStatusIconLegend> = {
  render: () => <TaskStatusIconLegend useWaterfall />,
};

export const LegendOnlyMainlineCommits: CustomStoryObj<typeof LegendContent> = {
  render: () => <LegendContent useWaterfall={false} />,
};

export const LegendOnlyWaterfall: CustomStoryObj<typeof LegendContent> = {
  render: () => <LegendContent useWaterfall />,
};
