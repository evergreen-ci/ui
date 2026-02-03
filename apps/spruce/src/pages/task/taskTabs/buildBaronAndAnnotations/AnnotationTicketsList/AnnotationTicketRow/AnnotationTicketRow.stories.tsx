import { CustomStoryObj, CustomMeta } from "@evg-ui/lib/test_utils";
import AnnotationTicketRow from ".";

export default {
  component: AnnotationTicketRow,
} satisfies CustomMeta<typeof AnnotationTicketRow>;

export const Default: CustomStoryObj<typeof AnnotationTicketRow> = {
  render: (args) => (
    <AnnotationTicketRow
      issueKey="EVG-123"
      jiraTicket={{
        key: "key",
        fields: {
          summary: "summary",
          status: {
            name: "status",
            id: "id",
          },
          created: "2020-01-02",
          updated: "2020-01-02",
          assigneeDisplayName: "mohamed.khelif",
          assignedTeam: "evg-ui",
        },
      }}
      url="https://www.google.com"
      {...args}
    />
  ),
  args: {
    confidenceScore: 0.5,
    loading: false,
  },
  argTypes: {
    confidenceScore: {
      control: {
        type: "range",
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
  },
};
