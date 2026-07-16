import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import SpawnPageSkeleton from ".";

export default {
  component: SpawnPageSkeleton,
  title: "pages/spawn/SpawnPageSkeleton",
} satisfies CustomMeta<typeof SpawnPageSkeleton>;

export const Default: CustomStoryObj<typeof SpawnPageSkeleton> = {
  render: () => <SpawnPageSkeleton />,
};
