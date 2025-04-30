import { useQuery } from "@apollo/client";
import { useToastContext } from "@evg-ui/lib/context/toast";
import {
  IssuesQuery,
  IssuesQueryVariables,
  Annotation,
} from "gql/generated/types";
import JIRA_ISSUES from "gql/queries/jira-issues.graphql";
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
  const dispatchToast = useToastContext();
  // Query Jira ticket data
  const { data, loading } = useQuery<IssuesQuery, IssuesQueryVariables>(
    JIRA_ISSUES,
    {
      variables: { taskId, execution },
      onError: (err) => {
        dispatchToast.error(
          `There was an error loading the ticket information from Jira: ${err.message}`,
        );
      },
    },
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
