import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { taskStatusesMock, versionTasks } from "./testData";
import { VersionTasksTable } from ".";

const versionId = versionTasks.data.version.id;
const tasks = versionTasks.data.version.tasks.data;
const selectedTasks = tasks.slice(0, 2);
const rowSelection = Object.fromEntries(
  selectedTasks.map(({ id }) => [id, true]),
);

export default {
  component: VersionTasksTable,
} satisfies CustomMeta<typeof VersionTasksTable>;

export const Default: CustomStoryObj<typeof VersionTasksTable> = {
  render: (args) => (
    <VersionTasksTable
      clearQueryParams={() => {}}
      filteredCount={tasks.length}
      isPatch={args.isPatch}
      limit={10}
      loading={false}
      onFilterChange={() => {}}
      onRowSelectionChange={() => {}}
      onToggleAll={() => {}}
      page={0}
      rowSelection={rowSelection}
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
