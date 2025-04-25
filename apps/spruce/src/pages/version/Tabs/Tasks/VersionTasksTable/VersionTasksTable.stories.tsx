import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { tasks, taskStatusesMock, versionId } from "./testData";
import { VersionTasksTable } from ".";

export default {
  component: VersionTasksTable,
} satisfies CustomMeta<typeof VersionTasksTable>;

export const Default: CustomStoryObj<typeof VersionTasksTable> = {
  render: () => (
    <VersionTasksTable
      clearQueryParams={() => {}}
      filteredCount={tasks.length}
      isPatch={false}
      limit={10}
      loading={false}
      page={0}
      tasks={tasks}
      totalCount={tasks.length}
    />
  ),
  parameters: {
    apolloClient: {
      mocks: [taskStatusesMock],
    },
    reactRouter: {
      path: "/version/:versionId",
      route: `/version/${versionId}`,
    },
  },
};
