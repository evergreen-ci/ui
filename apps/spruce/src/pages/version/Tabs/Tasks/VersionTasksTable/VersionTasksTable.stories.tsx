import Cookies from "js-cookie";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { SEEN_TASK_REVIEW_TOOLTIP } from "constants/cookies";
import { taskStatusesMock, versionTasks } from "./testData";
import { VersionTasksTable } from ".";

const versionId = versionTasks.data.version.id;
const tasks = versionTasks.data.version.tasks.data;

export default {
  component: VersionTasksTable,
} satisfies CustomMeta<typeof VersionTasksTable>;

export const Default: CustomStoryObj<typeof VersionTasksTable> = {
  render: (args) => {
    Cookies.set(SEEN_TASK_REVIEW_TOOLTIP, new Date("2020-01-01").toString());
    return (
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
    );
  },
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
