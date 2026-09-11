import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { patchData } from "../testData";
import PatchCard from ".";

type PatchCardStoryProps = React.ComponentProps<typeof PatchCard> & {
  hidden: boolean;
  invalidatedByUpstream: boolean;
};

const meta = {
  component: PatchCard,
  decorators: [(Story: () => React.JSX.Element) => WithToastContext(Story)],
  args: {
    hidden: false,
    invalidatedByUpstream: false,
  },
  argTypes: {
    hidden: { control: "boolean" },
    invalidatedByUpstream: { control: "boolean" },
  },
  render: ({ hidden, invalidatedByUpstream, patch, ...args }) => (
    <PatchCard {...args} patch={{ ...patch, hidden, invalidatedByUpstream }} />
  ),
} satisfies CustomMeta<PatchCardStoryProps>;

export default meta;

type Story = CustomStoryObj<typeof meta>;

export const ProjectPatchCard: Story = {
  args: {
    pageType: "project",
    patch: patchData,
  },
};

export const UserPatchCard: Story = {
  args: {
    pageType: "user",
    patch: patchData,
  },
};
