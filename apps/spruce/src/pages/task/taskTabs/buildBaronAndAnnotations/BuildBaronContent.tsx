import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { useErrorToast } from "@evg-ui/lib/hooks";
import {
  BuildBaronQuery,
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
  bbData: BuildBaronQuery["buildBaron"];
  taskId: string;
  execution: number;
  annotation: Annotation;
  userCanModify: boolean;
}

const BuildBaronContent: React.FC<BuildBaronCoreProps> = ({
  annotation,
  bbData,
  execution,
  taskId,
  userCanModify,
}) => {
  const [selectedRowKey, setSelectedRowKey] = useState("");

  const { data: customCreatedTickets, error: customTicketsError } = useQuery<
    CustomCreatedIssuesQuery,
    CustomCreatedIssuesQueryVariables
  >(JIRA_CUSTOM_CREATED_ISSUES, {
    variables: { taskId, execution },
  });
  useErrorToast(
    customTicketsError,
    "There was an error loading the ticket information from Jira",
  );

  const { data: bbCreatedTickets, error: bbTicketsError } = useQuery<
    CreatedTicketsQuery,
    CreatedTicketsQueryVariables
  >(CREATED_TICKETS, {
    variables: { taskId },
  });
  useErrorToast(
    bbTicketsError,
    "There was an error getting tickets created for this task",
  );

  const customTickets = customCreatedTickets?.task?.annotation?.createdIssues;
  const bbTickets = bbCreatedTickets?.bbGetCreatedTickets;
  const canCreateTickets = bbData?.bbTicketCreationDefined;

  return (
    <div data-cy="build-baron-content">
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
    </div>
  );
};

export default BuildBaronContent;
