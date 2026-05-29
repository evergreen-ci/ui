import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TaskEventLogData } from "gql/generated/types";
import { getUserSettingsMock } from "gql/mocks/getSpruceConfig";
import { TaskEventType } from "types/task";
import { TaskEventLogLine } from "./TaskEventLogLine";

export default {
  component: TaskEventLogLine,
} satisfies CustomMeta<typeof TaskEventLogLine>;

const timestamp = new Date("2026-05-29T12:00:00.000Z");

const apolloMocks = {
  apolloClient: {
    mocks: [getUserSettingsMock],
  },
};

const buildStory = (
  eventType: TaskEventType,
  data: Partial<TaskEventLogData> = {},
): CustomStoryObj<typeof TaskEventLogLine> => ({
  render: (args) => <TaskEventLogLine {...args} />,
  args: {
    id: "event-id",
    resourceId: "task-id",
    resourceType: "TASK",
    timestamp,
    eventType,
    data: { timestamp, ...data },
  },
  parameters: apolloMocks,
});

export const TaskBlocked = buildStory(TaskEventType.TaskBlocked, {
  blockedOn: "blocking-task-id",
});

export const TaskFinished = buildStory(TaskEventType.TaskFinished, {
  status: "success",
});

export const TaskStarted = buildStory(TaskEventType.TaskStarted);

export const TaskDispatched = buildStory(TaskEventType.TaskDispatched, {
  hostId: "host-1",
});

export const TaskUndispatched = buildStory(TaskEventType.TaskUndispatched, {
  hostId: "host-1",
});

export const TaskCreated = buildStory(TaskEventType.TaskCreated);

export const TaskRestarted = buildStory(TaskEventType.TaskRestarted, {
  userId: "mohamed.khelif",
});

export const TaskActivated = buildStory(TaskEventType.TaskActivated, {
  userId: "mohamed.khelif",
});

export const TaskJiraAlertCreated = buildStory(
  TaskEventType.TaskJiraAlertCreated,
  {
    jiraIssue: "EVG-1234",
    jiraLink: "https://jira.mongodb.org/browse/EVG-1234",
    userId: "mohamed.khelif",
  },
);

export const TaskJiraAlertCreatedNoUser = buildStory(
  TaskEventType.TaskJiraAlertCreated,
  {
    jiraIssue: "EVG-1234",
    jiraLink: "https://jira.mongodb.org/browse/EVG-1234",
  },
);

export const TaskDeactivated = buildStory(TaskEventType.TaskDeactivated, {
  userId: "mohamed.khelif",
});

export const TaskAbortRequest = buildStory(TaskEventType.TaskAbortRequest, {
  userId: "mohamed.khelif",
});

export const TaskScheduled = buildStory(TaskEventType.TaskScheduled);

export const TaskPriorityChanged = buildStory(
  TaskEventType.TaskPriorityChanged,
  {
    priority: 50,
    userId: "mohamed.khelif",
  },
);

export const TaskDependenciesOverridden = buildStory(
  TaskEventType.TaskDependenciesOverridden,
  {
    userId: "mohamed.khelif",
  },
);

export const MergeTaskUnscheduled = buildStory(
  TaskEventType.MergeTaskUnscheduled,
  {
    userId: "mohamed.khelif",
  },
);

export const ContainerAllocated = buildStory(TaskEventType.ContainerAllocated);
