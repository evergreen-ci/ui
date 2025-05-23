import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { slugs } from "constants/routes";
import {
  BuildBaronQuery,
  BuildBaronQueryVariables,
  TaskQuery,
  TaskQueryVariables,
} from "gql/generated/types";
import { BUILD_BARON, TASK } from "gql/queries";
import { useQueryParam } from "hooks/useQueryParam";
import { RequiredQueryParams } from "types/task";

type Action =
  | { name: "Clicked Jira ticket summary link" }
  | { name: "Created build baron ticket" }
  | { name: "Saved annotation note" }
  | {
      name: "Clicked move annotation button";
      type: "Issue" | "Suspected Issue";
    }
  | {
      name: "Clicked annotation link";
      target: "Jira ticket link";
    }
  | {
      name: "Deleted annotation";
      "annotation.type": "Issue" | "Suspected Issue";
    }
  | {
      name: "Created task annotation";
      "annotation.type": "Issue" | "Suspected Issue";
    };

export const useAnnotationAnalytics = () => {
  const { [slugs.taskId]: taskId } = useParams();
  const [execution] = useQueryParam(RequiredQueryParams.Execution, 0);

  const { data: bbData } = useQuery<BuildBaronQuery, BuildBaronQueryVariables>(
    BUILD_BARON,
    {
      variables: { taskId: taskId || "", execution },
      fetchPolicy: "cache-first",
    },
  );

  const { data: taskData } = useQuery<TaskQuery, TaskQueryVariables>(TASK, {
    skip: !taskId,
    variables: { taskId: taskId || "", execution },
    errorPolicy: "all",
    fetchPolicy: "cache-first",
  });

  const { buildBaronConfigured } = bbData?.buildBaron || {};

  const {
    displayName,
    displayStatus,
    failedTestCount,
    latestExecution,
    project,
    requester = "",
    status: taskStatus,
    versionMetadata: { isPatch } = { isPatch: false },
  } = taskData?.task || {};
  const { identifier } = project || {};
  const isLatestExecution = latestExecution === execution;

  return useAnalyticsRoot<Action, AnalyticsIdentifier>("Annotations", {
    "task.display_status": displayStatus || "",
    "task.execution": execution,
    "task.failed_test_count": failedTestCount || "",
    "task.id": taskId || "",
    "task.is_latest_execution": isLatestExecution,
    "task.name": displayName || "",
    "task.project.identifier": identifier || "",
    "task.status": taskStatus || "",
    "version.is_patch": isPatch,
    "version.requester": requester,
    "task.build_baron_configured": buildBaronConfigured || false,
  });
};
