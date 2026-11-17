import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { taskStatusesMock, versionTasks } from "./testData";
import { VersionTasksTable } from ".";

const versionId = versionTasks.data.version.id;
const tasks = versionTasks.data.version.tasks.data;
const selectedTasks = tasks.slice(0, 2);
const selectedIds = new Set(selectedTasks.map(({ id }) => id));

export default {
  component: VersionTasksTable,
} satisfies CustomMeta<typeof VersionTasksTable>;

export const Default: CustomStoryObj<typeof VersionTasksTable> = {
  render: (args) => (
    <VersionTasksTable
      clearQueryParams={() => {}}
      filteredCount={tasks.length}
      isPatch={args.isPatch}
      isRowSelected={(taskId) => selectedIds.has(taskId)}
      limit={10}
      loading={false}
      onFilterChange={() => {}}
      onToggleAll={() => {}}
      onToggleRow={() => {}}
      page={0}
      selectedCount={selectedTasks.length}
      tasks={tasks}
      totalCount={tasks.length}
      versionId={versionId}
    />
  ),
  args: {
    isPatch: false,
  },
  argTypes: {
    isPatch: {
      control: { type: "boolean" },
    },
  },
  parameters: {
    apolloClient: {
      mocks: [taskStatusesMock],
    },
  },
};
