import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { SortedTaskStatus, TaskStatus } from "@evg-ui/lib/types/task";
import { tasks } from "../testData";
import CommitDetailsCard from ".";

export default {
  component: CommitDetailsCard,
  decorators: [(Story: () => JSX.Element) => WithToastContext(Story)],
  args: {
    isCurrentTask: true,
    isSelectedTask: false,
    status: TaskStatus.Succeeded,
    canRestart: true,
    message:
      "DEVPROD-1234: Create Commit Details Card component which will be used in the Commit Details List. It should handle overflow correctly and render different status colors.",
  },
  argTypes: {
    isCurrentTask: {
      control: { type: "boolean" },
    },
    isSelectedTask: {
      control: { type: "boolean" },
    },
    status: {
      options: SortedTaskStatus,
      control: { type: "select" },
    },
    canRestart: {
      control: { type: "boolean" },
    },
    message: {
      control: { type: "text" },
    },
  },
} satisfies CustomMeta<TemplateProps>;

export const Default: CustomStoryObj<TemplateProps> = {
  render: (args) => <Template {...args} />,
};

type TemplateProps = {
  isCurrentTask: boolean;
  isSelectedTask: boolean;
  status: TaskStatus;
  canRestart: boolean;
  message: string;
};

const Template = (args: TemplateProps) => {
  const storyTask = {
    ...tasks[0],
    displayStatus: args.status,
    canRestart: args.canRestart,
    versionMetadata: {
      ...tasks[0].versionMetadata,
      message: args.message,
    },
  };
  return (
    <CommitDetailsCard
      isCurrentTask={args.isCurrentTask}
      isSelectedTask={args.isSelectedTask}
      owner="evergreen-ci"
      repo="evergreen"
      setHoveredTask={() => {}}
      task={storyTask}
    />
  );
};
