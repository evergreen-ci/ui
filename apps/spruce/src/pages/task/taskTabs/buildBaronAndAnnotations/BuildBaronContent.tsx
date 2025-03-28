import { useState } from "react";
import { useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  BuildBaron,
  Annotation,
  CustomCreatedIssuesQuery,
  CustomCreatedIssuesQueryVariables,
  CreatedTicketsQuery,
  CreatedTicketsQueryVariables,
} from "gql/generated/types";
import { CREATED_TICKETS, JIRA_CUSTOM_CREATED_ISSUES } from "gql/queries";
import AnnotationNote from "./AnnotationNote";
import { BBCreatedTickets, CustomCreatedTickets } from "./CreatedTicketsTable";
import { Issues, SuspectedIssues } from "./Issues";
import JiraIssueTable from "./JiraIssueTable";

interface BuildBaronCoreProps {
  bbData: BuildBaron;
  taskId: string;
  execution: number;
  loading: boolean;
  annotation: Annotation;
  userCanModify: boolean;
}

const BuildBaronContent: React.FC<BuildBaronCoreProps> = ({
  annotation,
  bbData,
  execution,
  loading,
  taskId,
  userCanModify,
}) => {
  const [selectedRowKey, setSelectedRowKey] = useState("");
  const dispatchToast = useToastContext();

  const { data: customCreatedTickets } = useQuery<
    CustomCreatedIssuesQuery,
    CustomCreatedIssuesQueryVariables
  >(JIRA_CUSTOM_CREATED_ISSUES, {
    variables: { taskId, execution },
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the ticket information from Jira: ${err.message}`,
      );
    },
  });

  const { data: bbCreatedTickets } = useQuery<
    CreatedTicketsQuery,
    CreatedTicketsQueryVariables
  >(CREATED_TICKETS, {
    variables: { taskId },
    onError(error) {
      dispatchToast.error(
        `There was an error getting tickets created for this task: ${error.message}`,
      );
    },
  });

  const customTickets = customCreatedTickets?.task?.annotation?.createdIssues;
  const bbTickets = bbCreatedTickets?.bbGetCreatedTickets;
  const canCreateTickets = bbData?.bbTicketCreationDefined;

  return (
    <Wrapper data-cy="bb-content">
      {loading && <ParagraphSkeleton />}
      {canCreateTickets ? (
        <CustomCreatedTickets
          execution={execution}
          taskId={taskId}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          tickets={customTickets}
        />
      ) : (
        <BBCreatedTickets
          buildBaronConfigured={bbData?.buildBaronConfigured}
          execution={execution}
          taskId={taskId}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          tickets={bbTickets}
        />
      )}
      <AnnotationNote
        execution={execution}
        // @ts-expect-error: FIXME. This comment was added by an automated script.
        note={annotation?.note}
        taskId={taskId}
        userCanModify={userCanModify}
      />
      <Issues
        annotation={annotation}
        execution={execution}
        selectedRowKey={selectedRowKey}
        setSelectedRowKey={setSelectedRowKey}
        taskId={taskId}
        userCanModify={userCanModify}
      />
      <SuspectedIssues
        annotation={annotation}
        execution={execution}
        selectedRowKey={selectedRowKey}
        setSelectedRowKey={setSelectedRowKey}
        taskId={taskId}
        userCanModify={userCanModify}
      />
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      {bbData?.searchReturnInfo?.issues.length > 0 && (
        <JiraIssueTable bbData={bbData} />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 80%;
`;

export default BuildBaronContent;
