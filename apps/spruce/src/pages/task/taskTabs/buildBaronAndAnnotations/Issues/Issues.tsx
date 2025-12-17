import { useQuery } from "@apollo/client";
import { useErrorToast } from "@evg-ui/lib/hooks";
import {
  IssuesQuery,
  IssuesQueryVariables,
  Annotation,
} from "gql/generated/types";
import { JIRA_ISSUES } from "gql/queries";
import AnnotationTickets from "./AnnotationTickets";

interface IssuesProps {
  taskId: string;
  execution: number;
  userCanModify: boolean;
  selectedRowKey: string;
  setSelectedRowKey: (selectedRowKey: string) => void;
  annotation: Annotation;
}

const Issues: React.FC<IssuesProps> = ({
  annotation,
  execution,
  selectedRowKey,
  setSelectedRowKey,
  taskId,
  userCanModify,
}) => {
  // Query Jira ticket data
  const { data, error, loading } = useQuery<IssuesQuery, IssuesQueryVariables>(
    JIRA_ISSUES,
    {
      variables: { taskId, execution },
    },
  );
  useErrorToast(
    error,
    "There was an error loading the ticket information from Jira",
  );
  return (
    <AnnotationTickets
      execution={execution}
      isIssue
      loading={loading}
      selectedRowKey={selectedRowKey}
      setSelectedRowKey={setSelectedRowKey}
      taskId={taskId}
      tickets={data?.task?.annotation?.issues || annotation?.issues || []}
      userCanModify={userCanModify}
    />
  );
};

export default Issues;
