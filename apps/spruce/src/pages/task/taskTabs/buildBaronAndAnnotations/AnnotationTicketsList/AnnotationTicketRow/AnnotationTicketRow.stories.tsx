import { CustomMeta, CustomStoryObj } from "@evg-ui/lib/test_utils/types";
import AnnotationTicketRow from ".";

export default {
  component: AnnotationTicketRow,
} satisfies CustomMeta<typeof AnnotationTicketRow>;

export const Default: CustomStoryObj<typeof AnnotationTicketRow> = {
  args: {
    confidenceScore: 0.5,
    loading: false,
  },
  argTypes: {
    confidenceScore: {
      control: {
        max: 1,
        min: 0,
        step: 0.01,
        type: "range",
      },
    },
  },
  render: (args) => (
    <AnnotationTicketRow
      issueKey="EVG-123"
      jiraTicket={{
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
      }}
      url="https://www.google.com"
      {...args}
    />
  ),
};
