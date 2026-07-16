import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import {
  HostEventLogData,
  HostEventLogEntry,
  HostEventType,
} from "gql/generated/types";
import HostTable from ".";

const data: HostEventLogData = {
  agentBuild: "1.2.3",
  agentRevision: "abc123",
  duration: 1000,
  execution: "execution",
  hostname: "hostname",
  jasperRevision: "abc123",
  logs: "This is a log message",
  monitorOp: "monitorOp",
  newStatus: "newStatus",
  oldStatus: "oldStatus",
  provisioningMethod: "provisioningMethod",
  successful: true,
  taskId: "taskId",
  taskPid: "123",
  taskStatus: "failed",
  user: "user",
};

const eventLogEntries: HostEventLogEntry[] = Object.values(HostEventType).map(
  (eventType) => ({
    data,
    eventType,
    id: "id",
    processedAt: new Date("2021-09-01T00:00:00Z"),
    resourceId: "resourceId",
    resourceType: "resourceType",
    timestamp: new Date("2021-09-01T00:00:00Z"),
  }),
);

export default {
  component: HostTable,
} satisfies CustomMeta<typeof HostTable>;

export const Default: CustomStoryObj<typeof HostTable> = {
  args: {
    error: undefined,
    eventCount: 0,
    eventLogEntries,
    eventTypes: [],
    limit: 10,
    loading: false,
    page: 1,
  },
  argTypes: {},
  parameters: {
    reactRouter: {
      path: "/task/:id",
      route: "/task/task-1",
    },
  },
  render: (args) => (
    <HostTable
      error={args.error}
      eventCount={args.eventCount}
      eventLogEntries={args.eventLogEntries}
      eventTypes={args.eventTypes}
      initialFilters={args.initialFilters}
      limit={args.limit}
      loading={args.loading}
      page={args.page}
    />
  ),
};
