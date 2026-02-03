import styled from "@emotion/styled";
import { Body } from "@leafygreen-ui/typography";
import { size } from "@evg-ui/lib/constants";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils";
import { HostEventLogData, HostEventType } from "gql/generated/types";
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
          <EventContainer>
            <HostEventString data={data} eventType={eventType} />
          </EventContainer>
        </div>
      ))}
    </>
  ),
  argTypes: {},
  args: {},
};

const EventContainer = styled.div`
  margin-bottom: ${size.m};
  border: 1px solid green;
`;
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
