import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { TestStatus } from "types/test";
import styles from "./TestStatusBadge.stories.module.css";
import TestStatusBadge from ".";

export default {
  component: TestStatusBadge,
} satisfies CustomMeta<typeof TestStatusBadge>;

export const Default: CustomStoryObj<typeof TestStatusBadge> = {
  argTypes: {
    status: {
      control: "select",
      options: Object.values(TestStatus),
    },
  },
  args: {
    status: TestStatus.Pass,
  },
  render: (args) => <TestStatusBadge {...args} />,
};

export const AllBadges: CustomStoryObj<typeof TestStatusBadge> = {
  render: () => (
    <div className={styles.container}>
      {Object.values(TestStatus).map((status) => (
        <TestStatusBadge key={status} status={status} />
      ))}
    </div>
  ),
};
