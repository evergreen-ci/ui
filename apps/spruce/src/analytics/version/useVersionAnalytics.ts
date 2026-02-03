import { useQuery } from "@apollo/client/react";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics";
import { AnalyticsIdentifier } from "analytics/types";
import {
  VersionQuery,
  VersionQueryVariables,
  TaskSortCategory,
} from "gql/generated/types";
import { VERSION } from "gql/queries";

type Action =
  | {
      name: "Created notification";
      "subscription.type": string;
      "subscription.trigger": string;
    }
  | { name: "Changed page size"; "page.size": number }
  | { name: "Changed tab"; tab: string }
  | { name: "Clicked metadata base commit link" }
  | { name: "Filtered by build variant group" }
  | { name: "Clicked metadata github commit link" }
  | {
      name: "Filtered by build variant and task status group";
      "filter.task_square_statuses": string | string[];
    }
  | { name: "Clicked metadata previous version link" }
  | { name: "Clicked metadata project patches link" }
  | { name: "Clicked task table task link"; "task.id": string }
  | { name: "Deleted all filters" }
  | { name: "Filtered downstream tasks table"; "filter.by": string | string[] }
  | { name: "Filtered tasks table"; "filter.by": string | string[] }
  | { name: "Filtered task duration table"; "filter.by": string | string[] }
  | { name: "Sorted task duration table"; "sort.by": string | string[] }
  | { name: "Viewed notification modal" }
  | { name: "Viewed schedule tasks modal" }
  | {
      name: "Toggled include never activated tasks";
      include_never_activated_tasks: boolean;
    }
  | {
      name: "Clicked restart tasks button";
      abort: boolean;
      "task.modified_count": number;
    }
  | { name: "Clicked schedule tasks button"; "task.scheduled_count": number }
  | { name: "Clicked patch reconfigure link" }
  | { name: "Changed version priority"; "version.priority": number }
  | {
      name: "Sorted tasks table";
      "sort.by": TaskSortCategory | TaskSortCategory[];
    }
  | {
      name: "Sorted downstream tasks table";
      "sort.by": TaskSortCategory | TaskSortCategory[];
    }
  | { name: "Toggled display task expansion"; expanded: boolean }
  | { name: "Clicked unschedule tasks button"; abort: boolean }
  | { name: "Filtered test analysis tab"; "filter.by": string | string[] }
  | {
      name: "System Event test analysis tab stats";
      has_reoccurring_tests: boolean;
      num_reoccurring_tests: number;
      num_tests: number;
      num_failed_tasks: number;
    };

export const useVersionAnalytics = (id: string) => {
  const { data: eventData } = useQuery<VersionQuery, VersionQueryVariables>(
    VERSION,
    {
      skip: !id,
      variables: { id, includeNeverActivatedTasks: false },
      fetchPolicy: "cache-first",
    },
  );
  const { isPatch, requester, status } = eventData?.version || {};

  return useAnalyticsRoot<Action, AnalyticsIdentifier>("Version", {
    "version.status": status || "",
    "version.id": id,
    "version.is_patch": isPatch || false,
    "version.requester": requester || "",
  });
};
