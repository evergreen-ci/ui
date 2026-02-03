import { useQuery } from "@apollo/client/react";
import { useAnalyticsRoot } from "@evg-ui/lib/analytics";
import { AnalyticsIdentifier } from "analytics/types";
import {
  PatchQuery,
  PatchQueryVariables,
  TaskSortCategory,
} from "gql/generated/types";
import { PATCH } from "gql/queries";

type Action =
  | {
      name: "Filtered downstream tasks table";
      "filter.by": string | string[];
    }
  | {
      name: "Sorted downstream tasks table";
      "sort.by": TaskSortCategory | TaskSortCategory[];
    }
  | { name: "Toggled patch visibility"; "patch.hidden": boolean }
  | { name: "Clicked patch reconfigure link" }
  | {
      name: "Clicked schedule patch button";
      "task.scheduled_count": number;
      "aliases.scheduled_count": number;
    };

export const usePatchAnalytics = (id: string) => {
  const { data: eventData } = useQuery<PatchQuery, PatchQueryVariables>(PATCH, {
    skip: !id,
    variables: { id },
    fetchPolicy: "cache-first",
  });
  const { status } = eventData?.patch || {};

  return useAnalyticsRoot<Action, AnalyticsIdentifier>("Patch", {
    "patch.status": status || "",
    "patch.id": id,
  });
};
