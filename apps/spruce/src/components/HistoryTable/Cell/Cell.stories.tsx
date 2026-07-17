import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { ColumnHeaderCell, EmptyCell, LoadingCell, TaskCell } from ".";

export default {
  component: TaskCell,
  title: "components/HistoryTable/Cell",
} satisfies CustomMeta<typeof TaskCell>;

export const TaskCellStory: CustomStoryObj<typeof TaskCell> = {
  args: {
    task: {
      displayStatus: "success",
      id: "task-1",
    },
  },
  parameters: {
    reactRouter: {
      path: "/task/:id",
      route: "/task/task-1",
    },
  },
  render: (args) => <TaskCell {...args} />,
};

export const EmptyCellStory: CustomStoryObj<typeof EmptyCell> = {
  args: {},
  render: () => <EmptyCell />,
};

export const LoadingCellStory: CustomStoryObj<typeof LoadingCell> = {
  args: {
    isHeader: false,
  },
  render: (args) => <LoadingCell {...args} />,
};

export const ColumnHeaderCellStory: CustomStoryObj<typeof ColumnHeaderCell> = {
  args: {
    fullDisplayName: "LongWindedDisplayName",
    trimmedDisplayName: "displayName",
  },
  render: (args) => <ColumnHeaderCell {...args} />,
};
