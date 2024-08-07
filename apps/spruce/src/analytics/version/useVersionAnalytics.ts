import { useQuery } from "@apollo/client";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics/hooks";
import { AnalyticsObject } from "analytics/types";
import {
  SaveSubscriptionForUserMutationVariables,
  VersionQuery,
  VersionQueryVariables,
  TaskSortCategory,
} from "gql/generated/types";
import { VERSION } from "gql/queries";

type Action =
  | {
      name: "Created notification";
      subscription: SaveSubscriptionForUserMutationVariables["subscription"];
    }
  | { name: "Changed page size"; pageSize: number }
  | { name: "Changed tab"; tab: string }
  | { name: "Clicked metadata base commit link" }
  | { name: "Filtered by build variant group" }
  | { name: "Clicked metadata github commit link" }
  | {
      name: "Filtered by build variant and task status group";
      taskSquareStatuses: string | string[];
    }
  | { name: "Clicked metadata previous version link" }
  | { name: "Clicked metadata project patches link" }
  | { name: "Clicked task table task link"; taskId: string }
  | { name: "Deleted all filters" }
  | { name: "Clicked enqueue tasks button" }
  | { name: "Filtered downstream tasks table"; filterBy: string | string[] }
  | { name: "Filtered tasks table"; filterBy: string | string[] }
  | { name: "Filtered task duration table"; filterBy: string | string[] }
  | { name: "Viewed notification modal" }
  | { name: "Viewed schedule tasks modal" }
  | { name: "Clicked restart tasks button"; abort: boolean }
  | { name: "Clicked schedule tasks button" }
  | { name: "Clicked patch reconfigure link" }
  | { name: "Changed version priority"; priority: number }
  | {
      name: "Sorted tasks table";
      sortBy:
        | TaskSortCategory.BaseStatus
        | TaskSortCategory.Name
        | TaskSortCategory.Status
        | TaskSortCategory.Variant;
    }
  | {
      name: "Sorted downstream tasks table";
      sortBy: TaskSortCategory | TaskSortCategory[];
    }
  | { name: "Toggled display task expansion"; expanded: boolean }
  | { name: "Clicked unschedule tasks button"; abort: boolean };

export const useVersionAnalytics = (id: string) => {
  const { data: eventData } = useQuery<VersionQuery, VersionQueryVariables>(
    VERSION,
    {
      skip: !id,
      variables: { id },
      fetchPolicy: "cache-first",
    },
  );
  const { status } = eventData?.version || {};

  return useAnalyticsRoot<Action, AnalyticsObject>("Version", {
    versionStatus: status,
    versionId: id,
  });
};
