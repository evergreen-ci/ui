import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { tasks, taskStatusesMock, versionId } from "./testData";
import { VersionTasksTable } from ".";

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
      page={0}
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
