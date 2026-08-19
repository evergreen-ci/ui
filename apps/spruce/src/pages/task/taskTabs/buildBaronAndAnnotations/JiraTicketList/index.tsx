import { JiraTicket } from "gql/generated/types";
import JiraTicketRow from "./JiraTicketRow";

const JiraTicketList: React.FC<{
  jiraIssues: JiraTicket[];
}> = ({ jiraIssues }) => (
  <>
    {jiraIssues.map(({ fields, key }) => (
      <JiraTicketRow key={key} fields={fields} jiraKey={key} />
    ))}
  </>
);

export default JiraTicketList;
