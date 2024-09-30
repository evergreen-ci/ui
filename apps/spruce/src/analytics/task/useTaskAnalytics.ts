import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { slugs } from "constants/routes";
import {
  TaskQuery,
  TaskQueryVariables,
  TaskSortCategory,
  TestSortCategory,
} from "gql/generated/types";
import { TASK } from "gql/queries";
import { useQueryParam } from "hooks/useQueryParam";
import { CommitType } from "pages/task/actionButtons/RelevantCommits/types";
import { RequiredQueryParams, LogTypes } from "types/task";

type LogViewer = "raw" | "html" | "parsley";
type Action =
  | { name: "Filtered tests table"; "filter.by": string | string[] }
  | {
      name: "Sorted tests table";
      "sort.by": TestSortCategory | TestSortCategory[];
    }
  | {
      name: "Sorted execution tasks table";
      "sort.by": TaskSortCategory | TaskSortCategory[];
    }
  | {
      name: "Clicked restart task button";
      "task.is_display_task": false;
    }
  | {
      name: "Clicked restart task button";
      allTasks: boolean;
      "task.is_display_task": true;
    }
  | {
      name: "Clicked execution tasks table link";
    }
  | { name: "Clicked schedule task button" }
  | { name: "Clicked abort task button" }
  | { name: "Changed task priority"; "task.priority": number }
  | { name: "Clicked unschedule task button" }
  | { name: "Changed page size" }
  | { name: "Changed tab"; tab: string }
  | { name: "Changed execution" }
  | { name: "Clicked log link"; "log.type": LogTypes; "log.viewer": LogViewer }
  | {
      name: "Clicked test log link";
      "log.viewer": LogViewer;
      "test.status": string;
    }
  | { name: "Clicked annotation link"; "link.text": string }
  | { name: "Changed log preview type"; "log.type": LogTypes }
  | { name: "Viewed notification modal" }
  | {
      name: "Created notification";
      "subscription.type": string;
      "subscription.trigger": string;
    }
  | { name: "Clicked see history link" }
  | { name: "Clicked metadata link"; "link.type": string }
  | {
      name: "Clicked task file link";
      "parsley.is_available": boolean;
      "file.name": string;
    }
  | {
      name: "Clicked task file Parsley link";
      "file.name": string;
    }
  | { name: "Clicked relevant commit"; type: CommitType };

export const useTaskAnalytics = () => {
  const { [slugs.taskId]: taskId } = useParams();

  const [execution] = useQueryParam(RequiredQueryParams.Execution, 0);
  const { data: eventData } = useQuery<TaskQuery, TaskQueryVariables>(TASK, {
    skip: !taskId,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    variables: { taskId, execution },
    errorPolicy: "all",
    fetchPolicy: "cache-first",
  });

  const {
    failedTestCount,
    latestExecution,
    // @ts-expect-error: FIXME. This comment was added by an automated script.
    project: { identifier } = { identifier: null },
    status: taskStatus,
  } = eventData?.task || {};
  const isLatestExecution = latestExecution === execution;

  return useAnalyticsRoot<Action, AnalyticsIdentifier>("Task", {
    "task.status": taskStatus || "",
    "task.execution": execution,
    "task.is_latest_execution": isLatestExecution,
    "task.id": taskId || "",
    "task.failed_test_count": failedTestCount || "",
    "task.project.identifier": identifier,
  });
};
