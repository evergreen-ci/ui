import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { patchData } from "../testData";
import PatchCard from ".";

export default {
  component: PatchCard,
  decorators: [(Story: () => React.JSX.Element) => WithToastContext(Story)],
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
