import { useEffect, useRef } from "react";
import { useMutation } from "@apollo/client/react";
import { useToastContext } from "@evg-ui/lib/context";
import { useAnnotationAnalytics } from "analytics";
import {
  MoveAnnotationIssueMutation,
  MoveAnnotationIssueMutationVariables,
  RemoveAnnotationIssueMutation,
  RemoveAnnotationIssueMutationVariables,
} from "gql/generated/types";
import { MOVE_ANNOTATION, REMOVE_ANNOTATION } from "gql/mutations";
import AnnotationTicketRowWithActions from "./AnnotationTicketRowWithActions";
import { AnnotationTickets } from "./types";

interface AnnotationTicketsListProps {
  jiraIssues: AnnotationTickets;
  taskId: string;
  execution: number;
  isIssue: boolean;
  userCanModify: boolean;
  selectedRowKey: string;
  setSelectedRowKey: (key: string) => void;
  loading: boolean;
}

const AnnotationTicketsList: React.FC<AnnotationTicketsListProps> = ({
  execution,
  isIssue,
  jiraIssues,
  loading,
  selectedRowKey,
  setSelectedRowKey,
  taskId,
  userCanModify,
}) => {
  const annotationAnalytics = useAnnotationAnalytics();
  const dispatchToast = useToastContext();
  const issueString = isIssue ? "issue" : "suspected issue";

  const [removeAnnotation] = useMutation<
    RemoveAnnotationIssueMutation,
    RemoveAnnotationIssueMutationVariables
  >(REMOVE_ANNOTATION, {
    onCompleted: () => {
      dispatchToast.success(`Successfully removed ${issueString}`);
    },
    onError(error) {
      dispatchToast.error(
        `There was an error removing the ${issueString}: ${error.message}`,
      );
    },
    refetchQueries: ["SuspectedIssues", "Issues"],
  });

  const [moveAnnotation] = useMutation<
    MoveAnnotationIssueMutation,
    MoveAnnotationIssueMutationVariables
  >(MOVE_ANNOTATION, {
    onCompleted: () => {
      dispatchToast.success(
        `Successfully moved ${issueString} to ${
          isIssue ? "suspected issues" : "issues"
        }.`,
      );
    },
    onError(error) {
      dispatchToast.error(
        `There was an error moving the ${issueString}: ${error.message}`,
      );
    },
    refetchQueries: ["SuspectedIssues", "Issues"],
  });

  const handleRemove = (url: string, issueKey: string): void => {
    const apiIssue = {
      url,
      issueKey,
    };
    removeAnnotation({ variables: { taskId, execution, apiIssue, isIssue } });

    annotationAnalytics.sendEvent({
      name: "Deleted annotation",
      "annotation.type": isIssue ? "Issue" : "Suspected Issue",
    });
  };

  const handleMove = (apiIssue: {
    url: string;
    issueKey: string;
    confidenceScore: number;
  }): void => {
    moveAnnotation({ variables: { taskId, execution, apiIssue, isIssue } });

    setSelectedRowKey(apiIssue.issueKey);
    annotationAnalytics.sendEvent({
      name: "Clicked move annotation button",
      type: isIssue ? "Issue" : "Suspected Issue",
    });
  };

  // SCROLL TO added Issue
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedRowKey && rowRef.current) {
      rowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedRowKey]);

  return (
    <div data-cy={isIssue ? "issues-list" : "suspected-issues-list"}>
      {/* @ts-expect-error: FIXME. This comment was added by an automated script. */}
      {jiraIssues.map((issue) => (
        <AnnotationTicketRowWithActions
          key={issue.issueKey}
          ref={issue.issueKey === selectedRowKey ? rowRef : null}
          isIssue={isIssue}
          issueString={issueString}
          loading={loading}
          onMove={handleMove}
          onRemove={handleRemove}
          selected={issue.issueKey === selectedRowKey}
          userCanModify={userCanModify}
          {...issue}
        />
      ))}
    </div>
  );
};

export default AnnotationTicketsList;
