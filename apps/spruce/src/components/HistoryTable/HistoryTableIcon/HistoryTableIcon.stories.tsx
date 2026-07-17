import styled from "@emotion/styled";
import { action } from "storybook/actions";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { HistoryTableIcon } from "./index";

export default {
  component: HistoryTableIcon,
  title: "Components/HistoryTable/Icons",
} satisfies CustomMeta<typeof HistoryTableIcon>;

export const ActiveIcons: CustomStoryObj<typeof HistoryTableIcon> = {
  render: () => (
    <Container>
      {data.map(({ label, status }) => (
        <HistoryTableIcon
          key={`${status}_history_table`}
          failingTests={label ? failingTests : undefined}
          inactive={false}
          label={label}
          onClick={action(`clicked ${status}`)}
          status={status}
        />
      ))}
    </Container>
  ),
};

export const InactiveIcons: CustomStoryObj<typeof HistoryTableIcon> = {
  render: () => (
    <Container>
      {data.map(({ status }) => (
        <HistoryTableIcon
          key={`${status}_history_table_inactive`}
          inactive
          status={status}
        />
      ))}
    </Container>
  ),
};

const failingTests = [
  "test a",
  "test b",
  "test c",
  "test looooonnnnnnnng name",
  "some other test",
  "test name d",
];

const data = [
  { status: TaskStatus.Succeeded },
  { label: "5/10 failing tests", status: TaskStatus.Failed },
  { label: "1/2 failing tests", status: TaskStatus.KnownIssue },
  { status: TaskStatus.Dispatched },
  { label: "5/10 failing tests", status: TaskStatus.SetupFailed },
  { label: "5/10 failing tests", status: TaskStatus.SystemUnresponsive },
  { label: "5/10 failing tests", status: TaskStatus.TestTimedOut },
  { label: "5/10 failing tests", status: TaskStatus.Aborted },
  { status: TaskStatus.WillRun },
  { status: TaskStatus.Inactive },
];
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
