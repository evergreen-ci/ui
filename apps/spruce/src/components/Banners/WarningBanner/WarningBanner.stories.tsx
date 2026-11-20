import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { WarningBanner } from ".";

export default {
  component: WarningBanner,
} satisfies CustomMeta<typeof WarningBanner>;

export const Default: CustomStoryObj<typeof WarningBanner> = {
  args: {
    warnings: [
      "task 'test' has no dependencies",
      "buildvariant 'rhel' uses deprecated distro",
    ],
  },
  render: (args) => <WarningBanner {...args} />,
};
