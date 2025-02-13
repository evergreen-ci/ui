import styled from "@emotion/styled";
import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils/types";
import { TaskStatus } from "@evg-ui/lib/types/task";
import { getTooltipQueryMock } from "./testData";
import { WaterfallTaskStatusIcon } from ".";

export default {
  title: "Pages/Commits/WaterfallIcon",
  component: WaterfallTaskStatusIcon,
  parameters: {
    apolloClient: {
      mocks: [getTooltipQueryMock],
    },
  },
} satisfies CustomMeta<typeof WaterfallTaskStatusIcon>;

export const Default: CustomStoryObj<typeof WaterfallTaskStatusIcon> = {
  render: (args) => (
    <Container>
      <WaterfallTaskStatusIcon {...args} />
    </Container>
  ),
  args: {
    displayName: "multiversion",
    timeTaken: 2754729,
    taskId: "task-id",
    identifier: "ubuntu1604",
    status: "failed",
    hasCedarResults: true,
  },
  argTypes: {
    status: {
      // @ts-expect-error: FIXME. This comment was added by an automated script.
      options: TaskStatus,
      control: { type: "select" },
    },
  },
};

const Container = styled.div`
  width: fit-content;
  display: flex;
  justify-content: center;
  margin-right: auto;
  margin-left: auto;
`;
