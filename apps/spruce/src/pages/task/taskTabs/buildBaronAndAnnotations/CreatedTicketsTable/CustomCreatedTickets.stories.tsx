import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import CustomCreatedTickets from "./CustomCreatedTickets";

export default {
  component: CustomCreatedTickets,
  decorators: [(Story: () => React.JSX.Element) => WithToastContext(Story)],
} satisfies CustomMeta<typeof CustomCreatedTickets>;

export const Default: CustomStoryObj<typeof CustomCreatedTickets> = {
  args: {
    execution: 0,
    taskId: "123",
    tickets: [
      {
        confidenceScore: 0.25,
        issueKey: "DEVPROD-1",
        jiraTicket: {
          fields: {
            assignedTeam: "evg-ui",
            assigneeDisplayName: "sophie.stadler",
            created: "2020-01-27",
            status: {
              id: "id",
              name: "Done",
            },
            summary: "Issue Summary",
            updated: "2023-11-28",
          },
          key: "key",
        },
        url: "https://spruce.corp.mongodb.com",
      },
      {
        confidenceScore: 0.5,
        issueKey: "DEVPROD-2",
        jiraTicket: {
          fields: {
            assignedTeam: "evg-ui",
            assigneeDisplayName: "mohamed.khelif",
            created: "2020-01-28",
            status: {
              id: "id",
              name: "In Progress",
            },
            summary: "Issue Summary",
            updated: "2023-11-29",
          },
          key: "key",
        },
        url: "https://spruce.corp.mongodb.com",
      },
    ],
  },
  argTypes: {},
  render: (args) => <CustomCreatedTickets {...args} />,
};
