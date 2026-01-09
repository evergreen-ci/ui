import { useQuery } from "@apollo/client";
import { useErrorToast } from "@evg-ui/lib/hooks";
import {
  SuspectedIssuesQuery,
  SuspectedIssuesQueryVariables,
  Annotation,
} from "gql/generated/types";
import { JIRA_SUSPECTED_ISSUES } from "gql/queries";
import AnnotationTickets from "./AnnotationTickets";

interface SuspectedIssuesProps {
  taskId: string;
  execution: number;
  userCanModify: boolean;
  selectedRowKey: string;
  setSelectedRowKey: React.Dispatch<React.SetStateAction<string>>;
  annotation: Annotation;
}

const SuspectedIssues: React.FC<SuspectedIssuesProps> = ({
  annotation,
  execution,
  selectedRowKey,
  setSelectedRowKey,
  taskId,
  userCanModify,
}) => {
  // Query Jira ticket data
  const { data, error, loading } = useQuery<
    SuspectedIssuesQuery,
    SuspectedIssuesQueryVariables
  >(JIRA_SUSPECTED_ISSUES, {
    variables: { taskId, execution },
  });
  useErrorToast(
    error,
    "There was an error loading the ticket information from Jira",
  );

  const suspectedIssues = data?.task?.annotation?.suspectedIssues;
  return (
    <AnnotationTickets
      execution={execution}
      isIssue={false}
      loading={loading}
      selectedRowKey={selectedRowKey}
      setSelectedRowKey={setSelectedRowKey}
      taskId={taskId}
      tickets={suspectedIssues || annotation?.suspectedIssues || []}
      userCanModify={userCanModify}
    />
  );
};

export default SuspectedIssues;
