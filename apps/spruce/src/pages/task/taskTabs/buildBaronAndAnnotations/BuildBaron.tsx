import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useErrorToast } from "@evg-ui/lib/hooks";
import {
  Annotation,
  BuildBaronQuery,
  BuildBaronQueryVariables,
  IssueLink,
  JiraTicket,
} from "gql/generated/types";
import { BUILD_BARON } from "gql/queries";
import AnnotationNote from "./AnnotationNote";
import {
  AnnotationCreatedTickets,
  BBCreatedTickets,
} from "./CreatedTicketsTable";
import { Issues, SuspectedIssues } from "./Issues";
import JiraIssueTable from "./JiraIssueTable";

interface Props {
  annotation: Annotation;
  bbTicketCreationDefined: boolean;
  buildBaronConfigured: boolean;
  execution: number;
  taskId: string;
  userCanModify: boolean;
}

const BuildBaron: React.FC<Props> = ({
  annotation,
  bbTicketCreationDefined,
  buildBaronConfigured,
  execution,
  taskId,
  userCanModify,
}) => {
  const { data, error, loading } = useQuery<
    BuildBaronQuery,
    BuildBaronQueryVariables
  >(BUILD_BARON, {
    errorPolicy: "all",
    variables: {
      execution,
      includeAnnotationCreatedIssues: bbTicketCreationDefined,
      includeCreatedTickets: !bbTicketCreationDefined,
      taskId,
    },
  });
  useErrorToast(error, "There was an error loading Build Baron information");

  const annotationCreatedIssues = data?.task?.annotation?.createdIssues;
  const createdTickets = data?.task?.buildBaronCreatedTickets;
  const suggestions = data?.task?.buildBaronSuggestions;
  const isLoading = !data && loading; // TODO: Re-evaluate in DEVPROD-33191.
  if (isLoading) {
    return <ParagraphSkeleton />;
  }
  return (
    <BuildBaronContent
      annotation={annotation}
      annotationCreatedIssues={annotationCreatedIssues ?? undefined}
      bbTicketCreationDefined={bbTicketCreationDefined}
      buildBaronConfigured={buildBaronConfigured}
      createdTickets={createdTickets}
      execution={execution}
      suggestions={suggestions}
      taskId={taskId}
      userCanModify={userCanModify}
    />
  );
};

interface BuildBaronCoreProps {
  annotation: Annotation;
  annotationCreatedIssues?: IssueLink[];
  bbTicketCreationDefined: boolean;
  buildBaronConfigured: boolean;
  createdTickets?: JiraTicket[];
  execution: number;
  suggestions: NonNullable<BuildBaronQuery["task"]>["buildBaronSuggestions"];
  taskId: string;
  userCanModify: boolean;
}

const BuildBaronContent: React.FC<BuildBaronCoreProps> = ({
  annotation,
  annotationCreatedIssues,
  bbTicketCreationDefined,
  buildBaronConfigured,
  createdTickets,
  execution,
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
          buildBaronConfigured={buildBaronConfigured}
          execution={execution}
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

export default BuildBaron;
