import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import AnnotationTicketRowWithActionProps from ".";

export default {
  component: AnnotationTicketRowWithActionProps,
} satisfies CustomMeta<typeof AnnotationTicketRowWithActionProps>;

export const Default: CustomStoryObj<
  typeof AnnotationTicketRowWithActionProps
> = {
  args: {
    confidenceScore: 0.5,
    isIssue: true,
    issueKey: "EVG-123",
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
    loading: false,
    url: "https://www.google.com",
    userCanModify: true,
  },
  argTypes: {},
  render: (args) => <AnnotationTicketRowWithActionProps {...args} />,
};
