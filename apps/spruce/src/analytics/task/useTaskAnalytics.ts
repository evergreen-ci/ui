import { useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsIdentifier } from "analytics/types";
import { slugs } from "constants/routes";
import {
  SaveSubscriptionForUserMutationVariables,
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
  | { name: "Filtered tests table"; filterBy: string | string[] }
  | {
      name: "Sorted tests table";
      sortBy: TestSortCategory | TestSortCategory[];
    }
  | {
      name: "Sorted execution tasks table";
      sortBy: TaskSortCategory | TaskSortCategory[];
    }
  | {
      name: "Clicked restart task button";
      isDisplayTask: false;
    }
  | {
      name: "Clicked restart task button";
      allTasks: boolean;
      isDisplayTask: true;
    }
  | {
      name: "Clicked execution tasks table link";
    }
  | { name: "Clicked schedule task button" }
  | { name: "Clicked abort task button" }
  | { name: "Changed task priority"; priority: number }
  | { name: "Clicked unschedule task button" }
  | { name: "Changed page size" }
  | { name: "Changed tab"; tab: string }
  | { name: "Changed execution" }
  | { name: "Clicked log link"; logType: LogTypes; logViewer: LogViewer }
  | { name: "Clicked test log link"; logViewer: LogViewer; testStatus: string }
  | { name: "Clicked annotation link"; linkText: string }
  | { name: "Changed log preview type"; logType: LogTypes }
  | { name: "Viewed notification modal" }
  | {
      name: "Created notification";
      subscription: SaveSubscriptionForUserMutationVariables["subscription"];
    }
  | { name: "Clicked see history link" }
  | { name: "Clicked metadata link"; linkType: string }
  | {
      name: "Clicked task file link";
      parsleyAvailable: boolean;
      fileName: string;
    }
  | {
      name: "Clicked task file Parsley link";
      fileName: string;
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
    "task.isLatestExecution": isLatestExecution,
    "task.id": taskId || "",
    "task.failedTestCount": failedTestCount || "",
    "task.project.identifier": identifier,
  });
};
