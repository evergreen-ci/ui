import { useState } from "react";
import styled from "@emotion/styled";
import { Tooltip } from "@leafygreen-ui/tooltip";
import { size } from "@evg-ui/lib/constants/tokens";
import { PlusButton } from "components/Buttons";
import { IssueLink } from "gql/generated/types";
import { AddIssueModal } from "../AddIssueModal";
import AnnotationTicketsList from "../AnnotationTicketsList";
import { TicketsTitle } from "../BBComponents";

interface AnnotationTicketsProps {
  tickets: IssueLink[];
  taskId: string;
  execution: number;
  isIssue: boolean;
  userCanModify: boolean;
  selectedRowKey: string;
  setSelectedRowKey: (selectedRowKey: string) => void;
  loading: boolean;
}

const AnnotationTickets: React.FC<AnnotationTicketsProps> = ({
  execution,
  isIssue,
  loading,
  selectedRowKey,
  setSelectedRowKey,
  taskId,
  tickets,
  userCanModify,
}) => {
  const title = isIssue ? "Issues" : "Suspected Issues";
  const buttonText = isIssue ? "Add Issue" : "Add Suspected Issue";
  const [isAddAnnotationModalVisible, setIsAddAnnotationModalVisible] =
    useState<boolean>(false);

  const handleAdd = () => {
    setIsAddAnnotationModalVisible(true);
  };
  return (
    <>
      <TicketsTitle>{title}</TicketsTitle>
      <Tooltip
        enabled={!userCanModify}
        trigger={
          <StyledButton
            data-cy={
              isIssue ? "add-issue-button" : "add-suspected-issue-button"
            }
            disabled={!userCanModify}
            onClick={handleAdd}
          >
            {buttonText}
          </StyledButton>
        }
      >
        You are not authorized to edit failure details
      </Tooltip>
      {tickets.length > 0 && (
        <AnnotationTicketsList
          execution={execution}
          isIssue={isIssue}
          jiraIssues={tickets}
          loading={loading}
          selectedRowKey={selectedRowKey}
          setSelectedRowKey={setSelectedRowKey}
          taskId={taskId}
          userCanModify={userCanModify}
        />
      )}
      <AddIssueModal
        closeModal={() => setIsAddAnnotationModalVisible(false)}
        data-cy="addIssueModal"
        execution={execution}
        isIssue={isIssue}
        setSelectedRowKey={setSelectedRowKey}
        taskId={taskId}
        visible={isAddAnnotationModalVisible}
      />
    </>
  );
};

const StyledButton = styled(PlusButton)`
  margin: ${size.xs} 0;
`;

export default AnnotationTickets;
