import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
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

export const ProjectPatchCardAllTaskStatuses: Story = {
  args: {
    pageType: "project",
    patch: {
      ...patchData,
      version: {
        ...patchData.version,
        taskStatusStats: {
          counts: [
            { count: 8, status: TaskStatus.Succeeded },
            { count: 2, status: TaskStatus.Failed },
            { count: 1, status: TaskStatus.Started },
            { count: 1, status: TaskStatus.SystemFailed },
            { count: 3, status: TaskStatus.WillRun },
            { count: 2, status: TaskStatus.Unscheduled },
            { count: 1, status: TaskStatus.SetupFailed },
          ],
        },
      },
    },
  },
};
