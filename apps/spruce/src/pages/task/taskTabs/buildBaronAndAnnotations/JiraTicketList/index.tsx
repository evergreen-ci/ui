import { CreatedTicketsQuery } from "gql/generated/types";
import JiraTicketRow from "./JiraTicketRow";

type CreatedTickets = CreatedTicketsQuery["bbGetCreatedTickets"];

const JiraTicketList: React.FC<{
  jiraIssues: CreatedTickets;
}> = ({ jiraIssues }) => (
  <>
    {jiraIssues.map(({ fields, key }) => (
      <JiraTicketRow key={key} fields={fields} jiraKey={key} />
    ))}
  </>
);

export default JiraTicketList;
