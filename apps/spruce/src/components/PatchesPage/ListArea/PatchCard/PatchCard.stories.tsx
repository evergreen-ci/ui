import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import PatchCard from ".";
import { patchData } from "../testData";

export default {
  component: PatchCard,
  decorators: [(Story: () => JSX.Element) => WithToastContext(Story)],
} satisfies CustomMeta<typeof PatchCard>;

export const ProjectPatchCard: CustomStoryObj<typeof PatchCard> = {
  render: (args) => <PatchCard {...args} />,
  argTypes: {},
  args: {
    pageType: "project",
    patch: patchData,
  },
};

export const UserPatchCard: CustomStoryObj<typeof PatchCard> = {
  render: (args) => <PatchCard {...args} />,
  argTypes: {},
  args: {
    pageType: "user",
    patch: patchData,
  },
};
