import { useQuery } from "@apollo/client";
import { useAnalyticsRoot } from "analytics/useAnalyticsRoot";
import {
  PatchQuery,
  PatchQueryVariables,
  TaskSortCategory,
} from "gql/generated/types";
import { PATCH } from "gql/queries";

type Action =
  | {
      name: "Filtered downstream tasks table";
      filterBy: string | string[];
    }
  | {
      name: "Sorted downstream tasks table";
      sortBy: TaskSortCategory | TaskSortCategory[];
    }
  | { name: "Toggled patch visibility"; hidden: boolean }
  | { name: "Clicked patch reconfigure link" };

export const usePatchAnalytics = (id: string) => {
  const { data: eventData } = useQuery<PatchQuery, PatchQueryVariables>(PATCH, {
    skip: !id,
    variables: { id },
    fetchPolicy: "cache-first",
  });
  const { status } = eventData?.patch || {};

  return useAnalyticsRoot<Action>("Patch", {
    patchStatus: status,
    patchId: id,
  });
};
