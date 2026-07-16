import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import JiraTicketRow from ".";

export default {
  component: JiraTicketRow,
} satisfies CustomMeta<typeof JiraTicketRow>;

export const Default: CustomStoryObj<typeof JiraTicketRow> = {
  args: {
    fields: {
      assigneeDisplayName: "mohamed.khelif",
      created: "2020-01-02",
      status: {
        id: "id",
        name: "Closed",
      },
      summary: "Create the JiraTicketRow component",
      updated: "2023-11-21",
    },
    jiraKey: "DEVPROD-123",
  },
  argTypes: {},
  render: (args) => <JiraTicketRow {...args} />,
};
