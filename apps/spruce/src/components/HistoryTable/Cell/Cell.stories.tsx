import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import { TaskCell, EmptyCell, LoadingCell, ColumnHeaderCell } from ".";

export default {
  component: TaskCell,
  title: "components/HistoryTable/Cell",
} satisfies CustomMeta<typeof TaskCell>;

export const TaskCellStory: CustomStoryObj<typeof TaskCell> = {
  render: (args) => <TaskCell {...args} />,
  args: {
    task: {
      id: "task-1",
      displayStatus: "success",
    },
  },
  parameters: {
    reactRouter: {
      path: "/task/:id",
      route: "/task/task-1",
    },
  },
};

export const EmptyCellStory: CustomStoryObj<typeof EmptyCell> = {
  render: () => <EmptyCell />,
  args: {},
};

export const LoadingCellStory: CustomStoryObj<typeof LoadingCell> = {
  render: (args) => <LoadingCell {...args} />,
  args: {
    isHeader: false,
  },
};

export const ColumnHeaderCellStory: CustomStoryObj<typeof ColumnHeaderCell> = {
  render: (args) => <ColumnHeaderCell {...args} />,
  args: {
    trimmedDisplayName: "displayName",
    fullDisplayName: "LongWindedDisplayName",
  },
};
