import { useState } from "react";
import {
  Annotation,
  BuildBaronQuery,
  IssueLink,
  JiraTicket,
} from "gql/generated/types";
import AnnotationNote from "./AnnotationNote";
import {
  AnnotationCreatedTickets,
  BBCreatedTickets,
} from "./CreatedTicketsTable";
import { Issues, SuspectedIssues } from "./Issues";
import JiraIssueTable from "./JiraIssueTable";

interface BuildBaronCoreProps {
  suggestions: NonNullable<BuildBaronQuery["task"]>["buildBaronSuggestions"];
  createdTickets?: JiraTicket[];
  annotationCreatedIssues?: IssueLink[];
  taskId: string;
  execution: number;
  annotation: Annotation;
  bbTicketCreationDefined: boolean;
  userCanModify: boolean;
  projectId?: string;
}

const BuildBaronContent: React.FC<BuildBaronCoreProps> = ({
  annotation,
  annotationCreatedIssues,
  bbTicketCreationDefined,
  createdTickets,
  execution,
  projectId,
  suggestions,
  taskId,
  userCanModify,
}) => {
  const [selectedRowKey, setSelectedRowKey] = useState("");

  return (
    <div data-testid="build-baron-content">
      {bbTicketCreationDefined ? (
        <AnnotationCreatedTickets
          execution={execution}
          taskId={taskId}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          tickets={annotationCreatedIssues}
        />
      ) : (
        <BBCreatedTickets
          execution={execution}
          projectId={projectId}
          taskId={taskId}
          // @ts-expect-error: FIXME. This comment was added by an automated script.
          tickets={createdTickets}
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
      {!!suggestions?.issues.length && (
        <JiraIssueTable suggestions={suggestions} />
      )}
    </div>
  );
};

export default BuildBaronContent;
