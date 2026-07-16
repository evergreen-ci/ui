import styled from "@emotion/styled";
import { action } from "storybook/actions";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { TaskStatus, TaskStatusUmbrella } from "@evg-ui/lib/types/task";

import { GroupedTaskStatusBadge } from ".";

export default {
  component: GroupedTaskStatusBadge,
} satisfies CustomMeta<typeof GroupedTaskStatusBadge>;

export const Default: CustomStoryObj<typeof GroupedTaskStatusBadge> = {
  render: () => (
    <Container>
      {groupedTaskStats.map((item) => (
        <GroupedTaskStatusBadge
          key={item.status}
          count={item.count}
          href="/test"
          onClick={action(`Click status ${item.status}`)}
          status={item.status}
          statusCounts={statusCounts}
        />
      ))}
    </Container>
  ),
};

const groupedTaskStats = [
  { count: 20, status: TaskStatus.Succeeded },
  { count: 1, status: TaskStatus.Succeeded },
  { count: 1, status: TaskStatusUmbrella.Failed },
  { count: 2, status: TaskStatusUmbrella.Running },
  { count: 3, status: TaskStatusUmbrella.SystemFailure },
  { count: 4, status: TaskStatus.SetupFailed },
  { count: 1, status: TaskStatus.SetupFailed },
  { count: 5, status: TaskStatusUmbrella.Undispatched },
  { count: 5, status: TaskStatusUmbrella.Scheduled },
];

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const statusCounts = {
  [TaskStatus.Aborted]: 88,
  [TaskStatus.Blocked]: 50,
  [TaskStatus.Dispatched]: 99,
  [TaskStatus.Failed]: 15,
  [TaskStatus.Pending]: 987,
  [TaskStatus.Started]: 30,
  [TaskStatus.SystemFailed]: 22,
  [TaskStatus.TaskTimedOut]: 53,
  [TaskStatus.TestTimedOut]: 2,
  [TaskStatus.Unscheduled]: 6,
  [TaskStatus.Unstarted]: 5,
  [TaskStatus.WillRun]: 11,
};
