import { Body } from "@via-ds/components";
import "@via-ds/components/index.css";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { HostEventLogData, HostEventType } from "gql/generated/types";
import styles from "./HostEventString.stories.module.css";
import HostEventString from ".";

export default {
  component: HostEventString,
} satisfies CustomMeta<typeof HostEventString>;

export const Default: CustomStoryObj<typeof HostEventString> = {
  render: () => (
    <>
      {Object.values(HostEventType).map((eventType) => (
        <div key={eventType.toString()}>
          <Body>{eventType}</Body>
          <div className={styles.eventContainer}>
            <HostEventString data={data} eventType={eventType} />
          </div>
        </div>
      ))}
    </>
  ),
  argTypes: {},
  args: {},
};

const data: HostEventLogData = {
  successful: true,
  logs: "This is a log message",
  agentBuild: "1.2.3",
  agentRevision: "abc123",
  duration: 1000,
  execution: "execution",
  hostname: "hostname",
  jasperRevision: "abc123",
  monitorOp: "monitorOp",
  newStatus: "newStatus",
  oldStatus: "oldStatus",
  provisioningMethod: "provisioningMethod",
  taskId: "taskId",
  taskPid: "123",
  taskStatus: "failed",
  user: "user",
};
