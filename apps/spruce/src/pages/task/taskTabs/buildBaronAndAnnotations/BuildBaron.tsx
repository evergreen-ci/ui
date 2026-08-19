import { useQuery } from "@apollo/client/react";
import { ParagraphSkeleton } from "@leafygreen-ui/skeleton-loader";
import { useErrorToast } from "@evg-ui/lib/hooks";
import {
  Annotation,
  BuildBaronQuery,
  BuildBaronQueryVariables,
} from "gql/generated/types";
import { BUILD_BARON } from "gql/queries";
import BuildBaronContent from "./BuildBaronContent";

interface Props {
  taskId: string;
  execution: number;
  annotation: Annotation;
  bbTicketCreationDefined: boolean;
  userCanModify: boolean;
  projectId?: string;
}

const BuildBaron: React.FC<Props> = ({
  annotation,
  bbTicketCreationDefined,
  execution,
  projectId,
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
      createdTickets={createdTickets}
      execution={execution}
      projectId={projectId}
      suggestions={suggestions}
      taskId={taskId}
      userCanModify={userCanModify}
    />
  );
};

export default BuildBaron;
