import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { ErrorBanner } from ".";

export default {
  component: ErrorBanner,
} satisfies CustomMeta<typeof ErrorBanner>;

export const Default: CustomStoryObj<typeof ErrorBanner> = {
  args: {
    errors: [
      "buildvariant 'ubuntu' has no tasks",
      "task 'lint' references unknown function 'setup'",
    ],
  },
  render: (args) => <ErrorBanner {...args} />,
};
