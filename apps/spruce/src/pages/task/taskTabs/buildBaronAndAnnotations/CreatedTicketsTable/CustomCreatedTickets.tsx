import styled from "@emotion/styled";
import { size } from "@evg-ui/lib/constants";
import { IssueLink } from "gql/generated/types";
import AnnotationTicketRow from "../AnnotationTicketsList/AnnotationTicketRow";
import { TicketsTitle } from "../BBComponents";
import FileTicketButton from "../FileTicketButton";

interface CustomCreatedTicketProps {
  taskId: string;
  execution: number;
  tickets: IssueLink[];
}

const CustomCreatedTickets: React.FC<CustomCreatedTicketProps> = ({
  execution,
  taskId,
  tickets,
}) => (
  <>
    <TicketsTitle>Create a New Ticket</TicketsTitle>
    <FileTicketButton execution={execution} taskId={taskId} />
    {!!tickets?.length && (
      <>
        <TicketsTitle margin>Tickets Created From This Task</TicketsTitle>
        <TicketContainer>
          {tickets.map(({ confidenceScore, issueKey, jiraTicket, url }) => (
            <AnnotationTicketRow
              key={issueKey}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              confidenceScore={confidenceScore}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              issueKey={issueKey}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              jiraTicket={jiraTicket}
              // @ts-expect-error: FIXME. This comment was added by an automated script.
              url={url}
            />
          ))}
        </TicketContainer>
      </>
    )}
  </>
);

const TicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.s};
`;

export default CustomCreatedTickets;
