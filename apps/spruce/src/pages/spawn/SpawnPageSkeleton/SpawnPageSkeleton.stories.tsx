import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import SpawnPageSkeleton from ".";

export default {
  title: "pages/spawn/SpawnPageSkeleton",
  component: SpawnPageSkeleton,
} satisfies CustomMeta<typeof SpawnPageSkeleton>;

export const Default: CustomStoryObj<typeof SpawnPageSkeleton> = {
  render: () => <SpawnPageSkeleton />,
};
