import WithToastContext from "@evg-ui/lib/test_utils/toast-decorator";
import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import AnnotationTicketsList from ".";

export default {
  component: AnnotationTicketsList,
  decorators: [(Story: () => React.JSX.Element) => WithToastContext(Story)],
} satisfies CustomMeta<typeof AnnotationTicketsList>;

export const Default: CustomStoryObj<typeof AnnotationTicketsList> = {
  args: {
    execution: 0,
    isIssue: true,
    jiraIssues: [
      {
        confidenceScore: 0.5,
        issueKey: "DEVPROD-123",
        jiraTicket: {
          fields: {
            assignedTeam: "evg-ui",
            assigneeDisplayName: "mohamed.khelif",
            created: "2020-01-02",
            status: {
              id: "id",
              name: "status",
            },
            summary: "summary",
            updated: "2020-01-02",
          },
          key: "key",
        },
        url: "https://example.com",
      },
      {
        confidenceScore: 0.99,
        issueKey: "DEVPROD-456",
        jiraTicket: {
          fields: {
            assignedTeam: "evg-ui",
            assigneeDisplayName: "sophie.stadler",
            created: "2020-01-02",
            status: {
              id: "id",
              name: "failed",
            },
            summary: "other summary",
            updated: "2020-01-02",
          },
          key: "key2",
        },
        url: "https://example.com",
      },
    ],
    loading: false,
    selectedRowKey: "key",
    taskId: "taskId",
    userCanModify: true,
  },
  argTypes: {},
  render: (args) => <AnnotationTicketsList {...args} />,
};
