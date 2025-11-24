import { useState } from "react";
import { useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import { Button, Variant, Size } from "@leafygreen-ui/button";
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
}

const FileTicketButton: React.FC<FileTicketProps> = ({ execution, taskId }) => {
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
    refetchQueries: ["CreatedTickets", "CustomCreatedIssues", "BuildBaron"],
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
        data-cy="file-ticket-popconfirm"
        onConfirm={onClickFile}
        trigger={
          <ButtonWrapper>
            <Button
              data-cy="file-ticket-button"
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
