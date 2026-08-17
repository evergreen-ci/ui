import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import styled from "@emotion/styled";
import { Button, Size, Variant } from "@leafygreen-ui/button";
import Popconfirm from "@evg-ui/lib/components/Popconfirm";
import { size } from "@evg-ui/lib/constants/tokens";
import { useToastContext } from "@evg-ui/lib/context/toast";
import { useAnnotationAnalytics } from "analytics";
import {
  BuildBaronCreateTicketMutation,
  BuildBaronCreateTicketMutationVariables,
} from "gql/generated/types";
import { FILE_JIRA_TICKET } from "gql/mutations";
import { ButtonWrapper } from "./BBComponents";

interface FileTicketProps {
  taskId: string;
  execution: number;
  /** The created-tickets operation rendered alongside this button. Only one of the two is active. */
  refetchQuery: "CreatedTickets" | "CustomCreatedIssues";
}

const FileTicketButton: React.FC<FileTicketProps> = ({
  execution,
  refetchQuery,
  taskId,
}) => {
  const dispatchToast = useToastContext();

  const [fileJiraTicket, { loading: loadingFileJiraTicket }] = useMutation<
    BuildBaronCreateTicketMutation,
    BuildBaronCreateTicketMutationVariables
  >(FILE_JIRA_TICKET, {
    onCompleted: () => {
      setButtonText("File another ticket");
      dispatchToast.success(`Successfully requested ticket`);
    },
    onError(error) {
      dispatchToast.error(
        `There was an error filing the ticket: ${error.message}`,
      );
    },
    refetchQueries: [refetchQuery],
  });

  const [buttonText, setButtonText] = useState<string>("File ticket");
  const annotationAnalytics = useAnnotationAnalytics();
  const onClickFile = () => {
    annotationAnalytics.sendEvent({ name: "Created build baron ticket" });
    fileJiraTicket({ variables: { taskId, execution } });
  };

  return (
    <Container>
      <Popconfirm
        align="right"
        confirmDisabled={loadingFileJiraTicket}
        data-testid="file-ticket-popconfirm"
        onConfirm={onClickFile}
        trigger={
          <ButtonWrapper>
            <Button
              data-testid="file-ticket-button"
              size={Size.XSmall}
              variant={Variant.Primary}
            >
              {buttonText}
            </Button>
          </ButtonWrapper>
        }
      >
        Do you want to create a failure ticket for this task?
      </Popconfirm>
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: ${size.m};
`;

export default FileTicketButton;
