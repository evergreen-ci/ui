import { useQuery } from "@apollo/client";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  SuspectedIssuesQuery,
  SuspectedIssuesQueryVariables,
  Annotation,
} from "gql/generated/types";
import JIRA_SUSPECTED_ISSUES from "gql/queries/jira-suspected-issues.graphql";
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
  const dispatchToast = useToastContext();
  // Query Jira ticket data
  const { data, loading } = useQuery<
    SuspectedIssuesQuery,
    SuspectedIssuesQueryVariables
  >(JIRA_SUSPECTED_ISSUES, {
    variables: { taskId, execution },
    onError: (err) => {
      dispatchToast.error(
        `There was an error loading the ticket information from Jira: ${err.message}`,
      );
    },
  });

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
